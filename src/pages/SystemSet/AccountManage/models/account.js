import * as api from '@/services/SystemSet';
import { addListKey } from '@/utils/utils';

export default {
  namespace: 'account',

  state: {
    accountList: [], //账号列表
    queryConfig: {}
  },

  effects: {
    //获取账号列表
    *fetchAccountList({ payload }, { call, put }) {
      let response = yield call(api.queryRoleList,payload)
      yield put({
        type: 'saveAccountList',
        payload
      });
    },
    //添加账号
    *addAccount({ payload },{ call,put }){
      return yield call(api.addRole,payload)
    },
    //编辑账号
    *editAccount({ payload },{ call,put }){
      let response = yield call(api.editRole,payload)
      
    },
    //删除账号
    *delAccount({ payload },{call,put}){
      return yield call(api.delRole,payload)
      
    },
    //角色授权
    *empower({ payload },{call,put}){
      let response = yield call(api.empower,payload)
    }
  },

  reducers: {
    saveRoleList(state, { payload }) {
      return {
        ...state,
        roleList: payload,
      };
    },
    setQueryConfig(state, { payload }) {
      return {
        ...state,
        queryConfig: payload
      }
    }
  },
};
