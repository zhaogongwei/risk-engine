import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  Modal,
  message,
  Icon,
  Row,
  Col,
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
export default class VarList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
      {
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },
      {
        title: '策略类型',
        dataIndex: 'policyType',
        key:'policyType'
      },
      {
        title: '策略名称',
        dataIndex: 'policyName',
        key:'policyName'
      },
      {
        title: '策略代码',
        key:'policyCode',
        dataIndex:'policyCode'
      },
      {
        title: '当前负责人',
        key:'leader',
        dataIndex:'leader'
      },
        {
          title: '授权状态',
          key:'status',
          dataIndex:'status',
          render:(record)=>record?'已授权':'未授权'
        },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <div style={{color:'#6BC7FF',cursor:'pointer'}}>
            <span style={{marginRight:10}}>{record.status?'取消授权':'授权'}</span>
          </div>
        )
      }],
      data:[
        {
          key:1,
          policyType:'主策略',
          policyName:'信贷最牛策略',
          policyCode:'best',
          leader:'王大大',
          status:1,
        },
        {
          key:2,
          policyType:'主策略',
          policyName:'信贷最牛策略',
          policyCode:'best',
          leader:'王大大',
          status:0,
        },
        {
          key:3,
          policyType:'主策略',
          policyName:'信贷最牛策略',
          policyCode:'best',
          leader:'王大大',
          status:0,
        },
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1:添加 2：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      record:{},
      visible:false,
      isTrust:0,//授权状态框显示状态
      selectedRowKeys:[],//table选中数据
    };
  }
  componentDidMount() {
    this.change()
  }
  //table单选触发函数
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
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
        <Button onClick={()=>this.addEdit(1)}><Icon type="plus" theme="outlined" />新增</Button>
        <Button><Icon type="export" />导出列表</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = (obj={})=>{
    //this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
    router.push({
      pathname:'/riskReport/reportList/mould/edit',
      state:obj
    })
  }
  //去报告预览
  goPreview=()=>{
    router.push({
      pathname:'/riskReport/reportList/mould/preview',
    })
  }
  //去风控策略列表
  goPolicyList = ()=>{
    router.push({
      pathname:'/riskManage/riskpolicylist/list',
    })
  }
  //弹框点击确定事件
  addFormSubmit=async ()=>{
    const response = this.addForm.submitHandler();
    if(response&&response.status === '000'){
      this.setState({
        visible:false
      })
    }
  }
  //添加、编辑事件
  addEdit=(type,record={})=>{
    this.setState({
      visible:true,
      type:type,
      record:record,
    })
  }
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.onSelectChange,
      selections:[
        {
          key:'batch-empower',
          text:'批量授权',
          onSelect:()=>{

          }
        },
        {
          key:'cancel-empower',
          text:'批量取消授权',
          onSelect:()=>{

          }
        }
      ]
    };
    return (
     <PageTableTitle title={'策略权限'}>
        <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
       <Row>
         <Col style={{lineHeight:'40px'}}>当前授权人:王笑笑</Col>
       </Row>
       <Row>
         <Table
           rowSelection={rowSelection}
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
       </Row>
      </PageTableTitle>
    )
  }
}
