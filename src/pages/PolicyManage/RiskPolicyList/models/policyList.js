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
    mouldList:[],//输出模板集合
    tableList:[],//输入变量集合
    templateId:'',//输出模板
    pageList:[],//输入变量分页
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
      if(response&&response.status===1){
        response.data.inputVarList = addListKey(response.data.inputVarList)
        yield put({
          type: 'InitTableList',
          payload:response,
        })
      }
      return response;
    },
    //保存策略输入输出变量
    *saveInputVar({payload},{call,put}){
      let response = yield call(api.saveInputVar,payload)
      if(response&&response.status===1){
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
    //查询输出模板变量
    *queryMouldList({payload},{call,put}){
      let response = yield call(api.queryMouldList,payload)
      if(response&&response.status===1){
        yield put({
          type: 'saveMouldList',
          payload:response,
        })
      }
      return response;
    },
    //删除输入变量时进行校验
    *checkMouldList({payload},{call,put}){
      let response = yield call(api.checkMouldList,payload)
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
    //获取输出模板集合
    saveMouldList(state,{payload}){
      return {
        ...state,
        mouldList:payload.data.records
      }
    },
    //初始化查询输入变量列表
    InitTableList(state,{payload}){
      return {
        ...state,
        tableList:payload.data.inputVarList,
        templateId:payload.data.templateId,
      }
    },
    //保存输入变量列表
    saveTableList(state,{payload}){
      return {
        ...state,
        tableList:payload
      }
    },
    //分页数据
    savePageList(state,{payload}){
      return {
        ...state,
        pageList:payload.pageList,
      }
    }
  },
};
