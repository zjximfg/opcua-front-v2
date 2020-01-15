import React from 'react';
import {Dispatch} from "redux";
import {AlarmModelStateType} from "@/models/alarm";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import {Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Table, Tag} from "antd";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {FormComponentProps} from "antd/es/form";
import ItemObjectDataType from "@/pages/project/components/Item/opcUaItem";
import {ColumnProps} from "antd/es/table";
import AlarmDataType from "@/pages/project/components/Alarm/alarm";
import FormLayout from "@/models/formLayout";
import {AlarmCategoryModelStateType} from "@/models/alarmCategory";
import {AlarmLevelModelStateType} from "@/models/alarmLevel";
import AlarmCategoryDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmCategory/alarmCategory";
import AlarmLevelDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmLevel/alarmLevel";


const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;

interface AlarmProps extends FormComponentProps{
  dispatch?: Dispatch<any>
  loading?: boolean;
  alarmModel?: AlarmModelStateType;
  alarmCategoryModel?: AlarmCategoryModelStateType;
  alarmLevelModel?: AlarmLevelModelStateType;
  opcUaConnection: Partial<OpcUaConnectionDataType>;
}

interface AlarmState {
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<AlarmDataType>;
  intervalNumber: NodeJS.Timeout | null;
  state: 'online' | 'offline';
  itemObjectOptionList: Array<ItemObjectDataType>;
  dbNumberShow: boolean;
}

@connect(({alarm, alarmCategory, alarmLevel ,loading}: { alarm: AlarmModelStateType, alarmCategory: AlarmCategoryModelStateType, alarmLevel: AlarmLevelModelStateType, loading: LoadingDataType }) => {
  return {
    alarmModel: alarm,
    alarmCategoryModel: alarmCategory,
    alarmLevelModel: alarmLevel,
    loading: loading.models.alarm,
  }
})
class Alarm extends React.Component<AlarmProps, AlarmState> {

  state: AlarmState = {
    visible: false,
    formType: undefined,
    current: undefined,
    intervalNumber: null,
    state: 'offline',
    itemObjectOptionList: [],
    dbNumberShow: false,
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'alarmCategory/fetchAlarmCategoryList',
    });
    dispatch({
      type: 'alarmLevel/fetchAlarmLevelList',
    });
  }


  componentWillReceiveProps(nextProps: Readonly<AlarmProps>, nextContext: any): void {
    if (this.props.opcUaConnection.id !== nextProps.opcUaConnection.id) {
      if (!("id" in nextProps.opcUaConnection)) return;
      const {dispatch} = this.props;
      if (!dispatch) return;
      dispatch({
        type: 'alarm/fetchItemObjectListByOpcUaNamespaceId',
        payload: {opcUaNamespaceId: nextProps.opcUaConnection.opcUaNamespaceId}
      });
      // 清除列表内的显示数据
      dispatch({
        type: 'alarm/resetAlarmList',
      });
      dispatch({
        type: 'alarm/fetchAlarmListByConnectionId',
        payload: {opcUaConnectionId: nextProps.opcUaConnection.id},
      });
      // 清除online 功能 （包括1. 按钮状态，2. 结束周期timer）
      if (this.state.intervalNumber === null) return;
      clearInterval(this.state.intervalNumber);
      this.setState({
        state: "offline",
        intervalNumber: null,
      })
    }
  }

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined,
    });
    if (!this.props.alarmModel) return;
    this.setObjectInitValue(this.props.alarmModel.itemObjectList, 1);
  };

  showEditModal = (item: AlarmDataType): void => {
    if (!this.props.alarmModel) return;

    const itemObject = this.props.alarmModel.itemObjectList.find((item: ItemObjectDataType) => item.id === this.props.form.getFieldValue("itemObjectId"));
    this.setState({
      visible: true,
      formType: "edit",
      current: item,
      dbNumberShow: itemObject ? itemObject.name === 'db' : false,
    });
    this.setObjectInitValue(this.props.alarmModel.itemObjectList, item.itemCategoryId);
  };

  handleDelete = (item: AlarmDataType): void => {
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
      type: 'alarm/deleteAlarmFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'alarm/fetchAlarmListByConnectionId',
          payload: {opcUaConnectionId: this.props.opcUaConnection.id},
        });
      },
    })
  };

  handleSubmit = (): void => {
    const {dispatch, form} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: AlarmDataType): void => {
      if (err) return;
      const item: AlarmDataType = {
        ...fieldsValue
      };
      if (this.state.formType === 'edit') {
        dispatch({
          type: 'alarm/editAlarmFetch',
          payload: item,
          callback: () => {
            dispatch({
              type: 'alarm/fetchAlarmListByConnectionId',
              payload: {opcUaConnectionId: this.props.opcUaConnection.id},
            });
          }
        });
      } else {
        if (this.state.formType === 'create') {
          dispatch({
            type: 'alarm/createAlarmFetch',
            payload: item,
            callback: () => {
              dispatch({
                type: 'alarm/fetchAlarmListByConnectionId',
                payload: {opcUaConnectionId: this.props.opcUaConnection.id},
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

  setObjectInitValue = (itemObjectList: Array<ItemObjectDataType>, itemCategoryId: number) => {
    const list = itemObjectList.filter((item: ItemObjectDataType) => item.itemCategoryId === itemCategoryId);
    this.setState({
      itemObjectOptionList: list
    });
  };

  handleOnline = () => {
    this.setState({
      state: 'online',
      intervalNumber: setInterval(this.updateOnlineData, 2 * 1000),
    });
  };

  updateOnlineData = () => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'alarm/fetchOnlineDataByConnectionId',
      payload: {opcUaConnectionId: this.props.opcUaConnection.id},
    });
  };

  handleOffline = () => {
    if (this.state.intervalNumber === null) return;
    clearInterval(this.state.intervalNumber);
    this.setState({
      state: 'offline',
      intervalNumber: null,
    });
  };

  handleSearch = (value: string) => {
    this.setState({
      // TODO
    })
  };

  handleItemObjectOnSelect = (value: any) => {
    if (!this.props.alarmModel) return;
    const itemObject = this.props.alarmModel.itemObjectList.find((item: ItemObjectDataType) => item.id === value);
    this.setState({
      dbNumberShow: itemObject ? itemObject.name === 'db' : false,
    })
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {visible, current = {}, state, itemObjectOptionList} = this.state;

    const {alarmModel, opcUaConnection, alarmLevelModel, alarmCategoryModel} = this.props;

    const {getFieldDecorator} = this.props.form;

    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };

    if (!alarmModel || !alarmCategoryModel || !alarmLevelModel) return;

    const extraContent: React.ReactNode = (
      <Row>
        <Col span={6}>
          <Button type={"primary"} icon={"plus"}
                  onClick={this.showAddModal}>Add</Button>
        </Col>
        <Col span={6}>
          {state === 'offline' ?
            (<Button type={"primary"} onClick={this.handleOnline}>Online</Button>) :
            (<Button type={"danger"} onClick={this.handleOffline}>Offline</Button>)
          }
        </Col>
        <Col span={12}>
          <Search placeholder={"Please input key word to search"} onSearch={value => this.handleSearch(value)}/>
        </Col>
      </Row>
    );


    const columns: ColumnProps<AlarmDataType>[] = [
      {
        key: 'fullName',
        title: 'Name',
        dataIndex: 'fullName',
      },
      {
        key: 'itemObjectId',
        title: 'Object',
        dataIndex: 'itemObjectId',
        render: (text, record) => {
          const itemObject = alarmModel.itemObjectList.find((item: ItemObjectDataType) => item.id === record.itemObjectId);
          return itemObject ? itemObject.name : '';
        }
      },
      {
        key: 'alarmCategoryId',
        title: 'Alarm Category',
        dataIndex: 'alarmCategoryId',
        render: (text, record) => {
          const alarmCategory = alarmCategoryModel.alarmCategoryList.find((item: AlarmCategoryDataType) => item.id === record.alarmCategoryId);
          return alarmCategory ? alarmCategory.name : '';
        }
      },
      {
        key: 'alarmLevelId',
        title: 'Alarm Level',
        dataIndex: 'alarmLevelId',
        render: (text, record) => {
          const alarmLevel = alarmLevelModel.alarmLevelList.find((item: AlarmLevelDataType) => item.id === record.alarmLevelId);
          return alarmLevel ? alarmLevel.name : '';
        }
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description'
      },
      {
        key: 'currentValue',
        title: 'Value',
        dataIndex: 'currentValue',
      },
      {
        key: 'quality',
        title: 'Quality',
        dataIndex: 'quality',
        render: quality => {
          let color = 'geekblue';
          if (!quality || this.state.state === 'offline') return (<span>
            <Tag color={color} key={"offline"}>
                {"offline".toUpperCase()}
            </Tag>
          </span>);
          if (quality === 'good') color = 'green';
          if (quality === 'bad') color = 'volcano';
          return (
            <span>
              <Tag color={color} key={quality}>
                {quality.toUpperCase()}
              </Tag>
            </span>
          )
        }
      },
      {
        key: 'action',
        title: 'Action',
        render: (text, record) => renderTableAction(record)
      }
    ];

    const renderTableAction = (item: AlarmDataType): React.ReactNode => {
      return (
        <div>
          <a key={"edit"} onClick={e => {
            e.preventDefault();
            this.showEditModal(item);
          }}>Edit</a>
          <Divider type={"vertical"}/>
          <a key={"delete"} onClick={e => {
            e.preventDefault();
            this.handleDelete(item);
          }}>Delete</a>
        </div>
      )
    };

    const renderForm = (): React.ReactNode => {
      if (!this.props.alarmModel) return;
      getFieldDecorator("id", {
        initialValue: current.id,
      });
      getFieldDecorator("opcUaConnectionId", {
        initialValue: current.opcUaConnectionId || opcUaConnection.id
      });
      getFieldDecorator("itemCategoryId", {
        initialValue: current.itemCategoryId || 1
      });
      return (
        <Form>
          <FormItem label={"Object"} {...formLayout}>
            {
              getFieldDecorator("itemObjectId", {
                initialValue: current.itemObjectId,
                rules: [{required: true, message: "Please select the Item Object!"}]
              })(
                <Select placeholder={'Please select the Item Object'}
                        onSelect={(value) => this.handleItemObjectOnSelect(value)}>
                  {itemObjectOptionList.map((item: ItemObjectDataType) => {
                    return (
                      <Option value={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"DB number"} {...formLayout}>
            {
              getFieldDecorator("dbNumber", {
                initialValue: current.dbNumber,
                rules: [{required: this.state.dbNumberShow, message: "Please input the DB number"}]
              })(
                <InputNumber placeholder={'DB number'} disabled={!this.state.dbNumberShow}/>
              )
            }
          </FormItem>
          <FormItem label={"Address"} {...formLayout}>
            {
              getFieldDecorator("address", {
                initialValue: current.address,
                rules: [{required: this.state.dbNumberShow, message: "Please input the address"}]
              })(
                <InputNumber placeholder={'Address'}/>
              )
            }
          </FormItem>
          <FormItem label={"Bit Address"} {...formLayout}>
            {
              getFieldDecorator("bitAddress", {
                initialValue: current.bitAddress,
                rules: [{required: true, message: "Please input the Bit Address"}]
              })(
                <InputNumber placeholder={'Bit Address'} />
              )
            }
          </FormItem>
          <FormItem label={"Alarm Category"} {...formLayout}>
            {
              getFieldDecorator("alarmCategoryId", {
                initialValue: current.alarmCategoryId,
                rules: [{required: true, message: "Please select the Alarm Category!"}]
              })(
                <Select placeholder={'Please select the Alarm Category'}>
                  {alarmCategoryModel.alarmCategoryList.map((item: AlarmCategoryDataType) => {
                    return (
                      <Option value={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"Alarm Level"} {...formLayout}>
            {
              getFieldDecorator("alarmLevelId", {
                initialValue: current.alarmLevelId,
                rules: [{required: true, message: "Please select the Alarm Level!"}]
              })(
                <Select placeholder={'Please select the Alarm Level'}>
                  {alarmLevelModel.alarmLevelList.map((item: AlarmLevelDataType) => {
                    return (
                      <Option value={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"Description"} {...formLayout}>
            {
              getFieldDecorator("description", {
                initialValue: current.description,
                rules: [{required: true, message: "Please input the Description"}]
              })(
                <Input type={"text"} placeholder={'Description'}/>
              )
            }
          </FormItem>
        </Form>
      )
    };

    return (
      <>
        <Card
          title={"OPC UA Alarm List"}
          bordered={false}
          extra={extraContent}
        >
          <Table
            dataSource={alarmModel.alarmList}
            columns={columns}
          />
        </Card>
        <Modal
          title={"Edit Alarm Properties"}
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
      </>
    );
  }

}

export default Form.create<AlarmProps>()(Alarm);
