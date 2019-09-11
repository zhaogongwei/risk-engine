import request from '@/utils/request';

//    风控报告模板

const _baseApi = '/merchant-admin';

//风控报告模板编辑页面查询数据
export async function queryRiskReport(params) {
  return request(`${_baseApi}/report/selectReport`, {
    method: 'POST',
    body: params,
  });
}