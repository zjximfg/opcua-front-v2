import request, {baseUrl} from '@/utils/request';
import OpcUaGroupDataType from "@/pages/project/components/Group/opcUaGroup";

export async function groupListFetchByConnectionId(payload: {opcUaConnectionId: number}) {
  return request(baseUrl + "project/opcUaGroup/list", {
    method: 'get',
    params: payload,
  })
}

export async function storagePeriodListFetch() {
  return request(baseUrl + "project/opcUaGroup/storagePeriod/list", {
    method: 'get'
  })
}

export async function deleteGroupFetch(payload: {id: number}) {
  return request(baseUrl + "project/opcUaGroup", {
    method: 'delete',
    data: payload,
  })
}

export async function editOpcUaGroupFetch(payload: Partial<OpcUaGroupDataType>) {
  return request(baseUrl + "project/opcUaGroup", {
    method: 'put',
    data: payload,
  })
}

export async function createOpcUaGroupFetch(payload: Partial<OpcUaGroupDataType>) {
  return request(baseUrl + "project/opcUaGroup", {
    method: 'post',
    data: payload,
  })
}
