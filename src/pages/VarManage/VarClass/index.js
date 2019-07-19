import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Pagination,
  Table,
  Badge,
  Menu,
  Dropdown,
  Icon,
  Popconfirm,
  message
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import FilterIpts from './FilterIpts';
import AddForm from './addForm';
import { findInArr,exportJudgment } from '@/utils/utils'
import router from 'umi/router';
const menu = (
  <Menu>
    <Menu.Item>
      Action 1
    </Menu.Item>
    <Menu.Item>
      Action 2
    </Menu.Item>
  </Menu>
);
@connect(({ varclass, loading }) => ({
  varclass,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class VarClass extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns:[
        { title: '序号', dataIndex: 'number', key: 'number',width:'25%' },
        { title: '分类名称', dataIndex: 'name', key: 'name',width:'19%'},
        { title: '分类描述', dataIndex: 'classDes',key: 'classDes',width:'38%',},
        {
          title: 'Action',
          width:180,
          render: (record) => (
            <div>
              <Button icon="edit" onClick={()=>{this.clickDialog(4,record)}}/>
              <Popconfirm
                title="您确定要删除此分类？"
                onConfirm={this.confirm}
                onCancel={this.cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button icon="delete" />
              </Popconfirm>
            </div>
          ),
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
  confirm=(e)=>{
    console.log(e);
    message.success('Click on Yes');
  }

  cancel=(e) =>{
    console.log(e);
    message.error('Click on No');
  }

  expandedRowRender = (record,index) => {
    return (
      <Table
        showHeader={false}
        columns={this.state.columns}
        dataSource={record.secList}
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
  render() {
    const columns = [
      { title: '序号', dataIndex: 'number', key: 'number',width:'24%' },
      { title: '分类名称', dataIndex: 'name', key: 'name', width:'19%'},
      { title: '分类描述', dataIndex: 'classDes', key: 'amount', width:'36%',
        render:(record)=>(<a onClick={()=>router.push('/varManage/varlist')}>{record}</a>),
      },
      {
        title: '操作',
        key: 'action',
        width:380,
        render: (record) => {
          return<div>
                  <Button icon="plus-square" onClick={()=>{this.clickDialog(2,record)}}/>
                  <Button icon="edit" onClick={()=>{this.clickDialog(3,record)}}/>
                  <Popconfirm
                    title="您确定要删除此分类？"
                    onConfirm={this.confirm}
                    onCancel={this.cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon="delete" />
                  </Popconfirm>
                </div>
        }
      },
    ];
    const data = [
      {
        key:1,
        number:1,
        name:'反欺诈',
        classDes:'王大大的分类',
        secList:[
          {
            key:1,
            number: 1,
            name: '注册',
            classDes:'王大大的分类',
          },
          {
            key:2,
            number: 2,
            name: '登录',
            classDes:'王大大的分类',
          },
          {
            key:3,
            number: 3,
            name: '借款',
            classDes:'王大大的分类',
          },
        ]
      },
      {
        key:2,
        number:2,
        name:'信审模块',
        classDes:'王大大的分类',
        secList:[
          {
            key:1,
            number: 1,
            name: '评分规则',
            classDes:'王大大的分类',
          },
          {
            key:2,
            number: 2,
            name: '借款人信息',
            classDes:'王大大的分类',
          },
          {
            key:3,
            number: 3,
            name: '自动拒绝规则',
            classDes:'王大大的分类',
          },
        ]
      },
    ];
    const { permission } = this.props
    return (
      <PageTableTitle title={'变量分类'}>
        <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
        <Button type="primary" onClick={()=>this.clickDialog(1)}>添加分类</Button>
        <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={(record,index)=>this.expandedRowRender(record,index)}
          defaultExpandAllRows={true}
          dataSource={data}
          pagination={false}
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
        <AddForm
          showState={this.state.modalStatus}
          onChange={this.handleChildChange}
          getSubKey={this.getSubKey}
          type={this.state.type}
          title={this.state.title}
          record={this.state.record}
        />
      </PageTableTitle>
    )
  }
}
