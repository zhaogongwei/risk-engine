
export default {
  namespace: 'risklabel',

  state: {
    editorData: {},
    selectId:'',
    selectItem:{},
    status:false,
    tableList:[],
    pageList:[]
  },

  effects: {
    *fetchNotices({payload,callback}, { call, put }) {
      yield put({
        type: 'saveEditorData',
        payload,
      });
      callback()
    },
    *saveId({payload},{call,put}){
      yield put({
        type: 'saveEditId',
        payload,
      });
    },
    *saveItem({payload},{call,put}){
      yield put({
        type: 'saveEditItem',
        payload,
      });
    },
    *change({payload},{call,put}){
      yield put({
        type:'changeStatus',
        payload
      })
    }
  },

  reducers: {
    saveEditorData(state, { payload }) {
      return {
        ...state,
        editorData: payload,
      };
    },
    saveTableList(state,{payload}){
      console.log(payload)
      return {
        ...state,
        tableList:payload
      }
    },
    savePageList(state,{payload}){
      return {
        ...state,
        pageList:payload
      }
    }
  },
};
