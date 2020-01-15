
export interface AlarmHistoryDataType {
  id: string;
  alarmId: number;
  alarmName: string;
  description: string;
  isComing: boolean;
  isLeaving: boolean;
  recordTime: string;
}


export interface AlarmHistoryQueryParams {
  alarmState?: "Leaving" | "Coming" | "Both" | "Current";   // current 时，隐藏alarmId
  alarmId?: number;
  startTime?: string;
  endTime?: string;
  pageSize?: number;
  currentPage?: number;
}
