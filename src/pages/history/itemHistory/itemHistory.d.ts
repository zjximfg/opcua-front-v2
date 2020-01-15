
export interface QueryParams {
  itemId?: number;
  startTime?: string;
  endTime?: string;
  pageSize?: number;
  currentPage?: number;
}


export interface ItemHistoryDataType {
  id: string;
  itemId: number;
  itemName: string;
  description: string;
  itemValue: string;
  recordTime: string;
}
