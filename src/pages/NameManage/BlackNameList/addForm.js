import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Spin,
  TreeSelect,
  Form
} from 'antd';
import { connect } from 'dva'
const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { SHOW_PARENT } = TreeSelect;
const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];
@connect()

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      value:[],
      loading:true
    }
  }
  //点击确定
  submitHandler = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) return
    })
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    formQueryData.assetsTypeName=formQueryData.assetsTypeName.trim()
    formQueryData.assetsTypeCode=formQueryData.assetsTypeCode.trim()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'addForm');
    setTimeout(()=>{
      this.setState({
        loading:false
      })
    },3000)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:16},
    }
    return (
      <Form>
        <FormItem label="姓名" {...formItemConfig}>
          {getFieldDecorator('trueName', {
            rules: [
              {
                required: true,
                message: '请输入姓名'
              }
            ]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label="身份证号" {...formItemConfig}>
          {getFieldDecorator('idCard', {
            rules: [
              {
                required: true,
                message: '请输入身份证号'
              }
            ]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label="性别" {...formItemConfig}>
          {getFieldDecorator('sex', {
            rules: [
              {
                required: true,
                message: '请输入性别'
              }
            ]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label="手机号" {...formItemConfig}>
          {getFieldDecorator('mobile', {
            rules: [
              {
                required: true,
                message: '请输入手机号'
              }
            ]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label="状态"  {...formItemConfig}>
          {getFieldDecorator('status', {
            rules: [
              { required: true, message: '角色状态为必选'}
            ],
          })(
            <RadioGroup>
              <Radio value={1}>启用</Radio>
              <Radio value={2}>禁用</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
}
