import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Row,
  Col,
  Pagination,
  Divider,
  Table
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { addListKey } from '@/utils/utils'
@connect(({auditAsset,dateLoading,loading }) => ({
  auditAsset,
  dateLoading:loading.effects['auditAsset/queryRiskTime'],
  loading: loading.effects['auditAsset/queryRiskInfo'],
}))

export default  class HundredBank extends  PureComponent{
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
      personalMsg:[
        {
          title: '姓名',
          dataIndex: 'trueName',
          key:'trueName'
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
          key:'idCard'
        },
        {
          title: '手机号数量',
          dataIndex: 'iphoneNum',
          key:'iphoneNum'
        },
      ],
      homeMsg:[
        {
          title: '家庭住址',
          dataIndex: 'homeAddress',
          key:'homeAddress'
        },
        {
          title: '家庭电话',
          dataIndex: 'telephone',
          key:'telephone'
        },
      ],
      carrerMsg:[
        {
          title: '工作单位',
          dataIndex: 'positionName',
          key:'positionName'
        },
        {
          title: '单位地址',
          dataIndex: 'positionAddress',
          key:'positionAddress'
        },
        {
          title: '单位地址的报送日期',
          dataIndex: 'reportDate',
          key:'reportDate'
        },
      ],
      loanMsg:[
        {
          title: '累计贷款笔数',
          dataIndex: 'loansNum',
          key:'loansNum'
        },
        {
          title: '未结清贷款笔数',
          dataIndex: 'unsettledNum',
          key:'unsettledNum'
        },
        {
          title: '未结清总余额',
          dataIndex: 'unsettledAmount',
          key:'unsettledAmount'
        },
        {
          title: '当前逾期贷款笔数',
          dataIndex: 'singleOverdue',
          key:'singleOverdue'
        },
        {
          title: '当前逾期金额',
          dataIndex: 'overdueAmount',
          key:'overdueAmount1'
        },
        {
          title: '当前最严重的逾期状态',
          dataIndex: 'overdueStatus',
          key:'overdueStatus'
        },
        {
          title: '累计逾期次数',
          dataIndex: 'overdueNum',
          key:'overdueNum1'
        },
        {
          title: '历史最严重逾期状态(过去三年)',
          dataIndex: 'historyOverdueStatus',
          key:'historyOverdueStatus1'
        },
      ],
      nearLoanMsg:[
        {
          title: '',
          dataIndex: 'loansType',
          key:'loansType1'
        },
        {
          title: '申请机构数量',
          dataIndex: 'institutionsNum',
          key:'institutionsNum1'
        },
        {
          title: '新增贷款笔数',
          dataIndex: 'newLoansNum',
          key:'newLoansNum'
        },{
          title: '新增贷款金额',
          dataIndex: 'newLoansAmount',
          key:'newLoansAmount1'
        },
        {
          title: '新增贷款机构数',
          dataIndex: 'newInstitutionsNum',
          key:'newInstitutionsNum'
        },
        {
          title: '最大贷款金额',
          dataIndex: 'maximumOverdueAmount',
          key:'maximumOverdueAmount'
        },
        {
          title: '平均贷款金额',
          dataIndex: 'avgOverdueAmount',
          key:'avgOverdueAmount'
        },
        {
          title: '发生逾期贷款笔数',
          dataIndex: 'overdueNum',
          key:'overdueNum2'
        },
      ],
      creditMsg:[
        {
          title: '累计循环授信账户数',
          dataIndex: 'creditNum',
          key:'creditNum'
        },{
          title: '未结清贷款笔数',
          dataIndex: 'outstandingLoansNum',
          key:'outstandingLoansNum'
        },{
          title: '有效循环授信账户数',
          dataIndex: 'effectiveCreditNum',
          key:'effectiveCreditNum'
        },{
          title: '当前授信总额',
          dataIndex: 'creditAmount',
          key:'creditAmount'
        },{
          title: '单个机构最高授信额度',
          dataIndex: 'instCreditNum',
          key:'instCreditNum'
        },{
          title: '未结清总余额',
          dataIndex: 'outstandingOverdueAmount',
          key:'outstandingOverdueAmount'
        },{
          title: '当前逾期循环授信账户数',
          dataIndex: 'overdueCreditNum',
          key:'overdueCreditNum'
        },{
          title: '当前逾期金额',
          dataIndex: 'overdueAmount',
          key:'overdueAmount2'
        },{
          title: '当前最严重逾期状态',
          dataIndex: 'seriousOverdueStatus',
          key:'seriousOverdueStatus'
        },{
          title: '累计逾期次数',
          dataIndex: 'overdueNum',
          key:'overdueNum3'
        },{
          title: '历史最严重逾期状态',
          dataIndex: 'historyOverdueStatus',
          key:'historyOverdueStatus2'
        },
      ],
      nearCreditMsg:[
        {
          title: '',
          dataIndex: 'loansType',
          key:'loansType2'
        },
        {
          title: '申请机构数量',
          dataIndex: 'institutionsNum',
          key:'institutionsNum2'
        },
        {
          title: '新增循环授信账户数',
          dataIndex: 'newCreditNum',
          key:'newCreditNum'
        },
        {
          title: '新增循环授信额度',
          dataIndex: 'newCreditAmount',
          key:'newCreditAmount'
        },
        {
          title: '新增借款金额',
          dataIndex: 'newLoansAmount',
          key:'newLoansAmount2'
        },
        {
          title: '发生逾期账户数',
          dataIndex: 'overdueNum',
          key:'overdueNum4'
        },
      ],
      queryRecord:[
        {
          title: '查询机构类型',
          dataIndex: 'queryInstType',
          key:'queryInstType'
        },
        {
          title: '查询机构名称',
          dataIndex: 'queryInstName',
          key:'queryInstName'
        },
        {
          title: '查询用户ID',
          dataIndex: 'queryInstUsername',
          key:'queryInstUsername'
        },
        {
          title: '查询日期',
          dataIndex: 'queryDate',
          key:'queryDate'
        },
        {
          title: '查询原因',
          dataIndex: 'queryReason',
          key:'queryReason'
        },
      ],
      reportId:'',
      currentPage:1
    }

  }
  componentDidMount(){
    this.setState({
      currentime:this.props.auditAsset.dateList.length>0?this.props.auditAsset.dateList[0]['reportTime']:'',
      reportId:this.props.auditAsset.dateList.length>0?this.props.auditAsset.dateList[0]['id']:'',
    },()=>{
    })
  }
  goBack=()=>{
    this.props.dispatch(routerRedux.goBack());
  }
  itemRender=(current, type, originalElement)=>{
    if(type === 'page'){
      return <a>{this.props.auditAsset.dateList[current-1]['reportTime']}</a>
    }
    return originalElement;
  }
  onChange=(current)=>{
    this.setState({
      currentime:this.props.auditAsset.dateList[current-1]['reportTime'],
      reportId:this.props.auditAsset.dateList[current-1]['id'],
      currentPage:current
    },()=>{
      this.checkRiskInfo(this.state.reportId)
    })
  }
  //风控报告页面时间获取
  queryRiskDate=()=>{
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryRiskTime',
      payload: {
        ...propsData
      },
      callback:(id)=>{
        this.setState({
          currentPage:1
        })
        this.checkRiskInfo(id)
      }
    })
  }
  //风控信息查询
  checkRiskInfo = (id)=>{
    this.props.dispatch({
      type: 'auditAsset/queryRiskInfo',
      data: {
        id:id
      }
    })
  }
  //更新风控报告信息
  updateRiskInfo=()=>{
    const formData = this.props.auditAsset.reportList['threeAssetsReport']
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/renewRiskInfo',
      payload: {
        trueName:formData['name'],
        idCardNum:formData['idCardNum'],
        queryReason:4,
        ...propsData,
      },
      callback:()=>{
        this.queryRiskDate()
      }
    })
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
          <Pagination defaultCurrent={1} current={this.state.currentPage} total={this.props.auditAsset.dateList.length*10} itemRender={this.itemRender} onChange={this.onChange}/>
        </Row>
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <span>报告编号</span>
            <span>{this.props.auditAsset.reportList['threeAssetsReport']['reportCode']}</span>
          </Col>
          <Col>
            <span>报告时间</span>
            <span>{this.props.auditAsset.reportList['threeAssetsReport']['reportTime']}</span>
          </Col>
          <Col>
            <span>查询结果:{this.props.auditAsset.reportList['threeAssetsReport']['reportResult']}</span>
            <Button type="primary" onClick={this.updateRiskInfo}>更新数据</Button>
          </Col>
        </Row>
        <Row>
          <Divider>个人基本信息</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.personalMsg}
            dataSource={this.checkNull(this.props.auditAsset.reportList['threeAssetsReport'])?addListKey([this.props.auditAsset.reportList['threeAssetsReport']]):[]}
          />
        </Row>
        <Row>
          <Divider>居住信息</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.homeMsg}
            dataSource={this.props.auditAsset.reportList['threeReportLiveinfo']}
          />
        </Row>
        <Row>
          <Divider>职业信息</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.carrerMsg}
            dataSource={this.props.auditAsset.reportList['threeReportPositioninfo']}
          />
        </Row>
        <Row>
          <Divider>单笔贷款的概要信息</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.loanMsg}
            dataSource={this.checkNull(this.props.auditAsset.reportList['threeReportOutlineinfo'])?addListKey([this.props.auditAsset.reportList['threeReportOutlineinfo']]):[]}
          />
        </Row>
        <Row>
          <Divider>进30/90/180/360天单笔贷款概要</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.nearLoanMsg}
            dataSource={this.props.auditAsset.reportList['singleOutlineinfos']}
          />
        </Row>
        <Row>
          <Divider>循环授信信息概要</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.creditMsg}
            dataSource={this.checkNull(this.props.auditAsset.reportList['creditInformation'])?addListKey([this.props.auditAsset.reportList['creditInformation']]):[]}
          />
        </Row>
        <Row>
          <Divider>进30/90/180/360天循环授信账户概要</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.nearCreditMsg}
            dataSource={this.props.auditAsset.reportList['loopCredits']}
          />
        </Row>
        <Row>
          <Divider>查询记录明细</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.queryRecord}
            dataSource={this.checkNull(this.props.auditAsset.reportList['recordsDetail'])?addListKey([this.props.auditAsset.reportList['recordsDetail']]):[]}
          />
        </Row>
        <Row type="flex" justify="center">
          <Col>
            <Button type="primary" style={{width:100}} onClick={this.goBack}>返回</Button>
          </Col>
        </Row>
      </PageTableTitle>
    )
  }
}