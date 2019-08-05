import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'scoreModel',

  state: {
    scoreList:[],
    scoreDetail:[],
    numList:{
      count:1,
      dataSource:[
      ]
    },
    strList:{
      count:1,
      dataSource:[
      ]
    },
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
  },

  effects: {
    //评分模型节点信息查询
    *queryScoreInfo(payload, { call, put }) {
      let response = yield call(api.queryScoreInfo,payload)
      if(response && response.status === '000000'){
        /*yield put({
          type:'riskListHandle',
          payload:response
        })*/
      }
    },
    //简单规则节点信息保存
    *saveScoreInfo({payload,callback},{call,put}){
      let response = yield call(api.saveScoreInfo,payload)
      if(response&&response.status == '000000'){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    scoreListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        scoreList:payload.scoreList,
      }
    },
    addNumData(state, {payload}) {
      return {
        ...state,
        numList:{
          dataSource: payload.dataSource,
          count: payload.count,
        }
      };
    },
    addStrData(state,{payload}){
        return {
          ...state,
          strList:{
            dataSource: payload.dataSource,
            count: payload.count,
          }
        }
    },
    delNumData(state, {payload}) {
      return {
        ...state,
        numList:{
          dataSource: payload.dataSource,
          count:payload.count
        }
      };
    },
    delStrData(state, {payload}) {
      return {
        ...state,
        strList:{
          dataSource: payload.dataSource,
          count:payload.count
        }
      };
    },
  },
};





