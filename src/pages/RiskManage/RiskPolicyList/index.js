import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Icon
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ assetDeploy, loading }) => ({
  assetDeploy,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class PolicyList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '策略类型',
        dataIndex: 'policyType',
        key:'policyType'
      },{
        title: '策略名称',
        dataIndex: 'policyName',
        key:'policyName'
      },{
        title: '策略代码',
        key:'policyCode',
        dataIndex:'policyCode'
      },{
        title: '策略说明',
        key:'policyExplain',
        dataIndex:'policyExplain'
      },{
        title: '输出报告',
        key:'outreport',
        dataIndex:'outreport'
      },{
        title: '状态',
        key:'status',
        dataIndex:'status'
      },{
        title: '负责人',
        key:'leader',
        dataIndex:'leader'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <div style={{color:'#6BC7FF',cursor:'pointer'}}>
            <Popconfirm
              title="是否确认禁用该策略？"
              onConfirm={this.confirm}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <span style={{paddingLeft:10,paddingRight:10}}>禁用</span>
            </Popconfirm>
            <span style={{paddingLeft:10,paddingRight:10}} onClick={this.goLabel}>标签</span>
            <span style={{paddingLeft:10,paddingRight:10}}>编辑</span>
            <span>策略流</span>
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
      type:true,
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1
    };
  }
  componentDidMount() {
    this.change()
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
    let formData ;
    if(this.child){
      formData = this.child.getFormValue()
    }else{
      formData = {}
    }
    this.props.dispatch({
      type: 'assetDeploy/riskSubmit',
      data: {
        ...formData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  confirm=(e)=>{
    console.log(e);
    message.success('Click on Yes');
  }

  cancel=(e) =>{
    console.log(e);
    message.error('Click on No');
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //去编辑页面
  goEditPage=()=>{
    router.push('/riskManage/riskpolicylist/list/edit')
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
    return (
      <Fragment>
        <Button onClick={this.goEditPage}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = ()=>{
    this.props.dispatch(routerRedux.push({pathname:'/info/RiskManagement/PolicyList'}))
  }
  //跳转风控标签页面
  goLabel = () =>{
    this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/PolicyList/RiskLabel'}))
  }
  render() {
    return (
     <PageTableTitle title={'风控策略列表'} renderBtn={this.renderTitleBtn}>
        <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
        <Table
          bordered
          pagination={false}
          columns={this.state.columns}
          dataSource={this.state.data}
          loading={this.props.loading}
        />
        <Pagination
          style={{ marginBottom: "50px" }}
          showQuickJumper
          defaultCurrent={1}
          current={this.state.current}
          total={100}
          onChange={this.onChange}
          showTotal={(total, range) => this.showTotal(total, range)}
        />
      </PageTableTitle>
    )
  }
}
