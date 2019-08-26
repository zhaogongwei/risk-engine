import * as api from '@/services/PolicyManage/RiskPolicyList';
import {message} from 'antd';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'policyList',

  state: {
    policyList:[],
    policyTypeList:[],//策略类型集合
    queryData: {},   //   查询数据
    userList:[],//策略负责人集合
    policyInfo:{
      strategyType:'',
    },//策略信息
    tableList:[],
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
    //获取策略负责人
    *fetchUserList({payload},{call,put}){
      let response = yield call(api.queryUserList,payload)
      if(response&&response.status===1){
        yield put({
          type: 'saveUserList',
          payload:response,
        })
      }
    },
    //获取策略信息
    *fetchPolicyInfo({payload},{call,put}){
      let response = yield call(api.queryPolicyInfo,payload)
      if(response&&response.status===1){
        yield put({
          type: 'savePolicyInfo',
          payload:response,
        })
      }
    },
    //新增策略
    *addPolicy({payload}, { call, put }) {
      let response = yield call(api.addPolicy,payload)
      return response;
    },
    //编辑策略
    *editPolicy({payload}, { call, put }) {
      let response = yield call(api.editPolicy,payload)
      return response;
    },
    //校验策略名称
    *checkPolicyName({payload},{call,put}){
      let response = yield call(api.checkPolicyName,payload)
      return response;
    },
    //校验策略代码
    *checkPolicyCode({payload},{call,put}){
      let response = yield call(api.checkPolicyCode,payload)
      return response;
    },
    //校验策略排序
    *checkPolicySort({payload},{call,put}){
      let response = yield call(api.checkPolicySort,payload)
      return response;
    },
    //查询策略输入输出变量
    *queryInputVar({payload},{call,put}){
      let response = yield call(api.queryInputVar,payload)
      return response;
    },
    //保存策略输入输出变量
    *saveInputVar({payload},{call,put}){
      let response = yield call(api.saveInputVar,payload)
      return response;
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
    },
    //保存策略负责人集合
    saveUserList(state,{payload}){
      return {
        ...state,
        userList:payload.data,
      }
    },
    //获取策略信息
    savePolicyInfo(state,{payload}){
      return {
        ...state,
        policyInfo:payload.data,
      }
    },
    saveTableList(state,{payload}){
      return {
        ...state,
        tableList:payload
      }
    }
  },
};
