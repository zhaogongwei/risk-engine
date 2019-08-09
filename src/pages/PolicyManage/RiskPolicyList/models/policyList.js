import * as api from '@/services/PolicyManage/RiskPolicyList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'policyList',

  state: {
    editorData: {},
    status:false,
    tableList:[],
    pageList:[],
    policyList:[]
  },

  effects: {
    //获取策略列表
    *fetchPolicyList({payload}, { call, put }) {
      let response = yield call(api.queryPolicyList,payload)
      yield put({
        type: 'savePolicyList',
        payload,
      });
    },
    //新增策略
    *addPolicy({payload}, { call, put }) {
      let response = yield call(api.addPolicy,payload)
      yield put({
        type: 'savePolicyList',
        payload,
      });
    },
    //编辑策略
    *editPolicy({payload}, { call, put }) {
      let response = yield call(api.editPolicy,payload)
      yield put({
        type: 'savePolicyList',
        payload,
      });
    },
  },

  reducers: {
    saveEditorData(state, { payload }) {
      return {
        ...state,
        editorData: payload,
      };
    },
    saveTableList(state,{payload}){
      console.log(payload)
      return {
        ...state,
        tableList:payload
      }
    },
    savePageList(state,{payload}){
      return {
        ...state,
        pageList:payload
      }
    },
    savePolicyList(state,{payload}){
      return {
        ...state,
        policyList:payload,
      }
    }
  },
};
