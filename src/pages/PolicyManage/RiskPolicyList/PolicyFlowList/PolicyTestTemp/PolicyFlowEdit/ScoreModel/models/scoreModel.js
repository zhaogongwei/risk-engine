import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'scoreModel',

  state: {
    riskList:[],
    scoreList:[],
    scoreDetail:[],
    one:{
      count:1,
      dataSource:[
      ]
    },
    two:{
      count:1,
      dataSource:[
      ]
    },
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
    scoreListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        scoreList:payload.scoreList,
      }
    },
    addDataSource(state, {payload}) {
      return {
        ...state,
        one:{
          dataSource: payload.dataSource,
          count: payload.count,
        }
      };
    },
    addTwoData(state,{payload}){
        return {
          ...state,
          two:{
            dataSource: payload.dataSource,
            count: payload.count,
          }
        }
    },
    delNumData(state, {payload}) {
      return {
        ...state,
        one:{
          dataSource: payload.dataSource,
          count:payload.count
        }
      };
    },
    delStrData(state, {payload}) {
      return {
        ...state,
        two:{
          dataSource: payload.dataSource,
          count:payload.count
        }
      };
    },
  },
};





