import request from '@/utils/request';
const _baseApi = '/merchant-admin'


//接口管理
//接口管理列表
export async function queryInterfaceList(params) {
  return request(`${_baseApi}/system/interface/list`, {
    method: 'POST',
    body: params
  });
}

//修改接口
export async function updateInterface(params) {
  return request(`${_baseApi}/system/interface/update`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//接口添加
export async function addInterface(params) {
  return request(`${_baseApi}/system/interface/add`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

// 查看详情
export async function viewInfo(params) {
  return request(`${_baseApi}/system/interface/view`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//角色删除
export async function delInterface(params){
  return request(`${_baseApi}/system/interface/delete`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
