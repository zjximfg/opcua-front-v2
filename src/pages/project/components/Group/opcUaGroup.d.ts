
export default interface OpcUaGroupDataType {
  id: number;
  groupName: string;
  storagePeriodId: number; // 单位ms
  opcUaConnectionId: number;
}

export default interface StoragePeriodDataType {
  id: number;
  period: number;   // 单位 ms
  name: string;
  corn: string;
}
