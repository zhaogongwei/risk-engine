import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'setVar',

  state: {
    varList:[],
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
  },

  effects: {
    //设置变量节点信息查询
    *queryVarInfo(payload, { call, put }) {
      let response = yield call(api.queryVarInfo,payload)
      if(response && response.status === '000000'){
        /*yield put({
          type:'riskListHandle',
          payload:response
        })*/
      }
    },
    //设置变量节点信息保存
    *saveVarInfo({payload,callback},{call,put}){
      let response = yield call(api.saveVarInfo,payload)
      if(response&&response.status == '000000'){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    varListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        varList:payload.varList,
      }
    },
  },
};





