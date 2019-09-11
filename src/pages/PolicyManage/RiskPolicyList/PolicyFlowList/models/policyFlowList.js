import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList';
import { addListKey } from '@/utils/utils'
import {message} from 'antd';
export default {
  namespace: 'policyFlowList',

  state: {
    policyFlowList:[],//策略流列表
    queryData:{},//查询信息
    formData:{
      size:10,
      current:1,
      total:0,
    }
  },

  effects: {
    //获取策略流列表
    *fetchFlowList({payload}, { call, put }) {
      let response = yield call(api.queryPolicyFlowList,payload)
      if(response&&response.status === 1){
        response.data.records = addListKey(response.data.records,response.data.current,response.data.size)
        yield put({
          type: 'flowListHanlder',
          payload:response,
        });
      }else{
        message.error(response.statusDesc)
      }

    },
    //启用、禁用
    *IsForbid({payload}, { call, put }) {
      let response = yield call(api.isForbid,payload)
      return response;
    },
  },

  reducers: {
    flowListHanlder(state,{payload}){
      return {
        ...state,
        policyFlowList:payload.data.records,
        formData:{...payload.data}
      }
    },
    //   保存查询数据
    saveQueryData(state, { payload }) {
      return {
        ...state,
        queryData: payload,
      }
    },
  },
};
