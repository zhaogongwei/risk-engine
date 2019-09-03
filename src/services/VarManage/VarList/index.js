import request from '@/utils/request';
const _baseApi = '/merchant-admin'
const _api='/engine'
//查询变量列表信息
export async function queryVarList(params) {
  return request(`${_baseApi}/variable/selectVariablePage`, {
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
//新增变量
export async function addVar(params) {
  return request(`${_baseApi}/variable/insertVariable`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//编辑变量
export async function updateVariable(params) {
  return request(`${_baseApi}/variable/updateVariable`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}  
//查询变量信息
export async function selectVariableById(params) {
  return request(`${_baseApi}/variable/selectVariableById`, {
    method: 'POST',
    body: {
      ...params
    },
  });
} 
//删除变量
export async function delVar(params){
  return request(`${_baseApi}/variable/delete`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//应用策略
export async function getStrategy(params){
  return request(`${_baseApi}/variable/getStrategyName`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function getEnumeration(params){
  return request(`${_api}/varList/getEnumeration`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}