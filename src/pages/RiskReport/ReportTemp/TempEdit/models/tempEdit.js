import * as api from '../services';
import { addListKey } from '@/utils/utils'
import { notification,message} from 'antd'

export default {
  namespace: 'tempEdit',

  state: {
    riskList:[],
    //报告模板列表
    reportList:[
      {
        title:'',
        checkList:[],
        selectVar:[],
      }
    ],
    presentationName:'',//报告模板名称
    //子标题列表
    titleList:[
      {
        title:'标题一',
        variable:[],//table数据
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
    //风控报告模板保存
    *saveTemplate({payload}, { call, put }) {
      let response = yield call(api.saveTemplate,payload)
      return response
    },
    //风控报告模板查询
    *queryTemplate({payload,callback},{call,put}){
      let response = yield call(api.queryTemplate,payload)
      if(response&&response.status === 1){
        response.data.reportTemplate&&response.data.reportTemplate.forEach((item,index)=>{
          addListKey(item['variable'])
        })
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
        presentationName:payload.data.presentationName,
        titleList:payload.data.reportTemplate,
      }
    },
    titleListHandle(state,{payload}){
      return{
        ...state,
        titleList:payload.titleList
      }
    }
  },
};





