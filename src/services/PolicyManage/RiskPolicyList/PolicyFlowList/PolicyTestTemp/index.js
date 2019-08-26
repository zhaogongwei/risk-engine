import request from '@/utils/request';
const _baseApi = '/merchant-admin'
//查询策略策略测试模板列表信息
export async function queryTestTempList(params) {
  return request(`${_baseApi}/strategyFlow/testTemplate/selectTestTemplatePage`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//查询策略策略测试模板用户列表信息
export async function queryUserList(params) {
  return request(`${_baseApi}/system/user/getMerchantUserList`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//测试模板新增
//查询策略测试模板变量信息
export async function queryPolicyVarInfo(params) {
  return request(`${_baseApi}/strategyFlow/testTemplate/${params.testTemplateId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//保存并测试测试模板
export async function saveTest(params) {
  return request(`${_baseApi}/strategyFlow/testTemplate/saveAndRunTestTemplate`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}


//查询测试资产执行结果
export async function queryTestResult(params) {
  return request(`${_baseApi}/strategyFlow/testTemplate/getResult`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
