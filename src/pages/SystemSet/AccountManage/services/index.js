import request from '@/utils/request';
const _baseApi = '/merchant-admin'


//角色管理
//初始化数据
export async function initData(params){
    return request(`${_baseApi}/system/user/init`, {
      method: 'POST',
      body: {
        ...params
      },
    });
  }

//查询角色列表
export async function queryList(params) {
  return request(`${_baseApi}/system/user/list`, {
    method: 'POST',
    body: params
  });
}

//角色修改编辑
export async function editAccount(params) {
  return request(`${_baseApi}/system/user/view`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//账号添加
export async function addAccount(params) {
  return request(`${_baseApi}/system/user/add`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//账号删除
export async function delAccount(params){
  return request(`${_baseApi}/system/user/delete`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
