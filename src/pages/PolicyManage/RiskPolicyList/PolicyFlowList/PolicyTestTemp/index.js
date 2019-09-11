import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Icon,
  Card
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'
@connect(({ policyTestTemp, loading }) => ({
  policyTestTemp,
  loading: loading.effects['policyTestTemp/fetchTestTempList']
}))
export default class PolicyTestTemp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '策略名称',
        dataIndex: 'strategyName',
        key:'strategyName'
      },{
        title: '模板名称',
        key:'templateName',
        dataIndex:'templateName'
      },{
        title: '负责人',
        key:'updateTrueName',
        dataIndex:'updateTrueName'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <div style={{color:'#6BC7FF',cursor:'pointer'}}>
            <span style={{paddingLeft:10,paddingRight:10}} onClick={()=>this.goTest(record.strategyId,record.flowId,record.id,0)}>测试</span>
          </div>
        )
      }],
      data:[
        {
          key:1,
          policyType:'主策略',
          policyName:'信贷最牛策略',
          policyCode:'best',
          policyExplain:'适用于信用贷',
          outreport:'信用贷最牛报告',
          status:'启用',
          leader:'王大大',
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1:新增，2：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'policyTestTemp/saveQueryData',
      payload: {}
    })
    const {formData} = this.props.policyTestTemp;
    const {current} = formData;
    this.change(current);
    //请求用户列表
    this.props.dispatch({
      type: 'policyTestTemp/fetchUserList',
      payload: {}
    })
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    const {query} = this.props.location;
    const {queryData} = this.props.policyTestTemp;
    this.props.dispatch({
      type: 'policyTestTemp/fetchTestTempList',
      payload: {
        ...queryData,
        ...query,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //查询时改变默认页数
  changeDefault=(value)=>{
    this.setState({
      current:value
    })
  }
  //右上角渲染
  renderTitleBtn = () => {
    const {query} = this.props.location;
    return (
      <Fragment>
        <Button onClick={()=>this.goAddTest(query['strategyId'],query['flowId'],1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = ()=>{
    this.props.dispatch(routerRedux.push({pathname:'/info/RiskManagement/PolicyList'}))
  }
  //跳转到测试
  goTest = (strategyId,flowId,id='',type) =>{
    router.push(`/policyManage/riskpolicylist/policyFlow/test/add?strategyId=${strategyId}&flowId=${flowId}&id=${id}&type=${type}`)
  }
  //跳转到新增页面
  goAddTest = (strategyId,flowId,type) =>{
    router.push(`/policyManage/riskpolicylist/policyFlow/test/add?strategyId=${strategyId}&flowId=${flowId}&type=${type}`)
  }
  render() {
    const {tempList,formData} = this.props.policyTestTemp;
    const {current,total} = formData
    return (
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
         <Card
           bordered={false}
           title={'策略流测试模板'}
         >
           <FilterIpts
             getSubKey={this.getSubKey}
             change={this.change}
             current={this.state.currentPage}
             changeDefault={this.changeDefault}
           />
           <Table
             bordered
             pagination={false}
             columns={this.state.columns}
             dataSource={tempList}
             loading={this.props.loading}
           />
           <Pagination
             style={{ marginBottom: "50px" }}
             showQuickJumper
             defaultCurrent={1}
             current={current}
             total={total}
             onChange={this.onChange}
             showTotal={(total, range) => this.showTotal(total, range)}
           />
         </Card>
       }
      </PageHeaderWrapper>
    )
  }
}
