
export default interface OpcUaConnectionDataType {
  id: number;
  opcUaNamespaceId: number;
  connectionName: string;
  opcUaServerId: number;
}

export default interface OpcUaNamespaceDataType {
  id: number;
  protocolId: number;
  namespaceIndex: number;
  namespaceUri: string;
}
