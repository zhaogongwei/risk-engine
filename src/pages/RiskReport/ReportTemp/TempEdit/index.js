import React, { Component, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RptTable from '@/components/RptTable/RptTable'
import AddForm from '@/components/VarListModal/AddForm'
import {
  Button,
  Table,
  Pagination,
  Modal,
  Icon,
  Row,
  Col,
  Input,
  Select,
  Form,
  message,
  Card,
} from 'antd';
import { connect } from 'dva'
import router from 'umi/router';
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
import error from '../../../Exception/models/error';
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ tempEdit, loading,varList }) => ({
  tempEdit,
  varList,
  submitLoading: loading.effects['tempEdit/saveTemplate']
}))
@Form.create()
export default class Index extends Component {
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
        title: '排序',
        key:'orderNum',
        dataIndex:'orderNum',
        editable:true,
        pattern:/^\d{1,10}$/,
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
      tableList:[{key:0,checkList:[]}],
      number:0,//表格序号
      addModalVisible:false,//表格显隐
      tableVarKey:0,//表格内变量序号，
      cellFormData:[],//表格form
      titleFormData:[],//表格标题form
    };
  }
  componentDidMount() {
    const {query} = this.props.location;
    const {type,id} = query;
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
    if(type*1)return;
    //请求风控报告模板信息
    this.props.dispatch({
      type: 'tempEdit/queryTemplate',
      payload: {
        id:query['id']
      }
    })
  }
  componentWillUnmount(){
    //清空表格数据
    this.props.dispatch({
      type: 'tempEdit/InittitleListHandle',
      payload: {
        data:{
          presentationName:'',
          reportTemplate:[
            {
              title:'标题一',
              variable:[],//table数据
            }
          ]
        }
      }
    })
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //表格新增变量
  addVar=(index)=>{
    console.log(index)
    //this.child.reset()
    this.setState({
      addModalVisible:true,
    })
  }
  setNumber=(index)=>{
    this.setState({
      number:index,
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
// 按钮点击确定事件执行的方法
  addFormSubmit=async ()=>{
    //选择的变量集合
    const checkedList = this.addForm.submitHandler();
    console.log(checkedList)
    //table数据集合
    let {titleList} =this.props.tempEdit
    let newlist =[...titleList[this.state.number]['variable'],...checkedList];
    const newData = addListKey(deepCopy(newlist))
    titleList.splice(this.state.number,1,{...titleList[this.state.number],...{variable:newData}})
    this.props.dispatch({
      type: 'tempEdit/titleListHandle',
      payload: {
        titleList:titleList
      }
    })
    console.log(this.props.tempEdit.titleList)
    this.setState({
      addModalVisible: false
    })
  }
  reset = () => {
    this.props.form.resetFields()
  }
  //删除对应表格变量
  deleteVar=(key,list,callback)=>{
    console.log(key,list)
    const {titleList}= this.props.tempEdit;
    const selectVar= titleList[key]['selectVar'];
    //对应表格的数据
    let checkList = titleList[key]['variable'];
    if(selectVar.length>0){
      for(var i of selectVar){
        checkList.forEach((item,index)=>{
          if(item['key'] ===i){
            checkList.splice(index,1)
          }
        })
      }
      addListKey(titleList[key]['variable'])
      /*console.log(newlist)
      reportList.splice(this.state.number,1,{key:this.state.number,title:reportList[this.state.number]['title'],checkList:newlist})*/
      this.props.dispatch({
        type: 'tempEdit/titleListHandle',
        payload: {
          titleList:titleList
        }
      })
      callback()
    }else{
      message.error('删除失败,请勾选要删除的项目!');
    }
    console.log(key,list)
  }
  //存储对应table选中的变量
  saveSelectVar=(index,list)=>{
    console.log(index,list)
    const {titleList}= this.props.tempEdit;
    titleList[index]['selectVar']=list;
  }
  //存储表格form
  handleModify = form => {
    let arr = this.state.cellFormData
    arr.push(form)
    this.setState({
      cellFormData: arr
    })
  }
  //存储标题form
  handleTitle = form => {
    let arr = this.state.titleFormData
    arr.push(form)
    this.setState({
      titleFormData: arr
    })
  }
  saveData=async()=>{
    let count =0 ;
    this.state.cellFormData.map((item)=>{
      item.validateFieldsAndScroll((errors,values)=>{
        if(errors)count++;
      })
    })
    this.rptable.props.form.validateFields(async(errors,value)=>{
      if(!errors){
        if(!count){
          let varStatus = true;//变量列表是否为空
          const formData = this.rptable.getFormValue();
          const {titleList} = this.props.tempEdit;
          const {query} = this.props.location;
          for(let item of titleList){
            if(!item['variable'].length){
              varStatus = false;
              break;
            }
          }
          if(varStatus){
            const response = await this.props.dispatch({
              type: 'tempEdit/saveTemplate',
              payload: {
                name :formData['name'],
                reportTemplate:titleList,
                id:query['id']
              }
            })
            if(response&&response.status === 1){
              message.success(response.statusDesc)
                .then(()=>{
                  router.goBack()
                })
            }else{
              message.error(response.statusDesc)
            }
          }else{
            message.error('变量列表不能为空!')
          }
        }else{
          message.error('输入内容不能为空!')
        }
      }else{
        message.error('输入内容不能为空!')
      }
    })
  }
  //去预览页面
  goPreview=(id)=>{
    router.push(`/riskReport/reportList/mould/preview?id=${id}`)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { titleList,presentationName } = this.props.tempEdit
    const { number } = this.state
    const { query } = this.props.location
    const {id,type} = query
    console.log('titleList',titleList)
    //console.log('number',number)
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={type*1===1?'新增风控报告模板':'编辑风控报告模板'}
        >
          <RptTable
            loading={this.props.loading}
            columns={this.state.columns}
            handleDelete={this.handleDelete}
            handleAdd={this.handleAdd}
            addVar={this.addVar}
            deleteVar={this.deleteVar}
            saveSelectVar={this.saveSelectVar}
            titleList={titleList}
            setNumber={(index)=>this.setNumber(index)}
            handleModify={(form)=>{this.handleModify(form)}}
            handleTitle={(form)=>{this.handleTitle(form)}}
            getSubKey={this.getSubKey}
            presentationName={presentationName}
          />
          <Modal
            className={'ant-modal-sm'}
            width={1000}
            title={''}
            visible={this.state.addModalVisible}
            onOk={this.addFormSubmit}
            destroyOnClose={true}
            confirmLoading={this.props.submitLoading}
            onCancel={() => this.setState({ addModalVisible: false })}
          >
            <AddForm
              type={1}
              number={this.state.number}
              getSubKey={this.getSubKey}
              pageList={titleList[number]['variable']}
            />
          </Modal>
          <Row type="flex" gutter={16} align="middle" justify="center">
            <Col col={8}>
              <Button type="primary" onClick={this.saveData} loading={this.props.submitLoading}>保存</Button>
            </Col>
            {
              type*1===1?null:
                <Col col={8}>
                  <Button type="primary" onClick={()=>this.goPreview(id)}>预览</Button>
                </Col>
            }
            <Col col={8}>
              <Button type="primary" onClick={()=>router.goBack()}>取消</Button>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
