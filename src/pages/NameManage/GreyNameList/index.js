import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Menu,
  Dropdown,
  Popconfirm,
  message,
  Icon,
  Card,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Swal from 'sweetalert2';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ greyName, loading }) => ({
  greyName,
  loading: loading.effects['greyName/fetchGreyNameList']
}))
export default class GreyNameList extends PureComponent {
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
        dataIndex: 'idcard',
        key:'idcard'
      },
      {
        title: '灰名单来源',
        key:'greyDescribe',
        dataIndex:'greyDescribe'
      },
      {
        title: '性别',
        key:'sex',
        dataIndex:'sex',
        render: record => record == 1 ? '男' : (record == 2 ? '女' : record == 0 && '未知')
      },
      {
        title: '手机号',
        key:'mobile',
        dataIndex:'mobile'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: record => record == 0 ? '启用' : '禁用'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={()=>this.isForbid()}>
                <Icon type="edit"/>{record.status===1?'禁用':'启用'}
              </Menu.Item>
              <Menu.Item onClick={()=>this.handleInBlack()}>
                <Icon type="delete"/>拉黑
              </Menu.Item>
              <Menu.Item onClick={()=>this.delName()}>
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
      status:1
    };
  }
  componentDidMount() {
    this.change()
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    console.log(current, 'change')
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'greyName/fetchGreyNameList',
      payload: {
        ...this.props.greyName.queryData,
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
        <Button onClick={()=>this.goAddPage({type:1})}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //启用/禁用
  isForbid=async(record)=>{
    const confirmVal = await Swal.fire({
      text: '确定要执行该操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){

    }
  }
  //删除灰名单
  delName=async(record)=>{
    const confirmVal = await Swal.fire({
      text: '确定要执行该操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){

    }
  }
  //拉黑
  handleInBlack=async(record)=>{
    const confirmVal = await Swal.fire({
      text: '确定要执行该操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){

    }
  }
  //跳转编辑/新增页面
  goAddPage = (obj={})=>{
    //this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
    router.push({
      pathname:'/varManage/varlist/editPage',
      state:obj
    })
  }
  render() {
    const { greyNameList, total } = this.props.greyName
    return (
     <PageHeaderWrapper>
       <Card
         bordered={false}
         title={'本地灰名单库'}
       >
         <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
         <Table
           bordered
           pagination={false}
           columns={this.state.columns}
           dataSource={greyNameList}
           loading={this.props.loading}
         />
         <Pagination
           style={{ marginBottom: "50px" }}
           showQuickJumper
           defaultCurrent={1}
           current={this.state.current}
           total={total}
           onChange={this.onChange}
           showTotal={(total, range) => this.showTotal(total, range)}
         />
       </Card>
      </PageHeaderWrapper>
    )
  }
}
