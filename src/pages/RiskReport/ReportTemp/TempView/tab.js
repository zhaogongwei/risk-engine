import React, { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Affix,
  Anchor,
  Button
} from 'antd';
import { connect } from 'dva'
import './tab.less'

const {Link} = Anchor
@connect(({ registRecord, loading }) => ({
  registRecord,
  loading: loading.effects['registRecord/initListData']
}))

export default  class Tab extends  PureComponent{
  constructor(props){
    super(props)
  }
  componentDidMount(){}
  changeHash(idName){
    document.querySelector(idName).scrollIntoView(true)
  }
  render(){
    const {tabList,handleTab,selectKey}=this.props;
    return(
      <div id="tabWrapper">
        <Affix>
          <Row gutter={16} type="flex"  align="middle" style={{background:'#fff'}}>
            {
              tabList&&tabList.map((item,index)=>{
                return (
                  <Col key={index}>
                    <a className={`tabItem ${selectKey===index?"active":null}`} onClick={()=>{handleTab(index);this.changeHash(`#list${index}`)}}>
                      {item['title']}
                    </a>
                  </Col>
                )
              })
            }
          </Row>
        </Affix>
      </div>
    )
  }
}