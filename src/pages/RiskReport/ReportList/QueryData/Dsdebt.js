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
  loading: loading.effects['auditAsset/queryDsDebtInfo'],
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
      head:[
        {
          title: '当前共债订单数',
          dataIndex: 'orderNum',
          key:'orderNum',
          className:'thead'
        },
        {
          title: '当前共债订单已还款⾦额',
          dataIndex: 'repayOrderAmt',
          key:'repayOrderAmt',
          className:'thead'
        },
        {
          title: '当前共债机构数',
          dataIndex: 'curInstNum',
          key:'curInstNum',
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
      body:[
        {
          title: '共债统计时间',
          dataIndex: 'statisticsTime',
          key:'statisticsTime',
          className:'thead'
        },
        {
          title: '共债机构数',
          dataIndex: 'instNum',
          key:'instNum',
          className:'thead'
        },
        {
          title: '共债订单数',
          dataIndex: 'orderNum',
          key:'orderNum',
          className:'thead'
        },
        {
          title: '共债订单已还款⾦额',
          dataIndex: 'repayOrderAmt',
          key:'repayOrderAmt',
          className:'thead'
        },
        {
          title: '疑似借新还旧',
          dataIndex: 'borrowNewRepayOld',
          key:'borrowNewRepayOld',
          className:'thead'
        },
      ],
      reportId:'',
      currentPage:1,
      visible:false
    }

  }
  componentDidMount(){
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryDsPublicDate',
      payload: {
        ...propsData,
        reportFlag:2
      },
      callback:(time)=>{
        this.checkRiskInfo(time)
      }
    })
    this.setState({
      currentime:this.props.auditAsset.debtDateList.length>0?this.props.auditAsset.debtDateList[0]:'',
    },()=>{
    })
  }
  itemRender=(current, type, originalElement)=>{
    if(type === 'page'){
      return <a>{this.props.auditAsset.debtDateList[current-1]}</a>
    }
    return originalElement;
  }
  onChange=(current)=>{
    this.setState({
      currentime:this.props.auditAsset.debtDateList[current-1],
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
        reportFlag:2
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
      type: 'auditAsset/queryDsDebtInfo',
      data: {
        reportTime:time,
        ...propsData
      }
    })
  }
  //更新风控报告信息
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
        type: 'auditAsset/updateDsDebtInfo',
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
          <Pagination style={{zIndex:99}} defaultCurrent={1} current={this.state.currentPage} total={this.props.auditAsset.debtDateList.length*10} itemRender={this.itemRender} onChange={this.onChange}/>
        </Row>
        <Row type="flex" align="middle" justify="space-between" style={{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginTop:10,background:'#dbeef3'}}>
          <Col>
            <span>报告编号</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{this.props.auditAsset.debtInfoList['reportCode']}</span>
          </Col>
          <Col>
            <span>报告时间</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{this.props.auditAsset.debtInfoList['reportTime']}</span>
          </Col>
          <Col>
            <span>操作人:{this.props.auditAsset.debtInfoList['operator']}</span>
            <span style={{display:'inline-block',width:10}}></span>
            <Button type="primary" onClick={this.updateRiskInfo} style={{backgroundColor:'#AEAEAE',borderColor:'#AEAEAE'}}>更新数据</Button>
          </Col>
        </Row>
        <Row>
          <Divider>大圣共债报告</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.head}
            dataSource={this.props.auditAsset.debtInfoList['head']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.body}
            dataSource={this.props.auditAsset.debtInfoList['body']}
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