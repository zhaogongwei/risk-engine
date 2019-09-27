import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp';
import { addListKey } from '@/utils/utils'
import {message} from 'antd';

export default {
  namespace: 'testTemp',

  state: {
    tempVarList: [],//测试模板变量列表信息
    templateName:'',//测试模板信息
    resultList:[],//查询结果列表
    testTemplateId:'',//测试模板id
  },

  effects: {
    //查询策略测试模板变量信息(编辑）
    *fetchTestTempVarList({payload}, { call, put }) {
      let response = yield call(api.queryPolicyVarInfo,payload);
      if(response&&response.status===1){
        yield put({
          type: 'saveTempVarList',
          payload:response,
        });
      }else{
        message.error(response.statusDesc)
      }
    },
    //查询策略测试模板变量信息(新增）
    *fetchTestTempVarArray({payload}, { call, put }) {
      let response = yield call(api.queryPolicyVarMsg,payload);
      if(response&&response.status===1){
        yield put({
          type: 'saveTempVarList',
          payload:response,
        });
      }else{
        message.error(response.statusDesc)
      }
      return response
    },
    //校验策略测试模板名称
    *checkTemplateName({payload},{call,put}){
      let response = yield call(api.checkTemplateName,payload);
      return response;
    },
    //保存并测试策略模板
    *saveTest({payload}, { call, put }) {
      let response = yield call(api.saveTest,payload);
      return response;
    },
    //查询测试结果
    *queryTestResult({payload},{call,put}){
      let response = yield call(api.queryTestResult,payload);
      if(response&&response.status===1){
        yield put({
          type: 'saveResultList',
          payload:response,
        });
      }else{
        message.error(response.statusDesc)
      }
      return response;
    }
  },

  reducers: {
    saveTempVarList(state, { payload }) {
      return {
        ...state,
        tempVarList: payload.data.inputVarList,
        templateName: payload.data.templateName,
      };
    },
    saveResultList(state,{payload}){
      return {
        ...state,
        resultList:payload.data.list,
      }
    },
    saveTestTemplateId(state,{payload}){
      return {
        ...state,
        testTemplateId:payload,
      }
    }
  },
};
