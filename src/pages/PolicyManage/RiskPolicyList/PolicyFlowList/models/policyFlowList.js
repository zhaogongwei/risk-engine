import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'policyFlowList',

  state: {
    policyFlowList:[],//策略流列表
  },

  effects: {
    //获取策略流列表
    *fetchFlowList({payload}, { call, put }) {
      let response = yield call(api.queryPolicyFlowList,payload)
      yield put({
        type: 'flowListHanlder',
        payload:response,
      });
    },
    //启用、禁用
    *IsForbid({payload}, { call, put }) {
      let response = yield call(api.isForbid,payload)
      yield put({
        type: 'flowListHanlder',
        payload,
      });
    },
  },

  reducers: {
    flowListHanlder(state,{payload}){
      return {
        ...state,
        policyFlowList:payload.policyFlowList,
      }
    }
  },
};
