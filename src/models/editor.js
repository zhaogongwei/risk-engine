import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'
export default {
  namespace: 'editorFlow',

  state: {
    selectId:'',//当前选中节点的id
    selectItem:{},//当前选中的节点信息
    type:'',//节点类型
    policyObj:{
      nodeJson: {},//策略流编辑的数据
      updateTrueName:'',
      updateTime:'',
      remark:'',
    },//备注，操作时间，操作人
  },

  effects: {
    //保存节点id
    *saveId({payload},{call,put}){
      yield put({
        type: 'saveEditId',
        payload,
      });
    },
    //保存策略流数据
    *savePolicyData({payload},{call,put}){
      let response = yield call(api.savePolicyFlow,payload)
      if(response&&response.status ===1){
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
    //查询节点信息
    *queryItemInfo({payload},{call,put}){
      let response = yield call(api.importPolicyFlow,payload)
      if(response&&response.status ===1){
        message.success(response.statusDesc)
        yield put({
          type: 'initPolicyData',
          payload:response,
        });
      }else{
        message.error(response.statusDesc)
      }
      return response
    },
  },

  reducers: {
    //初始化策略流数据
    initPolicyData(state,{payload}){
      return {
        ...state,
        policyObj:{
          ...payload.data,
        }
      };
    },
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
