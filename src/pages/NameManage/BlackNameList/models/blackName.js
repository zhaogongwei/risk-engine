import * as api from '@/services/NameManage/BlackNameList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'blackName',

  state: {
    blackNameList: [],//黑名单列表
  },

  effects: {
    //获取黑名单列表
    *fetchBlackNameList({payload}, { call, put }) {
      let response = yield call(api.queryBlackList,payload)
      yield put({
        type: 'saveBlackNameList',
        payload,
      });
    },
    //禁用、启用
    *isForbid({payload},{call,put}){
      let response = yield call(api.isForbid,payload)
      yield put({
        type: 'saveBlackNameList',
        payload,
      });
    },
    //新增黑名单
    *addBalckName({payload},{call,put}){
      let response = yield call(api.addBalckName,payload)
      yield put({
        type: 'saveBlackNameList',
        payload,
      });
    },
    //删除黑名单
    *delBalckName({payload},{call,put}){
      let response = yield call(api.delBalckName,payload)
      yield put({
        type: 'saveBlackNameList',
        payload,
      });
    },
  },

  reducers: {
    saveBlackNameList(state, { payload }) {
      return {
        ...state,
        blackNameList: payload,
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
