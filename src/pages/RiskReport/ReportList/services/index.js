import request from '@/utils/request';
const _baseApi = '/merchant-admin'


//查询列表
export async function listData(params) {
  return request(`${_baseApi}/report/list`, {
    method: 'POST',
    body: params
  });
}