
export default interface AlarmDataType {
  id: number;
  itemCategoryId: number;
  identifier: string;
  fullName: string;
  opcUaConnectionId: number;
  itemObjectId: number;
  dbNumber: number;
  address: number;
  bitAddress: number;
  alarmCategoryId: number;
  alarmLevelId: number;
  description: string;

  key: number;
}
