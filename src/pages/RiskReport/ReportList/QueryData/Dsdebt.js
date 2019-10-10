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
      currentime:'',
      head:[
        {
          title: '当前共债订单数',
          dataIndex: 'current_order_count',
          key:'current_order_count',
          className:'thead'
        },
        {
          title: '当前共债订单已还款⾦额',
          dataIndex: 'current_order_amt',
          key:'current_order_amt',
          className:'thead'
        },
        {
          title: '当前共债机构数',
          dataIndex: 'current_org_count',
          key:'current_org_count',
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
          dataIndex: 'totaldebt_date',
          key:'totaldebt_date',
          className:'thead'
        },
        {
          title: '共债机构数',
          dataIndex: 'totaldebt_org_count',
          key:'totaldebt_org_count',
          className:'thead'
        },
        {
          title: '共债订单数',
          dataIndex: 'totaldebt_order_count',
          key:'totaldebt_order_count',
          className:'thead'
        },
        {
          title: '共债订单已还款⾦额',
          dataIndex: 'totaldebt_order_amt',
          key:'totaldebt_order_amt',
          className:'thead'
        },
        {
          title: '疑似借新还旧',
          dataIndex: 'new_or_old',
          key:'new_or_old',
          className:'thead'
        },
      ],
      reportId:'',
      currentPage:1,
      visible:false
    }

  }
  componentDidMount(){
    const {query} = this.props.location;
    const {id} = query;
    this.props.dispatch({
      type: 'auditAsset/queryDsDebtInfo',
      payload: {
        id:id,
        type:4
      },
    })
    this.setState({
      currentime:this.props.auditAsset.debtInfoList.length>0?this.props.auditAsset.debtInfoList[0]['createTime']:'',
    },()=>{
    })
  }
  itemRender=(current, type, originalElement)=>{
    if(type === 'page'){
      return <a>{this.props.auditAsset.debtInfoList[current-1]['createTime']}</a>
    }
    return originalElement;
  }
  onChange=(current)=>{
    this.setState({
      currentime:this.props.auditAsset.debtInfoList[current-1]['createTime'],
      currentPage:current
    })
  }
  //风控信息查询
  checkRiskInfo = (time)=>{
    const {query} = this.props.location;
    const {id} = query;
    this.props.dispatch({
      type: 'auditAsset/queryDsDebtInfo',
      payload: {
        id:id,
        type:4
      },
    })
  }
  //更新风控报告信息
  updateRiskInfo=()=>{
    this.showModal()
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    },async()=>{
      const {query} = this.props.location;
      const {id} = query;
      const res = await this.props.dispatch({
        type: 'auditAsset/updateDsDebtInfo',
        payload: {
          ...query
        },
      })
      if(res&&res.status===1){
        this.checkRiskInfo()
      }
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
    const {debtInfoList} = this.props.auditAsset;
    const {currentPage} = this.state;
    let currentDebtInfo=debtInfoList[currentPage-1];
    console.log(debtInfoList)
    console.log(currentDebtInfo)
    return(
      <PageTableTitle title={'风控报告'}>
        <Row type="flex" justify="center">
          <Pagination style={{zIndex:99}} defaultCurrent={1} current={this.state.currentPage} total={debtInfoList.length*10} itemRender={this.itemRender} onChange={this.onChange}/>
        </Row>
        <Row type="flex" align="middle" justify="space-between" style={{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginTop:10,background:'#dbeef3'}}>
          <Col>
            <span>报告编号</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{currentDebtInfo['idFormat']}</span>
          </Col>
          <Col>
            <span>报告时间</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{currentDebtInfo['createTime']}</span>
          </Col>
          <Col>
            <span>操作人:{currentDebtInfo['createByName']}</span>
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
            dataSource={currentDebtInfo['creditDebtResult']['debtInfo']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.body}
            dataSource={currentDebtInfo['creditDebtResult']['detail']}
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