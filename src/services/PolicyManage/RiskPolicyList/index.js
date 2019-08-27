import request from '@/utils/request';
const _baseApi = '/merchant-admin'
//查询风控策略列表信息
export async function queryPolicyList(params) {
  return request(`${_baseApi}/strategy/selectStrategyPage`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//查询策略类型
export async function queryPolicyType(params) {
  return request(`${_baseApi}/strategy/selectStrategyTypes`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//新增风控策略
export async function addPolicy(params) {
  return request(`${_baseApi}/strategy/insertStrategy`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//编辑风控策略
export async function editPolicy(params) {
  return request(`${_baseApi}/strategy/updateStrategy`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//查询策略类型
export async function queryPolicyTypes(params) {
  return request(`${_baseApi}/strategy/selectStrategyTypes`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//查询策略策略负责人列表信息
export async function queryUserList(params) {
  return request(`${_baseApi}/system/user/getMerchantUserList`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//查询策略策信息
export async function queryPolicyInfo(params) {
  return request(`${_baseApi}/strategy/${params.strategyId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//校验策略名称
export async function checkPolicyName(params) {
  return request(`${_baseApi}/strategy/checkStrategyName`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//校验策略代码
export async function checkPolicyCode(params) {
  return request(`${_baseApi}/strategy/checkStrategyCode`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//校验策略排序
export async function checkPolicySort(params) {
  return request(`${_baseApi}/strategy/checkOrderNum`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//输入输出配置
//查询策略输入输出变量
export async function queryInputVar(params) {
  return request(`${_baseApi}/strategy/variable/${params.strategyId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//保存策略输入输出变量
export async function saveInputVar(params) {
  return request(`${_baseApi}/strategy/insertStrategyVariable`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//查询输出模板变量
export async function queryMouldList(params) {
  return request(`${_baseApi}/reportTemplate/reportTemplateList`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
