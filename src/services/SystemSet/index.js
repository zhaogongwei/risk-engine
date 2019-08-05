import request from '@/utils/request';
const _baseApi = '/engine'


//角色管理
//查询角色列表
export async function queryRoleList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//角色修改编辑
export async function editRole(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//角色添加
export async function addRole(params) {
  return request(`${_baseApi}/admin/asset/risk_detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//角色删除
export async function delRole(params){
  return request(`${_baseApi}/admin/institutions/assets_elements`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//角色授权
export async function empower(params){
  return request(`${_baseApi}/admin/institutions/assets_elements`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}