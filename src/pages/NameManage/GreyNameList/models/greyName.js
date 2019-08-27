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
      console.log(response, '===========>response')
      yield put({
        type: 'saveGreyNameList',
        payload: addListKey(response.data.records, payload.currentPage, payload.pageSize),
        total: response.data.total
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
  },
};
