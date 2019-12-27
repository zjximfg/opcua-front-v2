import React from 'react';
import {Dispatch} from "redux";
import {ExplorerStateType} from "@/models/explorer";
import {Badge, Descriptions} from "antd";
import {connect} from "dva";
import LoadingDataType from "@/models/loading";
import {OpcUaServerDataType} from "@/pages/explorer/components/OpcUaServer/data";
import {OpcUaNodeDataType} from "@/pages/explorer/components/OpcUaNode/data";



interface OpcUaServerProps {
  dispatch?: Dispatch<any>;
  explorerModel?: ExplorerStateType;
  loading?: boolean;
  serverStyle: React.CSSProperties;
  currentOpcUaServerOrOpcUaNode: Partial<OpcUaServerDataType> | Partial<OpcUaNodeDataType>;
}

interface OpcUaServerState {
}

@connect(({explorer, loading}: { explorer: ExplorerStateType, loading: LoadingDataType }) => {
  return {
    explorerModel: explorer,
    loading: loading.models.opcUaServer
  }
})
class OpcUaServer extends React.Component<OpcUaServerProps, OpcUaServerState> {

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const currentOpcUaServerOrOpcUaNode = this.props.currentOpcUaServerOrOpcUaNode as OpcUaServerDataType;

    return (
      <>
        <Descriptions title={currentOpcUaServerOrOpcUaNode.fullName} bordered
                      style={{...this.props.serverStyle, overflow: 'auto'}}>
          <Descriptions.Item
            label="Application Name">{currentOpcUaServerOrOpcUaNode.applicationName}</Descriptions.Item>
          <Descriptions.Item label="Application URI"
                             span={2}>{currentOpcUaServerOrOpcUaNode.productUri}</Descriptions.Item>
          <Descriptions.Item label="Endpoint URL">{currentOpcUaServerOrOpcUaNode.endpointUrl}</Descriptions.Item>
          <Descriptions.Item
            label="Security mode">{currentOpcUaServerOrOpcUaNode.securityMode}</Descriptions.Item>
          <Descriptions.Item
            label="Authentication types">{currentOpcUaServerOrOpcUaNode.authenticationTypes}</Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            <Badge status="processing" text="Connected"/>
          </Descriptions.Item>
          <Descriptions.Item label="Supported profile"
                             span={3}>{currentOpcUaServerOrOpcUaNode.supportedFile}</Descriptions.Item>
          <Descriptions.Item label="Security policy"
                             span={3}>{currentOpcUaServerOrOpcUaNode.securityPolicyUri}</Descriptions.Item>
        </Descriptions>
      </>
    );
  }
}

export default OpcUaServer;
