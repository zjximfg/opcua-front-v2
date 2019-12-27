import {OpcUaDataValueDataType} from "@/pages/explorer/components/OpcUaDataValue/data";

export interface OpcUaNodeDataType {
  id: number;
  identifier: string;
  namespaceIndex: number;
  namespaceUri: string;
  nodeIdType: string;
  nodeIdString: string;
  browseName: string;
  nodeClass: string;
  opcUaServerId: number;
  variableId: number;

  // 变量的实际值
  opcUaDataValue: OpcUaDataValueDataType;
}
