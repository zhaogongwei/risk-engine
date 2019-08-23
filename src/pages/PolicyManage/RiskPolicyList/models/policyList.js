import * as api from '@/services/PolicyManage/RiskPolicyList';
import {message} from 'antd';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'policyList',

  state: {
    policyList:[],
    policyTypeList:[],//策略类型集合
    queryData: {},   //   查询数据
    pageData:{
      current:1,
      total:0,
      size:0
    }
  },

  effects: {
    //获取策略列表
    *fetchPolicyList({ payload }, { call, put }) {
      let response = yield call(api.queryPolicyList, payload)
      if(response&&response.status===1){
        response.data.records=addListKey(response.data.records,response.data.current,response.data.size)
        yield put({
          type: 'savePolicyList',
          payload:response,
        });
      }

    },
    //获取策略类型列表
    *fetchPolicyTypeList({payload},{call,put}){
      let response = yield call(api.queryPolicyType,payload);
      if(response&&response.status===1){
        yield put({
          type: 'savePolicyTypeList',
          payload:response,
        });
      }
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
    savePolicyList(state, { payload }){
      return {
        ...state,
        policyList: payload.data.records,
        pageData:{...payload.data}
      }
    },
    //   保存查询数据
    saveQueryData(state, { payload }) {
      return {
        ...state,
        queryData: payload,
      }
    },
    //保存策略类型集合
    savePolicyTypeList(state,{payload}){
      return {
        ...state,
        policyTypeList:payload.data,
      }
    }
  },
};
