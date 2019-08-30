import * as api from '../services';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'secret',

  state: {
    infoData: {},
  },

  effects: {
    // 获取初始化数据
    *fetchSecert({ payload }, { call, put }) {
      let response = yield call(api.fetchSecert, payload);
      if(response && response.status == 1) {
        yield put({
          type: 'saveData',
          payload: response.data
        })
      }
    },
    // 生成秘钥
    *createSecret({ payload }, { call, put }) {
      let response = yield call(api.createSecret, payload);
      if(response && response.status == 1) {
        yield put({
          type: 'saveData',
          payload: response.data
        })
      }
    }
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        infoData: payload
      };
    }
  },
};
