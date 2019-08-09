import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  Modal,
  message,
  Menu,
  Dropdown,
  Icon,
  Card,
} from 'antd';
import AddForm from './addForm';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/fetchAccountList']
}))
export default class AccountManage extends PureComponent {
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
        render: (record) => {
          const action = (
            <Menu>
              {/* <Menu.Item onClick={()=>{this.goPolicyPower()}}>
                <Icon type="edit"/>策略权限
              </Menu.Item> */}
              <Menu.Item onClick={()=>{this.addEdit(2,record)}}>
                <Icon type="edit"/>编辑
              </Menu.Item>
              <Menu.Item onClick={()=>this.deleteAccount()}>
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
          username:'王德发',
          name:'王德发',
          email:'13636579254@163.com',
          mobile:13636579254,
          addTime:'20180716',
          status:'启用',
          role:'风控专员',
        }
      ],
      type:1,//1:添加 2：编辑
      pageSize:10,
      currPage:1,
      modalVisible:false
    };
  }
  componentDidMount() {
    this.change()
  }
  //  分页器改变页数的时候执行的方法
  onChange = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize
    })
    this.change(currPage, pageSize)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'account/fetchAccountList',
      payload: {
        ...this.props.account.queryConfig,
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
  //右上角渲染
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={()=>this.addEdit(true, 1)}><Icon type="plus" theme="outlined" />新增</Button>
        <Button><Icon type="export" />导出列表</Button>
      </Fragment>
    )
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
  addEdit=(flag, type, record = {})=>{
    this.setState({
      modalVisible: !!flag,
      type
    })
  }
  //删除账号
  deleteAccount=async(type=1,record={})=>{
    const confirmVal = await Swal.fire({
      text: '确定要删除该账号吗？',
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
    const modalParams = {
      type: this.state.type,
      modalVisible: this.state.modalVisible,
      addEdit: this.addEdit
    }
    return (
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
       <Card
        bordered={false}
        title={'账号管理'}
       >
         <FilterIpts getSubKey={this.getSubKey} change={this.change} pageSize={this.state.pageSize}/>
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
         {
           this.state.modalVisible ? <AddForm {...modalParams} /> : null
         }
       </Card>
      </PageHeaderWrapper>
    )
  }
}
