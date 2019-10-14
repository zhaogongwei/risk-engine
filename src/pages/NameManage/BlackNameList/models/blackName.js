import { message } from 'antd'
import * as api from '@/services/NameManage/BlackNameList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'blackName',

  state: {
    blackNameList: [],  //黑名单列表
    total: 0,   //   总条数
    queryData: {},   //  检索条件
    pageData:{
      current:1,
      size:10,
      total:0,
    }
  },

  effects: {
    //获取黑名单列表
    *fetchBlackNameList({ payload }, { call, put }) {
      const response = yield call(api.queryBlackList, payload)
      if (response && response.status === 1) {
        yield put({
          type: 'saveBlackNameList',
          payload: addListKey(response.data.records, response.data.current, response.data.size),
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
    *addBlackName({ payload },{ call }){
      return yield call(api.addBlackName, payload)
    }
  },

  reducers: {
    saveBlackNameList(state, { payload, total }) {
      return {
        ...state,
        blackNameList: payload,
        total,
        pageData:{...payload.data}
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
