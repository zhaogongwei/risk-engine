import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  Modal,
  message,
  Icon,
  Card,
  Menu,
  Dropdown,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { findInArr,exportJudgment } from '@/utils/utils'
// 验证权限的组件
import FilterIpts from './FilterIpts';
import AddForm from './AddRole';


@connect(({ role, loading }) => ({
  role,
  loading: loading.effects['role/riskSubmit']
}))
export default class RoleManage extends PureComponent {
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
        title: '角色名称',
        dataIndex: 'oneclass',
        key:'oneclass'
      },
      {
        title: '角色说明',
        dataIndex: 'twoclass',
        key:'twoclass'
      },
      {
        title: '角色状态',
        key:'varname',
        dataIndex:'varname'
      },
      {
        title: '操作',
        key:'action',
        render: (record) =>{
          const action = (
            <Menu>
              <Menu.Item onClick={()=>this.addEdit(2,record)}>
                <Icon type="edit"/>修改
              </Menu.Item>
              <Menu.Item onClick={()=>this.deleteRole()}>
                <Icon type="delete"/>删除
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
      data:[
        {
          key:1,
          oneclass:'反欺诈',
          twoclass:'注册',
          varname:'注册时间',
          varcode:'变量代码',
          vartype:'变量类型',
          isenmu:'否',
          length:22,
          defVal:'男',
          max:88,
          min:11,
          enmuval:'男、女',
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1:添加 2：编辑
      pageSize:10,
      currPage:1,
      pageSize:1,
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
  onChange = (currPage,pageSize) => {
    this.setState({
      currPage,
      pageSize
    })
    this.change(currPage, pageSize)
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
      type: 'role/queryRoleList',
      payload: {
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
      isTrust:0,
    })
  }
  //授权事件
  empower=(status,record={})=>{
    this.setState({
      isTrust:status,
      visible:true,
      record:record
    },()=>{
    })
  }
  //删除角色
  deleteRole=async(type=1,record={})=>{
    const confirmVal = await Swal.fire({
      text: '确定要删除该角色吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){

    }
  }
  render() {
    return (
     <PageHeaderWrapper renderBtn={this.renderTitleBtn}>
         <Card
            bordered={false}
            title={'角色管理'}
         >

         </Card>
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
          current={this.state.currPage}
          total={100}
          onChange={this.onChange}
          showTotal={(total, range) => this.showTotal(total, range)}
        />
       <Modal
         title={this.state.isTrust===1?null:(this.state.type===1?'新增角色':'修改角色')}
         visible={this.state.visible}
         onOk={this.addFormSubmit}
         onCancel={()=>this.setState({visible:false})}
       >
         { this.state.visible ? <AddForm
           getSubKey={this.getSubKey}
           type={this.state.type}
           isTrust={this.state.isTrust}
           record={this.state.record}
         /> : null}
       </Modal>
      </PageHeaderWrapper>
    )
  }
}
