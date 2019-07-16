import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Icon
} from 'antd';
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
        title: '一级分类',
        dataIndex: 'oneclass',
        key:'oneclass'
      },
      {
        title: '二级分类',
        dataIndex: 'twoclass',
        key:'twoclass'
      },
      {
        title: '变量名',
        key:'varname',
        dataIndex:'varname'
      },
      {
        title: '变量代码',
        key:'varcode',
        dataIndex:'varcode'
      },
      {
        title: '变量类型',
        key:'vartype',
        dataIndex:'vartype'
      },
      {
        title: '是否枚举',
        key:'isenmu',
        dataIndex:'isenmu'
      },
      {
        title: '长度',
        key:'length',
        dataIndex:'length'
      },
      {
        title: '缺省值',
        key:'defVal',
        dataIndex:'defVal'
      },
      {
        title: '最大值',
        key:'max',
        dataIndex:'max'
      },
      {
        title: '最小值',
        key:'min',
        dataIndex:'min'
      },
      {
        title: '枚举值',
        key:'enmuval',
        dataIndex:'enmuval'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <div style={{color:'#6BC7FF',cursor:'pointer'}}>
            <span onClick={()=>this.goAddPage({...record,type:2})}>编辑</span>
            <Popconfirm
              title="是否确认删除该变量？"
              onConfirm={this.confirm}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <span style={{paddingLeft:10,paddingRight:10}}>删除</span>
            </Popconfirm>
            <span onClick={()=>{this.goPolicyList()}}>应用策略</span>
          </div>
        )
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
        <Button onClick={()=>this.goAddPage({type:1})}><Icon type="plus" theme="outlined" />新增</Button>
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
  //去风控策略列表
  goPolicyList = ()=>{
    router.push({
      pathname:'/varManage/riskpolicylist/list',
    })
  }
  render() {
    return (
     <PageTableTitle title={'变量列表'} renderBtn={this.renderTitleBtn}>
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
      </PageTableTitle>
    )
  }
}