import request, {baseUrl} from '@/utils/request';
import OpcUaConnectionDataType from "@/pages/project/connection/opcUaConnection";

export async function opcUaNamespaceListFetchByProtocolId(payload: {protocolId: number}) {
  return request(baseUrl + 'project/opcUaConnection/opcUaNamespace/list', {
    method: 'get',
    params: payload
  })
}

export async function opcUaConnectionListFetch(payload: {opcUaServerId: number}) {
  return request(baseUrl + "project/opcUaConnection/list", {
    method: 'get',
    params: payload
  })
}

export async function deleteOpcUaConnectionFetch(payload: Partial<OpcUaConnectionDataType>) {
  return request(baseUrl + "project/opcUaConnection", {
    method: 'delete',
    data: payload
  })
}

export async function editOpcUaConnectionFetch(payload: Partial<OpcUaConnectionDataType>) {
  return request(baseUrl + "project/opcUaConnection", {
    method: 'put',
    data: payload
  })
}

export async function createOpcUaConnectionFetch(payload: Partial<OpcUaConnectionDataType>) {
  return request(baseUrl + 'project/opcUaConnection', {
    method: 'post',
    data: payload
  })
}

export async function opcUaConnectionFetchById(payload: {id: number}) {
  return request(baseUrl + 'project/opcUaConnection', {
    method: 'get',
    params: payload,
  })
}
