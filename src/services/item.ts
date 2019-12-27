import request, {baseUrl} from '@/utils/request';

export async function fetchOpcUaItemListByGroupId(payload: {opcUaGroupId: number}) {
  return request(baseUrl + 'project/opcUaItem/list', {
    method: 'get',
    params: payload,
  })
}

export async function fetchItemCategoryListByOpcUaNamespaceId(payload: {opcUaNamespaceId: number}) {
  return request(baseUrl + 'project/opcUaItem/itemCategory/list', {
    method: 'get',
    params: payload,
  })
}

export async function fetchItemObjectListByOpcUaNamespaceId(payload: {opcUaNamespaceId: number}) {
  return request(baseUrl + 'project/opcUaItem/itemObject/list', {
    method: 'get',
    params: payload,
  })
}

export async function fetchItemTypeListByOpcUaNamespaceId(payload: {opcUaNamespaceId: number}) {
  return request(baseUrl + 'project/opcUaItem/itemType/list', {
    method: 'get',
    params: payload,
  })
}
