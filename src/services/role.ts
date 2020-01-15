import request, {baseUrl} from '@/utils/request';
import RoleDataType from "@/pages/sms/role/Role";

export async function fetchRoleList() {
  return request(baseUrl + "sms/role/list", {
    method: 'get',
  })
}

export async function deleteRoleFetch(payload: Partial<RoleDataType>) {
  return request(baseUrl + "sms/role", {
    method: 'delete',
    data: payload,
  })
}

export async function editRoleFetch(payload: Partial<RoleDataType>) {
  return request(baseUrl + "sms/role", {
    method: 'put',
    data: payload,
  })
}

export async function createRoleFetch(payload: Partial<RoleDataType>) {
  return request(baseUrl + "sms/role", {
    method: 'post',
    data: payload,
  })
}

export async function updateRoleAlarmListFetch(payload: {roleId: number, alarmIds: number[] | string[]}) {
  return request(baseUrl + "sms/roleAlarm", {
    method: 'put',
    data: payload,
  })
}

export async function fetchAllAlarmList() {
  return request(baseUrl + "sms/roleAlarm/alarm/all", {
    method: 'get',
  })
}

export async function fetchSelectedKeysByRoleId(payload: {roleId: number}) {
  return request(baseUrl + "sms/roleAlarm/list", {
    method: 'get',
    params: payload,
  })
}
