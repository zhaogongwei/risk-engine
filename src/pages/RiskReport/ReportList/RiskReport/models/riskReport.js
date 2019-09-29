import * as api from '../services';
import { addListKey } from '@/utils/utils'
import { notification,message} from 'antd'

export default {
  namespace: 'riskReport',

  state: {
    //子标题列表
    titleList:[],
    reportInfo:{},//报告信息
    reportTemplateDto:{
      id:'',
      assetsCode:''
    },
  },

  effects: {
    //风控报告模板查询
    *queryRiskReport({payload,callback},{call,put}){
      let response = yield call(api.queryRiskReport,payload)
      if(response&&response.status === 1){
        yield put({
          type: 'InittitleListHandle',
          payload: response
        })
      }
    },
  },

  reducers: {
    //风控报告模板初始化
    InittitleListHandle(state,{payload}){
      return{
        ...state,
        reportInfo:payload.data[0],
        presentationName:payload.data.presentationName,
        reportTemplateDto:payload.data[0]['reportTemplateDto'],
        titleList:payload.data[0]['reportTemplateDto']['reportTemplate'],
      }
    },
  },
};





