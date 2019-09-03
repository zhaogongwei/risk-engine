import request from '@/utils/request';

//    风控报告模板

const _baseApi = '/merchant-admin';
//风控报告模板新增/编辑页面保存
export async function saveTemplate(params) {
  return request(`${_baseApi}/reportTemplate/insetReportTemplate`, {
    method: 'POST',
    body: params,
  });
}

//风控报告模板编辑页面查询数据
export async function queryTemplate(params) {
  return request(`${_baseApi}/reportTemplate/reportTemplate`, {
    method: 'POST',
    body: params,
  });
}