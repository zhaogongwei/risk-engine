import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Modal,
  Icon,
  Card,
  Menu,
  Dropdown,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'
import router from 'umi/router';
import Swal from 'sweetalert2';

@connect(({ risklabel, loading }) => ({
  risklabel,
  loading: loading.effects['risklabel/fetchRiskLabelList']
}))
export default class RiskLabel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '标签名称',
        dataIndex: 'labelName',
        key:'labelName'
      },
        {
          title:'标签内容',
          dataIndex:'labelCont',
          key:'labelCont'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key:'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key:'updateTime'
        },
        {
          title: '负责人',
          dataIndex: 'responser',
          key:'responser'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key:'status'
        },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={() => this.goAddEdit(2)}>
                <Icon type="edit"/>编辑
              </Menu.Item>
              <Menu.Item onClick={() => this.delLabel()}>
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
          labelName:'壹钱包房抵贷',
          labelCont:'<资产来源：极速云> <资产类型：个人经营贷><期限：12月>',
          createTime:'2018-06-06',
          updateTime:'2018-06-06',
          responser:'王大大',
          status:'启用',
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1：新增，2：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      visible:false
    };
  }
  componentDidMount() {
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
      type: 'risklabel/fetchRiskLabelList',
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
        <Button onClick={()=>this.goAddEdit(1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转新增/编辑页面
  goAddEdit=(type)=>{
    router.push({
      pathname:'/policyManage/riskpolicylist/risklabel/edit',
      query:{
        type:type,
      }
    })
  }
  //删除标签
  delLabel=async (record)=>{
    const confirmVal = await Swal.fire({
      text: '删除后可能导致符合该标签的资产无法匹配策略是否确认删除该标签?',
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
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
       <Card bordered={false}>
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
           total={20}
           onChange={this.onChange}
           showTotal={(total, range) => this.showTotal(total, range)}
         />
       </Card>
      </PageHeaderWrapper>
    )
  }
}
