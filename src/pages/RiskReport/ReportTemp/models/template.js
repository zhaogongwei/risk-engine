import * as api from '../services';
import { message } from 'antd';
import { addListKey } from '@/utils/utils'

export default {
  namespace: 'template',

  state: {
    templateList: [],   //   列表
    total: 0,          //   总条数
    queryData: {},    //   检索条件
  },

  effects: {
    *templateList({ payload }, { call, put }) {
      const res = yield call(api.templateList, payload)
      if (res && res.status === 1) {
        yield put({
          type: 'saveTemplateList',
          payload: addListKey(res.data.records, payload.currentPage, payload.pageSize),
          total: res.data.total
        })
      } else {
        yield put({
          type: 'saveTemplateList',
          payload: [],
          total: 0
        })
        message.error(res.statusDesc)
      }
    }
  },

  reducers: {
    saveTemplateList(state, { payload, total }) {
      return {
        ...state,
        templateList: payload,
        total
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





