import * as api from '@/services/VarManage/VarClass';
import { addListKeydouble } from '@/utils/utils'
export default {
  namespace: 'varclass',

  state: {
    varClassList: [],
    total:100,//一共多少项
    selectItem:[],//下拉表单1数据
    secondSelectItem:[],//下拉表单2数据
    status:false,
    filterIpts:{},//变量分类表单
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
        type: 'saveVarClassListTotal',
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
      yield put({
        type: 'changeSecondSelect',
        payload:response,
      });
    },
    //添加变量(一级/二级）
    *addVarClass({payload,callback},{call,put}){
      let response = yield call(api.addVarClass,payload)
      return response;
    },
    //编辑变量(一级/二级)
    *editVarClass({payload,callback},{call,put}){
      let response = yield call(api.editVarClass,payload)
      return response;
    },
    //删除变量
    *delVarClass({payload,callback},{call,put}){
      let response = yield call(api.delVarClass,payload)
      return response;
    },
    //校验变量分类名称唯一性
    *checkVarName({payload,callback},{call,put}){
      let response = yield call(api.checkVarName,payload)
      return response;
    },
  },

  reducers: {
    saveVarClassList(state, { payload }) {
    	let list = addListKeydouble( payload.data.records,'childTypeList',payload.data.current,10)
    	console.log(list)
      return {
        ...state,
        varClassList: list,
      };
    },
    saveVarClassListTotal(state, { payload }) {
      return {
        ...state,
        total: payload.data.total,
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
    //清空选择
    clearfilterIpts(state,{payload}) {
      return {
        ...state,
       filterIpts:{}
     }
   },
  },
};
