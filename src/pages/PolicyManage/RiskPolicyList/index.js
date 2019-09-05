import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  Menu,
  Dropdown,
  message,
  Card,
  Icon,
  Modal
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
//   新增编辑组件
import PolicyEdit from './PolicyEdit'
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ policyList, loading }) => ({
  policyList,
  loading: loading.effects['policyList/fetchPolicyList']
}))
export default class RiskPolicyList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '策略类型',
        dataIndex: 'strategyTypeName',
        key:'strategyTypeName'
      },{
        title: '策略名称',
        dataIndex: 'strategyName',
        key:'strategyName'
      },{
        title: '策略代码',
        key:'strategyCode',
        dataIndex:'strategyCode'
      },{
        title: '策略说明',
        key:'remark',
        dataIndex:'remark'
      },{
        title: '输出报告',
        key:'templateName',
        dataIndex:'templateName'
      },{
        title: '状态',
        key:'status',
        dataIndex:'status',
        render: record => record === 1 ? '启用' : '禁用'
      },{
        title: '负责人',
        key:'dutyTrueName',
        dataIndex:'dutyTrueName'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={()=>this.goDeploy(record.id)}>
                <Icon type="setting" />变量设置
              </Menu.Item>
              <Menu.Item onClick={()=>this.goLabel(record.id)}>
                <Icon type="snippets" />标签
              </Menu.Item>
              <Menu.Item onClick={()=>this.goEditPage(0,record.id)}>
                <Icon type="edit"/>编辑
              </Menu.Item>
              <Menu.Item onClick={()=>this.goPolicyFlowList(record)}>
                <Icon type="diff" />策略流
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
      type:1,//1:新增，2：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status: 1,//0：编辑  1：新增
      modalVisible: false,   //   新增策略状态
      policyId: '',   //   策略id
    };
  }
  componentDidMount() {
    //查询策略类型
    this.props.dispatch({
      type: 'policyList/fetchPolicyTypeList',
      payload:{}
    })
    //查询策略负责人集合
    this.props.dispatch({
      type: 'policyList/fetchUserList',
      payload:{}
    })
    //保存查询条件
    this.props.dispatch({
      type: 'policyList/saveQueryData',
      payload:{}
    })
    //查询风控策略列表
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
      type: 'policyList/fetchPolicyList',
      payload: {
        ...this.props.policyList.queryData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubKey = (ref, key) => {
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //去编辑页面
  goEditPage=(type,id)=>{
    this.setState({
      modalVisible: true,
      status:type,
      policyId:id,
    },()=>{
      if(!type){
        this.props.dispatch({
          type: 'policyList/fetchPolicyInfo',
          payload: {
            strategyId:id
          }
        })
      }
    })
  }
  //去输入输出配置
  goDeploy=(id)=>{
    router.push(`/policyManage/riskpolicylist/list/deploy?id=${id}`)
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
        <Button onClick={()=>this.goEditPage(1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转风控标签页面
  goLabel = (strategyId) =>{
    router.push(`/policyManage/riskpolicylist/risklabel?strategyId=${strategyId}`)
  }
  //跳转策略流列表
  goPolicyFlowList=(record)=>{
    router.push(`/policyManage/riskpolicylist/policyFlow/list?id=${record.id}`)
  }
  //   确定添加修改
  confirmChange = async() => {
    console.log(this.edit.props.form.getFieldsValue())
    try {
      const res = await this.edit.submitHandler()
      if (res && res.status === 1) {
        this.setState({
          modalVisible: false
        })
        this.change()
        message.success('操作成功')
      }else message.error(res.statusDesc)
    } catch (err) {
      console.log(err)
    }
  }
  render() {
    const {policyList,pageData} = this.props.policyList
    const {status,policyId} = this.state
    return (
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
         <Card
           bordered={false}
           title={'风控策略列表'}
         >
           <FilterIpts getSubKey={this.getSubKey} change={this.change} pageSize={this.state.pageSize} changeDefault={this.changeDefault}/>
           <Table
             bordered
             pagination={false}
             columns={this.state.columns}
             dataSource={policyList}
             loading={this.props.loading}
           />
           <Pagination
             style={{ marginBottom: "50px" }}
             showQuickJumper
             defaultCurrent={1}
             current={this.state.current}
             total={pageData['total']}
             onChange={this.onChange}
             showTotal={(total, range) => this.showTotal(total, range)}
           />
         </Card>
        <Modal
          visible={this.state.modalVisible}
          onOk={this.confirmChange}
          destroyOnClose={true}
          onCancel={() => this.setState({ modalVisible: false })}
          width={550}
          title={status?'新增策略':'编辑策略'}
          bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        >
          <PolicyEdit
            returnSubKey={this.getSubKey}
            status={status}
            id={policyId}
          />
        </Modal>
      </PageHeaderWrapper>
    )
  }
}
