import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'testTemp',

  state: {
    tempList: [],//测试模板列表
    tempObj:[],//测试模板集合
  },

  effects: {
    //获取策略测试模板列表
    *fetchTestTempList({payload}, { call, put }) {
      let response = yield call(api.queryTestTempList,payload)
      yield put({
        type: 'saveTempList',
        payload,
      });
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
        tempList: payload,
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
