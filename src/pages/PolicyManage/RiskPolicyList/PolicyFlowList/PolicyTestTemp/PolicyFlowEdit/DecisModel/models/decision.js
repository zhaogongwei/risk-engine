import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'decision',

  state: {
    decList:{
      variableEnumList:[],//枚举值列表
      rowVarList:[],//table list列表
      colVarList:[],//columns列表
    },//查询返回的table
    rowList:{
      dataSource:[],//弹框选择好的行数据
    },
    colList:{
      dataSource:[],//弹框选择好的列数据
    },
    tableCol:[],//拼接好的列数据集合
    tableRow:[],//拼接好的行数据集合
    formData:{
      rowVarId:'',//行变量
      rowVarName:'',//行变量
      colVarId:'',//列变量
      colVarName:'',//列变量
      resultVarId:'',//输出结果
      resultVarName:'',//输出结果
    }
  },

  effects: {
    //查询决策模型信息
    *querydecInfo({payload}, { call, put }) {
      let response = yield call(api.querydecInfo,payload)
      if(response&&response.status === 1){
        yield put({
          type:'initHandledecList',
          payload:response
        })
      }else{
        message.error(response.statusDesc)
      }
      return response;
    },
    //保存决策模型信息
    *savedecInfo({payload,callback}, { call, put }){
      let response = yield call(api.savedecInfo,payload)
      if(response && response.status === 1){
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
      }
      return response
    }
  },

  reducers: {
    //初始化查询table
    initHandledecList(state,{payload}){
      return {
        ...state,
        decList:{...payload.data},
        formData:{...payload.data}
      }
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
    //设置列
    saveColData(state,{payload}){
      return {
        ...state,
        colList:{
          dataSource:payload.dataSource,
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
        }
      }
    }
  },
};





