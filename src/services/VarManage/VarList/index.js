import request from '@/utils/request';
const _baseApi = '/aems'
//查询变量列表信息
export async function queryVarList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//新增变量
export async function addVar(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//编辑变量
export async function editVar(params) {
  return request(`${_baseApi}/admin/asset/risk_detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//删除变量
export async function delVar(params){
  return request(`${_baseApi}/admin/institutions/assets_elements`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}