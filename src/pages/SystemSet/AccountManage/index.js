import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  Modal,
  message,
  Icon
} from 'antd';
import DropdownDetail from '@/components/DropdownDetail/DropdownDetail'
import AddForm from './addForm';
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
        title: '用户名',
        dataIndex: 'username',
        key:'username'
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '邮箱',
        key:'email',
        dataIndex:'email'
      },
      {
        title: '手机号码',
        key:'mobile',
        dataIndex:'mobile'
      },
        {
          title: '添加时间',
          key:'addTime',
          dataIndex:'addTime'
        },
        {
          title: '用户状态',
          key:'status',
          dataIndex:'status'
        },
        {
          title: '角色',
          key:'role',
          dataIndex:'role'
        },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <div style={{color:'#6BC7FF',cursor:'pointer'}}>
            <span style={{marginRight:10}} onClick={()=>{this.goPolicyPower()}}>策略权限</span>
            <span style={{marginRight:10}} onClick={()=>{this.addEdit(2,record)}}>修改</span>
            <Popconfirm
              title="是否确认删除该账号？"
              onConfirm={this.confirm}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <span style={{paddingLeft:10,paddingRight:10}}>删除</span>
            </Popconfirm>
          </div>
        )
      }],
      data:[
        {
          key:1,
          username:'王德发',
          name:'王德发',
          email:'13636579254@163.com',
          mobile:13636579254,
          addTime:'20180716',
          status:'启用',
          role:'风控专员',
        }
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
  //去策略权限
  goPolicyPower = ()=>{
    router.push({
      pathname:'/systemSet/accountManage/policyPower',
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
    return (
     <PageTableTitle title={'账号管理'} renderBtn={this.renderTitleBtn}>
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
       <Modal
         title={this.state.type===1?'新增':'修改'}
         visible={this.state.visible}
         onOk={this.addFormSubmit}
         onCancel={()=>this.setState({visible:false})}
       >
         <AddForm
           getSubKey={this.getSubKey}
           type={this.state.type}
           isTrust={this.state.isTrust}
           record={this.state.record}
         />
       </Modal>
      </PageTableTitle>
    )
  }
}
