import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'threeSide',

  state: {
    thirds:[],//选中集合
  },

  effects: {
    //三方数据查询节点信息查询
    *queryThreeSideInfo({payload}, { call, put }) {
      let response = yield call(api.queryThreeSideInfo,payload)
      if(response && response.status === 1){
        yield put({
          type:'checkedListHandle',
          payload:response
        })
      }
      return response;
    },
    //三方数据查询节点信息保存
    *saveThreeSideInfo({payload,callback},{call,put}){
      let response = yield call(api.saveThreeSideInfo,payload)
      if(response&&response.status == 1){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    checkedListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        thirds:payload.data.thirds,
      }
    },
  },
};





