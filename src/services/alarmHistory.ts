import request, {baseUrl} from '@/utils/request';
import {AlarmHistoryQueryParams} from "@/pages/history/alarmHistory/alarmHistory";

export async function fetchAlarmHistoryPage(payload: AlarmHistoryQueryParams) {
  return request(baseUrl + "history/alarmHistory/page", {
    method: 'get',
    params: payload,
  })
}

export async function fetchConnectionList() {
  return request(baseUrl + "history/alarmHistory/opcUaConnection/list", {
    method: 'get',
  })
}

export async function fetchAlarmList(payload: {opcUaConnectionId: number}) {
  return request(baseUrl + "history/alarmHistory/alarm/list", {
    method: 'get',
    params: payload
  })
}
