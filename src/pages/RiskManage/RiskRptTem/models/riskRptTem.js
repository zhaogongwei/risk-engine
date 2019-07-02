import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'riskRptTem',

  state: {
    riskList:[],
    //报告模板列表
    reportList:[
      {
        title:'',
        checkList:[],
      }
    ],
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
  },

  effects: {
    *riskSubmit(payload, { call, put }) {
      let response = yield call(queryRiskList,payload.data)
      if(response && response.status === '000000'){
        response.resultList = addListKey(response.resultList,payload.data.currPage,payload.data.pageSize)
        yield put({
          type:'riskListHandle',
          payload:response
        })
      }
    },
    //配置
    *riskDeploy({payload,callback},{call,put}){
      let response = yield call(deployRisk,payload)
      if(response&&response.status == '000000'){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
    //新增
    *riskAdd({payload,callback},{call,put}){
      let response = yield call(addRisk,payload)
      if(response&&response.status == '000000'){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    riskListHandle(state, { payload }) {
      return {
        ...state,
        riskList:payload.resultList,
        page:payload.page
      }
    },
    rptListHandle(state,{payload}){
      return {
        ...state,
        reportList:payload.reportList,
      }
    },
  },
};





