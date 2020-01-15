import request, {baseUrl} from '@/utils/request';
import AlarmCategoryDataType from "@/pages/project/alarmConfig/alarmBase/components/AlarmCategory/alarmCategory";

export async function fetchAlarmCategoryList() {
  return request(baseUrl + "project/alarm/alarmCategory/list", {
    method: 'get'
  })
}

export async function deleteAlarmCategoryFetch(payload: Partial<AlarmCategoryDataType>) {
  return request(baseUrl + "project/alarm/alarmCategory", {
    method: 'delete',
    data: payload,
  })
}

export async function editAlarmCategoryFetch(payload: Partial<AlarmCategoryDataType>) {
  return request(baseUrl + "project/alarm/alarmCategory", {
    method: 'put',
    data: payload,
  })
}

export async function createAlarmCategoryFetch(payload: Partial<AlarmCategoryDataType>) {
  return request(baseUrl + "project/alarm/alarmCategory", {
    method: 'post',
    data: payload,
  })
}
