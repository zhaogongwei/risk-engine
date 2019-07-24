import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

const App = WrappedComponent => {
  @connect(state => ({
    global: state.global,
  }))
  class App extends React.Component {
    async componentDidMount() {
      await this.props.dispatch({
          type: 'global/fetchMenus',
        });
      
      await this.props.dispatch({
        type: 'global/fetchCommonInfo'
      })
    }
    render() {
      const { menus } = this.props.global;
      return menus.length ? <WrappedComponent {...this.props} menus={menus} />  : null
    }
  }
  return App;
};
export default App;
