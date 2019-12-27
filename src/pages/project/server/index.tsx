import React from 'react';
import {Button, Card, Col, Descriptions, Form, Modal, Row, Select} from "antd";
import {FormComponentProps} from "antd/es/form";
import {ServerModelStateType} from "@/models/server";
import {Dispatch} from "redux";
import {OpcUaServerDataType} from "@/pages/explorer/components/OpcUaServer/data";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import serverImg from '@/assets/server.jpg';
import styles from './index.less'
import {OpcUaProtocolDataType} from "@/pages/explorer/protocol/data";
import SecurityPolicyUriDataType from "@/models/securityPolicyUri";
import FormLayout from "@/models/formLayout";
import ConnectionList from "@/pages/project/components/ConnectionList";


const FormItem = Form.Item;
const {Option} = Select;

interface ServerProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  serverModel: ServerModelStateType;
  loading: boolean;
}

interface ServerState {
  visible: boolean;
  current?: Partial<OpcUaServerDataType>; // 用于修改opcUaServer的表单
  formType: 'edit' | 'create' | undefined;
}

@connect(({server, loading}: { server: ServerModelStateType; loading: LoadingDataType }) => {
  return {
    serverModel: server,
    loading: loading.models.server
  }
})
class Server extends React.Component<ServerProps, ServerState> {
  state: ServerState = {
    visible: false,
    current: undefined,
    formType: undefined
  };

  componentDidMount(): void {
    const {dispatch} = this.props;
    dispatch({
      type: 'server/opcUaServerFetch',
    })
  }

  showEditModal = (item: OpcUaServerDataType): void => {
    this.setState({
      visible: true,
      current: item,
      formType: 'edit',
    }, () => {
      const {dispatch} = this.props;
      dispatch({
        type: 'server/opcUaProtocolListFetch',
      });
      dispatch({
        type: 'server/securityPolicyUriListFetch',
      })
    });
  };

  handleRestartServer = (): void => {
    const {dispatch} = this.props;
    dispatch({
      type: 'server/restartServer',
    })
  };

  handleSubmit = (): void => {
    const {dispatch, form} = this.props;
    const {formType} = this.state;
    // 验证
    form.validateFields((err: string | undefined, fieldsValue: OpcUaServerDataType): void => {
      if (err) return;
      const item: OpcUaServerDataType = {
        ...fieldsValue
      };
      this.setState({
        visible: false
      });
      if (formType === 'edit') {
        dispatch({
          type: 'server/updateOpcUaServer',
          payload: item,
          // 重新加载更新后的数据
          callback: () => {
            dispatch({
              type: 'server/opcUaServerFetch',
            })
          }
        })
      }
    })

  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    // props
    const {serverModel, loading} = this.props;
    // state
    const {visible, current = {}} = this.state;
    //// FORM 相关
    // form
    const {getFieldDecorator} = this.props.form;
    // FormLayout
    const formLayout: FormLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 13}
    };

    const renderForm = (): React.ReactNode => {
      getFieldDecorator("id", {
        initialValue: serverModel.opcUaServer.id,
      });
      return (
        <Form>
          <FormItem label={"Opc UA Protocol"} {...formLayout}>
            {
              getFieldDecorator("opcUaProtocolId", {
                initialValue: current.opcUaProtocolId,
                rules: [{required: true, message: 'Please Select the protocol'}]
              })(
                <Select placeholder={"Please Select the protocol"}>
                  {serverModel.opcUaProtocolList.map((item: OpcUaProtocolDataType) => {
                    return (
                      <Option value={item.id}>{item.protocolName}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem label={"Security Policy Uri"} {...formLayout}>
            {
              getFieldDecorator("securityPolicyUri", {
                initialValue: current.securityPolicyUri,
                rules: [{required: true, message: 'Please Select the Security Policy Uri'}]
              })(
                <Select placeholder={"Please Select the Security Policy Uri"}>
                  {serverModel.securityPolicyUriList.map((item: SecurityPolicyUriDataType) => {
                    return (
                      <Option value={item.name}>{item.name}</Option>
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
        <PageHeaderWrapper>
          <Card style={{background: '#364d79', height: 280, width: '100%'}} loading={loading}>
            <Row>
              <Col span={6}>
                <a key={"edit"} style={{marginLeft: 15}} onClick={e => {
                  e.preventDefault();
                  this.showEditModal(serverModel.opcUaServer);
                }}>
                  <img src={serverImg} alt="server图片" style={{width: 180, height: 120, marginLeft: 40, marginTop: 50}}/>
                </a>
              </Col>
              <Col span={18}>
                <Descriptions title={"Opc UA Server Info."} className={styles.customDescriptions}>
                  <Descriptions.Item
                    label={"Application Name"}>{serverModel.opcUaServer.applicationName}</Descriptions.Item>

                  <Descriptions.Item label={"Endpoint URL"}>{serverModel.opcUaServer.endpointUrl}</Descriptions.Item>
                  <Descriptions.Item label={"Server Name"}>{serverModel.opcUaServer.serverName}</Descriptions.Item>

                  <Descriptions.Item label={"Security Mode"}>{serverModel.opcUaServer.securityMode}</Descriptions.Item>
                  <Descriptions.Item
                    label={"Authentication Types"}>{serverModel.opcUaServer.authenticationTypes}</Descriptions.Item>
                  <Descriptions.Item label={"Product URI"}>{serverModel.opcUaServer.productUri}</Descriptions.Item>
                  <Descriptions.Item label={"Application URI"}
                                     span={3}>{serverModel.opcUaServer.applicationUri}</Descriptions.Item>
                  <Descriptions.Item label={"Supported File"}
                                     span={3}>{serverModel.opcUaServer.supportedFile}</Descriptions.Item>
                  <Descriptions.Item label={"Security Policy URI"}
                                     span={2}>{serverModel.opcUaServer.securityPolicyUri}</Descriptions.Item>
                  <Descriptions.Item>
                    <Button type={"primary"} onClick={this.handleRestartServer}>Restart Server</Button>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
          <ConnectionList opcUaServerId={serverModel.opcUaServer.id} protocolId={serverModel.opcUaServer.opcUaProtocolId}/>
        </PageHeaderWrapper>
        <Modal
          title={"Edit Opc UA Server Properties"}
          width={800}
          bodyStyle={{padding: '28px 0 0'}}
          destroyOnClose
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        >
          {renderForm()}
        </Modal>
      </>
    );
  }
}

export default Form.create<ServerProps>()(Server);
