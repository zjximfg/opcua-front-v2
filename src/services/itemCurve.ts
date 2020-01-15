import request, {baseUrl} from '@/utils/request';

export async function itemCurveDataFetch(payload: {itemId: number}) {
  return request(baseUrl + "project/opcUaItem/itemCurve/data", {
    method: 'get',
    params: payload,
  })
}
