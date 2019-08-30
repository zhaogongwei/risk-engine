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
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

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
        dataIndex: 'oneclass',
        key:'oneclass'
      },
      {
        title: '策略名称',
        dataIndex: 'twoclass',
        key:'twoclass'
      },
      {
        title: '报告名称',
        key:'varname',
        dataIndex:'varname'
      },
      {
        title: '添加时间',
        key:'varcode',
        dataIndex:'varcode'
      },
      {
        title: '审核结果',
        key:'vartype',
        dataIndex:'vartype'
      },
      {
        title: '报告状态',
        key:'dfa',
        dataIndex:'fkdf'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={()=>this.goRiskReport()}>
                <Icon type="edit"/>查看
              </Menu.Item>
              <Menu.Item onClick={()=>this.goRiskReport()}>
                <Icon type="delete"/>三方数据查询
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
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = async (currPage = 1, pageSize = 10) => {
    let formData ;
    if(this.child){
      formData = this.child.getFormValue()
    }else{
      formData = {}
    }
    await this.props.dispatch({
      type: 'reportList/listData',
      payload: {
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
        <Button onClick={()=>this.goAddPage({type:1})}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
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
  goDataQuery = ()=>{
    router.push({
      pathname:'/riskReport/reportList/queryData',
    })
  }
  //跳转报告模板
  goRiskReport = ()=>{
    router.push({
      pathname:'/riskReport/reportList/mould/preview',
    })
  }
  render() {
    const { listData } = this.props.reportList;
    return (
     <PageHeaderWrapper>
       <Card
        bordered={false}
        title={'风控报告列表'}
       >
         <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
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
           current={this.state.current}
           total={100}
           onChange={this.onChange}
           showTotal={(total, range) => this.showTotal(total, range)}
         />
       </Card>
      </PageHeaderWrapper>
    )
  }
}
