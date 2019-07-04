import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Icon
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'
import router from 'umi/router';

@connect(({ riskRptTem, loading }) => ({
  riskRptTem,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class RiskRepTem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '报告名称',
        dataIndex: 'rptname',
        key:'rptname'
      },{
        title: '创建时间',
        dataIndex: 'createtime',
        key:'createtime'
      },{
        title: '更新时间',
        key:'updatetime',
        dataIndex:'updatetime'
      },
        {
          title: '负责人',
          dataIndex: 'leader',
          key:'leader'
        },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <div style={{color:'#6BC7FF',cursor:'pointer'}}>
            <span>编辑</span>
            <span style={{paddingLeft:10,paddingRight:10}} onClick={this.goPreview}>查看</span>
            <span style={{paddingLeft:10,paddingRight:10}}>策略</span>
            <span>资产</span>
          </div>
        )
      }],
      data:[
        {
          key:1,
          rptname:'信用贷反风险报告',
          createtime:'2018-08-08',
          updatetime:'2018-08-08',
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
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //监听子组件数据变化
  handleChildChange = (newState)=>{
    this.setState({
      modalStatus:newState
    })
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
  //跳转编辑、新增页面
  goEditPage = ()=>{
    router.push({
      pathname:'/riskManage/riskrptem/list/edit',
    })
  }
  //跳转报告预览
  goPreview = ()=>{
    router.push({
      pathname:'/riskManage/riskrptem/list/preview'
    })
  }
  render() {
    return (
     <PageTableTitle title={'风控报告模板'} renderBtn={this.renderTitleBtn}>
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
          total={this.state.data.length}
          onChange={this.onChange}
          showTotal={(total, range) => this.showTotal(total, range)}
        />
      </PageTableTitle>
    )
  }
}
