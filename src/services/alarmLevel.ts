import request, {baseUrl} from '@/utils/request';
import AlarmLevelDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmLevel/alarmLevel";

export async function fetchAlarmLevelList() {
  return request(baseUrl + "project/alarm/alarmLevel/list", {
    method: 'get'
  })
}

export async function deleteAlarmLevelFetch(payload: Partial<AlarmLevelDataType>) {
  return request(baseUrl + "project/alarm/alarmLevel", {
    method: 'delete',
    data: payload,
  })
}

export async function editAlarmLevelFetch(payload: Partial<AlarmLevelDataType>) {
  return request(baseUrl + "project/alarm/alarmLevel", {
    method: 'put',
    data: payload,
  })
}

export async function createAlarmLevelFetch(payload: Partial<AlarmLevelDataType>) {
  return request(baseUrl + "project/alarm/alarmLevel", {
    method: 'post',
    data: payload,
  })
}
