import request, {baseUrl} from '@/utils/request';
import OpcUaItemDataType from "@/pages/project/components/Item/opcUaItem";

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

export async function editOpcUaItemFetch(payload: Partial<OpcUaItemDataType>) {
  return request(baseUrl + 'project/opcUaItem', {
    method: 'put',
    data: payload,
  })
}

export async function createOpcUaItemFetch(payload: Partial<OpcUaItemDataType>) {
  return request(baseUrl + 'project/opcUaItem', {
    method: 'post',
    data: payload,
  })
}

export async function fetchOnlineDataByGroupId(payload: {opcUaGroupId: number}) {
  return request(baseUrl + 'project/opcUaItem/list/online',{
    method: 'get',
    params: payload,
  })

}
