import request, {baseUrl} from '@/utils/request';
import {QueryParams} from "@/pages/history/itemHistory/itemHistory";

export async function fetchItemHistoryPage(params?: QueryParams) {
  return request(baseUrl + 'history/itemHistory/page', {
    method: 'get',
    params,
  });
}

export async function fetchConnectionList() {
  return request(baseUrl + 'history/itemHistory/opcUaConnection/list', {
    method: 'get',
  })
}

export async function fetchGroupList() {
  return request(baseUrl + 'history/itemHistory/opcUaGroup/list', {
    method: 'get',
  })
}

export async function fetchItemList(payload: {opcUaGroupId: number}) {
  return request(baseUrl + 'history/itemHistory/opcUaItem/list', {
    method: 'get',
    params: payload,
  })
}
