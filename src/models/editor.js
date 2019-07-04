
export default {
  namespace: 'editorFlow',

  state: {
    editorData: {},
    selectId:'',
    selectItem:{},
    status:false,
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
      alert('zz王启琛')
      return {
        ...state,
        editorData: payload,
      };
    },
    saveEditId(state, { payload }) {
      return {
        ...state,
        selectId: payload,
      };
    },
    saveEditItem(state,{payload}){
      return{
        ...state,
        selectItem:payload
      }
    },
    changeStatus(state,{payload}){
      return {
        ...state,
        status:payload
      }
    }
  },
};
