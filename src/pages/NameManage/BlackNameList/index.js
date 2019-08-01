import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Swal from 'sweetalert2'
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Icon,
  Card,
  Menu,
  Dropdown,
  Modal,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import AddForm from './addForm';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ assetDeploy, loading }) => ({
  assetDeploy,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class BlackNameList extends PureComponent {
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
        title: '姓名',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '身份证号',
        dataIndex: 'idCard',
        key:'idCard'
      },
      {
        title: '灰名单来源',
        key:'source',
        dataIndex:'source'
      },
      {
        title: '性别',
        key:'sex',
        dataIndex:'sex'
      },
      {
        title: '手机号',
        key:'phone',
        dataIndex:'phone'
      },
      {
        title: '状态',
        key:'status',
        dataIndex:'status',
        render:(record)=>record==1?'启用':'禁用'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={() => this.isForbid()}>
                <Icon type="edit"/>{record.status===1?'禁用':'启用'}
              </Menu.Item>
              <Menu.Item onClick={()=>this.deleteName()}>
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
          name:'张三',
          idCard:'160145236545632654569',
          source:'壹钱包逾期',
          sex:'男',
          phone:13333333333,
          status:0,
        },
        {
          key:2,
          name:'张三',
          idCard:'160145236545632654569',
          source:'壹钱包逾期',
          sex:'男',
          phone:13333333333,
          status:1,
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
      visible:false
    };
  }
  componentDidMount() {
    //this.change()
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
        <Button onClick={()=>this.setState({visible:true})}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = (obj={})=>{
    //this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
    router.push({
      pathname:'/varManage/varlist/editPage',
      state:obj
    })
  }
  //启用/禁用
  isForbid=async() => {
    const confirm = await Swal({
      text: '确定要执行本次操作吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirm.value) {
      // 请求开启/停用方法

    }
  }
  deleteName=async(record)=>{
    const confirm = await Swal({
      text: '确定要执行本次操作吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirm.value) {
      // 请求开启/停用方法

    }
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
  render() {
    return (
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
       <Card
         bordered={false}
         title={'本地黑名单库'}
         >
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
           title={'新增'}
           visible={this.state.visible}
           onOk={this.addFormSubmit}
           onCancel={()=>this.setState({visible:false})}
         >
         <AddForm
           getSubKey={this.getSubKey}
         />
         </Modal>
       </Card>
      </PageHeaderWrapper>
    )
  }
}
