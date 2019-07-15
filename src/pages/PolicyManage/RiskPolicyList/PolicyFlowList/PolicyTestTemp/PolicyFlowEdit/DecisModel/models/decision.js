import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'decision',

  state: {
    info:[],
    rowList:{
      count:1,
      dataSource:[]
    },
    colList:{
      count:1,
      dataSource:[]
    },
    tableCol:[],
    tableRow:[],
    one:{
      count:1,
      dataSource:[
      ]
    },
    two:{
      count:1,
      dataSource:[
      ],
    },
    dataSet:[
      {title:'',dataIndex: 'title',key:0}
    ],
    dataList:[]
  },

  effects: {
    //修改企业信息
    *litiCaseSubmit(payload, { call, put }) {
      let response = yield call(changeLitigate,payload.data)
      if(response&&response.status == '000000'){
        yield put(routerRedux.goBack())
      }else{
        message.error(response.statusDesc)
      }
    },
    //查看企业信息
    *findLitiCase({payload,callback}, { call, put }){
      let response = yield call(queryLitigate,payload)
      if(response && response.status === '000000'){
        response.result = addListKey(response.result)
        response.result.length>0&&callback({value:response.result})
        yield put({
          type:'cpyInfoHandle',
          payload:response.result
        })
      }
    }
  },

  reducers: {
    cpyInfoHandle(state, { payload }) {
      return {
        ...state,
        info:payload
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
    addDataSourceTwo(state, {payload}) {
      return {
        ...state,
        two:{
          dataSource: payload.dataSource,
          count: payload.count,
        }
      };
    },
    makeTableCol(state,{payload}){
      return {
        ...state,
        tableCol: payload.tableCol,
      };
    },
    makeTableRow(state,{payload}){
      return {
        ...state,
        tableRow: payload.tableRow,
      };
    },
    changeDataSource(state, {payload}) {
      return {
        ...state,
        one:{
          dataSource: payload.dataSource,
          count:payload.count
        }
      };
    },
    changeDataSourceRow(state,{payload}){
      return {
        ...state,
        two:{
          dataSource:payload.dataSource,
          count:payload.count
        }
      }
    },
    //设置列
    saveColData(state,{payload}){
      return {
        ...state,
        colList:{
          dataSource:payload.dataSource,
          count:payload.count,
        }
      }
    },
    //设置行
    saveRowData(state,{payload}){
      console.log(payload)
      return {
        ...state,
        rowList:{
          dataSource:payload.dataSource,
          count:payload.count,
        }
      }
    }
  },
};





