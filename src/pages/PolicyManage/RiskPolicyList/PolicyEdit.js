import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Icon,
  Row,
  Col,
  Input,
  Select,
  message,
  Form
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import Dialog from './Dialog';
import router from 'umi/router';
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ policyList, loading }) => ({
  policyList,
}))
@Form.create()
export default class PolicyEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '变量名称',
        dataIndex: 'name',
        key:'name'
      },{
        title: '变量代码',
        dataIndex: 'code',
        key:'code'
      },{
        title: '长度',
        key:'length',
        dataIndex:'length'
      },
        {
          title: '类型',
          dataIndex: 'type',
          key:'type'
        }
        ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:true,
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      selectedRowKeys: [],
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
    this.pagination(10,current,this.props.policyList.tableList)
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
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
  //   获取子组件数据的方法
  getSubData = (ref) => {
    this.child = ref;
  }
  //   获取子组件数据的方法
  getSubDeploy = (ref) => {
    this.childDeploy = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //点击配置弹窗
  clickDialog=(record)=>{
    this.childDeploy.reset()
    this.setState({
      modalStatus:true,
      assetsTypeName:record.assetsTypeName,
      code:record.assetsTypeCode,
      id:record.id,
      status:record.status,
      type:false
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
  //右上角渲染
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={this.goAddPage}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = ()=>{
    this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
  }
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  //前端分页
  pagination=(pageSize=10,currentPage=1,array=[])=>{
    //起始位置
    this.setState({
      current:currentPage
    })
    var offset = (currentPage-1)*pageSize
    var list =[]
   array.length>10?list = array.slice(offset,offset+pageSize):list = array
   this.props.dispatch({
      type: 'policyList/savePageList',
      payload:list
    })
  }
  //删除表格数据
  deleteList=()=>{
    const {selectedRowKeys} = this.state;
    const {tableList} = this.props.policyList;
    console.log(tableList,selectedRowKeys)
    let list = []
    if(!selectedRowKeys.length){
      message.error('删除失败,请勾选要删除的项目!');
    }else{
      for(var key of selectedRowKeys){
        tableList.forEach((item,index)=>{
          if(item['key']===key){
            tableList.splice(index,1)
          }
        })
      }
    }
    this.pagination(10,1,addListKey(tableList));
    this.setState({
      selectedRowKeys:[]
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {state}=this.props.location
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const {selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageTableTitle title={state.type===1?'新增策略':'编辑策略'}>
        <Form
          className="ant-advanced-search-form"
        >
          <Row style={{marginBottom:20}}  gutter={24} type="flex" align="middle">
            <Col xxl={4} md={6}>
              <FormItem label="策略类型" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Select allowClear={true}>
                    <Option value={1}>主策略</Option>
                    <Option value={2}>次策略</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={4} md={6}>
              <FormItem label="策略名称" {...formItemConfig}>
                {getFieldDecorator('status',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={4} md={6}>
              <FormItem label="策略代码" >
                {getFieldDecorator('status',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={4} md={6}>
              <FormItem label="策略负责人" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Select allowClear={true}>
                    <Option value={1}>王一</Option>
                    <Option value={2}>王二</Option>
                    <Option value={3}>王三</Option>
                    <Option value={4}>王四</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        <Row  gutter={16} type="flex" align="top">
          <Col style={{paddingLeft:30,paddingRight:0,fontSize:12,color:'#333'}}><span style={{display:'inline-block',color:'#f5222d',lineHeight:1,marginRight:4,fontSize:14,content:'*'}}></span>输入变量 :</Col>
          <Col span={15}>
            <Row gutter={16} type="flex" align="middle" style={{marginBottom:20}}>
              <Col> <Button type="primary" onClick={this.clickDialog}>选择变量</Button></Col>
              <Col><Button type="primary" onClick={this.deleteList}>删除</Button></Col>
            </Row>
            <Row >
              <Table
                bordered
                pagination={false}
                rowSelection={rowSelection}
                columns={this.state.columns}
                dataSource={this.props.policyList.pageList}
                loading={this.props.loading}
              />
            </Row>
            <Row>
              <Pagination
                style={{ marginBottom: "50px" }}
                showQuickJumper
                defaultCurrent={1}
                current={this.state.current}
                total={this.props.policyList.tableList.length}
                onChange={this.onChange}
                showTotal={(total, range) => this.showTotal(total, range)}
              />
            </Row>
          </Col>
        </Row>
        <Row gutter={24} type="flex" align="middle">
          <Col xxl={4} md={6}>
            <FormItem label="输出变量" {...formItemConfig}>
              {getFieldDecorator('assetsTypeName',{
                initialValue:'',
                rules:[{required:true}]
              })(
                <Select allowClear={true} style={{width:165}}>
                  <Option value={1}>王一</Option>
                  <Option value={2}>王二</Option>
                  <Option value={3}>王三</Option>
                  <Option value={4}>王四</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24} type="flex" align="middle">
          <Col xxl={4} md={6}>
            <FormItem label="策略排序" {...formItemConfig}>
              {getFieldDecorator('assetsTypeName',{
                initialValue:'',
                rules:[{required:true}]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
          <Row type="flex" justify="center">
            <Col>
              <Button type="primary" onClick={this.formSubmit}>提交</Button>
              <Button  onClick={()=>router.goBack()}>返回</Button>
            </Col>
          </Row>
        </Form>
        <Dialog
          showState={this.state.modalStatus}
          onChange={this.handleChildChange}
          childDeploy={this.getSubDeploy}
          pagination={this.pagination}
        />
      </PageTableTitle>
    )
  }
}
