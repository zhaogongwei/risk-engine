import * as api from '@/services/PolicyManage/RiskPolicyList/RiskLabel';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'risklabel',

  state: {
    labelList:[],//风控标签列表
    labelObj:{
      labelName:'',
      labelStatus:0,
      list:[]
    },//新增、编辑标签
    editorData: {},
    selectId:'',
    selectItem:{},
    status:false,
    tableList:[],
    pageList:[]
  },

  effects: {
    *fetchNotices({payload,callback}, { call, put }) {
      yield put({
        type: 'saveEditorData',
        payload,
      });
      callback()
    },
    *saveId({payload},{call,put}){
      yield put({
        type: 'saveEditId',
        payload,
      });
    },
    *saveItem({payload},{call,put}){
      yield put({
        type: 'saveEditItem',
        payload,
      });
    },
    *change({payload},{call,put}){
      yield put({
        type:'changeStatus',
        payload
      })
    },
    //获取风控标签列表
    *fetchRiskLabelList({payload}, { call, put }) {
      let response = yield call(api.queryRiskLabelList,payload)
      yield put({
        type: 'labelListHandle',
        payload,
      });
    },
    //新增风控标签
    *addRiskLabel({payload}, { call, put }) {
      let response = yield call(api.addRiskLabel,payload)
      yield put({
        type: 'labelObjHandle',
        payload,
      });
    },
    //编辑风控标签
    *editRiskLabel({payload}, { call, put }) {
      let response = yield call(api.editRiskLabel,payload)
      yield put({
        type: 'labelObjHandle',
        payload,
      });
    },
    //删除风控标签
    *delRiskLabel({payload}, { call, put }) {
      let response = yield call(api.delRiskLabel,payload)
      yield put({
        type: 'labelListHandle',
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
    labelListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        labelList:payload.labelList,
      }
    },
    labelObjHanlder(state,{payload}){
      return {
        ...state,
        labelObj:payload.labelObj,
      }
    }
  },
};
