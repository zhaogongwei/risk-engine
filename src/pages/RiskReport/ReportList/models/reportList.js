import * as api from '../services';
import { addListKey } from '@/utils/utils';


export default {
  namespace: 'reportList',

  state: {
    listData: {},
    queryConfig: {}
  },

  effects: {
    *listData({ payload }, { call, put}) {
      let response = yield call(api.listData, payload);
      if(response && response.status == 1) {
        response.data.records = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'saveListData',
          payload: response.data
        })
      }
    }
  },

  reducers: {
    saveListData(state, { payload }) {
      return {
        ...state,
        listData: payload
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
  },
};





