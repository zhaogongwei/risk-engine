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
  loading: loading.effects['auditAsset/queryDsCreditInfo'],
}))

export default  class Dscredit extends  PureComponent{
  constructor(props){
    super(props)
    this.state={
      currentime:'',
      creditRow1:[
        {
          title: '申请准入分',
          dataIndex: 'applyNum',
          key:'applyNum',
          className:'thead'
        },
        {
          title: '申请准入置信度',
          dataIndex: 'applyConfidence',
          key:'applyConfidence',
          className:'thead'
        },
        {
          title: '申请命中查询机构数',
          dataIndex: 'applyHitSchNum',
          key:'applyHitSchNum',
          className:'thead'
        },
        {
          title: '申请命中消费金融类机构数',
          dataIndex: 'applyHitConNum',
          key:'applyHitConNum',
          className:'thead'
        },
        {
          title: '申请命中网络贷款类机构数',
          dataIndex: 'applyHitNetNum',
          key:'applyHitNetNum',
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
      creditRow2:[
        {
          title: '机构总查询次数',
          dataIndex: 'schNum',
          key:'schNum',
          className:'thead'
        },
        {
          title: '最近一次机构查询时间',
          dataIndex: 'schLastTime',
          key:'schLastTime',
          className:'thead'
        },
        {
          title: '近1个月贷款类机构总查询笔数',
          dataIndex: 'oneMonNum',
          key:'oneMonNum',
          className:'thead'
        },
        {
          title: '近3个月贷款类机构总查询笔数',
          dataIndex: 'threeMonNum',
          key:'threeMonNum',
          className:'thead'
        },
        {
          title: '近6个月贷款类机构总查询笔数',
          dataIndex: 'sixMonNum',
          key:'sixMonNum',
          className:'thead'
        },
      ],
      creditRow3:[
        {
          title: '贷款行为分',
          dataIndex: 'score',
          key:'score',
          className:'thead'
        },
        {
          title: '贷款行为置信度',
          dataIndex: 'confidence',
          key:'confidence',
          className:'thead'
        },
        {
          title: '贷款放款总订单数',
          dataIndex: 'orderNum',
          key:'orderNum',
          className:'thead'
        },
        {
          title: '贷款已结清订单数',
          dataIndex: 'repayOrderNum',
          key:'repayOrderNum',
          className:'thead'
        },
        {
          title: '贷款逾期订单数(M1)',
          dataIndex: 'overdueOrderNum',
          key:'overdueOrderNum',
          className:'thead'
        },
        {
          title: '命中消费金融类机构数',
          dataIndex: 'hitConsumNum',
          key:'hitConsumNum',
          className:'thead'
        },
        {
          title: '命中贷款放款机构数',
          dataIndex: 'hitNum',
          key:'hitNum',
          className:'thead'
        },
        {
          title: '命中网络贷款类机构数',
          dataIndex: 'hitNetworkNum',
          key:'hitNetworkNum',
          className:'thead'
        },
      ],
      creditRow4:[
        {
          title: '近1个月贷款机构放款笔数',
          dataIndex: 'oneMonLoanNum',
          key:'oneMonLoanNum',
          className:'thead'
        },
        {
          title: '近3个月贷款机构放款笔数',
          dataIndex: 'threeMonLoanNum',
          key:'threeMonLoanNum',
          className:'thead'
        },
        {
          title: '近6个月贷款机构放款笔数',
          dataIndex: 'sixMonLoanNum',
          key:'sixMonLoanNum',
          className:'thead'
        },
        {
          title: '历史贷款机构成功扣款笔数',
          dataIndex: 'hisSuccNum',
          key:'hisSuccNum',
          className:'thead'
        },
        {
          title: '历史贷款机构失败扣款笔数',
          dataIndex: 'hisFailNum',
          key:'hisFailNum',
          className:'thead'
        },
        {
          title: '近1个月贷款机构成功扣款笔数',
          dataIndex: 'oneMonSuccNum',
          key:'oneMonSuccNum',
          className:'thead'
        },
        {
          title: '近1个月贷款机构失败扣款笔数',
          dataIndex: 'oneMonFailNum',
          key:'oneMonFailNum',
          className:'thead'
        },
      ],
      creditRow5:[
        {
          title: '信用贷款时长',
          dataIndex: 'creTime',
          key:'creTime',
          className:'thead'
        },
        {
          title: '最近一次贷款放款时间',
          dataIndex: 'creLastTime',
          key:'creLastTime',
          className:'thead'
        },{
          title: '建议授信额度',
          dataIndex: 'sugCreAmt',
          key:'sugCreAmt',
          className:'thead'
        },
        {
          title: '建议额度置信度',
          dataIndex: 'sugAmtConfidence',
          key:'sugAmtConfidence',
          className:'thead'
        },
        {
          title: '消费金融类机构最大授信额度',
          dataIndex: 'consumMaxAmt',
          key:'consumMaxAmt',
          className:'thead'
        },
        {
          title: '消费金融类机构平均授信额度',
          dataIndex: 'consumAvgAmt',
          key:'consumAvgAmt',
          className:'thead'
        },
      ],
      creditRow6:[
        {
          title: '网络贷款机构最大授信额度',
          dataIndex: 'networkMaxAmt',
          key:'networkMaxAmt',
          className:'thead'
        },{
          title: '网络贷款机构平均授信额度',
          dataIndex: 'networkAvgAmt',
          key:'networkAvgAmt',
          className:'thead'
        },{
          title: '命中在用的网络贷款类机构数',
          dataIndex: 'hitUseNetworkNum',
          key:'hitUseNetworkNum',
          className:'thead'
        },{
          title: '命中在用的网络贷款类产品数',
          dataIndex: 'hitUseNetworkProductNum',
          key:'hitUseNetworkProductNum',
          className:'thead'
        },{
          title: '命中在用的消费金融类机构数',
          dataIndex: 'hitConsumInstNum',
          key:'hitConsumInstNum',
          className:'thead'
        },{
          title: '命中在用的消费金融类产品数',
          dataIndex: 'hitConsumProductNum',
          key:'hitConsumProductNum',
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
      type: 'auditAsset/queryDsCreditInfo',
      payload: {
        id:id,
        type:3
      },
    })
    this.setState({
      currentime:this.props.auditAsset.arfakeInfo.length>0?this.props.auditAsset.arfakeInfo[0]['createTime']:'',
    },()=>{
    })
  }
  itemRender=(current, type, originalElement)=>{
    if(type === 'page'){
      return <a>{this.props.auditAsset.creditInfoList[current-1]['createTime']}</a>
    }
    return originalElement;
  }
  onChange=(current)=>{
    console.log(current)
    this.setState({
      currentime:this.props.auditAsset.creditInfoList[current-1]['createTime'],
      currentPage:current
    })
  }
  //风控信息查询
  checkRiskInfo = (time)=>{
    const {query} = this.props.location;
    const {id} = query;
    this.props.dispatch({
      type: 'auditAsset/queryDsCreditInfo',
      payload: {
        id:id,
        type:3
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
        type: 'auditAsset/updateDsCreditInfo',
        payload: {
          ...query,
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
    const {creditInfoList} = this.props.auditAsset;
    const {currentPage} = this.state;
    let currentCreditInfo = creditInfoList[currentPage-1]
    return(
      <PageTableTitle title={'风控报告'}>
        <Row type="flex" justify="center">
          <Pagination style={{zIndex:99}} defaultCurrent={1} current={this.state.currentPage} total={creditInfoList.length*10} itemRender={this.itemRender} onChange={this.onChange}/>
        </Row>
        <Row type="flex" align="middle" justify="space-between" style={{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginTop:10,background:'#dbeef3'}}>
          <Col>
            <span>报告编号</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{currentCreditInfo['id']}</span>
          </Col>
          <Col>
            <span>报告时间</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{currentCreditInfo['createTime']}</span>
          </Col>
          <Col>
            <span>操作人:{currentCreditInfo['createBy']}</span>
            <span style={{display:'inline-block',width:10}}></span>
            <Button type="primary" onClick={this.updateRiskInfo} style={{backgroundColor:'#AEAEAE',borderColor:'#AEAEAE'}}>更新数据</Button>
          </Col>
        </Row>
        <Row>
          <Divider>大圣信用报告</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.creditRow1}
            dataSource={currentCreditInfo['threeMonkeyCredit']['creditRow1']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.creditRow2}
            dataSource={currentCreditInfo['threeMonkeyCredit']['creditRow2']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.creditRow3}
            dataSource={currentCreditInfo['threeMonkeyCredit']['creditRow3']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.creditRow4}
            dataSource={currentCreditInfo['threeMonkeyCredit']['creditRow4']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.creditRow5}
            dataSource={currentCreditInfo['threeMonkeyCredit']['creditRow5']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.creditRow6}
            dataSource={currentCreditInfo['threeMonkeyCredit']['creditRow6']}
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