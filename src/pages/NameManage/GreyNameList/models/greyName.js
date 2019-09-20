import * as api from '@/services/NameManage/GreyNameList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'greyName',

  state: {
    greyNameList: [],//灰名单列表
    queryData: {},   //   查询参数
    total: 0,     //   总条数
  },

  effects: {
    //获取灰名单列表
    *fetchGreyNameList({ payload }, { call, put }) {
      const response = yield call(api.queryGreyList, payload)
      yield put({
        type: 'saveGreyNameList',
        payload: addListKey(response.data.records, response.data.current, response.data.size),
        total: response.data.total
      });
    },
    //拉黑
    *pullBlack({payload},{call,put}){
      let response = yield call(api.pullBlack,payload)
      yield put({
        type: 'saveGreyNameList',
        payload,
      });
    },
    //   启用/禁用/删除
    *isForbid({ payload }, { call }) {
      return yield call(api.isForbid, payload)
    },
    //   拉黑
    *handleInBlack({ payload }, { call }) {
      return yield call(api.pullBlack, payload)
    }
  },

  reducers: {
    saveGreyNameList(state, { payload, total }) {
      return {
        ...state,
        greyNameList: payload,
        total
      };
    },
    saveTempObj(state, { payload }) {
      return {
        ...state,
        tempObj: payload,
      };
    },
    saveQueryData(state, { payload }) {
      console.log(payload, 'change')
      return {
        ...state,
        queryData: payload
      }
    }
  },
};
