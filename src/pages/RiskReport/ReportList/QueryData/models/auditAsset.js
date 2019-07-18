import { queryAssetList,auditAsset,queryRiskDate,queryRiskInfo,exportMemberExcel,updateRiskInfo,queryAssetDetail} from '@/services/RiskReport/ReportList/QueryData';
import * as riskReport from '@/services/RiskReport/ReportList/QueryData';
import { addListKey } from '@/utils/utils'
import { notification,message} from 'antd'

export default {
  namespace: 'auditAsset',

  state: {
    assetList:[],
    formData:{},
    dateList:[],
    reportList:{
      threeAssetsReport:{},
      threeReportLiveinfo:[],
      threeReportPositioninfo:[],
      threeReportOutlineinfo:{},
      singleOutlineinfos:[],
      creditInformation:{},
      loopCredits:[],
      recordsDetail:{},
    },
    creditDateList:[],
    debtDateList:[],
    overdueDateList:[],
    creditInfoList:[],
    debtInfoList:[],
    overdueInfoList:[],
    arcreditDateList:[],
    arfakeDateList:[],
    arcreditInfoList:{
      creditTransacte:{
        applyingRecord:{
          applyingCount:''
        },
        normalRepay:{},
        abnormalRepay:{},
        blackRecord:{},
        queryRecord:{},
      },
      loanApplicationList:[],
      normalRepayList:[],
      abnormalRepayList:[],
      queryRecordList:[],
      industryInfoList:[],
      objectionDeclaratList:[],
    },
    arfakeInfoList:{
      idcardVerif:{},
      nongovCredit:{},
      judicialInfo:{},
    },
    trInfo:{
      trRuleList:[],
      threeTrWindControlReport:{},
      threeAssetsReportVO:{}
    },
    //钛镕风控报告
    trRuleList:[],
    ruleList:[],
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
    info:{
      assetsNumber:'',
      borrowNid:'',
      assetsName:'',
      userName:'',
      amount:'',
      loanPeriod:'',
      periods:'',
      borrowStyle:'',
      projectStatusName:'',
      lendingTime:'',
      addTime:'',
    }
  },

  effects: {
    //百行风控报告日期查询
    *queryRiskTime({payload,callback}, { call, put }){
      let response = yield call (queryRiskDate,payload)
      if(response && response.status === '000000'){
        yield put ({
          type:'dateListHandle',
          payload:response
        })
        const data = {
          threeAssetsReport:{},
          threeReportLiveinfo:[],
          threeReportPositioninfo:[],
          threeReportOutlineinfo:{},
          singleOutlineinfos:[],
          creditInformation:{},
          loopCredits:[],
          recordsDetail:{},
        }
        callback&&response.result.length>0?callback(response.result[0]['id']):yield put({type:'rptListHandle',payload:{result:data}})
      }
    },
    //百行风控报告信息查询
    *queryRiskInfo(payload, { call, put }){
      let response = yield call (queryRiskInfo,payload.data)
      if(response && response.status === '000000'){
        addListKey(response.result['threeReportLiveinfo'])
        addListKey(response.result['threeReportPositioninfo'])
        addListKey(response.result['singleOutlineinfos'])
        addListKey(response.result['loopCredits'])
        yield put ({
          type:'rptListHandle',
          payload:response
        })
      }
    },

    //百行风控报告信息更新
    *renewRiskInfo({payload,callback}, { call, put }){
      let response = yield call(updateRiskInfo,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        //callback()
        message.error(response.statusDesc)
      }
    },
    //大圣公用日期查询
    *queryDsPublicDate({payload,callback}, { call, put }){
      let response = yield call (riskReport.queryDsPublicDate,payload)
      if(response && response.status === '000000'){
        const creditData = {
          creditRow1:[],
          creditRow2:[],
          creditRow3:[],
          creditRow4:[],
          creditRow5:[],
          creditRow6:[],
        }
        const debtData = {
          head:[],
          body:[],
        }
        const overdueData = {
          overdueRow1:[],
          overdueRow2:[],
        }
        if(payload.reportFlag === 1){
          yield put ({
            type:'creditDateHandle',
            payload:response
          })
          callback&&response.resultList.length>0?callback(response.resultList[0]):callback('')
        }else if(payload.reportFlag ===2){
          yield put ({
            type:'debtDateHandle',
            payload:response
          })
          callback&&response.resultList.length>0?callback(response.resultList[0]):callback('')
        }else if(payload.reportFlag ===3){
          yield put ({
            type:'overdueDateHandle',
            payload:response
          })
          callback&&response.resultList.length>0?callback(response.resultList[0]):callback('')
        }

      }
    },
    //大圣信用报告信息查询
    *queryDsCreditInfo(payload, { call, put }){
      let response = yield call (riskReport.queryDsCreditInfo,payload.data)
      if(response && response.status === '000000'){
        addListKey(response.result['creditRow1'])
        addListKey(response.result['creditRow2'])
        addListKey(response.result['creditRow3'])
        addListKey(response.result['creditRow4'])
        addListKey(response.result['creditRow5'])
        addListKey(response.result['creditRow6'])
        yield put ({
          type:'creditListHandle',
          payload:response
        })
      }
    },
    //大圣信用报告信息更新
    *updateDsCreditInfo({payload,callback}, { call, put }){
      let response = yield call(riskReport.updateDsCreditnfo,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },

    //大圣共债报告信息查询
    *queryDsDebtInfo(payload, { call, put }){
      let response = yield call (riskReport.queryDsDebtInfo,payload.data)
      if(response && response.status === '000000'){
        addListKey(response.result['head'])
        addListKey(response.result['body'])
        yield put ({
          type:'debtListHandle',
          payload:response
        })
      }
    },
    //大圣共债报告信息更新
    *updateDsDebtInfo({payload,callback}, { call, put }){
      let response = yield call(riskReport.updateDsDebtInfo,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },

    //大圣逾期宝报告信息查询
    *queryDsOverdueInfo(payload, { call, put }){
      let response = yield call (riskReport.queryOverdueInfo,payload.data)
      if(response && response.status === '000000'){
        addListKey(response.result['overdueRow1'])
        addListKey(response.result['overdueRow2'])
        yield put ({
          type:'overdueListHandle',
          payload:response
        })
      }
    },
    //大圣逾期宝报告信息更新
    *updateDsOverdueInfo({payload,callback}, { call, put }){
      let response = yield call(riskReport.updateDsOverduenfo,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
    //安融报告公用时间查询
    *queryArDateList({payload,callback},{call,put}){
      let response = yield call (riskReport.queryArPublicDate,payload)
      if(response && response.status === '000000'){
        if(payload.queryType === 1){
          yield put ({
            type:'arcreditDateHandle',
            payload:response
          })
          callback&&response.result['queryDateList'].length>0?callback(response.result['queryDateList'][0]['reportTime']):callback('')
        }else if(payload.queryType ===2){
          yield put ({
            type:'arfakeDateHandle',
            payload:response
          })
          callback&&response.result['queryDateList'].length>0?callback(response.result['queryDateList'][0]['reportTime']):callback('')
        }
      }
    },
    //安融个人征信报告信息查询
    *queryArcreditInfo(payload, { call, put }){
      let response = yield call (riskReport.queryArCreditInfo,payload.data)
      if(response && response.status === '000000'){
        addListKey(response.result['loanApplicationList'])
        addListKey(response.result['normalRepayList'])
        addListKey(response.result['abnormalRepayList'])
        addListKey(response.result['queryRecordList'])
        addListKey(response.result['industryInfoList'])
        addListKey(response.result['objectionDeclaratList'])
        yield put ({
          type:'arcreditInfoHandle',
          payload:response
        })
      }else{
        const res = {
          result: {
            creditTransacte:{
              applyingRecord:{
                applyingCount:''
              },
              normalRepay:{},
              abnormalRepay:{},
              blackRecord:{},
              queryRecord:{},
            },
            loanApplicationList:[],
            normalRepayList:[],
            abnormalRepayList:[],
            queryRecordList:[],
            industryInfoList:[],
            objectionDeclaratList:[],
          }
        }
        yield put ({
          type:'arcreditInfoHandle',
          payload:res
        })
      }
    },
    //安融个人反欺诈报告查询
    *queryArfakeInfo(payload, { call, put }){
      let response = yield call (riskReport.queryArfakeInfo,payload.data)
      if(response && response.status === '000000'){
        addListKey(response.result['antiFraud'])
        addListKey(response.result['judicialInfo']['caseList'])
        addListKey(response.result['judicialInfo']['breakList'])
        addListKey(response.result['judicialInfo']['implementList'])
        yield put ({
          type:'arfakeInfoHandle',
          payload:response
        })
      }else{
        const res = {
          result: {
            idcardVerif:{},
            nongovCredit:{},
            judicialInfo:{},
          }
        }
        yield put ({
          type:'arfakeInfoHandle',
          payload:res
        })
      }
    },
    //安融报告更新
    *updateArReport({payload,callback}, { call, put }){
      let response = yield call(riskReport.updateArReport,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
    //钛镕风控报告查询
    *queryTrReportInfo(payload,{call,put}){
      let response = yield call(riskReport.queryTrReportInfo,payload.data);
      if(response && response.status === '000000'){
        if(response.result){
          response.result['trRuleList']=response.result['trRuleList']?response.result['trRuleList']:[];
          response.result['threeAssetsReportVO']=response.result['threeAssetsReportVO']?response.result['threeAssetsReportVO']:{};
          response.result['threeTrWindControlReport']=response.result['threeTrWindControlReport']?response.result['threeTrWindControlReport']:{};
          addListKey(response.result['trRuleList'])
          yield put ({
            type:'trInfoHandle',
            payload:response
          })
        }else{
          const response = {
            result:{
              trRuleList:[],
              threeTrWindControlReport:{},
              threeAssetsReportVO:{}
            }
          }
          yield put ({
            type:'trInfoHandle',
            payload:response
          })
        }
      }else{
        message.error(response.statusDesc)
      }
    },
    //钛镕规则命中表查询
    *queryRuleList(payload,{call,put}){
      let response = yield call(riskReport.queryRuleList,payload.data);
      if(response && response.status === '000000'){
        addListKey(response.result)
        yield put ({
          type:'saveRuleList',
          payload:response
        })
      }else{
        message.error(response.statusDesc)
      }
    }

  },

  reducers: {
    assetListHandle(state, { payload }) {
      return {
        ...state,
        assetList:payload.resultList,
        page:payload.page
      }
    },
    saveFormData(state,{payload}){
      return {
        ...state,
        formData:payload
      }
    },
    dateListHandle(state,{payload}){
      return {
        ...state,
        dateList:payload.result
      }
    },
    creditDateHandle(state,{payload}){
      return {
        ...state,
        creditDateList:payload.resultList
      }
    },
    debtDateHandle(state,{payload}){
      return {
        ...state,
        debtDateList:payload.resultList
      }
    },
    overdueDateHandle(state,{payload}){
      return {
        ...state,
        overdueDateList:payload.resultList
      }
    },
    arcreditDateHandle(state,{payload}){
      return {
        ...state,
        arcreditDateList:payload.result.queryDateList
      }
    },
    arfakeDateHandle(state,{payload}){
      return {
        ...state,
        arfakeDateList:payload.result.queryDateList
      }
    },
    arcreditInfoHandle(state,{payload}){
      return {
        ...state,
        arcreditInfoList:payload.result
      }
    },
    arfakeInfoHandle(state,{payload}){
      return {
        ...state,
        arfakeInfoList:payload.result
      }
    },
    trInfoHandle(state,{payload}){
      return {
        ...state,
        trInfo:payload.result
      }
    },
    rptListHandle(state,{payload}){
      return {
        ...state,
        reportList:payload.result
      }
    },
    creditListHandle(state,{payload}){
      return {
        ...state,
        creditInfoList:payload.result
      }
    },
    debtListHandle(state,{payload}){
      return {
        ...state,
        debtInfoList:payload.result
      }
    },
    overdueListHandle(state,{payload}){
      return {
        ...state,
        overdueInfoList:payload.result
      }
    },
    saveRuleList(state,{payload}){
      return {
        ...state,
        trRuleList:addListKey(payload.result.trRuleList)
      }
    },
    merage(state, { payload }) {
      return {
        ...state,
        info:payload,
      };
    },
  },
};





