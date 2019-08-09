import * as api from '@/services/NameManage/GreyNameList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'greyName',

  state: {
    greyNameList: [],//灰名单列表
  },

  effects: {
    //获取灰名单列表
    *fetchGreyNameList({payload}, { call, put }) {
      let response = yield call(api.queryGreyList,payload)
      yield put({
        type: 'saveGreyNameList',
        payload,
      });
    },
    //禁用、启用
    *isForbid({payload},{call,put}){
      let response = yield call(api.isForbid,payload)
      yield put({
        type: 'saveGreyNameList',
        payload,
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
    //删除
    *delGreyName({payload},{call,put}){
      let response = yield call(api.delGreyName,payload)
      yield put({
        type: 'saveGreyNameList',
        payload,
      });
    },
  },

  reducers: {
    saveGreyNameList(state, { payload }) {
      return {
        ...state,
        greyNameList: payload,
      };
    },
    saveTempObj(state, { payload }) {
      return {
        ...state,
        tempObj: payload,
      };
    },
  },
};
