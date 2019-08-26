import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
  Form,
  Card,
  Modal,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import Dialog from './Dialog';
import AddForm from '@/components/VarListModal/AddForm'
import router from 'umi/router';
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ policyList, loading,varList }) => ({
  policyList,
  varList
}))
@Form.create()
export default class InputDeploy extends PureComponent {
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
      type:1,
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      selectedRowKeys: [],
      visible:false,
    };
  }
  componentDidMount() {
    const {query} = this.props.location;
    //请求变量列表
    this.props.dispatch({
      type: 'varList/queryVarList',
      payload: {
        strategyId:query['strategyId']
      }
    })
    //请求一级变量分类
    this.props.dispatch({
      type: 'varList/queryOneClassList',
      payload: {
        firstTypeId:0,
        secondTypeId:'',
      }
    })
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
  //   获取子组件数据的方法
  getSubKey = (ref,name) => {
    this[name]= ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //点击配置弹窗
  clickDialog=(record)=>{
    this.setState({
      visible:true,
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
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
  }
  //确定事件
  handleOk=()=>{
    this.setState({ visible:false,},()=>{
      const {checkedList} = this.dialog.submitHanler();
      const {tableList} = this.props.policyList;
      this.props.dispatch({
        type: 'policyList/saveTableList',
        payload: addListKey(deepCopy([...tableList,...checkedList]))
      })
      this.pagination(10,1,addListKey(deepCopy([...tableList,...checkedList])))
      this.dialog.emptyCheck();
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {state}=this.props.location
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const { query } = this.props.location
    const queryData = {
      strategyId:query['strategyId']
    }
    const {selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={'输入输出配置'}
        >
          <Form
            className="ant-advanced-search-form"
          >
            <Row  gutter={16} type="flex" align="top">
              <Col style={{paddingLeft:30,paddingRight:0,fontSize:12,color:'#333'}}><span style={{display:'inline-block',color:'#f5222d',lineHeight:1,marginRight:4,fontSize:14,verticalAlign:'middle'}}>*</span>输入变量 :</Col>
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
            <Row type="flex" justify="center">
              <Col>
                <Button type="primary" onClick={this.formSubmit}>提交</Button>
                <Button  onClick={()=>router.goBack()}>返回</Button>
              </Col>
            </Row>
          </Form>
          <Modal
            title={'选择变量'}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={()=>this.setState({visible:false})}
            width={1040}
          >
            <AddForm
              type={this.state.type}
              number={this.state.number}
              getSubKey={this.getSubKey}
              queryData={queryData}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
