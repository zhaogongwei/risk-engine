import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'scoreModel',

  state: {
    scoreList:[],//评分模型列表
    numList:{
      dataSource:[
      ]
    },//数字类型变量列表
    strList:{
      dataSource:[
      ]
    },//字符类型变量列表
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
    formData:{
      resultVarId:'',//输出结果id
      resultVarValue:'',//输出结果
    },
  },

  effects: {
    //评分模型节点信息查询
    *queryScoreInfo({payload}, { call, put }) {
      let response = yield call(api.queryScoreInfo,payload)
      if(response && response.status === 1){
        yield put({
          type:'InitScoreListHandle',
          payload:response
        })
      }
      return response;
    },
    //简单规则节点信息保存
    *saveScoreInfo({payload,callback},{call,put}){
      let response = yield call(api.saveScoreInfo,payload)
      if(response && response.status == 1){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    //初始化评分卡列表数据
    InitScoreListHandle(state,{payload}){
      return {
        ...state,
        scoreList:addListKey(payload.data.variables),
        formData:{...payload.data}
      }
    },
    //评分卡列表数据处理
    scoreListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        scoreList:payload.scoreList,
      }
    },
    //添加数字类型变量
    addNumData(state, {payload}) {
      return {
        ...state,
        numList:{
          dataSource: payload.dataSource,
        }
      };
    },
    //添加字符类型变量
    addStrData(state,{payload}){
        return {
          ...state,
          strList:{
            dataSource: payload.dataSource,
          }
        }
    },
    //删除数字类型变量
    delNumData(state, {payload}) {
      return {
        ...state,
        numList:{
          dataSource: payload.dataSource,
        }
      };
    },
    //删除字符类型变量
    delStrData(state, {payload}) {
      return {
        ...state,
        strList:{
          dataSource: payload.dataSource,
        }
      };
    },
  },
};





