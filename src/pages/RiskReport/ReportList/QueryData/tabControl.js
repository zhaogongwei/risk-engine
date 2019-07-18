import React, { Component } from 'react'
import {
  Button,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { sleep } from '@/utils/utils'

@connect()

export default class TabControl extends Component {
  constructor(props){
    super(props)
    this.state={
      currentIndex : 0
    };
  }
  check_tittle_index(index){
    return index===this.state.currentIndex ? "tab_tittle active" : "tab_tittle";
  }

  check_item_index(index){
    return index===this.state.currentIndex ? "tab_item show" : "tab_item";
  }
  componentDidMount () {
  }
  goBack=()=>{
    this.props.dispatch(routerRedux.goBack());
  }
  render() {
    let _this=this;
    return(
      <div className="tabContainer">
        {/*动态生成Tab导航*/}
        <div className="selectContainer">
          <div className="tabSelectWrap">
            { React.Children.map( this.props.children , (element,index) => {
              return(
                /*箭头函数没有自己的this，这里的this继承自外围作用域，即组件本身*/
                <a  onClick={ () => { this.setState({currentIndex : index});element.props.state?this.goBack():null; } } className={ this.check_tittle_index(index) }>{ element.props.name }</a>
              );
            }) }
          </div>
        </div>
        {/*Tab内容区域*/}
        <div className="tabItemWrap" style={{flex:1}}>
          {React.Children.map(this.props.children,(element,index)=>{
            return(
              <div className={ this.check_item_index(index) }>{ element }</div>
            );
          })}
        </div>
      </div>
    );
  }
}
