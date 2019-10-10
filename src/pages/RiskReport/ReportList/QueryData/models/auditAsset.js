import * as api from '@/services/RiskReport/ReportList/QueryData';
import { addListKey } from '@/utils/utils'
import moment from 'moment'
import { notification,message} from 'antd'
const dateFormat = 'YYYY-MM-DD'

export default {
  namespace: 'auditAsset',

  state: {
    assetList:[],
    formData:{},
    creditInfoList:[
      {
        createTime:'',
        threeMonkeyCredit:{
          creditRow1:[],
          creditRow2:[],
          creditRow3:[],
          creditRow4:[],
          creditRow5:[],
          creditRow6:[],
        }
      }
    ],
    debtInfoList:[
      {
        createTime:'',
        creditDebtResult:{
          detail:[],
          debtInfo:[],
        }
      }
    ],
    arfakeInfoList:{
      idcardVerif:{},
      nongovCredit:{},
      judicialInfo:{},
    },
    arfakeInfo:[
      {
        id:'',
        createBy:'',
        createTime:'',
        antiFraudResult:{
          idcardVerif:[],
          antiFraudList:[],
          validSifa:{
            anliInfoList:[],
            shiXinInfoList:[],
            zhiXingInfoList:[],
          }
        }
      }
    ],
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
    *queryDsCreditInfo({payload}, { call, put }){
      let response = yield call (api.queryDsCreditInfo,payload)
      if(response && response.status === 1&&response.data.length>0){
        response.data.forEach((item,index)=>{
          addListKey(item['threeMonkeyCredit']['creditRow1'])
          addListKey(item['threeMonkeyCredit']['creditRow2'])
          addListKey(item['threeMonkeyCredit']['creditRow3'])
          addListKey(item['threeMonkeyCredit']['creditRow4'])
          addListKey(item['threeMonkeyCredit']['creditRow5'])
          addListKey(item['threeMonkeyCredit']['creditRow6'])
        })

        yield put ({
          type:'creditListHandle',
          payload:response
        })
      }
    },
    //大圣信用报告信息更新
    *updateDsCreditInfo({payload,callback}, { call, put }){
      let response = yield call(api.updateDsCreditnfo,payload)
      if(response && response.status === 1){
        message.success(response.statusDesc);
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },

    //大圣共债报告信息查询
    *queryDsDebtInfo({payload}, { call, put }){
      let response = yield call (api.queryDsDebtInfo,payload)
      if(response && response.status === 1&&response.data.length>0){
        response.data.forEach((item,index)=>{
          addListKey(item['creditDebtResult']['detail'])
          item['creditDebtResult'].debtInfo = [
              {
                current_order_count:item['creditDebtResult']['current_order_count'],
                current_order_amt:item['creditDebtResult']['current_order_amt'],
                current_org_count:item['creditDebtResult']['current_org_count'],
              }
            ]
          addListKey(item['creditDebtResult']['debtInfo'])
        })
        yield put ({
          type:'debtListHandle',
          payload:response
        })
      }
    },
    //大圣共债报告信息更新
    *updateDsDebtInfo({payload,callback}, { call, put }){
      let response = yield call(api.updateDsDebtInfo,payload)
      if(response && response.status === 1){
        message.success(response.statusDesc);
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
    //安融个人反欺诈报告查询
    *queryArfakeInfo({payload}, { call, put }){
      let response = yield call (api.queryArfakeInfo,payload)
      if(response && response.status === 1&&response.data.length>0){
        response.data.forEach((item,index)=>{
          addListKey(item.antiFraudResult.antiFraudList);
          addListKey(item.antiFraudResult.validSifa.anliInfoList);
          addListKey(item.antiFraudResult.validSifa.shiXinInfoList);
          addListKey(item.antiFraudResult.validSifa.zhiXingInfoList);
          item.antiFraudResult.idcardVerif=[
            {
              validIdentity:item.antiFraudResult.validIdentity,
              validCard:item.antiFraudResult.validCard,
              queryTimes:item.antiFraudResult.queryTimes,
            }
          ]
          addListKey(item.antiFraudResult.idcardVerif);
        })
        yield put ({
          type:'arfakeInfoHandle',
          payload:response
        })
      }
      return response;
    },
    //安融报告更新
    *updateArReport({payload,callback}, { call, put }){
      let response = yield call(api.updateArReport,payload)
      if(response && response.status === 1){
        message.success(response.statusDesc);
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
  },

  reducers: {
    arfakeInfoHandle(state,{payload}){
      console.log(payload)
      return {
        ...state,
        arfakeInfo:payload.data
      }
    },
    creditListHandle(state,{payload}){
      return {
        ...state,
        creditInfoList:payload.data
      }
    },
    debtListHandle(state,{payload}){
      return {
        ...state,
        debtInfoList:payload.data
      }
    },
  },
};





