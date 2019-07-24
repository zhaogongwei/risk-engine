import request from '@/utils/request';
const _baseApi = '/engine'
//查询变量分类列表信息
export async function queryClassList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//添加变量（一级/二级）
export async function addVarClass(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//修改变量（一级/二级）
export async function editVarClass(params) {
  return request(`${_baseApi}/admin/asset/risk_detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//删除变量（一级/二级）
export async function delVarClass(params){
  return request(`${_baseApi}/admin/institutions/assets_elements`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}