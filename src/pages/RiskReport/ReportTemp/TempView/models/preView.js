import * as api from '../services';
import { addListKey } from '@/utils/utils'
import { notification,message} from 'antd'

export default {
  namespace: 'preView',

  state: {
    //子标题列表
    titleList:[],
    reportInfo:{}
  },

  effects: {
    //风控报告模板查询
    *queryTemplate({payload,callback},{call,put}){
      let response = yield call(api.queryTemplate,payload)
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
        reportInfo:payload.data,
        presentationName:payload.data.presentationName,
        titleList:payload.data.reportTemplate,
      }
    },
  },
};





