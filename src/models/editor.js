import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'
export default {
  namespace: 'editorFlow',

  state: {
    editorData: {},//策略流编辑的数据
    selectId:'',//当前选中节点的id
    selectItem:{},//当前选中的节点信息
    type:'',//节点类型
  },

  effects: {
    //保存节点数据
    *fetchNotices({payload,callback}, { call, put }) {
      yield put({
        type: 'saveEditorData',
        payload,
      });
      callback()
    },
    //保存节点id
    *saveId({payload},{call,put}){
      yield put({
        type: 'saveEditId',
        payload,
      });
    },
    //保存节点信息
    *saveItem({payload},{call,put}){
      let response = yield call(api.savePolicyFlow,payload)
      if(response&&response.status ===1){
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
      }
      yield put({
        type: 'saveEditItem',
        payload,
      });
    },
    //查询节点信息
    *queryItemInfo({payload},{call,put}){
      let response = yield call(api.importPolicyFlow,payload)
      if(response&&response.status ===1){
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
      }
      return response
    },
  },

  reducers: {
    saveEditorData(state, { payload }) {
      return {
        ...state,
        editorData: payload,
      };
    },
    saveEditId(state, { payload }) {
      return {
        ...state,
        selectId: payload,
      };
    },
    saveEditItem(state,{payload}){
      return{
        ...state,
        selectItem:payload
      }
    },
    saveNodeType(state,{payload}){
      return {
        ...state,
        type:payload
      }
    }
  },
};
