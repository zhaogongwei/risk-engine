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
  Pagination
} from 'antd';
import { addListKey } from '@/utils/utils'
import { connect } from 'dva'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

@connect(({tempEdit})=>({
  tempEdit
}))

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible:false,
      checkedList: [],
    }
  }
  onChange = (checkedList) => {
    console.log('选中',checkedList)
  }

  //点击确定回调函数
  submitHandler = ()=>{
    let formData
    this.props.form.validateFields((errors,value)=>{
      if(!errors){
        formData = this.getFormValue();
      }else{
        formData = {}
      }
    })
    return formData
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
    formQueryData.title=formQueryData.title.trim()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'child')
  }
  //标题名称校验(在同一个报告中，标题唯一)
  checkTitle=(title)=>{
    const {titleList} = this.props.tempEdit;
    let status = true;
    for(let item of titleList){
      if(item['title'].trim()===title.trim()){
        status = false;
        break;
      }
    }
    return status
  }
  render() {
    const {visible,loading} = this.state;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:16},
    }
    return (
        <Form
          className="ant-advanced-search-form"
        >
          <Row  type="flex" align="middle" justify="center">
            <Col xxl={16} md={12}>
              <FormItem label="标题名称"  {...formItemConfig}>
                {getFieldDecorator('title',{
                  initialValue:'',
                  rules:[
                    {
                      required:true,
                      validator:async(rule, val, cb)=>{
                        if(!val){
                          cb('标题内容不能为空!')
                          return
                        }
                        if(val.length>8){
                          cb('标题长度最多8位!')
                          return
                        }
                        let status = this.checkTitle(val);
                        if(status){
                          cb()
                        }else{
                          cb('标题名字已存在!')
                        }
                      }
                    }
                  ]
                })(
                  <Input maxLength={9}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
    )
  }
}
