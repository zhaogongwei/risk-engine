import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Pagination,
  Table,
  Badge,
  Menu,
  Dropdown,
  Icon,
  Popconfirm,
  message,
  Card,
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import permission from '@/utils/PermissionWrapper';
import FilterIpts from './FilterIpts';
import AddForm from './addForm';
import { findInArr,exportJudgment } from '@/utils/utils'
import router from 'umi/router';
import Swal from 'sweetalert2';

@permission
@connect(({ varclass, loading }) => ({
  varclass,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class VarClass extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns:[
        { title: '序号', dataIndex: 'key', key: 'key',width:'30%' },
        { title: '分类名称', dataIndex: 'typeName', key: 'typeName',width:'9%'},
        { title: '分类描述', dataIndex: 'remark',key: 'remark',width:'48%',},
        {
          title: 'Action',
          width:100,
          render: (record) => {
            const {permission} = this.props
            const action = (
              <Menu>
                {
                  permission.includes('re:variableType:update') ?
                    <Menu.Item onClick={() => {
                      this.clickDialog(4, record)
                    }}>
                      <Icon type="edit"/>编辑
                    </Menu.Item>:null
                }
                {
                  permission.includes('re:variableType:delete') ?
                    <Menu.Item onClick={() => this.deleteVar(1, record)}>
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
        },
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      title:'添加一级分类',
      type:1,//1:添加一级分类；2：添加二级分类；3：编辑一级分类，4：编辑二级分类
      tableKey:0
    };
  }
  componentDidMount() {
    this.change()
  }
  componentWillUnmount(){
    this.props.dispatch({
      type: 'varclass/clearfilterIpts',
      payload: {}
    })
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
  change = async(currPage = 1, pageSize = 10) => {
  	await this.props.dispatch({
      type: 'varclass/fetchVarClassList',
      payload: {
      	currPage:currPage,
      	pageSize:pageSize,
      	firstTypeId:this.props.varclass.filterIpts.parentId || '',
      	secondTypeId:this.props.varclass.filterIpts.id || ''
      }
    })
    
    this.setState({
      tableKey:this.state.tableKey+1
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
  //点击配置弹窗(添加一级分类)
  clickDialog=(type,record={})=>{
    this.addForm.reset()
    this.setState({
      type:type,
      title:this.titleRender(type),
      modalStatus:true,
      record:record,
    })
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
  expandedRowRender = (record,index) => {
      return (
        <Table
          bordered={false}
          showHeader={false}
          columns={this.state.columns}
          dataSource={record.childTypeList}
          pagination={false}
        />
      );

  }
  titleRender=(type)=>{
    let title;
    switch (type){
      case 1:title = '添加一级分类';break;
      case 2:title = '添加二级分类';break;
      case 3:title = '编辑一级分类';break;
      case 4:title = '编辑二级分类';break;
      default:title = '添加一级分类';break;
    }
    return title;
  }
  renderBtn = () => {
    return (
      <Fragment>
        <Button onClick={()=>this.clickDialog(1)}><Icon type="plus" />添加分类</Button>
      </Fragment>
    )
  }
  //删除变量
  deleteVar=async(type=1,record={})=>{
    const confirmVal = await Swal.fire({
      text: '确定要删除该分类吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){
    	this.props.dispatch({
	      type: 'varclass/delVarClass',
	      payload: {
	      	typeId:record['id']
	      },
	      callback:()=>{
	      	this.changeDefault(1)
	        this.child.classChangeGetSelect()
	        this.change(1)
	        this.reset()
	      }
	    })
    }
  }
  render() {
    const columns = [
      { title: '序号', dataIndex: 'key', key: 'key',width:'24%' },
      { title: '分类名称', dataIndex: 'typeName', key: 'typeName', width:'19%'},
      { title: '分类描述', key: 'remark', width:'36%',
        render:(record)=>(<a onClick={()=>router.push({pathname:'/varManage/varlist',query:{parentId:record.id}})}>{record.remark}</a>),
      },
      {
        title: '操作',
        key: 'action',
        render: (record) => {
          const {permission} = this.props
          const action = (
            <Menu>
              {
                permission.includes('re:variableType:add')?
                  <Menu.Item onClick={() => {
                    this.clickDialog(2, record)
                  }}>
                    <Icon type="plus"/>添加二级分类
                  </Menu.Item>:null
              }
              {
                permission.includes('re:variableType:update')?
                  <Menu.Item onClick={() => {
                    this.clickDialog(3, record)
                  }}>
                    <Icon type="edit"/>编辑
                  </Menu.Item> : null
              }
              {
                permission.includes('re:variableType:delete')?
                  <Menu.Item onClick={() => this.deleteVar(1, record)}>
                    <Icon type="delete"/>删除
                  </Menu.Item> : null
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
      },
    ];
    const { permission } = this.props
    return (
      <PageHeaderWrapper  renderBtn={permission.includes('re:variableType:add')?this.renderBtn:null}>
        {
          permission.includes('re:variableType:view') ?
            <Card bordered={false}>
              <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage}
                          changeDefault={this.changeDefault}/>
              <Table
                key={this.state.tableKey}
                style={{ border: "1px solid #e8e8e8" }}
                bordered={false}
                columns={columns}
                defaultExpandAllRows={true}
                expandedRowRender={(record, index) => this.expandedRowRender(record, index)}
                dataSource={this.props.varclass.varClassList}
                loading={false}
                pagination={false}
              />
              <Pagination
                style={{ marginBottom: "50px" }}
                showQuickJumper
                defaultCurrent={1}
                current={this.state.current}
                total={this.props.varclass.total}
                onChange={this.onChange}
                showTotal={(total, range) => this.showTotal(total, range)}
              />
              <AddForm
                showState={this.state.modalStatus}
                onChange={this.handleChildChange}
                getSubKey={this.getSubKey}
                type={this.state.type}
                title={this.state.title}
                changeDefault={this.changeDefault}
                change={this.change}
                record={this.state.record}
                current={this.state.current}
                resatSelect={this.child}
              /></Card> : null
        }
      </PageHeaderWrapper>
    )
  }
}
