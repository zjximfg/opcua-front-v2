import React from 'react';
import {Dispatch} from "redux";
import {ExplorerStateType} from "@/models/explorer";
import {Descriptions} from "antd";
import {OpcUaNodeDataType} from "@/pages/explorer/components/OpcUaNode/data";
import {OpcUaServerDataType} from "@/pages/explorer/components/OpcUaServer/data";

interface OpcUaNodeProps {
  dispatch?: Dispatch<any>;
  explorerModel?: ExplorerStateType;
  loading?: boolean;
  nodeStyle: React.CSSProperties;
  currentOpcUaServerOrOpcUaNode: Partial<OpcUaServerDataType> | Partial<OpcUaNodeDataType>;
}

interface OpcUaNodeState {

}

class OpcUaNode extends React.Component<OpcUaNodeProps, OpcUaNodeState> {


  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    let currentOpcUaServerOrOpcUaNode = this.props.currentOpcUaServerOrOpcUaNode as OpcUaNodeDataType;

    return (
      <>
        <Descriptions title={currentOpcUaServerOrOpcUaNode.browseName} bordered style={this.props.nodeStyle}>
          <Descriptions.Item label="Node ID" span={2}>{currentOpcUaServerOrOpcUaNode.nodeIdString}</Descriptions.Item>
          <Descriptions.Item label="Node Class" span={2}>{currentOpcUaServerOrOpcUaNode.nodeClass}</Descriptions.Item>
          <Descriptions.Item label="Browse Name" span={2}>{currentOpcUaServerOrOpcUaNode.browseName}</Descriptions.Item>
        </Descriptions>
      </>
    );
  }
}

export default OpcUaNode;
