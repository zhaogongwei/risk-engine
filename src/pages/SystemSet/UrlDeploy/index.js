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
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Swal from 'sweetalert2'
// 验证权限的组件
import AddForm from './addForm';
import DropdownDetail from '@/components/DropdownDetail/DropdownDetail'
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
        title: '接口名称',
        dataIndex: 'urlName',
        key:'urlName'
      },
      {
        title: '异步通知地址',
        dataIndex: 'asyncNoticeUrl',
        key:'asyncNoticeUrl'
      },
      {
        title: '同步跳转地址',
        key:'syncSkipUrl',
        dataIndex:'syncSkipUrl'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const linkArr = [
            {
              label: '修改',
              show: true,
              clickHandler: () => {
                this.addEditPage(2)
              }
            },
            {
              label: '删除',
              show: true,
              clickHandler: async() => {
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
            },
          ];
          return <DropdownDetail linkArr={linkArr}></DropdownDetail>
        }
      }
      ],
      data:[
        {
          key:1,
          urlName:'数据报送',
          name:'王晓东',
          acMenu:'角色管理',
          acData:'修改了角色：管理员-->超级管理员',
          acType:'修改',
          acTime:'2018-09-10',
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
        <Button onClick={()=>this.addEditPage(1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  addEditPage=(type)=>{
    this.setState({
      type:type,
      visible:true,
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
  render() {
    return (
     <PageTableTitle title={'接口配置'} renderBtn={this.renderTitleBtn}>
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
           record={this.state.record}
         />
       </Modal>
      </PageTableTitle>
    )
  }
}
