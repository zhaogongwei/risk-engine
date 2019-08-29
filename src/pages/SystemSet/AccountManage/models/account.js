import * as api from '../services';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'account',

  state: {
    initData: {},
    listData: [], //账号列表
    infoData: {},
    queryConfig: {},
  },

  effects: {
    // 初始化数据
    *initData({ payload }, { call, put }) {
      let response = yield call(api.initData, payload)
      if(response && response.status == 1) {
        yield put({
          type: 'saveInit',
          payload: response.data
        })
      }
    },
    //获取账号列表
    *fetchList({ payload }, { call, put }) {
      let response = yield call(api.queryList, payload)
      if(response && response.status == 1) {
        response.data.records = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'saveList',
          payload: response.data
        });
      }
    },
    // 检查用户名唯一性
    *checkUserName({ payload }, { call, put }) {
      return yield call(api.checkUserName, payload)
    },
    //添加账号
    *addAccount({ payload },{ call,put }){
      return yield call(api.addAccount, payload)
    },
    //编辑账号
    *editAccount({ payload },{ call,put }){
      let response = yield call(api.editAccount, payload)
      if(response && response.status == 1) {
        yield put({
          type: 'saveInfoData',
          payload: response.data
        })
      }
    },
    //更新账号
    *updateAccount({ payload }, { call, put }) {
      return yield call(api.updateAccount, payload)
    },
    //更新密码
    *updatePsw({ payload }, { call, put }) {
      return yield call(api.updatePsw, payload)
    },
    //删除账号
    *delAccount({ payload },{ call, put }){
      return yield call(api.delAccount,payload)
    },
    // 导出列表
    *exportFile({ payload }, { call, put }) {
      return yield call(api.exportFile,payload)
    }
  },

  reducers: {
    saveInit(state, { payload }) {
      return {
        ...state,
        initData: payload
      }
    },
    saveList(state, { payload }) {
      return {
        ...state,
        listData: payload
      };
    },
    saveInfoData(state, { payload }) {
      return {
        ...state,
        infoData: payload
      }
    },
    setQueryConfig(state, { payload }) {
      return {
        ...state,
        queryConfig: payload
      }
    }
  },
};
