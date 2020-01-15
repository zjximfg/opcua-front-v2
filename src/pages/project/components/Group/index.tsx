import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {connect} from "dva";
import {Dispatch} from "redux";
import {GroupModelStateType} from "@/models/group";
import LoadingDataType from "@/models/loading";
import {Button, Card, Divider, Form, Input, Modal, Select, Table} from "antd";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import OpcUaGroupDataType from "@/pages/project/components/Group/opcUaGroup";
import {ColumnProps, SelectionSelectFn} from "antd/es/table";
import StoragePeriodDataType from "@/pages/project/components/Group/opcUaGroup";
import FormLayout from "@/models/formLayout";

const FormItem = Form.Item;
const Option = Select.Option;

interface GroupProps extends FormComponentProps{
  dispatch?: Dispatch<any>;
  loading?: boolean;
  groupModel?: GroupModelStateType;
  opcUaConnection: Partial<OpcUaConnectionDataType>;
}

interface GroupState {
  visible: boolean;
  formType: 'edit' | 'create' | undefined;
  current?: Partial<OpcUaGroupDataType>;
  selectedRowKeys: string[] | number[];
}

@connect(({group, loading}: {group: GroupModelStateType, loading: LoadingDataType}) => {
  return {
    groupModel: group,
    loading: loading.models.group,
  }
})
class Group extends React.Component<GroupProps, GroupState> {
  state: GroupState = {
    visible: false,
    formType: undefined,
    current: undefined,
    selectedRowKeys: [],
  };

  componentDidMount(): void {
    if (!this.props.groupModel) return;
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'group/storagePeriodListFetch',
    });
  }

  componentWillReceiveProps(nextProps: Readonly<GroupProps>, nextContext: any): void {
    if (!this.props.groupModel || !nextProps.groupModel) return;
    if (this.props.opcUaConnection.id !== nextProps.opcUaConnection.id) {
      if (!this.props.dispatch) return;
      this.props.dispatch({
        type: 'group/groupListFetchByConnectionId',
        payload: {opcUaConnectionId: nextProps.opcUaConnection.id},
      });
      this.setState({
        selectedRowKeys: [],
      });
      this.props.dispatch({
        type: 'group/setSelectedGroup',
        payload: {},
      })
    }
  }

  showAddModal = () => {
    this.setState({
      visible: true,
      formType: "create",
      current: undefined,
    })
  };

  showEditModal = (item: OpcUaGroupDataType): void => {
    this.setState({
      visible: true,
      formType: "edit",
      current: item,
    });
  };

  handleDelete = (item: OpcUaGroupDataType): void => {
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
      type: 'group/deleteGroupFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'group/groupListFetchByConnectionId',
          payload: {opcUaConnectionId: this.props.opcUaConnection.id},
        });
      },
    });
  };

  handleSubmit = () => {
    const {dispatch, form} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: OpcUaGroupDataType): void => {
      if (err) return;
      const item: OpcUaGroupDataType = {
        ...fieldsValue
      };
      if (this.state.formType === 'edit') {
        dispatch({
          type: 'group/editOpcUaGroupFetch',
          payload: item,
          callback: () => {
            dispatch({
              type: 'group/groupListFetchByConnectionId',
              payload: {opcUaConnectionId: this.props.opcUaConnection.id},
            });
          }
        });
      } else {
        if (this.state.formType === 'create') {
          dispatch({
            type: 'group/createOpcUaGroupFetch',
            payload: item,
            callback: () => {
              dispatch({
                type: 'group/groupListFetchByConnectionId',
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

  handleGroupSelected: SelectionSelectFn<OpcUaGroupDataType> = (record) => {
    const {dispatch} = this.props;
    if (!dispatch) return;
    dispatch({
      type: 'group/setSelectedGroup',
      payload: record
    });
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {groupModel, loading} = this.props;

    const {visible, current = {}, selectedRowKeys} = this.state;

    const {getFieldDecorator} = this.props.form;

    if (!groupModel) return;

    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13}
    };

    const columns: ColumnProps<OpcUaGroupDataType>[] = [
      {
        key: 'groupName',
        title: 'Group Name',
        dataIndex: 'groupName',
        width: 200
      },
      {
        key: 'storagePeriodId',
        title: 'Storage Period',
        dataIndex: 'storagePeriodId',
        width: 200,
        render: (text, record) => {
          const storagePeriod = groupModel.storagePeriodList.find((item: StoragePeriodDataType) => record.storagePeriodId === item.id);
          if (storagePeriod) {
            return storagePeriod.name;
          } else {
            return '';
          }
        }
      },
      {
        key: 'action',
        title: 'Action',
        width: 200,
        render: (text, record) => renderTableAction(record)
      }
    ];

    const renderTableAction = (item: OpcUaGroupDataType): React.ReactNode => {
      return (
        <div>
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

    const renderAddButton = (): React.ReactNode => {
      return  <Button type={"primary"} onClick={this.showAddModal} icon={"plus"} style={{marginRight: 20}}>Add New</Button>
    };

    const renderForm = (): React.ReactNode => {
      getFieldDecorator("opcUaConnectionId", {
        initialValue: current.opcUaConnectionId || this.props.opcUaConnection.id
      });
      getFieldDecorator("id", {
        initialValue: current.id || 0
      });
      return (
        <Form>
          <FormItem label={"Group Id"} {...formLayout}>
            {
              getFieldDecorator("groupName", {
                initialValue: current.groupName,
                rules: [{required: true, message: 'Please input the Group Name'}]
              })(
                <Input type={"text"} placeholder={'Please input the Group Name'}/>
              )
            }
          </FormItem>
          <FormItem label={"Storage Period"} {...formLayout}>
            {
              getFieldDecorator("storagePeriodId", {
                initialValue: current.storagePeriodId,
                rules: [{required: true, message: 'Please select the Storage Period to save to SQL'}]
              })(
                <Select placeholder={'Please select the Storage Period to save to SQL'}>
                  {groupModel.storagePeriodList.map((item: StoragePeriodDataType) => {
                    return (
                      <Option value={item.id}>{item.name}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
        </Form>
      )
    };


    return (
      <>
        <Card
          title={"Opc UA Group"}
          extra={renderAddButton()}
        >
          <Table
            dataSource={groupModel.groupList}
            columns={columns}
            loading={loading}
            rowSelection={{
              type: 'radio',
              onSelect: this.handleGroupSelected,
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
      </>
    );
  }
}

export default Form.create<GroupProps>()(Group);
