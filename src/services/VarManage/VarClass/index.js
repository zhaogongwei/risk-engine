import request from '@/utils/request';
//const _baseApi = '/engine'
const _baseApi = '/merchant-admin'
//查询变量分类列表信息
export async function queryClassList(params) {
  return request(`${_baseApi}/variable/type/selectVariableTypePage`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function getSelectLevel1(params) {
  return request(`${_baseApi}/variable/type/firstVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getSelectLevel2(params) {
  return request(`${_baseApi}/variable/type/secondVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//添加变量（一级/二级）
export async function addVarClass(params) {
  return request(`${_baseApi}/variable/type/insertVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//修改变量（一级/二级）
export async function editVarClass(params) {
  return request(`${_baseApi}/variable/type/updateVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//删除变量（一级/二级）
export async function delVarClass(params){
  return request(`${_baseApi}/variable/type/delete`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//校验变量分类名称唯一性
export async function checkVarName(params){
  return request(`${_baseApi}/variable/type/checkVariableExist`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}