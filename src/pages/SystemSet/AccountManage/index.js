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
import permission from '@/utils/PermissionWrapper';
import { findInArr,exportJudgment } from '@/utils/utils'

@permission
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
      },{
        title: '用户名',
        dataIndex: 'userName',
        key:'userName'
      },{
        title: '姓名',
        dataIndex: 'trueName',
        key:'trueName'
      },{
        title: '邮箱',
        key:'email',
        dataIndex:'email'
      },
      {
        title: '手机号码',
        key:'mobile',
        dataIndex:'mobile'
      },{
        title: '添加时间',
        key:'createTime',
        dataIndex:'createTime'
      },{
        title: '用户状态',
        key:'statusName',
        dataIndex:'statusName'
      },{
        title: '角色',
        key:'roleName',
        dataIndex:'roleName'
      },{
        title: '操作',
        key:'action',
        render: (record) => {
          const {permission} = this.props;
          const action = (
            <Menu>
              {/* <Menu.Item onClick={()=>{this.goPolicyPower()}}>
                <Icon type="edit"/>策略权限
              </Menu.Item> */}
              {
                permission.includes('re:merchantUser:update')?
                <Menu.Item onClick={()=>{ this.addEdit(true,2,record) }}>
                  <Icon type="edit"/>编辑
                </Menu.Item>:null
              }
              {
                permission.includes('re:merchantUser:delete')?
                <Menu.Item onClick={()=>this.deleteAccount(record)}>
                  <Icon type="delete"/>删除
                </Menu.Item>:null
              }
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
      type: 'account/fetchList',
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
    const {permission} = this.props
    return (
      <Fragment>
        {
          permission.includes('re:merchantUser:add')?
            <Button onClick={()=>this.addEdit(true, 1)}>
              <Icon type="plus" theme="outlined" />新增
            </Button>:null
        }
        {
          permission.includes('re:merchantUser:export')?
            <Button onClick={()=>this.exportList()}>
              <Icon type="export" />导出列表
            </Button>:null
        }
      </Fragment>
    )
  }
  
  //导出列表
  exportList = async() => {
    const formData = await this.child.getFormValue();
    const { dispatch } = this.props;
    dispatch({
      type: 'account/exportFile',
      payload: {
        ...formData
      }
    })
  }

  //弹框点击确定事件
  addFormSubmit=async ()=>{
    const response = this.addForm.submitHandler();
    if(response && response.status === '000'){
      this.setState({
        visible:false
      })
    }
  }
  //添加、编辑事件
  addEdit= async(flag, type, record = {}) => {
    if(type == 2) {
      const { dispatch } = this.props;
      dispatch({
        type: 'account/editAccount',
        payload: {
          id: record.id
        }
      })
    }
    this.setState({
      modalVisible: !!flag,
      type,
      id: record.id
    })
  }
  //删除账号
  deleteAccount = async(record)=>{
    const confirmVal = await Swal.fire({
      text: '确定要删除该账号吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){
      new Promise(async(resolve, reject) => {
        // 请求方法
        const { dispatch } =  this.props;
        let res = await dispatch({
          type: 'account/delAccount',
          payload: {
            id: record.id
          }
        })
        if(res && res.status === 1) {
          message.success(res.statusDesc);
          let listData = this.props.account.listData
          resolve(listData)
        }else {
          message.error(res.statusDesc);
        }
      }).then((listData)=>{
        if(listData.records.length === 1 && this.state.currPage !== 1) {
          this.change(--this.state.currPage, this.state.pageSize);
        }else {
          this.change(this.state.currPage, this.state.pageSize);
        }
      })
    }
  }
  render() {
    const { listData } = this.props.account
    const modalParams = {
      type: this.state.type,
      id: this.state.id,
      modalVisible: this.state.modalVisible,
      addEdit: this.addEdit,
      change: this.change,
      currPage: this.state.currPage,
      pageSize: this.state.pageSize
    }
    const {permission} = this.props
    return (
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
       {
         permission.includes('re:merchantUser:view')?
           <Card
             bordered={false}
             title={'账号管理'}
           >
             <FilterIpts getSubKey={this.getSubKey} change={this.change} pageSize={this.state.pageSize}/>
             <Table
               bordered
               pagination={false}
               columns={this.state.columns}
               dataSource={listData.records}
               loading={this.props.loading}
             />
             <Pagination
               style={{ marginBottom: "50px" }}
               showQuickJumper
               defaultCurrent={1}
               current={this.state.currPage}
               total={listData.total}
               onChange={this.onChange}
               showTotal={(total, range) => this.showTotal(total, range)}
             />
               {
                 this.state.modalVisible ? <AddForm {...modalParams} /> : null
               }
           </Card>:null
       }
      </PageHeaderWrapper>
    )
  }
}
