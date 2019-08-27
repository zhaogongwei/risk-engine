import { message } from 'antd'
import * as api from '@/services/NameManage/BlackNameList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'blackName',

  state: {
    blackNameList: [],  //黑名单列表
    total: 0,   //   总条数
    queryData: {},   //  检索条件
  },

  effects: {
    //获取黑名单列表
    *fetchBlackNameList({ payload }, { call, put }) {
      const response = yield call(api.queryBlackList, payload)
      if (response && response.status === 1) {
        yield put({
          type: 'saveBlackNameList',
          payload: addListKey(response.data.records, payload.currentPage, payload.pageSize),
          total: response.data.total
        })
      } else {
        yield put({
          type: 'saveBlackNameList',
          payload: [],
          total: 0
        })
        message.error(response.statusDesc)
      }
    },
    //   启用/禁用/删除
    *isForbid({ payload }, { call }) {
      return yield call(api.isForbid, payload)
    },
    //新增黑名单
    *addBalckName({payload},{call,put}){
      let response = yield call(api.addBalckName,payload)
      yield put({
        type: 'saveBlackNameList',
        payload,
      });
    }
  },

  reducers: {
    saveBlackNameList(state, { payload, total }) {
      return {
        ...state,
        blackNameList: payload,
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
      return {
        ...state,
        queryData: payload
      }
    }
  },
};
