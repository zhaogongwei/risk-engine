import * as api from '@/services/PolicyManage/RiskPolicyList/RiskLabel';
import {message} from 'antd';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'risklabel',

  state: {
    labelList:[],//风控标签列表
    labelInfo:{
      labelName:'',
      status:null,
      variableList:[]
    },//风控标签信息
    queryData: {},   //   查询数据
    pageData:{
      current:1,
      total:0,
      size:0
    },
    tableList:[],
  },

  effects: {
    //获取风控标签列表
    *fetchRiskLabelList({payload}, { call, put }) {
      let response = yield call(api.queryRiskLabelList,payload)
      if(response&&response.status===1){
        response.data.records = addListKey(response.data.records,response.data.current,response.data.size)
        yield put({
          type: 'labelListHandle',
          payload:response,
        });
      }
    },
    //新增风控标签
    *addRiskLabel({payload}, { call, put }) {
      let response = yield call(api.addRiskLabel,payload)
      if(response&&response.status===1){
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
    //编辑风控标签
    *editRiskLabel({payload}, { call, put }) {
      let response = yield call(api.editRiskLabel,payload)
      if(response&&response.status===1){
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
    //删除风控标签
    *delRiskLabel({payload}, { call, put }) {
      let response = yield call(api.delRiskLabel,payload)
      return response;
    },
    //校验标签名称
    *checkLabelName({payload},{call,put}){
      let response = yield call(api.checkLabelName,payload)
      return response
    },
    //查询标签信息
    *queryLabelInfo({payload},{call,put}){
      let response = yield call(api.queryLabelInfo,payload)
      if(response&&response.status===1){
        response.data.variableList.forEach((item,index)=>{
          item['varType']=item['variableType']
        })
        yield put({
          type: 'saveLabelInfo',
          payload:response,
        });
      }
      return response;
    }
  },

  reducers: {
    saveEditorData(state, { payload }) {
      return {
        ...state,
        editorData: payload,
      };
    },
    saveTableList(state,{payload}){
      return {
        ...state,
        tableList:payload.tableList
      }
    },
    //   保存查询数据
    saveQueryData(state, { payload }) {
      return {
        ...state,
        queryData: payload,
      }
    },
    saveLabelInfo(state,{payload}){
      return {
        ...state,
        labelInfo:payload.data,
      }
    },
    labelListHandle(state,{payload}){
      return {
        ...state,
        labelList:payload.data.records,
        pageData:{...payload.data}
      }
    },
  },
};
