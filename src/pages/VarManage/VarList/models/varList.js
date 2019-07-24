import * as api from '@/services/VarManage/VarList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'varList',

  state: {
    varLilst:[],
  },

  effects: {
    //获取变量列表
    *fetchVarList({payload}, { call, put }) {
      let response = yield call(api.queryVarList,payload)
      yield put({
        type: 'saveVarList',
        payload,
      });
    },
    //添加变量
    *addVar({payload},{call,put}){
      let response = yield call(api.addVar,payload)
      yield put({
        type: 'saveVarList',
        payload,
      });
    },
    //编辑变量
    *editVar({payload},{call,put}){
      let response = yield call(api.editVar,payload)
      yield put({
        type: 'saveVarList',
        payload,
      });
    },
    //删除变量
    *delVar({payload},{call,put}){
      let response = yield call(api.delVar,payload)
      yield put({
        type:'saveVarList',
        payload
      })
    }
  },

  reducers: {
    saveVarList(state, { payload }) {
      return {
        ...state,
        varList: payload,
      };
    },
  },
};





