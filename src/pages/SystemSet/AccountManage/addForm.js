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
  //显示弹窗
  showModal = ()=>{

  }
  //设置加载状态
  setLoading=(status)=>{
    this.setState({
      loading:status
    })
  }
  //点击确定
  submitHandler = ()=> {
    this.props.form.validateFields((err, values) => {
      if(!err){

      }
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
  }

  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };
  render() {
    const { modalVisible, type, addEdit } = this.props;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{ span:6 },
      wrapperCol:{ span:16 },
    }
    return (
      <Modal
        title={type === 1 ? '新增账号': '修改账号'}
        visible={modalVisible}
        onOk={this.submitHandler}
        onCancel={()=>addEdit(false)}
      >
        <Form className="ant-advanced-search-form" >
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="用户名" {...formItemConfig}>
                {getFieldDecorator('username',{
                  initialValue: null,
                  rules:[{
                    required:true,
                    message: '请输入用户名'
                  }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="密码" {...formItemConfig}>
                {getFieldDecorator('password',{
                  initialValue: null,
                  rules:[{
                    required:true,
                    message: '请输入密码'
                  }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="确认密码" {...formItemConfig}>
                {getFieldDecorator('comfirmWord',{
                  initialValue: null,
                  rules:[{
                    required:true,
                    message: '请输入确认密码'
                  }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="姓名" {...formItemConfig}>
                {getFieldDecorator('name',{
                  initialValue: null,
                  rules:[{
                    required:true,
                    message: '请输入姓名'
                  }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="邮箱" {...formItemConfig}>
                {getFieldDecorator('email',{
                  initialValue:'',
                  rules:[{
                    required: false
                  }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="手机号码" {...formItemConfig}>
                {getFieldDecorator('mobile',{
                  initialValue:'',
                  rules:[{
                    required:true,
                    message: '请输入手机号码'
                  }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="角色" {...formItemConfig}>
                {getFieldDecorator('role',{
                  initialValue:'',
                  rules:[{
                    required:true,
                    message: '请输入角色'
                  }]
                })(
                  <Select allowClear={true}>
                    <Option value={1} >是</Option>
                    <Option value={0} >否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="用户状态"  {...formItemConfig}>
                {getFieldDecorator('status',{
                  initialValue: null,
                  rules: [
                    { required: true, message: '用户状态为必选'}
                  ]})(
                    <RadioGroup>
                      <Radio value={1}>启用</Radio>
                      <Radio value={2}>禁用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
