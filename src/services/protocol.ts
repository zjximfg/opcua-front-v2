import request, {baseUrl} from '@/utils/request'

export async function getOpcUaProtocolList() {
  return request(baseUrl + "explorer/opcUaProtocol/list", {
    method: 'get',
  })
}
