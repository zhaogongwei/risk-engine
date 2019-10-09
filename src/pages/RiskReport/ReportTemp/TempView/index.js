import React, { PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Affix,
  Button,
  Row,
  Col,
  Tabs,
  Anchor,
  List,
  Card,
  Empty,
} from 'antd';
const { Link } = Anchor;
const TabPane = Tabs.TabPane;
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import ReportComponent from './reportComponent'
import Tab from './tab'
import router from 'umi/router';
@connect(({ preView}) => ({
  preView,
}))

export default  class Index extends  PureComponent{
  constructor(props){
    super(props);
    this.state={
      selectKey:0,//当前选中tab key值
    }

  }
  //初始化信息
  componentDidMount(){
    const {query} = this.props.location;
    this.props.dispatch({
      type: 'preView/queryTemplate',
      payload: {
        ...query,
      }
    })
  }
  //返回
  goBack=()=>{
  }
  //tab切换
  handleTab=(key)=>{
    this.setState({
      selectKey:key,
    })
  }
  render(){
    const titleWrapper=
     <div>
       <span>模板预览&nbsp;&nbsp;&nbsp;&nbsp;</span><span>资产编号 ZC123455678910</span>
     </div>;
     const {titleList,reportInfo} = this.props.preView;
    return(
      <PageHeaderWrapper >
        {
          titleList&&titleList.length?
            <div>
              <Card
                bordered={false}
                title={titleWrapper}
                extra={`报告编号${reportInfo['idFormat']}`}
                headStyle={{fontSize:14}}
              >
              </Card>
              <Row>
                <Tab
                  selectKey={this.state.selectKey}
                  tabList={titleList}
                  handleTab={this.handleTab}
                />
              </Row>
              <Row>
                <Col>
                  <ReportComponent
                    list={titleList}
                  />
                </Col>
              </Row>
            </div>
            :<Empty style={{height:400,paddingTop:100}}/>
        }
        <Row type="flex" justify="center">
          <Col>
            <Button type="primary" onClick={()=>router.goBack()}>返回</Button>
          </Col>
        </Row>
      </PageHeaderWrapper>
    )
  }
}