import request from '@/utils/request';
const _baseApi = '/merchant-admin'

//大圣信用风控报告信息查询

export async function queryDsCreditInfo(params){
  return request(`${_baseApi}/report/selectReport`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//大圣信用风控报告信息更新
export async function updateDsCreditnfo(params){
  return request(`${_baseApi}/report/updatexyCreditReport`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//大圣共债风控报告信息查询

export async function queryDsDebtInfo(params){
  return request(`${_baseApi}/report/selectReport`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//大圣共债风控报告信息更新
export async function updateDsDebtInfo(params){
  return request(`${_baseApi}/report/updateDebtCreditReport`,{
    method:'POST',
    body:{
      ...params
    }
  })
}


//安融个人反欺诈报告
export async function queryArfakeInfo(params){
  return request(`${_baseApi}/report/selectReport`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//安融个人报告更新
export async function updateArReport(params){
  return request(`${_baseApi}/report/reportUpdate`,{
    method:'POST',
    body:{
      ...params
    }
  })
}