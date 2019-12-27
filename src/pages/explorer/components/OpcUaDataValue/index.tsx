// selectedOpcUaVariableNode

import React from 'react';
import {Dispatch} from "redux";
import {ExplorerStateType} from "@/models/explorer";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {Button, Card, Col, Row, Statistic} from "antd";
import {OpcUaDataValueDataType} from "@/pages/explorer/components/OpcUaDataValue/data";
import Timeout = NodeJS.Timeout;
import {OpcUaNodeDataType} from "@/pages/explorer/components/OpcUaNode/data";
import {OpcUaProtocolDataType} from "@/pages/explorer/protocol/data";
import {OpcUaServerDataType} from "@/pages/explorer/components/OpcUaServer/data";


interface OpcUaDataValueProps {
  dispatch?: Dispatch<any>;
  explorerModel?: ExplorerStateType;
  loading?: boolean;
  currentOpcUaProtocol: Partial<OpcUaProtocolDataType>;
  currentOpcUaServerOrOpcUaNode: Partial<OpcUaServerDataType> | Partial<OpcUaNodeDataType>;
  selectedOpcUaVariableNode: Partial<OpcUaNodeDataType>;
}

interface OpcUaDataValueState {
  isOnline: Timeout | undefined;
}


@connect(({explorer, loading}: { explorer: ExplorerStateType, loading: LoadingDataType }) => {
  return {
    explorerModel: explorer,
    loading: loading.models.opcUaServer
  }
})
class OpcUaDataValue extends React.Component<OpcUaDataValueProps, OpcUaDataValueState> {

  state = {
    isOnline: undefined,
  };

  componentWillReceiveProps(nextProps: Readonly<OpcUaDataValueProps>, nextContext: any): void {
    if (this.props.currentOpcUaProtocol.id !== nextProps.currentOpcUaProtocol.id) {
      this.handleOfflineClick();
    }
    if (this.props.currentOpcUaServerOrOpcUaNode !== nextProps.currentOpcUaServerOrOpcUaNode) {
      this.handleOfflineClick();
    }
    if (this.props.selectedOpcUaVariableNode !== nextProps.selectedOpcUaVariableNode) {
      this.handleOfflineClick();
    }

  }

  renderExtra = () => {
    if (!this.state.isOnline) {
      return <Button type={"primary"} onClick={this.handleOnlineClick} >Online</Button>
    } else {
      return <Button type={"danger"} onClick={this.handleOfflineClick} >Offline</Button>
    }
  };

  handleOnlineClick = () => {

    if (this.state.isOnline) return;
    const timer = setInterval(this.subscribeValue, 2000);
    this.setState({
      isOnline: timer
    });
  };

  handleOfflineClick = () => {
    if (this.state.isOnline) {
      clearInterval(this.state.isOnline);
      this.setState({
        isOnline: undefined
      })
    }
  };


  subscribeValue = () => {
    const dispatch = this.props.dispatch;
    if (!this.props.explorerModel) return;
    if (!dispatch) return;
    dispatch({
      type: 'explorer/opcUaDataValueFetch',
      payload: {
        opcUaServerId: this.props.selectedOpcUaVariableNode.opcUaServerId,
        namespaceIndex: this.props.selectedOpcUaVariableNode.namespaceIndex,
        identifier: this.props.selectedOpcUaVariableNode.identifier,
        nodeIdType: this.props.selectedOpcUaVariableNode.nodeIdType
      }
    });
  };


  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    if (!this.props.explorerModel || !this.props.explorerModel.opcUaDataValue) return;

    const opcUaDataValue = this.props.explorerModel.opcUaDataValue as OpcUaDataValueDataType;

    return (
      <>
        <Card title={"Data Acquisition View <" + this.props.selectedOpcUaVariableNode.variableId + ">"}
              bordered={false} extra={this.renderExtra()}>

          <Row gutter={16}>
            <Col span={12}>
              <Row>
                {/*<Col span={8}>*/}
                {/*  <Statistic title="Data Type" value={opcUaDataValue.dateType}/>*/}
                {/*</Col>*/}

                <Col span={8}>
                  <Statistic title="Quality" value={opcUaDataValue.quality}/>
                </Col>
                <Col span={16}>
                  <Statistic title="Server Time(UTC)" value={opcUaDataValue.serverDateTime}/>
                </Col>
                <Col span={12}>
                  <Statistic title="Data Value" value={opcUaDataValue.value}/>
                </Col>

              </Row>
            </Col>
            <Col>
              <span>echart</span>
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}

export default OpcUaDataValue;
