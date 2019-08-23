import * as api from '../services';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'urldeploy',

  state: {
    roleList: [],//角色列表
    queryConfig: {},
    Detail: {}
  },

  effects: {
    //获取角色列表
    *fetchInterfaceList({payload}, { call, put }) {
      let response = yield call(api.queryInterfaceList,payload)
      if(response && response.status == 1) {
        response.data.records = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'saveRoleList',
          payload: response.data
        });
      }
    },
    //添加接口
    *addInterface({ payload },{ call, put }){
      return yield call(api.addInterface,payload)
    },
    //查看详情
    *viewInfo({ payload }, { call, put }) {
      let response = yield call(api.viewInfo, payload)
      if(response && response.status == 1) {
        yield put({
          type: 'saveDetail',
          payload: response.data
        })
      }
    },
    //编辑接口
    *updateInterface({payload},{call,put}){
      return  yield call(api.updateInterface,payload)
    },
    //删除接口
    *delInterface({payload},{call,put}){
      return yield call(api.delInterface,payload)
    },
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
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        Detail: payload,
      };
    }
  },
};
