import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit'
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'complex',

  state: {
    complexList:[],//复杂规则列表
    formData:{
      countVarId:'',
      countVarValue:'',
      resultVarId:'',
      resultVarValue:'',
      ruleCondition:'',
    }
  },

  effects: {
    //复杂规则节点信息查询
    *queryComplexInfo({payload}, { call, put }) {
      let response = yield call(api.queryComplexInfo,payload)
      if(response && response.status === 1){
        yield put({
          type:'InitComplexListHandle',
          payload:response
        })
      }
      return response
    },
    //复杂规则节点信息保存
    *saveComplexInfo({payload,callback},{call,put}){
      let response = yield call(api.saveComplexInfo,payload)
      if(response&&response.status == 1){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    //初始化复杂规则列表处理
    InitComplexListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        complexList:addListKey(payload.data.variables),
        formData:{...payload.data}
      }
    },
    //规则列表处理
    complexListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        complexList:payload.complexList,
      }
    },
  },
};





