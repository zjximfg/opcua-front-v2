
export default interface OpcUaItemDataType {
  id: number;
  itemCategoryId: number;
  fullName: string;
  opcUaConnectionId: number;
  opcUaGroupId: number;
  itemObjectId: number;
  dbNumber: number;
  address: number;
  itemTypeId: number;
  bitAddress: number;
  stringLength: number;
  quantity: number;
  isArray: boolean;
  description: string;
  currentValue: string;
  quality: string;
}

export default interface ItemCategoryDataType {
  id: number;
  opcUaNamespaceId: number;
  name: string;
  description: string;
}

export default interface ItemObjectDataType {
  id: number;
  opcUaNamespaceId: number;
  itemCategoryId: number;
  name: string;
  description: string;
}

export default interface ItemTypeDataType {
  id: number;
  opcUaNamespaceId: number;
  itemCategoryId: number;
  s7Name: string;
  uaName: string;
  description: string;
}

