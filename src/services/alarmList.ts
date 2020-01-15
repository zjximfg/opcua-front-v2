import request, {baseUrl} from "@/utils/request";

export async function fetchAlarmList(payload: {roleId: number}) {
  return request(baseUrl + "sms/roleAlarm/alarm/list", {
    method: 'get',
    params: payload,
  })
}




