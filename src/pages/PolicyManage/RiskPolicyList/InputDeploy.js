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
import Swal from 'sweetalert2';
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ policyList, loading,varList }) => ({
  policyList,
  loading:loading.effects['policyList/queryInputVar'],
  submitLoading:loading.effects['policyList/saveInputVar'],
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
        dataIndex: 'variableName',
        key:'variableName'
      },{
        title: '变量代码',
        dataIndex: 'variableCode',
        key:'variableCode'
      },{
        title: '长度',
        key:'variableLength',
        dataIndex:'variableLength'
      },
        {
          title: '类型',
          dataIndex: 'variableTypeStr',
          key:'variableTypeStr'
        },
        {
          title: '添加时间',
          dataIndex: 'inputCreateTime',
          key:'inputCreateTime'
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
      selectedRowKeys: [],//选中变量的key值
      selectedRows:[],//选中的变量
      visible:false,
    };
  }
  async componentDidMount() {
    const {query} = this.props.location;
    //请求变量列表
    this.props.dispatch({
      type: 'varList/queryVarList',
      payload: {
        strategyId:query['strategyId'],
        status:1,
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
    //查询输出模板变量
    this.props.dispatch({
      type: 'policyList/queryMouldList',
      payload: {
        pageSize:10000,
        currPage:1,
      }
    })
    //查询策略输入输出变量
   const res = await this.props.dispatch({
      type: 'policyList/queryInputVar',
      payload: {
        strategyId:query['id']
      }
    })
    if(res&&res.status===1){
      this.pagination(10,1,addListKey(res.data.inputVarList))
    }
  }
  componentWillUnmount(){
    //清空列表数据
   this.props.dispatch({
      type: 'policyList/InitTableList',
      payload: {
        data:{
          inputVarList:[],
          templateId:''
        }
      }
    })
    this.pagination(10,1,addListKey([]))
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.pagination(10,current,this.props.policyList.tableList)
  }
  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({
      selectedRowKeys:selectedRowKeys,
      selectedRows:selectedRows
    });
  }
  //   获取子组件数据的方法
  getSubKey = (ref,key) => {
    this[key]= ref;
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
      payload:{
        pageList:list,
      }
    })
  }
  //删除表格数据
  deleteList= async()=>{
    const {query} = this.props.location;
    const {selectedRowKeys,selectedRows} = this.state;
    const {tableList,templateId} = this.props.policyList;
    let list = []
    if(!selectedRows.length){
      message.error('删除失败,请勾选要删除的项目!');
    }else{
      const confirmVal = await Swal.fire({
        text: '确定要删除选中的变量吗？',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if(confirmVal.value){
        let deleteList=[]
        selectedRows.map((item,index)=>{
          deleteList.push(item['variableId'])
        })
        //删除之前先进行接口调用，判断能否删除
        const res = await this.props.dispatch({
          type: 'policyList/checkMouldList',
          payload:{
            deleteVarIdList:deleteList,
            strategyId:query['id'],
          }
        })
        if(res&&res.status===1){
          if(res.data&&res.data.length>0){
            message.error('选中的变量已应用到策略,不能删除!')
          }else{
            for(var arr of selectedRows){
              tableList.forEach((item,index)=>{
                if(item['id']===arr['id']){
                  tableList.splice(index,1)
                }
              })
            }
            this.setState({ selectedRowKeys:[],selectedRows:[]});
            this.pagination(10,1,tableList);
            this.props.dispatch({
              type: 'policyList/saveTableList',
              payload: addListKey(tableList)
            })
            message.success('删除成功!')
          }
        }
      }
    }
  }
  //确定事件
  handleOk=()=>{
    this.setState({ visible:false,},()=>{
      const records = this.addForm.submitHandler();
      const {tableList} = this.props.policyList;
      this.props.dispatch({
        type: 'policyList/saveTableList',
        payload: addListKey(deepCopy([...tableList,...records]))
      })
      this.pagination(10,1,addListKey(deepCopy([...tableList,...records])))
      this.addForm.emptyCheck();
    })
  }
  //保存提交
  formSubmit=()=>{
    const {tableList} = this.props.policyList;
    const {query} = this.props.location;
    const formData = this.getFormValue();
    let inputVarList=[];
    tableList.map((item,index)=>{
      inputVarList.push({
        id:item['variableId'],
        inputCreateTime:item['inputCreateTime'],
      })
    })
    this.props.form.validateFields(async(err,value)=>{
      if(!err){
        if(tableList.length){
          const res = await this.props.dispatch({
            type: 'policyList/saveInputVar',
            payload:{
              inputVarList:inputVarList,
              strategyId:query['id'],
              ...formData,
            }
          })
          if(res&&res.status===1){
            message.success(res.statusDesc)
              .then(()=>{
                router.goBack()
              })
          }else{
            message.error(res.statusDesc)
          }
        }else{
          message.error('请添加变量!')
        }
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const { query } = this.props.location
    const queryData = {
      strategyId:query['strategyId'],
      status:1,
    }
    const {selectedRowKeys,selectedRows,columns,current } = this.state;
    const rowSelection = {
      selectedRowKeys,
      selectedRows,
      onChange: this.onSelectChange,
    };
    const {mouldList,pageList,tableList,templateId} = this.props.policyList
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
                    columns={columns}
                    dataSource={pageList}
                    loading={this.props.loading}
                  />
                </Row>
                <Row>
                  <Pagination
                    style={{ marginBottom: "50px" }}
                    showQuickJumper
                    defaultCurrent={1}
                    current={current}
                    total={tableList.length}
                    onChange={this.onChange}
                    showTotal={(total, range) => this.showTotal(total, range)}
                  />
                </Row>
              </Col>
            </Row>
            <Row gutter={24} type="flex" align="middle">
              <Col xxl={4} md={6}>
                <FormItem label="输出变量" {...formItemConfig}>
                  {getFieldDecorator('templateId',{
                    initialValue:templateId,
                    rules:[
                      {
                        required:true,
                        message:'请选择输出模板!'
                      }
                      ]
                  })(
                    <Select allowClear={true} style={{width:165}}>
                      {
                        mouldList&&mouldList.map((item,index)=>{
                          return (
                            <Option value={item.id} key={index}>{item.presentationName}</Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <Button type="primary" onClick={this.formSubmit} loading={this.props.submitLoading}>提交</Button>
                <Button  onClick={()=>router.goBack()}>返回</Button>
              </Col>
            </Row>
          </Form>
          <Modal
            title={'选择变量'}
            visible={this.state.visible}
            onOk={this.handleOk}
            destroyOnClose={true}
            maskClosable={false}
            onCancel={()=>this.setState({visible:false})}
            width={1040}
          >
            <AddForm
              type={this.state.type}
              number={this.state.number}
              getSubKey={this.getSubKey}
              queryData={queryData}
              pageList={tableList}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
