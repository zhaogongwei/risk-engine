import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp';
import { addListKey } from '@/utils/utils'
import {message} from 'antd';

export default {
  namespace: 'testTemp',

  state: {
    tempVarList: [],//测试模板变量列表信息
  },

  effects: {
    //查询策略测试模板变量信息
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
    //保存并测试策略模板
    *saveTest({payload}, { call, put }) {
      let response = yield call(api.saveTest,payload);
      return response;
    },
  },

  reducers: {
    saveTempVarList(state, { payload }) {
      return {
        ...state,
        tempVarList: payload.data.inputVarList,
      };
    },
  },
};
