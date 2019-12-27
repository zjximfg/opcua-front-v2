import request, {baseUrl} from '@/utils/request';
import {OpcUaServerDataType} from "@/pages/explorer/components/OpcUaServer/data";

export async function opcUaServerFetch() {
  return request(baseUrl + 'project/opcUaServer', {
    method: 'get',
  })
}

export async function updateOpcUaServer(payload: Partial<OpcUaServerDataType>) {
  return request(baseUrl + 'project/opcUaServer', {
    method: 'put',
    data: payload
  })
}

export async function restartServer() {
  return request(baseUrl + 'project/opcUaServer/restartServer', {
    method: 'get',
  })
}

export async function opcUaProtocolListFetch() {
  return request(baseUrl + 'project/opcUaProtocol/list', {
    method: 'get'
  })
}

export async function securityPolicyUriListFetch() {
  return request(baseUrl + 'project/securityPolicyUri/list', {
    method: 'get'
  })
}
