import * as api from '../services';
import { addListKey } from '@/utils/utils';
import {message} from 'antd';

export default {
  namespace: 'reportList',

  state: {
    listData:[],
    templateId:'',//模板id
    queryConfig: {},//查询参数
    pageData:{
      current:1,
      total:0,
      size:0
    }
  },

  effects: {
    *listData({ payload }, { call, put}) {
      let response = yield call(api.listData, payload);
      if(response && response.status == 1) {
        response.data.records = addListKey(response.data.records, response.data.current, response.data.size)
        yield put({
          type: 'saveListData',
          payload: response
        })
      }
    },
    //更新状态
    *updateStatus({ payload }, { call, put}) {
      let response = yield call(api.updateStatus, payload);
      return response
    }

  },

  reducers: {
    saveListData(state, { payload }) {
      return {
        ...state,
        listData: payload.data.records,
        pageData:{...payload.data}
      }
    },
    setQueryConfig(state, { payload }) {
      return {
        ...state,
        queryConfig: payload
      }
    },
    addData(state, {payload}) {
      return {
        ...state,
      };
    },
    delData(state, {payload}) {
      return {
        ...state
      };
    },
    setTemplateId(state,{payload}){
      return {
        ...state,
        templateId:payload
      }
    }
  },
};





