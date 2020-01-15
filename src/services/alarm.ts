import request, {baseUrl} from '@/utils/request';
import AlarmDataType from "@/pages/project/components/Alarm/alarm";


export async function fetchAlarmListByConnectionId(payload: {opcUaConnectionId: number}) {
  return request(baseUrl + "project/alarm/list", {
    method: 'get',
    params: payload,
  })
}

export async function fetchOnlineDataByConnectionId(payload: {opcUaConnectionId: number}) {
  return request(baseUrl + "project/alarm/list/online", {
    method: 'get',
    params: payload,
  })
}

export async function deleteAlarmFetch(payload: Partial<AlarmDataType>) {
  return request(baseUrl + "project/alarm", {
    method: 'delete',
    data: payload,
  })
}

export async function createAlarmFetch(payload: Partial<AlarmDataType>) {
  return request(baseUrl + "project/alarm", {
    method: "post",
    data: payload,
  })
}

export async function editAlarmFetch(payload: Partial<AlarmDataType>) {
  return request(baseUrl + "project/alarm", {
    method: 'put',
    data: payload,
  })
}
