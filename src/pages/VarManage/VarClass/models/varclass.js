import * as api from '@/services/VarManage/VarClass';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'varclass',

  state: {
    varClassList: [],
    selectId:'',
    selectItem:{},
    status:false,
  },

  effects: {
    //获取变量分类列表
    *fetchVarClassList({payload}, { call, put }) {
      let response = yield call(api.queryClassList,payload)
      yield put({
        type: 'saveVarClassList',
        payload,
      });
    },
    //添加变量(一级/二级）
    *addVarClass({payload},{call,put}){
      let response = yield call(api.addVarClass,payload)
      yield put({
        type: 'saveVarClassList',
        payload,
      });
    },
    //编辑变量(一级/二级)
    *editVarClass({payload},{call,put}){
      let response = yield call(api.editVarClass,payload)
      yield put({
        type: 'saveVarClassList',
        payload,
      });
    },
    //删除变量
    *delVarClass({payload},{call,put}){
      let response = yield call(api.delVarClass,payload)
      yield put({
        type:'saveVarClassList',
        payload
      })
    }
  },

  reducers: {
    saveVarClassList(state, { payload }) {
      return {
        ...state,
        varClassList: payload,
      };
    },
  },
};
