
export default {
  namespace: 'varList',

  state: {
    info:[],
    count:1,
    dataSource:[
    ]
  },

  effects: {
  },

  reducers: {
    riskCaseHandle(state, { payload }) {
      return {
        ...state,
        info:payload
      }
    },
    addData(state, {payload}) {
      return {
        ...state,
        dataSource: payload.dataSource,
        count: payload.count,
      };
    },
    delData(state, {payload}) {
      return {
        ...state,
        dataSource: payload.dataSource,
        count:payload.count
      };
    },
  },
};





