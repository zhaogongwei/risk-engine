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
@connect(({auditAsset,dateLoading,loading }) => ({
  auditAsset,
  dateLoading:loading.effects['auditAsset/queryRiskTime'],
  loading: loading.effects['auditAsset/queryRiskInfo'],
}))

export default  class Arcredit extends  PureComponent{
  constructor(props){
    super(props)
    this.state={
      currentime:'',
      loanApplicationList :[
        {
          title: '申请日期',
          dataIndex: 'applyDate',
          key:'applyDate',
          className:'thead'
        },
        {
          title: '会员类型',
          dataIndex: 'memberType',
          key:'memberType',
          className:'thead'
        },
        {
          title: '申请地点',
          dataIndex: 'creditAddress',
          key:'creditAddress',
          className:'thead'
        },
        {
          title: '申请金额',
          dataIndex: 'loanMoney',
          key:'loanMoney',
          className:'thead'
        },
        {
          title: '审批结果',
          dataIndex: 'applyResult',
          key:'applyResult',
          className:'thead'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key:'remark',
          className:'thead'
        },
      ],
      normalRepayList:[
        {
          title: '借款编号',
          dataIndex: 'num',
          key:'num',
          className:'thead'
        },
        {
          title: '会员类型',
          dataIndex: 'memberType',
          key:'memberType',
          className:'thead'
        },
        {
          title: '借款日期',
          dataIndex: 'creditStartDate',
          key:'creditStartDate',
          className:'thead'
        },
        {
          title: '到期日期',
          dataIndex: 'creditEndDate',
          key:'creditEndDate',
          className:'thead'
        },
        {
          title: '借款地点',
          dataIndex: 'creditAddress',
          key:'creditAddress',
          className:'thead'
        },
        {
          title: '担保方式',
          dataIndex: 'assureType',
          key:'assureType',
          className:'thead'
        },
        {
          title: '合同金额',
          dataIndex: 'loanMoney',
          key:'loanMoney',
          className:'thead'
        },
        {
          title: '还款期数',
          dataIndex: 'loanPeriods',
          key:'loanPeriods',
          className:'thead'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key:'remark',
          className:'thead'
        },
      ],
      abnormalRepayList :[
        {
          title: '借款编号',
          dataIndex: 'num',
          key:'num',
          className:'thead',
        },
        {
          title: '会员类型',
          dataIndex: 'memberType',
          key:'memberType',
          className:'thead',
        },
        {
          title: '借款日期',
          dataIndex: 'creditStartDate',
          key:'creditStartDate',
          className:'thead',
        },
        {
          title: '到期日期',
          dataIndex: 'creditEndDate',
          key:'creditEndDate',
          className:'thead',
        },
        {
          title: '担保方式',
          dataIndex: 'assureType',
          key:'assureType',
          className:'thead',
        },
        {
          title: '合同金额',
          dataIndex: 'loanMoney',
          key:'loanMoney',
          className:'thead',
        },
        {
          title: '还款期数',
          dataIndex: 'loanPeriods',
          key:'loanPeriods',
          className:'thead',
        },
        {
          title: '逾期日期',
          dataIndex: 'checkOverdueDate',
          key:'checkOverdueDate',
          className:'thead'
        },
        {
          title: '逾期时长',
          dataIndex: 'overdueDays',
          key:'overdueDays',
          className:'thead'
        },
        {
          title: '逾期金额',
          dataIndex: 'nbMoney',
          key:'nbMoney',
          className:'thead',
        },
        {
          title: '状态',
          dataIndex: 'overdueState',
          key:'overdueState',
          className:'thead'
        },
        {
          title: '更新日期',
          dataIndex: 'operTime',
          key:'operTime',
          className:'thead'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key:'remark',
          className:'thead'
        },
      ],
      queryRecordList :[
        {
          title: '查询日期',
          dataIndex: 'queryDate',
          key:'queryDate',
          className:'thead'
        },
        {
          title: '会员类型',
          dataIndex: 'memberType',
          key:'memberType',
          className:'thead'
        },{
          title: '查询类别',
          dataIndex: 'queryType',
          key:'queryType',
          className:'thead'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key:'remark',
          className:'thead'
        },
      ],
      industryInfoList:[
        {
          title: '序号',
          dataIndex: 'key',
          key:'key',
          className:'thead'
        },{
          title: '会员类型',
          dataIndex: 'memberType',
          key:'memberType',
          className:'thead'
        },{
          title: '报送/公开日期',
          dataIndex: 'createDate',
          key:'createDate',
          className:'thead'
        },{
          title: '逾期开始日期',
          dataIndex: 'lastOverdueDate',
          key:'lastOverdueDate',
          className:'thead'
        },{
          title: '借款地点',
          dataIndex: 'creditAddress',
          key:'creditAddress',
          className:'thead'
        },{
          title: '欠款总额',
          dataIndex: 'arrears',
          key:'arrears',
          className:'thead'
        },
        {
          title: '电话',
          dataIndex: 'phone',
          key:'phone',
          className:'thead'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key:'email',
          className:'thead'
        },
        {
          title: '户籍地址',
          dataIndex: 'residenceAddress',
          key:'residenceAddress',
          className:'thead'
        },
        {
          title: '现居地址',
          dataIndex: 'currentAddress',
          key:'currentAddress',
          className:'thead'
        },
        {
          title: '状态',
          dataIndex: 'infoStatus',
          key:'infoStatus',
          className:'thead'
        },
        {
          title: '信息来源',
          dataIndex: 'source',
          key:'source',
          className:'thead'
        },
      ],
      objectionDeclaratList:[
        {
          title: '申告日期',
          dataIndex: 'complainDate',
          key:'complainDate',
          className:'thead'
        },
        {
          title: '申告内容',
          dataIndex: 'complainContent',
          key:'complainContent',
          className:'thead'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key:'remark',
          className:'thead'
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
      currentPage:1,
      visible:false,
    }

  }
  componentDidMount(){
    console.log(this.props)
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryArDateList',
      payload: {
        ...propsData,
        creditInstCode:80000003,
        queryType:1
      },
      callback:(time)=>{
        this.checkRiskInfo(time)
      }
    })
    this.setState({
      currentime:this.props.auditAsset.arcreditDateList.length>0?this.props.auditAsset.arcreditDateList[0]['reportTime']:'',
    },()=>{
    })
  }
  componentDidUpdate(){
  }
  componentWillUnmount(){
  }
  goBack=()=>{
    this.props.dispatch(routerRedux.goBack());
  }
  itemRender=(current, type, originalElement)=>{
    if(type === 'page'){
      if(this.props.auditAsset.arcreditDateList.length){
        return <a>{this.props.auditAsset.arcreditDateList[current-1]['reportTime']}</a>
      }else{
        return null
      }
    }
    return originalElement;
  }
  onChange=(current)=>{
    this.setState({
      currentime:this.props.auditAsset.arcreditDateList[current-1]['reportTime'],
      currentPage:current
    },()=>{
      this.checkRiskInfo(this.state.currentime)
    })
  }
  //风控报告页面时间获取
  queryRiskDate=()=>{
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryArDateList',
      payload: {
        ...propsData,
        creditInstCode:80000003,
        queryType:1
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
      type: 'auditAsset/queryArcreditInfo',
      data: {
        ...propsData,
        creditInstCode:80000003,
        reportTime:time,
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
        type: 'auditAsset/updateArReport',
        payload: {
          ...propsData,
          adminUserID:getUserId(),
          reportFlag:4,
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
    const gridStyle = {
      width:96,
      height:'40px',
      lineHeight:'40px',
      textAlign: 'center',
      fontSize:'12px',
      backgroundColor:'#dbeef3',
      borderBottom: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4'
    };
    const gridConStyle = {
      width:96,
      height:'40px',
      lineHeight:'40px',
      textAlign: 'center',
      fontSize:'12px',
      backgroundColor:'#fff',
      borderBottom: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4'
    };
    const titleStyle = {
      textAlign: 'center',
      height:'40px',
      lineHeight:'40px',
      fontSize:'12px',
      backgroundColor:'#dbeef3',
      borderBottom: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4'
    };
    const {arcreditInfoList} = {...this.props.auditAsset}
    return(
      <PageTableTitle title={'风控报告'}>
        <Row type="flex" justify="center">
          <Pagination style={{zIndex:99}} defaultCurrent={1} current={this.state.currentPage} total={this.props.auditAsset.arcreditDateList.length*10} itemRender={this.itemRender} onChange={this.onChange}/>
        </Row>
        <Row type="flex" align="middle" justify="space-between" style={{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginTop:10,background:'#dbeef3'}}>
          <Col>
            <span>报告编号</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{arcreditInfoList['reportCode']}</span>
          </Col>
          <Col>
            <span>报告时间</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{arcreditInfoList['createTime']}</span>
          </Col>
          <Col>
            <span>操作人:{arcreditInfoList['createBy']}</span>
            <span style={{display:'inline-block',width:10}}></span>
            <Button type="primary" onClick={this.updateRiskInfo} style={{backgroundColor:'#AEAEAE',borderColor:'#AEAEAE'}}>更新数据</Button>
          </Col>
        </Row>
        <Row>
          <Divider>信贷交易统计概况</Divider>
          <Row type="flex" style={{flexWrap:'noWrap'}}>
            <Col  style={{width:'130px',backgroundColor:'#dbeef3',borderRight:'1px solid #ced3d4',borderBottom: '1px solid #ced3d4',}}></Col>
            <Col>
              <Row >
                <Col style={titleStyle}>借款申请记录</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridStyle}>待审核</Col>
                <Col  style={gridStyle}>审批通过</Col>
                <Col  style={gridStyle}>审批拒绝</Col>
                <Col  style={gridStyle}>客户取消</Col>
                <Col  style={gridStyle}>小计</Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col style={titleStyle}>正常还款账户</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridStyle}>未结清</Col>
                <Col  style={gridStyle}>已结清</Col>
                <Col  style={gridStyle}>小计</Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col style={titleStyle}>异常还款账户</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridStyle}>未结清</Col>
                <Col  style={gridStyle}>已结清</Col>
                <Col  style={gridStyle}>小计</Col>
              </Row>
            </Col>
            <Col style={{width:'120px',lineHeight:'80px',textAlign:'center',fontSize:'12px',backgroundColor:'#dbeef3',borderRight:'1px solid #ced3d4'}}>
              行业不良记录
            </Col>
            <Col>
              <Row>
                <Col style={titleStyle}>查询记录</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}} >
                <Col  style={gridStyle}>3个月内</Col>
                <Col  style={gridStyle}>6个月内</Col>
                <Col  style={gridStyle}>累计查询量</Col>
              </Row>
            </Col>
          </Row>
          <Row type="flex">
            <Col>
              <Col type="flex" style={{width:'130px',backgroundColor:'#dbeef3',textAlign:'center',fontSize:'12px',height:'40px',lineHeight:'40px',borderRight:'1px solid #ced3d4',borderBottom: '1px solid #ced3d4',}}>笔数</Col>
              <Col type="flex" style={{width:'130px',backgroundColor:'#dbeef3',textAlign:'center',fontSize:'12px',height:'40px',lineHeight:'40px',borderRight:'1px solid #ced3d4',borderBottom: '1px solid #ced3d4',}}>总(合同)金额</Col>
            </Col>
            {/*借款申请记录*/}
            <Col>
              {/*笔数*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyingCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyPassedCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyRejectCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyCancelCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyTotalCount']}</Col>
              </Row>
              {/*总金额*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyingSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyPassedSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyRejectSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyCancelSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['applyingRecord']['applyTotalSumMoney']}</Col>
              </Row>
            </Col>
            {/*正常还款账户*/}
            <Col>
              {/*笔数*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['normalRepay']['wjqCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['normalRepay']['jqCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['normalRepay']['totalCount']}</Col>
              </Row>
              {/*总金额*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['normalRepay']['wjqSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['normalRepay']['jqSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['normalRepay']['totalSumMoney']}</Col>
              </Row>
            </Col>
            {/*异常还款账户*/}
            <Col>
              {/*笔数*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['abnormalRepay']['ewjqCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['abnormalRepay']['ejqCount']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['abnormalRepay']['etotalCount']}</Col>
              </Row>
              {/*总金额*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['abnormalRepay']['ewjqSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['abnormalRepay']['ejqSumMoney']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['abnormalRepay']['etotalSumMoney']}</Col>
              </Row>
            </Col>
            {/*行业不良记录*/}
            <Col>
              <Col style={{width:'120px',height:'40px',lineHeight:'40px',textAlign:'center',fontSize:'12px',borderRight:'1px solid #ced3d4',borderBottom: '1px solid #ced3d4',}}>{arcreditInfoList['creditTransacte']['blackRecord']['blackCount']}</Col>
              <Col style={{width:'120px',height:'40px',lineHeight:'40px',textAlign:'center',fontSize:'12px',borderRight:'1px solid #ced3d4',borderBottom: '1px solid #ced3d4',}}>{arcreditInfoList['creditTransacte']['blackRecord']['blackSumMoney']}</Col>
            </Col>
            {/*查询记录*/}
            <Col>
              {/*笔数*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['queryRecord']['queryCountInThreeMonth']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['queryRecord']['queryCountInSix']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['queryRecord']['queryCount']}</Col>
              </Row>
              {/*总金额*/}
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['queryRecord']['querySumAmountInThreeMonth']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['queryRecord']['querySumAmountInSixMonth']}</Col>
                <Col  style={gridConStyle}>{arcreditInfoList['creditTransacte']['queryRecord']['querySumAmount']}</Col>
              </Row>
            </Col>
          </Row>
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>借款申请记录明细</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.loanApplicationList}
            dataSource={arcreditInfoList['loanApplicationList']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>正常还款账户明细</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.normalRepayList}
            dataSource={arcreditInfoList['normalRepayList']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>异常还款账户明细</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.abnormalRepayList}
            dataSource={arcreditInfoList['abnormalRepayList']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>查询记录明细</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.queryRecordList}
            dataSource={arcreditInfoList['queryRecordList']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>行业不良信息</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.industryInfoList}
            dataSource={arcreditInfoList['industryInfoList']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>本人异议申报明细</Divider>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.objectionDeclaratList}
            dataSource={arcreditInfoList['objectionDeclaratList']}
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