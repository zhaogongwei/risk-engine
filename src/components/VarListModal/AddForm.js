import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Form,
  Select,
  Button,
  Divider,
  Checkbox,
  Pagination,
  Empty
} from 'antd';
import moment from 'moment';
import { addListKey,deepCopy,getTimeDistance } from '@/utils/utils'
import { connect } from 'dva'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

@connect(({varList})=>({
  varList,
}))

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:false,
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      singleChecked:false,
      radioValue:'',
      type:1,// 0:单选框  1：多选框
      pageSize:10,
      currPage:1,
      loading:false,
    }
  }
  //变量列表查询
  formSubmit=async()=>{
    await this.change(1)
    await this.changeCurrent(1)
  }
  change = async (page)=>{
    const {queryData} = this.props;
    const res = await  this.props.dispatch({
      type: 'varList/queryVarList',
      payload: {
        ...this.getFormValue(),
        ...queryData,
        currPage:page,
        pageSize:this.state.pageSize,
      }
    })
    return res;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //  分页器改变页数的时候执行的方法
  onPageChange = (current) => {
    this.setState({
      currPage:current,
      checkedList:[],
    },async()=>{
     const res =  await this.change(current)
     const {checkAll} = this.state;
      if(res&&res.status===1){
       if(checkAll){
         this.onCheckAllChange({target:{checked:true}})
       }
      }
    })
  }
  onChange = (checkedList) => {
    console.log('选中',checkedList)
    const {varList} = this.props.varList
    this.setState({
      checkedList:checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < varList.length),
      checkAll: checkedList.length === varList.length,
    });
  }

  onCheckAllChange = (e) => {
    const { varList } = this.props.varList
    const { pageList } = this.props
    let handleVarList = [ ...varList, ...pageList ]
    let allList = []
    this.duplicateRemoval(varList, pageList).map(item => {
      if (!item.disabled) {
        allList.push(item)
      }
    })
    this.setState({
      checkedList: e.target.checked ? allList : [],
      indeterminate: false,
      checkAll: e.target.checked,
    })
  }
  //单选按钮onChange事件
  onRadioChange = (e)=>{
    console.log('radio checked', e.target.value);
    this.setState({
      radioValue:e.target.value
    })
  }
  //点击确定
  submitHandler=()=>{
      let records={};
      const {radioValue,checkedList}=this.state;
      const {type}=this.props;
      if(type){
        //多选
        checkedList.forEach((item,key)=>{
          item['variableId'] = item['id']
          item['varTypeStr'] = item['variableTypeStr']
          item['soleKey'] = Math.random()
          item['inputCreateTime'] = moment().format('YYYY-MM-DD HH:mm:ss')
        })
        return checkedList
      }else{
        //单选
        if(Object.keys(radioValue).length){
          records['varId']=radioValue['id'];
          records['variableId']=radioValue['id'];
          records['varCode']=radioValue['variableCode'];
          records['varName']=radioValue['variableName'];
          records['varType']=radioValue['variableType'];
          records['enumFlag']=radioValue['enumFlag'];
          records['enumList']=radioValue['variableEnumList'];
          records['varTypeStr'] = radioValue['variableTypeStr']
          records['soleKey'] = Math.random()
          records['inputCreateTime'] = moment().format('YYYY-MM-DD HH:mm:ss')
        }
        Object.assign(records,radioValue)
        console.log(records)
        return records
      }
  }
  deepCopy =(obj)=> {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是一个对象
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj;
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
    //清除二级分类内容
    this.props.dispatch({
      type: 'varList/twoClassHandle',
      payload: {
        data:[]
      }
    })
  }
 async componentWillMount(){
    const {queryData} = this.props;
    //请求变量列表
   await this.props.dispatch({
      type: 'varList/queryVarList',
      payload: {
        ...queryData,
      }
    })
    //请求一级变量分类
   await this.props.dispatch({
      type: 'varList/queryOneClassList',
      payload: {
        firstTypeId:0,
        secondTypeId:'',
      }
    })
  }
  componentDidMount () {
    this.props.getSubKey(this,'addForm')
  }
  componentWillUnmount(){
    console.log('componentWillUnMount')
    //清空数据
    this.props.dispatch({
      type: 'varList/varListHandle',
      payload: {
       data:{
         records:[],
         current:1,
         size:10,
         total:0,
       }
      }
    })
    this.emptyCheck()
  }
  emptyCheck=()=>{
    this.setState({
      checkedList:[],
      checkAll:false,
      radioValue:''
    })
  }
  componentWillReceiveProps(newProps){
    this.setState({
      visible:newProps.showState
    })
  }
  //一级分类选择监听事件
  oneClassHandle=(value)=>{
    console.log(value)
    this.props.form.setFields({
      secondTypeId: {
        value:''
      },
    });
    //二级分类列表查询
    this.props.dispatch({
      type: 'varList/queryTwoClassList',
      payload: {
        firstTypeId:value,
      }
    })
  }
  //   将已经选择的变量禁止重新选择一遍
  duplicateRemoval(varList = [], pageList = []) {
    varList.forEach((n)=>{
      let aaa = []
      n.disabled = false
      pageList.forEach(( m ) => {
        var tt=n.id.toString()
        var kk=m.id.toString()
        if(tt.indexOf(kk)!=-1){
          n.disabled = true
          aaa.push(n)
        } else {
          aaa.push(n)
        }
      })
      return aaa
    })
    return varList
  }
  subName=(name)=>{
    let newName;
    if(name&&name.length>10){
      newName=name.substring(0,10)+'...'
    }else{
      newName=name
    }
    return newName;
  }
  //页码复位
  changeCurrent=(page)=>{
    this.setState({
      currPage:page,
    })
  }
  render() {
    const {visible,loading} = this.state;
    const { getFieldDecorator } = this.props.form
    const { varList,page,oneClassList,twoClassList } = this.props.varList
    const { pageList } = this.props
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:16},
    }
    return (
        <Form
          className="ant-advanced-search-form"
        >
          <Row style={{marginBottom:'32px'}} gutter={16} type="flex" align="middle">
            <Col xxl={6} md={10}>
              <FormItem label="变量分类"  wrapperCol={{span:8}}>
                {getFieldDecorator('firstTypeId',{
                })(
                    <Select
                      allowClear={false}
                      onChange={this.oneClassHandle}
                      placeholder="一级分类"
                    >
                      {
                        oneClassList&&oneClassList.map((item,index)=>{
                          return (
                            <Option value={item.id} key={index}>{item.typeName}</Option>
                          )
                        })
                      }
                    </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={4} md={8}>
              <FormItem wrapperCol={{span:16}}>
                {getFieldDecorator('secondTypeId',{
                })(
                  <Select
                    allowClear={false}
                    placeholder="二级分类"
                  >
                    {
                      twoClassList&&twoClassList.map((item,index)=>{
                        return (
                          <Option value={item.id} key={index}>{item.typeName}</Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={6} md={10}>
              <FormItem label="变量名称" {...formItemConfig}>
                {getFieldDecorator('variableName',{
                  initialValue:''
                })(
                  <Input placeholder="请输入变量名称!"/>
                )}
              </FormItem>
            </Col>
            <Col offset={2}>
              <Button type="primary" onClick={this.formSubmit}>查询</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={this.reset}>清空查询</Button>
            </Col>
          </Row>
          <Divider />
          <div style={{marginBottom:'32px'}}>
            {
              this.props.type?
                <Checkbox.Group style={{ width: '100%' }} value={this.state.checkedList} onChange={this.onChange}>
                  {
                    this.duplicateRemoval(varList, pageList).length > 0 ? this.duplicateRemoval(varList, pageList).map((item, index) => {
                      return  <Row type="flex" align="middle" key={index}>
                        <Col span={8}>
                          <Checkbox disabled={item.disabled} value={item}>{this.subName(item.variableName)}</Checkbox>
                        </Col>
                        <Col span={8}>{item.variableTypeStr}</Col>
                        <Col span={8}>{item.remark?item.remark:'---'}</Col>
                      </Row>
                    }):<Empty />
                  }
                </Checkbox.Group>:
                <RadioGroup style={{ width: '100%' }} value={this.state.radioValue} onChange={this.onRadioChange}>
                  {
                    this.duplicateRemoval(varList, pageList).length > 0 ? this.duplicateRemoval(varList, pageList).map((item, index) => {
                      return  <Row type="flex" align="middle" key={index}>
                        <Col span={8}>
                          <Radio disabled={item.disabled} value={item}>{this.subName(item.variableName)}</Radio >
                        </Col>
                        <Col span={8}>{item.variableTypeStr}</Col>
                        <Col span={8}>{item.remark?item.remark:'---'}</Col>
                      </Row>
                    }):<Empty />
                  }
                </RadioGroup>
            }
          </div>
          <Divider />
          <Row style={{marginBottom:'32px'}} type="flex" align="middle" justify="space-between">
            <Col>
              {
                this.props.type?
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    全选
                  </Checkbox>:null
              }
            </Col>
            <Col>
              <Pagination
                style={{ marginBottom: "50px" }}
                showQuickJumper
                defaultCurrent={1}
                current={this.state.currPage}
                total={page.totalNum}
                onChange={this.onPageChange}
                showTotal={(total, range) => this.showTotal(total, range)}
              />
            </Col>
          </Row>
        </Form>
    )
  }
}
