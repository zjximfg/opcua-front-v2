import React from 'react';
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {AlarmListModelStateType} from '@/models/alarmList';
import {RoleModelStateType} from "@/models/role";
import {Dispatch} from "redux";
import {Card, Table} from "antd";
import {ColumnProps} from "antd/es/table";
import AlarmDataType from "@/pages/project/components/Alarm/alarm";
import {AlarmLevelModelStateType} from "@/models/alarmLevel";
import {AlarmCategoryModelStateType} from "@/models/alarmCategory";

interface AlarmListProps {
  dispatch?: Dispatch<any>;
  alarmListModel?: AlarmListModelStateType;
  alarmCategoryModel?: AlarmCategoryModelStateType;
  alarmLevelModel?: AlarmLevelModelStateType;
  roleModel?: RoleModelStateType;
  loading?: boolean;
}

interface AlarmListState {
}

@connect(({alarmList, role, alarmCategory, alarmLevel, loading}: {alarmList: AlarmListModelStateType, role: RoleModelStateType, alarmCategory: AlarmCategoryModelStateType, alarmLevel: AlarmListModelStateType, loading: LoadingDataType})=>{
  return {
    alarmListModel: alarmList,
    roleModel: role,
    alarmCategoryModel: alarmCategory,
    alarmLevelModel: alarmLevel,
    loading: loading.models.alarmList,
  }
})
class AlarmList extends React.Component<AlarmListProps, AlarmListState> {
  state: AlarmListState = {
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'alarmCategory/fetchAlarmCategoryList'
    });
    dispatch({
      type: 'alarmLevel/fetchAlarmLevelList'
    });
  }

  componentWillReceiveProps(nextProps: Readonly<AlarmListProps>, nextContext: any): void {

    if (!nextProps.dispatch) return;
    if (!this.props.roleModel || !nextProps.roleModel) return;
    if (!this.props.roleModel.selectedRole || !nextProps.roleModel.selectedRole) return;
    // 原先未选择，现在选择了 || 原先的id 和新的id不同
    if (!("id" in this.props.roleModel.selectedRole) && "id" in nextProps.roleModel.selectedRole || this.props.roleModel.selectedRole.id !== nextProps.roleModel.selectedRole.id) {
      nextProps.dispatch({
        type: 'alarmList/fetchAlarmList',
        payload: {roleId: nextProps.roleModel.selectedRole.id},
      })
    }
  }


  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {alarmListModel, alarmLevelModel, alarmCategoryModel, roleModel, loading} = this.props;


    if (!alarmListModel || !roleModel || !alarmLevelModel || !alarmCategoryModel) return;

    const columns: ColumnProps<AlarmDataType>[] = [
      {
        key: 'fullName',
        title: 'Alarm Name',
        dataIndex: 'fullName',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',

      },
      {
        key: 'alarmCategoryId',
        title: 'Alarm Category',
        dataIndex: 'alarmCategoryId',
        render: (text, record) => {
          const alarmCategory = alarmCategoryModel.alarmCategoryList.find(item => record.alarmCategoryId === item.id);
          return alarmCategory? alarmCategory.name: '';
        }
      },
      {
        key: 'alarmLevelId',
        title: 'Alarm Level',
        dataIndex: 'alarmLevelId',
        render: (text, record) => {
          const alarmLevel = alarmLevelModel.alarmLevelList.find(item => record.alarmLevelId === item.id);
          return alarmLevel? alarmLevel.name: '';
        }
      },
    ];

    return (
      <>
        <Card
          title={"Alarm List To Be Send"}
        >
          <Table
            dataSource={alarmListModel.alarmList}
            columns={columns}
            loading={loading}
          />
        </Card>
      </>
    );
  }
}

export default AlarmList;
