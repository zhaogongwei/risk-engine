import request from '@/utils/request';
const _baseApi = '/merchant-admin'


//查询列表
export async function listData(params) {
  return request(`${_baseApi}/report/list`, {
    method: 'POST',
    body: params
  });
}

//更新状态
export async function updateStatus(params) {
  return request(`${_baseApi}/report/updateReportList`, {
    method: 'POST',
    body: params
  });
}
