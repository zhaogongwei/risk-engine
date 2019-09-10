import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Swal from 'sweetalert2';
// 验证权限的组件
import permission from '@/utils/PermissionWrapper';
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@permission
@connect(({ reportList, loading }) => ({
  reportList,
  loading: loading.effects['reportList/riskSubmit']
}))
export default class ReportList extends PureComponent {
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
        title: '资产编号',
        dataIndex: 'assetsCode',
        key:'assetsCode'
      },
      {
        title: '策略名称',
        dataIndex: 'strategyName',
        key:'strategyName'
      },
      {
        title: '报告名称',
        key:'presentationName',
        dataIndex:'presentationName'
      },
      {
        title: '添加时间',
        key:'createTime',
        dataIndex:'createTime'
      },
      {
        title: '审核结果',
        key:'approvalResult',
        dataIndex:'approvalResult',
        render: record => {
          if(record -0 == 1){
            return '自动审核拒绝';
          }
          if(record - 0 == 2){
            return '自动审核通过';
          }
        }
      },
      {
        title: '报告状态',
        key:'status',
        dataIndex:'status',
        render: record => {
          if(record - 0 == 1) {
            return '初始';
          }
          if(record - 0 == 2) {
            return '生成中';
          }
          if(record - 0 == 3) {
            return '已生成';
          }
          if(record - 0 == 4) {
            return '异常';
          }
        }
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const {permission} = this.props;
          const actionA = (
            <Menu>
              {
                permission.includes('re:reportReturn:info')?
                <Menu.Item onClick={()=>this.goRiskReport(record.id)}>
                  <Icon type="edit"/>查看
                </Menu.Item>:null
              }
              {
                permission.includes('re:reportReturn:info')?
                <Menu.Item onClick={()=>this.goDataQuery(record)}>
                  <Icon type="delete"/>三方数据查询
                </Menu.Item>:null
              }
            </Menu>
          )
          const actionB = (
            <Menu>
              {
                permission.includes('re:reportReturn:update')?
                  <Menu.Item onClick={()=>this.updateStatus(record.id)}>
                    <Icon type="edit"/>更新状态
                  </Menu.Item>:null
              }
            </Menu>
          )
          return (
            <Dropdown overlay={record.status-0==4?actionB:actionA}>
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
      type:1,//1:添加 2：编辑
      pageSize:10,
      currPage:1,
      id:'',
      status:1
    };
  }
  componentDidMount() {
    const {query} = this.props.location;
    const {id,presentationName} = query;
    this.change(1,10,id)
  }
  //  分页器改变页数的时候执行的方法
  onChange = (currPage, pageSize) => {
    this.setState({
      currPage,
      pageSize
    })
    this.change(currPage,pageSize)
  }
  // 进入页面去请求页面数据
  change = async (currPage = 1, pageSize = 10,id) => {
    await this.props.dispatch({
      type: 'reportList/listData',
      payload: {
        ...this.props.reportList.queryConfig,
        templateId:id,
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
  //跳转编辑/新增页面
  goAddPage = (obj={})=>{
    //this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
    router.push({
      pathname:'/riskManage/varlist/editPage',
      state:obj
    })
  }
  //跳转三方数据查询
  goDataQuery = (record)=>{
    router.push(`/riskReport/reportList/list/queryData?id=${record.id}&assetsCode=${record.assetsCode}`)
  }
  //跳转报告模板
  goRiskReport = (id)=>{
    router.push(`/riskReport/reportList/list/check?id=${id}`)
  }
  //更新报告
  updateStatus=async (id)=>{
    const confirmVal = await Swal.fire({
      text: '确定要执行该操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){
      const res = await this.props.dispatch({
        type: 'reportList/updateStatus',
        payload: {
          id:id
        }
      })
      if(res&&res.status===1){
        this.change()
        message.success(res.statusDesc)
      }else{
        message.error(res.statusDesc)
      }
    }
  }
  render() {
    const { listData } = this.props.reportList;
    const {permission}=this.props;
    const {query}=this.props.location;
    const {id,presentationName} = query;
    return (
     <PageHeaderWrapper>
       {
         permission.includes('re:reportReturn:view')?
           <Card
             bordered={false}
             title={'风控报告列表'}
           >
             <FilterIpts
               getSubKey={this.getSubKey}
               change={this.change}
               pageSize={this.state.pageSize}
               presentationName={presentationName}
             />
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
           </Card>:null
       }
      </PageHeaderWrapper>
    )
  }
}
