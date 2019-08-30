import * as api from '@/services/RiskReport/ReportList/QueryData';
import { addListKey } from '@/utils/utils'
import { notification,message} from 'antd'

export default {
  namespace: 'auditAsset',

  state: {
    assetList:[],
    formData:{},
    dateList:[],
    creditDateList:[],
    debtDateList:[],
    overdueDateList:[],
    creditInfoList:[],
    debtInfoList:[],
    overdueInfoList:[],
    arcreditDateList:[],
    arfakeDateList:[],
    arfakeInfoList:{
      idcardVerif:{},
      nongovCredit:{},
      judicialInfo:{},
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
    //大圣信用报告信息查询
    *queryDsCreditInfo(payload, { call, put }){
      let response = yield call (api.queryDsCreditInfo,payload.data)
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
      let response = yield call(api.updateDsCreditnfo,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },

    //大圣共债报告信息查询
    *queryDsDebtInfo(payload, { call, put }){
      let response = yield call (api.queryDsDebtInfo,payload.data)
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
      let response = yield call(api.updateDsDebtInfo,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
    //安融个人反欺诈报告查询
    *queryArfakeInfo({payload}, { call, put }){
      let response = yield call (api.queryArfakeInfo,payload)
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
      let response = yield call(api.updateArReport,payload)
      if(response && response.status === '000000'){
        message.success(response.statusDesc);
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    arfakeInfoHandle(state,{payload}){
      return {
        ...state,
        arfakeInfoList:payload.result
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
  },
};





