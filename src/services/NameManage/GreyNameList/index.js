import request from '@/utils/request';
const _baseApi = '/engine'
//查询灰名单列表
export async function queryGreyList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//禁用、启用
export async function isForbid(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//拉黑
export async function pullBlack(params) {
  return request(`${_baseApi}/admin/asset/risk_detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//删除名单
export async function delGreyName(params){
  return request(`${_baseApi}/admin/institutions/assets_elements`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}