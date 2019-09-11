import * as api from '../services';
import { message } from 'antd';
import { addListKey } from '@/utils/utils'

export default {
  namespace: 'template',

  state: {
    templateList: [],   //   列表
    total: 0,          //   总条数
    queryData: {},    //   检索条件
    pageData:{
      current:1,
      total:0,
      size:0
    }
  },

  effects: {
    *templateList({ payload }, { call, put }) {
      const res = yield call(api.templateList, payload)
      res.data.records=addListKey(res.data.records, res.data.current, res.data.size)
      if (res && res.status === 1) {
        yield put({
          type: 'saveTemplateList',
          payload: res,
        })
      }
    }
  },

  reducers: {
    saveTemplateList(state, { payload, total }) {
      return {
        ...state,
        templateList: payload.data.records,
        pageData:{...payload.data}
      }
    },
    addData(state, {payload}) {
      return {
        ...state,
        dataSource: payload.dataSource,
        count: payload.count,
      };
    },
    setQueryData(state, { payload }) {
      return {
        ...state,
        queryData: payload
      };
    },
  },
};





