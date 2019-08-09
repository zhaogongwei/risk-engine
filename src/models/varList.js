import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'varList',

  state: {
    varList:[],//变量列表
    oneClassList:[],//一级分类
    twoClassList:[],//二级分类
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
  },

  effects: {
    //变量列表查询
    *queryVarList({payload}, { call, put }) {
      let response = yield call(api.queryVarList,payload)
      if(response && response.status ===1){
        yield put({
          type:'varListHandle',
          payload:response
        })
        if(!response.data.records.length){
          message.error('暂无数据')
        }
      }else{
        yield put({
          type:'varListHandle',
          payload:{
            data:{
              records:[],
              current:1,
              size:10,
              total:0,
            }
          }
        })
        message.error(response.statusDesc)
      }
      return response;
    },
    //一级变量分类查询
    *queryOneClassList({payload}, { call, put }) {
      let response = yield call(api.queryVarClassList,payload)
      if(response && response.status ===1){
        yield put({
          type:'oneClassHandle',
          payload:response
        })
      }
      return response;
    },
    //二级变量分类查询
    *queryTwoClassList({payload}, { call, put }) {
      let response = yield call(api.queryVarClassList,payload)
      if(response && response.status ===1){
        yield put({
          type:'twoClassHandle',
          payload:response
        })
      }
      return response;
    },
  },

  reducers: {
    //变量列表处理
    varListHandle(state,{payload}){
      return {
        ...state,
        varList:payload.data.records,
        page:{
          currentPage:payload.data.current,
          pageSize:payload.data.size,
          totalNum:payload.data.total,
        }
      }
    },
    //一级分类
    oneClassHandle(state,{payload}){
      return {
        ...state,
        oneClassList:payload.data
      }
    },
    //二级分类
    twoClassHandle(state,{payload}){
      return {
        ...state,
        twoClassList:payload.data
      }
    }
  },
};





