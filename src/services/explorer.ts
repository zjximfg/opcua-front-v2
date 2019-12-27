import request, {baseUrl} from '@/utils/request'

export async function getOpcUaProtocolList() {
  return request(baseUrl + "explorer/opcUaProtocol/list", {
    method: 'get',
  })
}

export async function getOpcUaServerList(payload: {opcUaProtocolId: number}) {
  return request(baseUrl + "explorer/opcUaServer/list", {
    method: 'get',
    params: payload
  })
}

export async function getOpcUaNodeListByNodeId(payload: {opcUaServerId: number, namespaceIndex: number, identifier: string, nodeIdType: string}) {
  return request(baseUrl + "explorer/opcUaNode/list", {
    method: 'get',
    params: payload
  })
}

export async function getOpcUaRootNodeListByServer(payload: {opcUaServerId: number}) {
  return request(baseUrl + "explorer/opcUaNode/rootList", {
    method: 'get',
    params: payload
  })
}

export async function opcUaDataValueFetch(payload: {opcUaServerId: number, namespaceIndex: number, identifier: string, nodeIdType: string}) {
  return request(baseUrl + "explorer/opcUaDataValue/read", {
    method: 'get',
    params: payload
  })
}

export async function monitorOpcUaDataValue(payload: {opcUaServerId: number, namespaceIndex: number, identifier: string, nodeIdType: string}) {
  return request(baseUrl + "explorer/opcUaDataValue/monitor", {
    method: 'get',
    params: payload
  })
}
