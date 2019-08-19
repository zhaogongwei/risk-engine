import request from '@/utils/request';
const _baseApi = '/merchant-admin'



//查询变量列表
export async function queryVarList(params) {
  return request(`${_baseApi}/variable/selectVariablePage`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//查询变量分类
export async function queryVarClassList(params) {
  return request(`${_baseApi}/variable/type/variableType/${params.firstTypeId}/${params.secondTypeId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}



//策略流保存
export async function savePolicyFlow(params) {
  return request(`${_baseApi}/strategyFlow/saveFlow`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//策略流导入
export async function importPolicyFlow(params) {
  return request(`${_baseApi}/strategyFlow/${params.flowId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//查询策略名称和版本号
export async function queryPolicyName(params) {
  return request(`${_baseApi}/strategyFlow/${params.strategyFlowId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//简单规则
//节点数据查询
export async function queryRuleInfo(params) {
  return request(`${_baseApi}/simple/info/${params.nodeId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//节点数据保存
export async function saveRuleInfo(params) {
  return request(`${_baseApi}/simple/save`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}


//复杂规则
//节点数据查询
export async function queryComplexInfo(params) {
  return request(`${_baseApi}/complex/info/${params.nodeId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//节点数据保存
export async function saveComplexInfo(params) {
  return request(`${_baseApi}/complex/save`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//评分卡模型
//节点数据查询
export async function queryScoreInfo(params) {
  return request(`${_baseApi}/score/info/${params.nodeId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//节点数据保存
export async function saveScoreInfo(params) {
  return request(`${_baseApi}/score/save`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//是否有交集验证
export async function verifyMixed(params) {
  return request(`${_baseApi}/score/checkDuplicate`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//决策模型
//节点数据查询
export async function querydecInfo(params) {
  return request(`${_baseApi}/decision/info/${params.nodeId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//节点数据保存
export async function savedecInfo(params) {
  return request(`${_baseApi}/decision/save`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//设置变量
//节点数据查询
export async function queryVarInfo(params) {
  return request(`${_baseApi}/setVar/info/${params.nodeId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//节点数据保存
export async function saveVarInfo(params) {
  return request(`${_baseApi}/setVar/save`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//三方数据查询
//节点数据查询
export async function queryThreeSideInfo(params) {
  return request(`${_baseApi}/score/info/${params.nodeId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//节点数据保存
export async function saveThreeSideInfo(params) {
  return request(`${_baseApi}/score/save`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
