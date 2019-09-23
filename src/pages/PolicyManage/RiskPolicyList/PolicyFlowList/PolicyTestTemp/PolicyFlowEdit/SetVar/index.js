import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Row,
  Col,
  Select,
  Button,
  Table,
  Pagination,
  Icon,
  Form,
  Modal,
  Popconfirm,
  Card,
  message,
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import AddForm from '@/components/VarListModal/AddForm'
import SetVarTable from '@/components/SetVarTable'
import router from 'umi/router';
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({setVar,varList,loading}) => ({
  setVar,
  varList,
  loading:loading.effects['setVar/queryVarInfo'],
  buttonLoading:loading.effects['setVar/saveVarInfo'],
}))
@Form.create()
export default class setVar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        width:100,
        key:'key'
      },{
        title: '变量名称',
        dataIndex: 'variableName',
        key:'variableName',
        editable:true,
        width:300,
        cols:1,
        type:'input',
        isFocus:true
      },{
        title: '条件',
        key:'compareCondition',
        dataIndex:'compareCondition',
        width:300,
        cols:2,
        render:()=>'='
      },
      {
        title: '值',
        key:'varValue',
        dataIndex:'varValue',
        editable:true,
        width:300,
        cols:3,
        type:'more',
        pattern:/^\d{1,3}$/,
      },
      {
        title: '操作',
        key:'action',
        width:300,
        render: (record) => (
          <Popconfirm title="是否确认删除本行?" onConfirm={()=>this.handleDelete(record.key)}>
            <Button type="primary">删除</Button>
          </Popconfirm>
        ),
      }],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:0,//0:单选按钮，1：多选按钮
      number:'',
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,//状态判断 1:表格 0：输出结果
      visible:false,
      resultVarId:{},//输出结果
      varFormData:[],//设置变量form列表
    };
  }
  async componentDidMount() {
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
    //查询节点信息
    const res = await this.props.dispatch({
      type: 'setVar/queryVarInfo',
      payload: {
        nodeId:query['id']
      }
    })
  }
  componentWillUnmount(){
    this.props.dispatch({
      type: 'setVar/varListHandle',
      payload: {
        varList:[]
      }
    })
  }
  //   获取子组件数据的方法
  getSubKey = (ref,key) => {
    this[key]=ref;
  }
  //点击配置弹窗
  clickDialog=(type,record)=>{
    console.log(type,record)
    this.setState({
      status:1,
      visible:true,
      number:record?record['key']:''
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //删除表格数据
  handleDelete=(key)=>{
    const {varList} = this.props.setVar
    const newDataSource = varList.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'setVar/varListHandle',
      payload: {
        varList:addListKey(newDataSource)
      }
    })
  }
  //保存数据
  handleSave = async()=>{
    let count=0;
    const {varList} = this.props.setVar;
    const {query} = this.props.location;
    this.state.varFormData.map(item => {
      item.validateFieldsAndScroll(async(errors,value)=>{
        if(errors)count++;
      })
    })
    if(!count){
      if(!varList.length){
        message.error('请选择变量!')
      }else{
        console.log(varList)
       const response = await this.props.dispatch({
          type: 'setVar/saveVarInfo',
          payload: {
            ruleType:'setVar',
            variableList:varList,
            nodeId:query['id']
          }
        })
        if(response&&response.status ===1){
          message.success(response.statusDesc)
            .then(()=>{
              router.goBack()
            })
        }else{
          message.error(response.statusDesc)
        }
      }
    }
    console.log(this.props.setVar.varList)
  }
  //弹框按钮取消
  handleCancel =()=>{
    this.setState({visible:false})
  }
  //弹框确定
  addFormSubmit=()=>{
    this.setState({visible:false},()=>{
      const records = this.addForm.submitHandler();
      const {varList} = this.props.setVar;
      if(Object.keys(records).length){
        const keyList = varList.filter(item => item['variableId']===records['variableId'])
        if(varList.length&&keyList.length){
          message.error('不能添加重复变量!')
        }else{
          this.props.dispatch({
            type: 'setVar/varListHandle',
            payload: {
              varList:addListKey(deepCopy([...varList,{...records}]))
            }
          })
        }
      }
    })
  }
  //  将每个cell的form保存起来
  handleModify = form => {
    let arr = this.state.varFormData;
    arr.push(form)
    this.setState({
      varFormData: arr
    })
  }
  render() {
    const { permission } = this.props
    const { query } = this.props.location;
    const { title } = query;
    const queryData = {
      strategyId:query['strategyId']
    }
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={title}
        >
          <SetVarTable
            bordered
            pagination={false}
            columns={this.state.columns}
            dataSource={this.props.setVar.varList}
            handleAdd={()=>this.clickDialog(1)}
            handleModify={(form)=>this.handleModify(form)}
            loading={this.props.loading}
          />
          <Row type="flex" gutter={24} justify="center" style={{marginTop:20}}>
            <Col>
              <Button type="primary" onClick={this.handleSave} loading={this.props.buttonLoading}>保存并提交</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={()=>router.goBack()}>返回</Button>
            </Col>
          </Row>
          <Modal
            title={'选择变量'}
            visible={this.state.visible}
            onOk={this.addFormSubmit}
            onCancel={this.handleCancel}
            destroyOnClose={true}
            width={1040}
          >
            <AddForm
              type={this.state.type}
              number={this.state.number}
              getSubKey={this.getSubKey}
              queryData={queryData}
              pageList={this.props.setVar.varList}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
