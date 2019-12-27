import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Dispatch} from "redux";
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {ConnectionModelStateType} from "@/models/connection";
import {Button, Card, Divider, Form, Input, Modal, Select, Table} from "antd";
import FormLayout from "@/models/formLayout";
import {ColumnProps} from "antd/es/table";
import OpcUaNamespaceDataType from "@/pages/project/connection/opcUaConnection";

const FormItem = Form.Item;
const Option = Select.Option;

interface ConnectionListProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  connectionModel?: ConnectionModelStateType;
  loading?: boolean;
  opcUaServerId: number;
  protocolId: number;
}

interface ConnectionListState {
  visible: boolean;
  current?: Partial<OpcUaConnectionDataType>; // 用于修改opcUaConnection的表单
  formType: 'edit' | 'create' | undefined;
}


@connect(({connection, loading}: { connection: ConnectionModelStateType;  loading: LoadingDataType }) => {
  return {
    connectionModel: connection,
    loading: loading.models.connection
  }
})
class ConnectionList extends React.Component<ConnectionListProps, ConnectionListState> {

  state: ConnectionListState = {
    visible: false,
    current: undefined,
    formType: undefined,
  };

  componentWillReceiveProps(nextProps: Readonly<ConnectionListProps>, nextContext: any): void {
    const {dispatch} = this.props;
    if (!dispatch) return;

    if (this.props.protocolId != nextProps.protocolId) {
      dispatch({
        type: 'connection/opcUaNamespaceListFetchByProtocolId',
        payload: {protocolId: nextProps.protocolId}
      });
    }
    if (this.props.opcUaServerId != nextProps.opcUaServerId) {
      dispatch({
        type: 'connection/opcUaConnectionListFetch',
        payload: {opcUaServerId: nextProps.opcUaServerId}
      });
      dispatch({
        type: 'menu/fetchProjectMenuList',
        payload: {opcUaServerId: nextProps.opcUaServerId}// 更新rout
      });
    }
  }

  showAddModal = (): void => {
    this.setState({
      visible: true,
      current: undefined,
      formType: 'create',
    });
  };

  showEditModal = (item: OpcUaConnectionDataType): void => {
    this.setState({
      visible: true,
      current: item,
      formType: "edit"
    });
  };

  handleDelete = (item: OpcUaConnectionDataType): void => {
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
      type: 'connection/deleteOpcUaConnectionFetch',
      payload: {id: id},
      callback: () => {
        dispatch({
          type: 'menu/fetchProjectMenuList',
          payload: {opcUaServerId: this.props.opcUaServerId}// 更新rout
        });
        dispatch({
          type: 'connection/opcUaConnectionListFetch',
          payload: {opcUaServerId: this.props.opcUaServerId}
        })
      }
    });
  };

  handleSubmit = (): void => {
    const {dispatch, form} = this.props;
    if (!dispatch) return;
    form.validateFields((err: string | undefined, fieldsValue: OpcUaConnectionDataType): void => {
      if (err) return;
      if (this.state.formType === 'edit') {
        dispatch({
          type: 'connection/editOpcUaConnectionFetch',
          payload: {...fieldsValue},
          callback: () => {
            dispatch({
              type: "menu/fetchProjectMenuList",
              payload: {opcUaServerId: this.props.opcUaServerId}// 更新rout
            });
            dispatch({
              type: 'connection/opcUaConnectionListFetch',
              payload: {opcUaServerId: this.props.opcUaServerId}
            });
          }
        });
      }
      if (this.state.formType === 'create') {
        dispatch({
          type: 'connection/createOpcUaConnectionFetch',
          payload: {...fieldsValue},
          callback: () => {
            dispatch({
              type: "menu/fetchProjectMenuList",
              payload: {opcUaServerId: this.props.opcUaServerId}// 更新rout
            });
            dispatch({
              type: 'connection/opcUaConnectionListFetch',
              payload: {opcUaServerId: this.props.opcUaServerId}
            })
          }
        });
      }

      this.setState({
        visible: false,
        formType: undefined
      })
    });
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const {visible, current = {}} = this.state;

    const {connectionModel, loading} = this.props;

    const {getFieldDecorator} = this.props.form;

    if (!connectionModel) return;

    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13},
    };

    /**
     * 列表的属性
     */
    const columns: ColumnProps<OpcUaConnectionDataType>[] = [
      {
        key: 'opcUaNamespaceId',
        title: 'Opc UA Namespace',
        render: (text, record) => renderTableNamespace(record)
      },
      {
        key: 'connectionName',
        title: 'Connection Name',
        dataIndex: 'connectionName',
        width: 800
      },
      {
        key: 'action',
        title: 'Action',
        render: (text, record) => renderTableAction(record),
      }
    ];

    const renderTableNamespace = (item: OpcUaConnectionDataType): React.ReactNode => {
      const opcUaNamespace = connectionModel.opcUaNamespaceList.find(opcUaNamespace => opcUaNamespace.id === item.id);
      if (!opcUaNamespace) return (<div>{''}</div>);
      return (
        <div>
          {opcUaNamespace.namespaceUri}
        </div>
      )
    };

    const renderTableAction = (item: OpcUaConnectionDataType): React.ReactNode => {
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

    /**
     * 弹出的表单， 用于编辑修改和添加
     */
    const renderForm = (): React.ReactNode => {
      getFieldDecorator("opcUaServerId", {
        initialValue: current.opcUaServerId || this.props.opcUaServerId,
      });
      getFieldDecorator("id", {
        initialValue: current.id
      });
      return (
        <Form>
          <FormItem label={'Opc UA Namespace'} {...formLayout}>
            {
              getFieldDecorator("opcUaNamespaceId", {
                initialValue: current.opcUaNamespaceId,
                rules: [{required: true, message: 'Please Select the Opc Ua Namespace'}]
              })(
                <Select placeholder={"Please Select the Opc Ua Namespace"}>
                  {connectionModel.opcUaNamespaceList.map((item: OpcUaNamespaceDataType) => {
                    return (
                      <Option value={item.id}>{item.namespaceUri}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"Connection Name"} {...formLayout}>
            {
              getFieldDecorator('connectionName', {
                initialValue: current.connectionName,
                rules: [{required: true, message: 'Please Select the Connection Name'}]
              })(
                <Input type={"text"} placeholder={"Please Select the Connection Name"}/>
              )
            }
          </FormItem>
        </Form>
      )
    };

    const renderAddButton = (): React.ReactNode => {
      return <Button type={"primary"} onClick={this.showAddModal} icon={"plus"} style={{marginRight: 20}}>Add New</Button>
    };
    return (
      <>
        <Card title={"OPC UA connection List"} extra={renderAddButton()} style={{marginTop: 20}}>
          <Table
            dataSource={connectionModel.opcUaConnectionList}
            columns={columns}
            loading={loading}
            style={{marginTop: 10}}
          />
        </Card>
        <Modal
          title={"Edit the Opc UA Connection Properties"}
          width={800}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({
              visible: false,
              formType: undefined
            });
          }}
        >
          {renderForm()}
        </Modal>
      </>
    );
  }
}

export default Form.create<ConnectionListProps>()(ConnectionList);
