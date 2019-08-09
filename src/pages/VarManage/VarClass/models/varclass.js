import * as api from '@/services/VarManage/VarClass';
import { addListKeydouble } from '@/utils/utils'
export default {
  namespace: 'varclass',

  state: {
    varClassList: [],
    total:0,//一共多少项
    selectId:'',
    selectItem:[],
    secondSelectItem:[],
    status:false,
  },

  effects: {
    //获取变量分类列表
    *fetchVarClassList({payload}, { call, put }) {
      let response = yield call(api.queryClassList,payload)
      yield put({
        type: 'saveVarClassList',
        payload:response,
      });
      yield put({
        type: 'saveVarClassList',
        payload:response,
      });
    },
    //获取查询一级list getSelectLevel1
    *getSelectLevel1({payload}, { call, put }) {
      let response = yield call(api.getSelectLevel1,payload)
      yield put({
        type: 'changeSelect',
        payload:response,
      });
    },
    *getSelectLevel2({payload}, { call, put }) {
      let response = yield call(api.getSelectLevel2,payload)
      console.log(response)
      yield put({
        type: 'changeSecondSelect',
        payload:response,
      });
    },
    //添加变量(一级/二级）
    *addVarClass({payload},{call,put}){
      let response = yield call(api.addVarClass,payload)
      yield put({
        type: 'saveVarClassList',
        payload:response,
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
    },
  },

  reducers: {
    saveVarClassList(state, { payload }) {
    	let list = addListKeydouble( payload.data,'secList')
      return {
        ...state,
        varClassList: list,
      };
    },
    saveVarClassListTotal(state, { payload }) {
      return {
        ...state,
        total: 100,
      };
    },
    changeSelect(state, { payload }) {
      return {
        ...state,
        selectItem: payload.data,
      };
    },
    changeSecondSelect(state, { payload }) {
      return {
        ...state,
        secondSelectItem: payload.data,
      };
    },
  },
};
