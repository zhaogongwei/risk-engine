import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp';
import { addListKey } from '@/utils/utils';
import {message} from 'antd';
export default {
  namespace: 'policyTestTemp',

  state: {
    tempList: [],//测试模板列表
    tempObj:[],//测试模板集合
    formData:{
      size:10,
      current:1,
      total:0,
    }
  },

  effects: {
    //获取策略测试模板列表
    *fetchTestTempList({payload}, { call, put }) {
      let response = yield call(api.queryTestTempList,payload)
      if(response&&response.status===1){
        response.data.records = addListKey(response.data.records,response.data.current,response.data.size)
        yield put({
          type: 'saveTempList',
          payload:response,
        });
      }

    },
    //新增模板
    *addTemp({payload},{call,put}){
      let response = yield call(api.addTestTemp,payload)
      yield put({
        type: 'saveTempList',
        payload,
      });
    },
    //执行测试模板(编辑）
    *carryTemp({payload},{call,put}){
      let response = yield call(api.carryTestTemp,payload)
      yield put({
        type: 'saveVarClassList',
        payload,
      });
    },
  },

  reducers: {
    saveTempList(state, { payload }) {
      return {
        ...state,
        tempList: payload.data.records,
        formData:{...payload.data}
      };
    },
    saveTempObj(state, { payload }) {
      return {
        ...state,
        tempObj: payload,
      };
    },
  },
};
