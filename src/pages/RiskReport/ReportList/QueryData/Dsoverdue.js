import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Row,
  Col,
  Modal,
  Pagination,
  Divider,
  Table
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {getUserId} from '@/utils/authority';
import { addListKey } from '@/utils/utils'
@connect(({auditAsset,dateLoading,loading }) => ({
  auditAsset,
  loading: loading.effects['auditAsset/queryDsOverdueInfo'],
}))

export default  class Dsdebt extends  PureComponent{
  constructor(props){
    super(props)
    this.state={
      data : [
        {
          id:1,
          time:'2018-01-01'
        },
        {
          id:2,
          time:'2018-01-02'
        },
        {
          id:3,
          time:'2018-01-03'
        },
        {
          id:4,
          time:'2018-01-04'
        },
        {
          id:5,
          time:'2018-01-05'
        },
        {
          id:6,
          time:'2018-01-06'
        },
        {
          id:7,
          time:'2018-01-07'
        },
        {
          id:8,
          time:'2018-01-08'
        },
        {
          id:9,
          time:'2018-01-09'
        },
        {
          id:10,
          time:'2018-01-10'
        },
        {
          id:11,
          time:'2018-01-11'
        },
        {
          id:12,
          time:'2018-01-12'
        },
        {
          id:13,
          time:'2018-01-13'
        },
        {
          id:14,
          time:'2018-01-14'
        },
        {
          id:15,
          time:'2018-01-15'
        },
        {
          id:16,
          time:'2018-01-16'
        },{
          id:17,
          time:'2018-01-17'
        },
        {
          id:18,
          time:'2018-01-18'
        },
        {
          id:19,
          time:'2018-01-19'
        },
        {
          id:20,
          time:'2018-01-20'
        },

      ],
      currentime:'',
      overdueRow1:[
        {
          title: '是否命中',
          dataIndex: 'hit',
          key:'hit',
          className:'thead'
        },
        {
          title: '逾期最早出现时间',
          dataIndex: 'earliestTime',
          key:'earliestTime',
          className:'thead'
        },
        {
          title: '逾期最近出现时间',
          dataIndex: 'recentTime',
          key:'recentTime',
          className:'thead'
        },
        {
          title: '逾期累计出现次数',
          dataIndex: 'num',
          key:'num',
          className:'thead'
        },
        {
          title: '逾期当前逾期金额',
          dataIndex: 'curAmt',
          key:'curAmt',
          className:'thead'
        },
        {
          title: '逾期当前逾期时长',
          dataIndex: 'curTime',
          key:'curTime',
          className:'thead'
        },
      ],
      personalData:[
        {
          trueName:1,
          idCard:2,
          iphoneNum1:3,
          iphoneNum2:4,
          iphoneNum3:5
        },
        {
          trueName:1,
          idCard:2,
          iphoneNum1:3,
          iphoneNum2:4,
          iphoneNum3:5
        },
        {
          trueName:1,
          idCard:2,
          iphoneNum1:3,
          iphoneNum2:4,
          iphoneNum3:5
        }
      ],
      overdueRow2:[
        {
          title: '历史借款次数',
          dataIndex: 'hisBorrowNum',
          key:'hisBorrowNum',
          className:'thead'
        },
        {
          title: '逾期历史最大逾期金额',
          dataIndex: 'hisMaxAmt',
          key:'hisMaxAmt',
          className:'thead'
        },
        {
          title: '逾期历史最大逾期时长',
          dataIndex: 'hisMaxTime',
          key:'hisMaxTime',
          className:'thead'
        },
        {
          title: '最早借款时间',
          dataIndex: 'earliestBorrowTime',
          key:'earliestBorrowTime',
          className:'thead'
        },
        {
          title: '已经还清的历史逾期最长时间',
          dataIndex: 'hisLongestTime',
          key:'hisLongestTime',
          className:'thead'
        },
        {
          title: '当前处于逾期状态的借款笔数',
          dataIndex: 'curBorrowNum',
          key:'curBorrowNum',
          className:'thead'
        },
        {
          title: '当前最长逾期时间',
          dataIndex: 'curLongestTime',
          key:'curLongestTime',
          className:'thead'
        },
      ],
      reportId:'',
      currentPage:1,
      visible:false
    }

  }
  componentWillMount(){
  }
  componentDidMount(){
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryDsPublicDate',
      payload: {
        ...propsData,
        reportFlag:3
      },
      callback:(time)=>{
        this.checkRiskInfo(time)
      }
    })
    this.setState({
      currentime:this.props.auditAsset.overdueDateList.length>0?this.props.auditAsset.overdueDateList[0]:'',
    },()=>{
    })
  }
  componentWillUpdate(){
  }
  componentDidUpdate(){
  }
  componentWillUnmount(){
  }
  itemRender=(current, type, originalElement)=>{
    if(type === 'page'){
      return <a>{this.props.auditAsset.overdueDateList[current-1]}</a>
    }
    return originalElement;
  }
  onChange=(current)=>{
    this.setState({
      currentime:this.props.auditAsset.overdueDateList[current-1],
      currentPage:current
    },()=>{
      this.checkRiskInfo(this.state.currentime)
    })
  }
  //风控报告页面时间获取
  queryRiskDate=()=>{
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryDsPublicDate',
      payload: {
        ...propsData,
        reportFlag:3
      },
      callback:(time)=>{
        this.setState({
          currentPage:1
        })
        this.checkRiskInfo(time)
      }
    })
  }
  //风控信息查询
  checkRiskInfo = (time)=>{
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryDsOverdueInfo',
      data: {
        reportTime:time,
        ...propsData
      }
    })
  }
  //更新风控报告信息
  updateRiskInfo=()=>{
    this.showModal()
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    },()=>{
      const propsData = this.props.location.state
      this.props.dispatch({
        type: 'auditAsset/updateDsOverdueInfo',
        payload: {
          adminUserID:getUserId(),
          ...propsData,
        },
        callback:()=>{
          this.queryRiskDate()
        }
      })
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
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
  render(){
    return(
      <PageTableTitle title={'风控报告'}>
        <Row type="flex" justify="center">
          <Pagination style={{zIndex:99}} defaultCurrent={1} current={this.state.currentPage} total={this.props.auditAsset.overdueDateList.length*10} itemRender={this.itemRender} onChange={this.onChange}/>
        </Row>
        <Row type="flex" align="middle" justify="space-between" style={{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginTop:10,background:'#dbeef3'}}>
          <Col>
            <span>报告编号</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{this.props.auditAsset.overdueInfoList['reportCode']}</span>
          </Col>
          <Col>
            <span>报告时间</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{this.props.auditAsset.overdueInfoList['reportTime']}</span>
          </Col>
          <Col>
            <span>操作人:{this.props.auditAsset.overdueInfoList['operator']}</span>
            <span style={{display:'inline-block',width:10}}></span>
            <Button type="primary" onClick={this.updateRiskInfo} style={{backgroundColor:'#AEAEAE',borderColor:'#AEAEAE'}}>更新数据</Button>
          </Col>
        </Row>
        <Row>
          <Divider>大圣逾期宝</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.overdueRow1}
            dataSource={this.props.auditAsset.overdueInfoList['overdueRow1']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.overdueRow2}
            dataSource={this.props.auditAsset.overdueInfoList['overdueRow2']}
          />
        </Row>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col style={{textAlign:'center',color:'#ff0000',fontSize:18,fontWeight:800,marginTop:60,marginBottom:20}}>
              更新报告将产生费用,如非必要，请勿更新！
            </Col>
            <Col style={{textAlign:'center',marginBottom:60}}>
              (如须查看过往已付费报告,请点击顶部日期按钮切换!)
            </Col>
          </Row>
        </Modal>
      </PageTableTitle>
    )
  }
}