import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import {RoleModelStateType} from "@/models/role";
import RoleDataType from "@/pages/sms/role/Role";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {Button, Card, Divider, Form, Input, Modal, Table} from "antd";
import FormLayout from "@/models/formLayout";
import {ColumnProps, SelectionSelectFn} from "antd/es/table";
import AlarmDataType from "@/pages/project/components/Alarm/alarm";
import {AlarmLevelModelStateType} from "@/models/alarmLevel";
import {AlarmCategoryModelStateType} from "@/models/alarmCategory";

const FormItem = Form.Item;
const { TextArea } = Input;

export interface RoleListProps extends FormComponentProps{
  dispatch?: Dispatch<any>;
  roleModel?: RoleModelStateType;
  loading?: boolean;
  alarmLevelModel?: AlarmLevelModelStateType;
  alarmCategoryModel?: AlarmCategoryModelStateType;
}

export interface RoleListState {
  configVisible: boolean;
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<RoleDataType>;
  selectedRowKeys: string[] | number[];
  selectedAlarmListKeys: string[] | number[];
}

@connect(({role,alarmLevel, alarmCategory, loading}: {role: RoleModelStateType, alarmLevel: AlarmLevelModelStateType, alarmCategory: AlarmCategoryModelStateType, loading: LoadingDataType}) => {
  return {
    roleModel: role,
    alarmCategoryModel: alarmCategory,
    alarmLevelModel: alarmLevel,
    loading: loading.models.role,
  }
})
class RoleList extends React.Component<RoleListProps, RoleListState> {

  state: RoleListState = {
    configVisible: false,
    visible: false,
    formType: undefined,
    current: undefined,
    selectedRowKeys: [],
    selectedAlarmListKeys: [],
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'role/fetchRoleList',
    });
    dispatch({
      type: 'role/setSelectedRole',
      payload: {}
    });
    dispatch(({
      type: 'role/fetchAllAlarmList'
    }))
  }

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined,
    })
  };

  showEditModal = (item: RoleDataType): void => {
    this.setState({
      visible: true,
      formType: "edit",
      current: item,
    });
  };

  handleDelete = (item: RoleDataType): void => {
    Modal.confirm({
      title: 'Delete Data',
      content: 'Are you sure delete this data?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => this.deleteItem(item.id),
    })
  };

  deleteItem = (id: number): void => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'role/deleteRoleFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'role/fetchRoleList',
        });
      },
    });
  };

  handleRoleSelected: SelectionSelectFn<RoleDataType> = (record) => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'role/setSelectedRole',
      payload: record
    });
  };

  handleSubmit = () => {
    const {dispatch, form} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: RoleDataType): void => {
      if (err) return;
      const item: RoleDataType = {
        ...fieldsValue
      };
      if (this.state.formType === 'edit') {
        dispatch({
          type: 'role/editRoleFetch',
          payload: item,
          callback: () => {
            dispatch({
              type: 'role/fetchRoleList',
            });
          }
        });
      } else {
        if (this.state.formType === 'create') {
          dispatch({
            type: 'role/createRoleFetch',
            payload: item,
            callback: () => {
              dispatch({
                type: 'role/fetchRoleList',
              });
            }
          });
        }
      }
      this.setState({
        visible: false,
        formType: undefined,
        current: undefined
      })
    })
  };

  showConfigModal = (item: RoleDataType): void => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'role/fetchSelectedKeysByRoleId',
      payload: {roleId: item.id},
      callback: (response: number[] | string[]) => {
        this.setState({
          selectedAlarmListKeys: response
        });
      }
    });
    this.setState({
      configVisible: true,
      current: item,
    });
  };

  handleChangeRoleAlarmList = () => {
    const {dispatch, roleModel} = this.props;
    if (!dispatch) return;
    if (!roleModel || !("selectedRole" in roleModel)) return;
    dispatch({
      type: 'role/updateRoleAlarmListFetch',
      payload: {
        roleId: roleModel.selectedRole.id,
        alarmIds: this.state.selectedAlarmListKeys,
      }
    });
    this.setState({
      configVisible: false,
      current: undefined,
    })
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {configVisible, visible, current = {}, selectedRowKeys, selectedAlarmListKeys} = this.state;

    const {form, loading, roleModel, alarmLevelModel, alarmCategoryModel} = this.props;

    const {getFieldDecorator} = form;

    if (!roleModel || !alarmCategoryModel || !alarmLevelModel) return;

    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13}
    };

    const renderAddButton = (): React.ReactNode => {
      return  <Button type={"primary"} onClick={this.showAddModal} icon={"plus"} style={{marginRight: 20}}>Add New</Button>
    };

    const columns: ColumnProps<RoleDataType>[] = [
      {
        key: 'name',
        title: 'Role Name',
        dataIndex: 'name',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'action',
        title: 'Action',
        render: (text, record) => renderTableAction(record)
      }
    ];

    const alarmColumns: ColumnProps<AlarmDataType>[] = [
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

    const renderTableAction = (item: RoleDataType): React.ReactNode => {
      return (
        <div>
          <a key={"Config"} onClick={e => {
            e.preventDefault();
            this.showConfigModal(item);
          }}>Config</a>
          <Divider type={"vertical"}/>
          <a key={"Edit"} onClick={e => {
            e.preventDefault();
            this.showEditModal(item);
          }}>Edit</a>
          <Divider type={"vertical"}/>
          <a key={"Delete"} onClick={e => {
            e.preventDefault();
            this.handleDelete(item);
          }}>Delete</a>
        </div>
      )
    };

    const renderForm = (): React.ReactNode => {
      getFieldDecorator("id", {
        initialValue: current.id || 0
      });
      return (
        <Form>
          <FormItem label={"Role Name"} {...formLayout}>
            {
              getFieldDecorator("name", {
                initialValue: current.name,
                rules: [{required: true, message: 'Please input the Role Name'}]
              })(
                <Input type={"text"} placeholder={'Please input the Role Name'}/>
              )
            }
          </FormItem>
          <FormItem label={"Description"} {...formLayout}>
            {
              getFieldDecorator("description", {
                initialValue: current.description,
                rules: [{required: true, message: 'Please input the Description'}]
              })(
                <TextArea rows={3} placeholder={'Please input the Description'}/>
              )
            }
          </FormItem>
        </Form>
      )
    };

    return (
      <>
        <Card
          title={"Role Group"}
          extra={renderAddButton()}
        >
          <Table
            dataSource={roleModel.roleList}
            columns={columns}
            loading={loading}
            rowSelection={{
              type: 'radio',
              onSelect: this.handleRoleSelected,
              selectedRowKeys: selectedRowKeys,
              onChange: (selectedRowKeys: string[] | number[]) => this.setState({selectedRowKeys: selectedRowKeys})
            }}
          />
        </Card>
        <Modal
          title={"Edit Group Properties"}
          width={800}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({
              visible: false,
              formType: undefined,
              current: undefined
            })
          }}
        >
          {renderForm()}
        </Modal>
        <Modal
          title={"Config role group Alarm list to send"}
          width={800}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={configVisible}
          onOk={this.handleChangeRoleAlarmList}
          onCancel={() => {
            this.setState({
              configVisible: false,
              current: undefined
            })
          }}
        >
          <Table
            dataSource={roleModel.alarmList.map(item => {
              item.key = item.id;
              return item;
            })}
            columns={alarmColumns}
            loading={loading}
            rowSelection={{
              selectedRowKeys: selectedAlarmListKeys,
              onChange: (selectedAlarmListKeys: string[] | number[]) => {
                this.setState({
                  selectedAlarmListKeys: selectedAlarmListKeys,
                })
              },
            }}
          />
        </Modal>
      </>
    );
  }

}

export default Form.create<RoleListProps>()(RoleList);
