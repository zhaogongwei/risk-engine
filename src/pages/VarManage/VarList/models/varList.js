import * as api from '@/services/VarManage/VarList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'varlist',

  state: {
    varList:[],
    filterIpts:{},
    selectItem:[],
    secondSelectItem:[],
    count:'',
    enumeration:[],
    total:100,//一共多少项
  },

  effects: {
    //获取变量列表
    *fetchVarList({payload}, { call, put }) {
    	
      let response = yield call(api.queryVarList,payload)
      yield put({
        type: 'saveVarList',
        payload:response,
      });
    },
     *getSelectLevel1({payload}, { call, put }) {
      let response = yield call(api.getSelectLevel1,payload)
      yield put({
        type: 'changeSelect',
        payload:response,
      });
    },
    *getSelectLevel2({payload}, { call, put }) {
      let response = yield call(api.getSelectLevel2,payload)
      yield put({
        type: 'changeSecondSelect',
        payload:response,
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
    *delVar({payload,callback},{call,put}){
      let response = yield call(api.delVar,payload)
      callback()
    },
    *getEnumeration({payload},{call,put}){
      let response = yield call(api.getEnumeration,payload)
      yield put({
        type: 'saveEnumeration',
        payload,
      });
    },
  },

  reducers: {
    saveVarList(state, { payload }) {
    	let list = addListKey( payload.data)
      return {
        ...state,
        varList:list,
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
    changefilterIpts(state,{payload}) {
    	 return {
    	 	...state,
    	  filterIpts:payload
    	}
    },
    saveEnumeration(state,{payload}) {
    	 return {
    	 	...state,
    	  Handle:payload
    	}
    },
  },
};





