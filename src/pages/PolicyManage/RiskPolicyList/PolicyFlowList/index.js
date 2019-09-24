import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Menu,
  Dropdown,
  Icon,
  Card,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import Swal from 'sweetalert2';
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ policyFlowList, loading,editorFlow }) => ({
  policyFlowList,
  editorFlow,
  loading: loading.effects['policyFlowList/fetchFlowList']
}))
export default class PolicyFlowList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '策略类型',
        dataIndex: 'strategyTypeName',
        key:'strategyTypeName'
      },{
        title: '策略名称',
        dataIndex: 'strategyName',
        key:'strategyName'
      },{
        title: '策略流版本号',
        dataIndex: 'version',
        key:'version'
      },{
        title: '版本号描述',
        key:'remark',
        dataIndex:'remark'
      },{
        title: '更新时间',
        key:'updateTime',
        dataIndex:'updateTime'
      },{
          title: '状态',
          key:'status',
          dataIndex:'status',
          render:(record)=>record===1?'启用':'禁用'
        },{
        title: '负责人',
        key:'updateTrueName',
        dataIndex:'updateTrueName'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={()=>this.goEditPage(record,0)}>
                <Icon type="edit"/>编辑
              </Menu.Item>
              <Menu.Item onClick={()=>this.goPolicyTest(record)}>
                <Icon type="delete"/>测试
              </Menu.Item>
              <Menu.Item onClick={()=>this.isForbid(record)}>
                <Icon type="delete"/>{record.status===1?'禁用':'启用'}
              </Menu.Item>
            </Menu>
          )
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作<Icon type="down"/>
              </a>
            </Dropdown>
          )
        }
      }],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1:新增，0：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1
    };
  }
  async componentDidMount() {
    await this.props.dispatch({
      type: 'policyFlowList/saveQueryData',
      payload: {}
    })
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
    const {query} = this.props.location;
    const {queryData} = this.props.policyFlowList;
    this.setState({current:currPage})
    this.props.dispatch({
      type: 'policyFlowList/fetchFlowList',
      payload: {
        ...queryData,
        strategyId:query['id'],
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
  //去编辑策略流页面
  goEditPage=async (record,type)=>{
    if(record.status){
      const confirmVal = await Swal.fire({
        text: '启用状态的策略流无法编辑，请先禁用后再进行编辑！',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
    }else{
      router.push(`/policyManage/riskpolicylist/policyFlow/edit?flowId=${record.id}&strategyId=${record.strategyId}&type=${type}`)
    }
  }
  //去新增策略流页面
  goAddPage=async (strategyId,type)=>{
    //清空flowId,新增策略流页面
    this.props.dispatch({
      type: 'editorFlow/saveFlowId',
      payload:''
    })
    router.push(`/policyManage/riskpolicylist/policyFlow/edit?strategyId=${strategyId}&type=${type}`)
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
        <Button onClick={()=>this.goAddPage(query['id'],1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转策略测试模板
  goPolicyTest = (record) =>{
    router.push(`/policyManage/riskpolicylist/policyFlow/test?strategyId=${record.strategyId}&flowId=${record.id}`)
  }
  //启用/禁用
  isForbid=async(record)=>{
    const confirmVal = await Swal.fire({
      text: record.status===1?"禁用策略后符合该策略标签的资产可能无法进行风控！是否确认禁用该策略？":"启用该版本后其他版本将自动禁用,是否确认启用该策略？",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){
      const res = await  this.props.dispatch({
        type: 'policyFlowList/IsForbid',
        payload: {
          flowId:record.id,
          status:record.status?0:1,
        }
      })
      if(res&&res.status===1){
        message.success(res.statusDesc);
        this.change()
      }else{
        message.error(res.statusDesc)
      }
    }
  }
  render() {
    const {policyFlowList,formData} = this.props.policyFlowList
    const {current,total} = formData
    return (
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
         <Card
           bordered={false}
           title ={'策略流列表'}
         >
           <FilterIpts
             getSubKey={this.getSubKey}
             change={this.change}
             current={this.state.currentPage}
             changeDefault={this.changeDefault}
             location={this.props.location}
           />
           <Table
             bordered
             pagination={false}
             columns={this.state.columns}
             dataSource={policyFlowList}
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
      </PageHeaderWrapper>
    )
  }
}
