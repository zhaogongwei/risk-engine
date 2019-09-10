import * as api from '../services';
import { addListKey } from '@/utils/utils';
import {message} from 'antd';

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
        message.success(response.statusDesc)
      }else{
        message.error(response.statusDesc)
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





