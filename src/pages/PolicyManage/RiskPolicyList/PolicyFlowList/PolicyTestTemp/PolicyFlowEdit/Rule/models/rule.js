import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'rule',

  state: {
    ruleList:[],
    varList:[],//变量列表
    oneClassList:[],//一级分类
    twoClassList:[],//二级分类
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
  },

  effects: {
    //变量列表查询
    *queryVarList({payload}, { call, put }) {
      let response = yield call(api.queryVarList,payload)
      if(response && response.status ===1){
        yield put({
          type:'varListHandle',
          payload:response
        })
      }
      response.data.records.forEach((item,index)=>{
        item['varId']=item['id']
      })
      return response;
    },
    //一级变量分类查询
    *queryOneClassList({payload}, { call, put }) {
      let response = yield call(api.queryVarClassList,payload)
      if(response && response.status ===1){
        yield put({
          type:'oneClassHandle',
          payload:response
        })
      }
      return response;
    },
    //二级变量分类查询
    *queryTwoClassList({payload}, { call, put }) {
      let response = yield call(api.queryVarClassList,payload)
      if(response && response.status ===1){
        yield put({
          type:'twoClassHandle',
          payload:response
        })
      }
      return response;
    },
    //简单规则节点信息查询
    *queryRuleInfo({payload}, { call, put }) {
      let response = yield call(api.queryRuleInfo,payload)
      if(response && response.status === 1){
        /*yield put({
          type:'riskListHandle',
          payload:response
        })*/
      }
    },
    //简单规则节点信息保存
    *saveRuleInfo({payload,callback},{call,put}){
      let response = yield call(api.saveRuleInfo,payload)
      if(response&&response.status == 1){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    ruleListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        ruleList:payload.ruleList,
      }
    },
    varListHandle(state,{payload}){
      return {
        ...state,
        varList:payload.data.records,
        page:{
          currentPage:payload.data.current,
          pageSize:payload.data.size,
          totalNum:payload.data.total,
        }
      }
    },
    oneClassHandle(state,{payload}){
      return {
        ...state,
        oneClassList:payload.data
      }
    },
    twoClassHandle(state,{payload}){
      return {
        ...state,
        twoClassList:payload.data
      }
    }
  },
};





