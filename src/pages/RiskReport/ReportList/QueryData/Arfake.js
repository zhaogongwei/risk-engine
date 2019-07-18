import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Row,
  Col,
  Progress,
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

export default  class Arfake extends  PureComponent{
  constructor(props){
    super(props)
    this.state={
      currentime:'',
      idcardVerif:[
        {
          title: '姓名+身份证号认证查询结果',
          dataIndex: 'validIdentity',
          key:'validIdentity',
          className:'thead'
        },
        {
          title: '姓名+身份证号+银行卡号认证查询结果',
          dataIndex: 'validCard',
          key:'validCard',
          className:'thead'
        },
        {
          title: '累计被其他机构查询记录数',
          dataIndex: 'queryTimes',
          key:'queryTimes',
          className:'thead'
        },
      ],
      anti_fraud:[
        {
          title:'个人反欺诈命中',
          className:'thead',
          children:[
            {
              dataIndex:'antiFraudName',
              key:'antiFraudName',
            },
            {
              dataIndex:'antiFraudContent',
              key:'antiFraudContent'
            }
          ]
        }
      ],
      caseList:[
        {
          title:'ID号',
          dataIndex:'idNo',
          align:'center',
          key:'idNo',
          className:'thead'
        },
        {
          title:'姓名',
          dataIndex:'name',
          align:'center',
          key:'name',
          className:'thead'
        },
        {
          title:'身份证',
          dataIndex:'idCard',
          align:'center',
          key:'idCard',
          className:'thead'
        },
        {
          title:'性别',
          dataIndex:'sex',
          align:'center',
          key:'sex',
          className:'thead'
        },
        {
          title:'当事人类型',
          dataIndex:'partyType',
          align:'center',
          key:'partyType',
          className:'thead'
        },
        {
          title:'案列标题',
          dataIndex:'caseTitle',
          align:'center',
          key:'caseTitle',
          className:'thead'
        },
        {
          title:'案件类型',
          dataIndex:'caseType',
          align:'center',
          key:'caseType',
          className:'thead'
        },
        {
          title:'审结日期',
          dataIndex:'endDate',
          align:'center',
          key:'endDate',
          className:'thead'
        },
        {
          title:'案件字号',
          dataIndex:'caseNum',
          key:'caseNum',
          align:'center',
          className:'thead'
        }

      ],
      breakList:[
        {
          title:'执行法院',
          dataIndex:'implementCourt',
          key:'implementCourt',
          align:'center',
          className:'thead'
        },
        {
          title:'案号',
          dataIndex:'caseNo',
          key:'caseNo',
          align:'center',
          className:'thead'
        },
        {
          title:'省份',
          dataIndex:'province',
          key:'province',
          align:'center',
          className:'thead'
        },
        {
          title:'被执行人履行情况',
          dataIndex:'executorStatus',
          key:'executorStatus',
          align:'center',
          className:'thead'
        },
        {
          title:'失信被执行人行为具体情形',
          dataIndex:'jutiStatus',
          key:'jutiStatus',
          align:'center',
          className:'thead'
        },
        {
          title:'发布时间',
          dataIndex:'publicTime',
          key:'publicTime',
          align:'center',
          className:'thead'
        },
        {
          title:'立案时间',
          dataIndex:'filingTime',
          key:'filingTime',
          align:'center',
          className:'thead'
        },
      ],
      implementList:[
        {
          title:'执行法院',
          dataIndex:'implementCourt',
          key:'implementCourt',
          align:'center',
          className:'thead'
        },
        {
          title:'案号',
          dataIndex:'caseNo',
          key:'caseNo',
          align:'center',
          className:'thead'
        },
        {
          title:'案件状态',
          dataIndex:'caseStatus',
          key:'caseStatus',
          align:'center',
          className:'thead'
        },
        {
          title:'执行标的',
          dataIndex:'implementTaget',
          key:'implementTaget',
          align:'center',
          className:'thead'
        },
        {
          title:'立案时间',
          dataIndex:'filingTime',
          key:'filingTime',
          align:'center',
          className:'thead'
        },
      ],
      currentPage:1,
      visible:false,
    }

  }
  componentWillMount(){
  }
  componentDidMount(){
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryArDateList',
      payload: {
        ...propsData,
        creditInstCode:80000003,
        queryType:2
      },
      callback:(time)=>{
        this.checkRiskInfo(time)
      }
    })
    this.setState({
      currentime:this.props.auditAsset.dateList.length>0?this.props.auditAsset.dateList[0]['reportTime']:'',
      reportId:this.props.auditAsset.dateList.length>0?this.props.auditAsset.dateList[0]['id']:'',
    },()=>{
    })
  }
  componentWillUpdate(){
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
      if(this.props.auditAsset.arfakeDateList.length){
        return <a>{this.props.auditAsset.arcreditDateList[current-1]['reportTime']}</a>
      }else{
        return null
      }
    }
    return originalElement;
  }
  onChange=(current)=>{
    this.setState({
      currentime:this.props.auditAsset.arfakeDateList[current-1]['reportTime'],
      currentPage:current
    },()=>{
      this.checkRiskInfo(this.state.currentime)
    })
  }
  //更新风控报告信息
  updateRiskInfo=()=>{
    this.showModal()
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
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
  //风控信息查询
  checkRiskInfo = (time)=>{
    const propsData = this.props.location.state
    this.props.dispatch({
      type: 'auditAsset/queryArfakeInfo',
      data: {
        ...propsData,
        creditInstCode:80000003,
        reportTime:time,
      }
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
        queryType:2
      },
      callback:(time)=>{
        this.setState({
          currentPage:1
        })
        this.checkRiskInfo(time)
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
          reportFlag:5,
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
      width:'300px',
      height:'50px',
      lineHeight:'50px',
      textAlign: 'center',
      fontSize:'12px',
      borderBottom: '1px solid #ced3d4',
      borderLeft: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4'
    };
    const gridStyle2 = {
      width:'50%',
      height:'50px',
      lineHeight:'50px',
      textAlign: 'center',
      fontSize:'12px',
      backgroundColor:'#dbeef3',
      borderBottom: '1px solid #ced3d4',
      borderLeft: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4'
    };
    const titleStyle = {
      width:'200px',
      textAlign:'center',
      fontSize:'12px',
      height:'100px',
      lineHeight:'100px',
      backgroundColor:'#dbeef3',
      borderBottom: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4',
      borderLeft: '1px solid #ced3d4'
    }
    const constyle = {
      width:'300px',
      height:'50px',
      lineHeight:'50px',
      textAlign: 'center',
      fontSize:'12px',
      backgroundColor:'#fff',
      borderBottom: '1px solid #ced3d4',
      borderLeft: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4'
    }
    const constyle2 = {
      width:'50%',
      height:'50px',
      lineHeight:'50px',
      textAlign: 'center',
      fontSize:'12px',
      backgroundColor:'#fff',
      borderBottom: '1px solid #ced3d4',
      borderLeft: '1px solid #ced3d4',
      borderRight:'1px solid #ced3d4'
    }
    const {arfakeInfoList} = {...this.props.auditAsset}
    return(
      <PageTableTitle title={'风控报告'}>
        <Row type="flex" justify="center">
          <Pagination style={{zIndex:99}} defaultCurrent={1} current={this.state.currentPage} total={this.props.auditAsset.arfakeDateList.length*10} itemRender={this.itemRender} onChange={this.onChange}/>
        </Row>
        <Row type="flex" align="middle" justify="space-between" style={{paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,marginTop:10,background:'#dbeef3'}}>
          <Col>
            <span>报告编号</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{arfakeInfoList['reportCode']}</span>
          </Col>
          <Col>
            <span>报告时间</span>
            <span style={{display:'inline-block',width:10}}></span>
            <span>{arfakeInfoList['createTime']}</span>
          </Col>
          <Col>
            <span>操作人:{arfakeInfoList['createBy']}</span>
            <span style={{display:'inline-block',width:10}}></span>
            <Button type="primary" onClick={this.updateRiskInfo} style={{backgroundColor:'#AEAEAE',borderColor:'#AEAEAE'}}>更新数据</Button>
          </Col>
        </Row>
        <Row>
          <Divider>身份信息验证</Divider>
          <Table
            loading={this.props.loading}
            bordered
            pagination={false}
            columns={this.state.idcardVerif}
            dataSource={addListKey([arfakeInfoList['idcardVerif']?arfakeInfoList['idcardVerif']:{}])}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>民间信贷信息</Divider>
          <Row type="flex" gutter={16} style={{display:'flex',flexWrap:'noWrap',}}>
            <Col>
              <Row style={{textAlign: 'center',fontSize:'12px',lineHeight:'50px',backgroundColor:'#dbeef3',border: '1px solid #ced3d4',}}>多重风险</Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={titleStyle}>多重申请</Col>
                <Col>
                  <Row style={gridStyle}>申请笔数</Row>
                  <Row style={gridStyle}>申请总金额区间</Row>
                </Col>
                <Col>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspApplyCount']:null}</Row>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspApplyMoney']:null}</Row>
                </Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={titleStyle}>已结清合同</Col>
                <Col>
                  <Row style={gridStyle}>已结清笔数</Row>
                  <Row style={gridStyle}>已结清合同总金额区间</Row>
                </Col>
                <Col>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspEndContractCount']:null}</Row>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspEndContractMoney']:null}</Row>
                </Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={titleStyle}>未结清负债</Col>
                <Col>
                  <Row style={gridStyle}>未结清笔数</Row>
                  <Row style={gridStyle}>未结清合同总金额区间</Row>
                </Col>
                <Col>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspContractCount']:null}</Row>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspContractMoney']:null}</Row>
                </Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={titleStyle}>违约风险</Col>
                <Col>
                  <Row style={gridStyle}>违约笔数</Row>
                  <Row style={gridStyle}>违约风险总金额区间</Row>
                </Col>
                <Col>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspBlacklistCount']:null}</Row>
                  <Row style={constyle}>{arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspBlacklistMoney']:null}</Row>
                </Col>
              </Row>
              <Row style={{paddingLeft:'70px',backgroundColor:'#fff',fontSize:'12px',borderBottom: '1px solid #ced3d4',borderRight: '1px solid #ced3d4', borderLeft: '1px solid #ced3d4'}}>
                <h3>说明 :</h3>
                <p>1. 笔数: 一笔为存在,两笔及以上为多笔;</p>
                <p>2. 总金额区间:3万以下,3-5万,5-10万,10万以上;</p>
              </Row>
            </Col>
            <Col style={{flexGrow:1}}>
              <Row style={{textAlign: 'center',fontSize:'12px',lineHeight:'50px',backgroundColor:'#dbeef3',border: '1px solid #ced3d4',}}>民间信贷交易行为评分</Row>
              <Row type="flex" style={{flexWrap:'noWrap',justifyContent:'center',padding:'15px 0',borderRight:'1px solid #ced3d4',borderLeft:'1px solid #ced3d4',}}>
                  <Progress type="circle" percent={parseInt(arfakeInfoList['nongovCredit']?arfakeInfoList['nongovCredit']['mspScore']:'0')} format={percent => `${percent} 分`}
                    strokeColor="#76c5d3"/>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={gridStyle2}>分数区间</Col>
                <Col style={gridStyle2}>释义</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={constyle2}>0分以上,60分以下</Col>
                <Col style={constyle2}>有违约信息</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={constyle2}>60分以上,80分以下</Col>
                <Col style={constyle2}>有放款记录,无违约信息</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={constyle2}>80分以上,100分以下</Col>
                <Col style={constyle2}>只有申请信息</Col>
              </Row>
              <Row type="flex" style={{flexWrap:'noWrap'}}>
                <Col style={constyle2}>NR</Col>
                <Col style={constyle2}>无信贷交易信息</Col>
              </Row>
              <Row style={{paddingLeft:'70px',backgroundColor:'#fff',fontSize:'12px',borderBottom: '1px solid #ced3d4',borderRight: '1px solid #ced3d4', borderLeft: '1px solid #ced3d4'}}>
                <h3>说明 :</h3>
                <p>1.行为分仅反映借款人的申请、放款、违约等的交易行为,与传统信用分的含义不同。</p>
                <p>2.同一分数区间中,分数越接近下限,代表笔数金额越大。</p>
              </Row>
            </Col>
          </Row>
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Table
            loading={this.props.loading}
            bordered={false}
            pagination={false}
            columns={this.state.anti_fraud}
            dataSource={arfakeInfoList['antiFraud']}
          />
        </Row>
        <Row style={{height:40}}></Row>
        <Row>
          <Divider>司法信息</Divider>
        </Row>
        <Row>
          <Col style={{display:'inline-block',padding:'0 16px',lineHeight:'30px',fontSize:'12px',fontWeight:'700',backgroundColor:'#dbeef3',marginBottom:'5px',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',}}>
            案列信息
          </Col>
          <Col style={{marginBottom:'10px'}}>
            <Table
              loading={this.props.loading}
              bordered={false}
              pagination={false}
              columns={this.state.caseList}
              dataSource={arfakeInfoList['judicialInfo']['caseList']}
            />
          </Col>
        </Row>
        <Row>
          <Col style={{display:'inline-block',padding:'0 16px',lineHeight:'30px',fontSize:'12px',fontWeight:'700',backgroundColor:'#dbeef3',marginBottom:'5px',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',}}>
            失信信息
          </Col>
          <Col style={{marginBottom:'10px'}}>
            <Table
              loading={this.props.loading}
              bordered={false}
              pagination={false}
              columns={this.state.breakList }
              dataSource={arfakeInfoList['judicialInfo']['breakList']}
            />
          </Col>
        </Row>
        <Row>
          <Col style={{display:'inline-block',padding:'0 16px',lineHeight:'30px',fontSize:'12px',fontWeight:'700',backgroundColor:'#dbeef3',marginBottom:'5px',borderTopLeftRadius:'10px',borderTopRightRadius:'10px',}}>
            执行信息
          </Col>
          <Col>
            <Table
              loading={this.props.loading}
              bordered={false}
              pagination={false}
              columns={this.state.implementList}
              dataSource={arfakeInfoList['judicialInfo']['implementList']}
            />
          </Col>
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