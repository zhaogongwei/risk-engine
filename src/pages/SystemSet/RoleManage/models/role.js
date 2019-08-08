import * as api from '@/services/SystemSet';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'role',

  state: {
    roleList: [],//角色列表
  },

  effects: {
    //获取角色列表
    *queryRoleList({payload}, { call, put }) {
      let response = yield call(api.queryRoleList,payload)
      yield put({
        type: 'saveRoleList',
        payload
      });
    },
    //添加角色
    *addRole({payload},{call,put}){
      let response = yield call(api.addRole,payload)
      yield put({
        type: 'saveRoleList',
        payload
      });
    },
    //编辑角色
    *editRole({payload},{call,put}){
      let response = yield call(api.editRole,payload)
      yield put({
        type: 'saveRoleList',
        payload
      });
    },
    //删除角色
    *delRole({payload},{call,put}){
      let response = yield call(api.delRole,payload)
      yield put({
        type:'saveRoleList',
        payload
      })
    },
    //角色授权
    *empower({payload},{call,put}){
      let response = yield call(api.empower,payload)
      yield put({
        type:'saveRoleList',
        payload
      })
    }
  },

  reducers: {
    saveRoleList(state, { payload }) {
      return {
        ...state,
        roleList: payload,
      };
    },
  },
};
