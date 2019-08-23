import request from '@/utils/request';
const _baseApi = '/merchant-admin'


//角色管理
//查询角色列表
export async function queryList(params) {
  return request(`${_baseApi}/system/role/list`, {
    method: 'POST',
    body: params
  });
}

//获取默认权限list
export async function initData(params) {
  return request(`${_baseApi}/system/role/info`, {
    method: 'POST',
    body: params
  });
}

//角色修改编辑
export async function editRole(params) {
  return request(`${_baseApi}/system/role/update`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//角色添加
export async function addRole(params) {
  return request(`${_baseApi}/system/role/add`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//角色删除
export async function delRole(params){
  return request(`${_baseApi}/system/role/delete`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
