import request from '@/utils/request';
const _baseApi = '/aems'
//百行风控报告日期查询
export async function queryRiskDate(params) {
  return request(`${_baseApi}/admin/risk_management_report/time/${params.instCode}/${params.assetsCode}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//百行风控报告信息查询

export async function queryRiskInfo(params){
  return request(`${_baseApi}/admin/risk_management_report/detail/${params.id}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//百行风控报告信息更新
export async function updateRiskInfo(params){
  return request(`${_baseApi}/admin/risk_management_report/update`,{
    method:'POST',
    body:{
      ...params
    }
  })
}
//大圣公共时间查询
export async function queryDsPublicDate(params) {
  return request(`${_baseApi}/admin/wind_monkey/common_time_query`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//大圣信用风控报告信息查询

export async function queryDsCreditInfo(params){
  return request(`${_baseApi}/admin/wind_monkey/credit_report_query`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//大圣信用风控报告信息更新
export async function updateDsCreditnfo(params){
  return request(`${_baseApi}/admin/wind_monkey/credit_report_update`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//大圣共债风控报告信息查询

export async function queryDsDebtInfo(params){
  return request(`${_baseApi}/admin/wind_monkey/debt_report_query`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//大圣共债风控报告信息更新
export async function updateDsDebtInfo(params){
  return request(`${_baseApi}/admin/wind_monkey/debt_report_update`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//大圣逾期宝风控报告信息查询

export async function queryOverdueInfo(params){
  return request(`${_baseApi}/admin/wind_monkey/overdue_query`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//大圣逾期宝风控报告信息更新
export async function updateDsOverduenfo(params){
  return request(`${_baseApi}/admin/wind_monkey/overdue_update`,{
    method:'POST',
    body:{
      ...params
    }
  })
}
//安融报告时间查询
export async function queryArPublicDate(params){
  return request(`${_baseApi}/admin/anrong/query_date/list`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//安融个人征信报告信息查询
export async function queryArCreditInfo(params){
  return request(`${_baseApi}/admin/anrong/personal_credit/list`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//安融个人反欺诈报告
export async function queryArfakeInfo(params){
  return request(`${_baseApi}/admin/wind_anrong/person_anti_fraud_report`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//安融个人报告更新
export async function updateArReport(params){
  return request(`${_baseApi}/admin/wind_anrong/report_update`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//钛镕风控报告查询
export async function queryTrReportInfo(params){
  return request(`${_baseApi}/admin/tr_wind/infoQuery`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

//钛镕规则命中表查询
export async function queryRuleList(params){
  return request(`${_baseApi}/admin/tr_wind/isHitRule`,{
    method:'POST',
    body:{
      ...params
    }
  })
}

// 导出列表信息的接口
export async function exportMemberExcel(params) {
  return exportExcel(`${_baseApi}/admin/asset_audit/export`, {
    method: 'POST',
    body: {
      ...params
    }
  });
}