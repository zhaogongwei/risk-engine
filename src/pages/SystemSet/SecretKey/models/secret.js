import * as api from '../services';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'secret',

  state: {
    dataList: [],//角色列表
    infoData: {},
  },

  effects: {
    // 获取初始化数据
    *fetchInitData({ payload }, { call, put }) {
      let response = yield call(api.initData,payload);
      if(response && response.status == 1) {
        yield put({
          type: 'saveInitData',
          payload: response.data
        })
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        dataList: payload
      };
    }
  },
};
