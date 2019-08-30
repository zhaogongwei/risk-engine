import request from '@/utils/request';

//    风控报告模板

const _baseApi = '/merchant-admin';
//   列表接口
export async function templateList(params) {
  return request(`${_baseApi}/reportTemplate/reportTemplateList`, {
    method: 'POST',
    body: params,
  });
}