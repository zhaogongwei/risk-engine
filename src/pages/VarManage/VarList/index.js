import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
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
import Swal from 'sweetalert2'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ varlist, loading }) => ({
  varlist,
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
        key:'id'
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
        title:'状态',
        key:'status',
        dataIndex:'status',
        render:(record)=>record===1?'启用':'禁用'
      },
      {
        title:'更新时间',
        key:'updateTime',
        dataIndex:'updateTime',
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={() => this.goAddPage({ ...record, type: 2 })}>
                <Icon type="edit"/>编辑
              </Menu.Item>
              <Menu.Item onClick={() => this.deleteVar()}>
                <Icon type="delete"/>删除
              </Menu.Item>
              <Menu.Item onClick={() => this.goPolicyList()}>
                <Icon type="snippets" />应用策略
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
  change = (currPage = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'varlist/fetchVarList',
      payload: {
      	...this.props.varlist.filterIpts,
      	currPage:currPage,
      	pageSize:pageSize,
      }
    })
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
  goPolicyList = async()=>{
    const text = [
      {
        msg:'信贷风控策略'
      },
      {
        msg:'消费贷风控策略'
      },
      {
        msg:'个人经营贷风控策略'
      },
    ]
    var textHtml = ''
      text.map((item,index)=>{
      textHtml+=`<p>${item['msg']}</p>`
    })
    console.log(textHtml)
    const confirm = await Swal({
      html: textHtml,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirm.value) {
      // 请求开启/停用方法
      router.push({
        pathname:'/policyManage/riskpolicylist/list',
      })
    }
  }
  //删除变量
  deleteVar=async(type=1,record={})=>{
    const confirmVal = await Swal.fire({
      text: '确定要删除该变量吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){
			this.props.dispatch({
	      type: 'varlist/delVar',
	      payload: {
	      	id:record['id']
	      },
	      callback:()=>{
	      	this.props.changeDefault(1)
	        this.reset()
	      }
	    })
    }
  }
  render() {
    return (
     <PageHeaderWrapper renderBtn={this.renderTitleBtn}>
       <Card bordered={false}>
         <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
         <Table
           bordered
           pagination={false}
           columns={this.state.columns}
           dataSource={this.props.varlist.varList}
         />
         <Pagination
           style={{ marginBottom: "50px" }}
           showQuickJumper
           defaultCurrent={1}
           current={this.state.current}
           total={this.props.varlist.total}
           onChange={this.onChange}
           showTotal={(total, range) => this.showTotal(total, range)}
         />
       </Card>
      </PageHeaderWrapper>
    )
  }
}
