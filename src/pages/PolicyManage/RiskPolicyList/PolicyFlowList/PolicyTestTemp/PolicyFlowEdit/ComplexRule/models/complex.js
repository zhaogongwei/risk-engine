import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit'
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'complex',

  state: {
    ruleList:[],
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
  },

  effects: {
    //复杂规则节点信息查询
    *queryComplexInfo(payload, { call, put }) {
      let response = yield call(api.queryComplexInfo,payload)
      if(response && response.status === '000000'){
        /*yield put({
          type:'riskListHandle',
          payload:response
        })*/
      }
    },
    //复杂规则节点信息保存
    *saveComplexInfo({payload,callback},{call,put}){
      let response = yield call(api.saveComplexInfo,payload)
      if(response&&response.status == '000000'){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    ruleListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        ruleList:payload.ruleList,
      }
    },
  },
};





