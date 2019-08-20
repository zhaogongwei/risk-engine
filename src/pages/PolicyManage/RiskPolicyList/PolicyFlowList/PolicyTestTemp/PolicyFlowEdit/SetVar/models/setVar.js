import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'setVar',

  state: {
    varList:[],
  },

  effects: {
    //设置变量节点信息查询
    *queryVarInfo({payload}, { call, put }) {
      let response = yield call(api.queryVarInfo,payload)
      if(response && response.status === 1){
        yield put({
          type:'InitSetVarHandle',
          payload:response
        })
      }
      return response;
    },
    //设置变量节点信息保存
    *saveVarInfo({payload,callback},{call,put}){
      let response = yield call(api.saveVarInfo,payload)
      if(response&&response.status ===1){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
  },

  reducers: {
    //初始化设置变量列表数据
    InitSetVarHandle(state,{payload}){
      return {
        ...state,
        varList:addListKey(payload.data.variableList),
      }
    },
    varListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        varList:payload.varList,
      }
    },
  },
};





