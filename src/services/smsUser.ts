import request, {baseUrl} from "@/utils/request";
import SmsUserDataType, {SmsUserQueryParams} from "@/pages/sms/smsUser/smsUser";

export async function fetchSmsUserPage(payload: Partial<SmsUserQueryParams>) {
  return request(baseUrl + "sms/user/page", {
    method: 'get',
    params: payload,
  })
}

export async function fetchRoleList() {
  return request(baseUrl + "sms/role/list", {
    method: 'get',
  })
}

export async function editSmsUserFetch(payload: Partial<SmsUserDataType>) {
  return request(baseUrl + "sms/user", {
    method: 'put',
    data: payload
  })
}

export async function createSmsUserFetch(payload: Partial<SmsUserDataType>) {
  return request(baseUrl + "sms/user", {
    method: 'post',
    data: payload
  })
}

export async function deleteSmsUserFetch(payload: Partial<SmsUserDataType>) {
  return request(baseUrl + "sms/user", {
    method: 'delete',
    data: payload
  })
}
