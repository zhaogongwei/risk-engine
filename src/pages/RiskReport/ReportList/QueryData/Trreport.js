import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Row,
  Col,
  Modal,
  Pagination,
  Divider,
  Table,
  Card
} from 'antd';
import { connect } from 'dva'
import {getUserId} from '@/utils/authority';
import { routerRedux } from 'dva/router';
import { addListKey } from '@/utils/utils'
import  './index.less'
@connect(({auditAsset,loading }) => ({
  auditAsset,
  loading: loading.effects['auditAsset/queryRuleList'],
}))

export default  class Trreport extends  PureComponent{
  constructor(props){
    super(props)
    this.state={
      ruleList:[
        {
          title: '序号',
          dataIndex: 'key',
          key:'key',
        },
        {
          title: '规则',
          dataIndex: 'ruleName',
          key:'ruleName',
        },
        {
          title: '是否命中',
          dataIndex: 'fit',
          key:'fit',
          render:(record)=>record?'是':'否'
        },
        {
          title: '描述',
          dataIndex: 'description',
          key:'description',
          className:'textAlignCenter'
        },
      ],
      data:[
        {
          key:1,
          rule:'年龄',
          isHit:'是',
          desc:'年龄<=23'
        },
        {
          key:2,
          rule:'年龄',
          isHit:'否',
          desc:'年龄>23'
        }
      ]
    }

  }
  componentDidMount(){
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryTrReportInfo',
      data: {
        ...propsData,
      }
    })
    this.ruleFilter(1,propsData)
  }
  goBack=()=>{
    this.props.dispatch(routerRedux.goBack());
  }
  //检验null
  checkNull=(obj)=>{
    for(var k in obj){
      if(obj[k]){
        return obj;
      }
    }
    return null;
  }
  //规则命中表查询
  ruleFilter=(type,record)=>{
    this.props.dispatch({
      type: 'auditAsset/queryRuleList',
      data: {
        ...record,
        fitType:type
      }
    })
  }
  render(){
    const titleStyone={
      textAlign:'center',
      color:'#868686',
      margin:0
    };
    const titleSty={
      textAlign:'center',
      color:'#868686',
      minHeight:'42px',
      margin:0
    };
    const girdStyle={
      fontSize:'14px',
      fontWeight:600,
      textAlign:'center',
      height:'20px',
      lineHeight:'20px'
    };
    const {trInfo} = {...this.props.auditAsset}
    const {trRuleList} = {...this.props.auditAsset}
    const propsData = this.props.location.state
    return(
      <PageTableTitle title={'风控报告'}>
        <div style={{width:'70%'}}>
          <Row type="flex" align="middle" justify="space-between" style={{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginTop:10,}}>
            <Col style={{fontSize:'18px',fontWeight:600}}>
              <span>资产编号</span>
              <span style={{display:'inline-block',width:10}}></span>
              <span>{trInfo['threeAssetsReportVO']['assetsCode']}</span>
            </Col>
            <Col>
              <span>姓名</span>
              <span style={{display:'inline-block',width:10}}></span>
              <span>{trInfo['threeAssetsReportVO']['trueName']}</span>
            </Col>
            <Col>
              <span>身份证号</span>
              <span style={{display:'inline-block',width:10}}></span>
              <span>{trInfo['threeAssetsReportVO']['idCardNum']}</span>
            </Col>
            <Col>
              <span>报告编号</span>
              <span style={{display:'inline-block',width:10}}></span>
              <span>{trInfo['threeAssetsReportVO']['reportCode']}</span>
            </Col>
          </Row>
          <Row style={{padding:'30px',backgroundColor:'#F2F2F2',marginTop:'20px'}}>
            <Row type="flex"  align="middle">
              <Col span={3} style={{fontSize:'18px',fontWeight:600,textAlign:'center'}}>综合决策报告</Col>
              <Col span={6} style={{textAlign:'center'}}>生成日期 {trInfo['threeAssetsReportVO']['reportTime']}</Col>
            </Row>
            <Row type="flex" align="top" style={{borderBottom:'1px dashed #c6c6c6',marginBottom:'20px',marginTop:'20px'}}>
              <Col span={3}>
                <p style={titleStyone}>风控决策结果</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['result']}</p>
              </Col>
              <Col span={6}>
                <p style={titleStyone}>评分卡得分</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['score']}</p>
              </Col>
              <Col span={6}>
                <p style={titleStyone}>(安融)借款申请审批通过数</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['passNum']}</p>
              </Col>
              <Col span={6}>
                <p style={titleStyone}>(安融)借款申请审批通过金额</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['passAmt']}</p>
              </Col>
            </Row>
            <Row type="flex" align="top" style={{borderBottom:'1px dashed #c6c6c6',marginBottom:'20px'}}>
              <Col span={3}>
                <p style={titleSty}>(安融)正常还款账户<br/>--未结清笔数</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['outStandingNum']}</p>
              </Col>
              <Col span={6}>
                <p style={titleSty}>(安融)正常还款账户<br/>--未结清金额</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['outStandingAmt']}</p>
              </Col>
              <Col span={6}>
                <p style={titleSty}>(安融)异常还款账户<br/>--未结清笔数</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['unOutStandingNum']}</p>
              </Col>
              <Col span={6}>
                <p style={titleSty}>(安融)异常还款账户<br/>--未结清金额</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['unOutStandingAmt']}</p>
              </Col>
            </Row>
            <Row type="flex" align="top">
              <Col span={3}>
                <p style={titleSty}>(安融)行业不良记录<br/>--笔数</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['badRecordNum']}</p>
              </Col>
              <Col span={6}>
                <p style={titleSty}>(安融)行业不良记录<br/>--金额</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['badRecordAmt']}</p>
              </Col>
              <Col span={6}>
                <p style={titleSty}>最近申请通过日期</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['passDate']}</p>
              </Col>
              <Col span={6}>
                <p style={titleSty}>最近申请通过地点</p>
                <p style={girdStyle}>{trInfo['threeTrWindControlReport']['passAddress']}</p>
              </Col>
            </Row>
          </Row>
          <Row style={{marginTop:'20px'}}>
            <Row type="flex" gutter={24} align="middle" style={{marginBottom:10}}>
              <Col>
                <p style={{fontSize:'18px',fontWeight:600,margin:0}}>规则命中表</p>
              </Col>
              <Col>
                <Button type="primary" onClick={()=>{this.ruleFilter(2,propsData)}}>全部</Button>
              </Col>
              <Col>
                <Button type="primary" onClick={()=>{this.ruleFilter(1,propsData)}}>命中</Button>
              </Col>
              <Col>
                <Button type="primary" onClick={()=>{this.ruleFilter(0,propsData)}}>未命中</Button>
              </Col>
            </Row>
            <Row>
              <Table
                loading={this.props.loading}
                bordered
                pagination={false}
                columns={this.state.ruleList}
                dataSource={trRuleList}
              />
            </Row>
          </Row>
        </div>
      </PageTableTitle>
    )
  }
}