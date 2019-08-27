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
  Form,
  message
} from 'antd';
import { connect } from 'dva'
const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(({ account }) => ({
  account
}))

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      value:[]
    }
  }
  //点击确定
  submitHandler = ()=> {
    const { dispatch } = this.props;
    this.props.form.validateFields(async(err, values) => {
      if(!err){
        console.log(values,'values')
        if(this.props.type == 1) {
          let res = await dispatch({
            type: 'account/addAccount',
            payload: {
              ...values
            }
          })
          if(res && res.status == 1) {
            message.success(res.statusDesc);
            this.props.addEdit(false);
            this.props.change()
          }else{
            message.error(res.statusDesc);
          }
        }
        
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
  async componentDidMount () {
    const { dispatch } = this.props;
    await dispatch({
      type: 'account/initData',
      payload: {}
    })
  }

  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };
  render() {
    const { modalVisible, type, addEdit } = this.props;
    const { userRoles } = this.props.account.initData;
    const { infoData } = this.props.account;
    const { getFieldDecorator } = this.props.form;
    const formItemConfig = {
      labelCol: { span:6 },
      wrapperCol: { span:16 },
    }
    return (
      <Modal
        title={ type === 1 ? '新增账号': '修改账号' }
        visible={modalVisible}
        onOk={this.submitHandler}
        onCancel={()=> addEdit(false)}
      >
        <Form className="ant-advanced-search-form" >
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="用户名" {...formItemConfig}>
                {getFieldDecorator('userName',{
                  initialValue: type == 2 ? infoData.userName: null,
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
                  rules:[{
                    required:true,
                    message: '请输入密码'
                  }]
                })(
                  <Input type="password"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="确认密码" {...formItemConfig}>
                {getFieldDecorator('confirmPassword',{
                  rules:[{
                    required:true,
                    message: '请输入确认密码'
                  }]
                })(
                  <Input type="password"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="姓名" {...formItemConfig}>
                {getFieldDecorator('trueName',{
                  initialValue: type == 2 ? infoData.trueName: null,
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
                  initialValue: type == 2 ? infoData.email: null,
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
                  initialValue: type == 2 ? infoData.mobile: null,
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
                {getFieldDecorator('roleId',{
                  initialValue: type == 2 ? infoData.roleId: null,
                  rules:[{
                    required:true,
                    message: '请输入角色'
                  }]
                })(
                  <Select allowClear={true}>
                    {
                      userRoles && userRoles.map(item=> <Option key={item.code} value={item.code} >{item.value}</Option>)
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10 }}>
            <Col xxl={20} md={12}>
              <FormItem label="用户状态"  {...formItemConfig}>
                {getFieldDecorator('status',{
                  initialValue: type == 2 ? infoData.status: null,
                  rules: [
                    { required: true, message: '用户状态为必选'}
                  ]})(
                    <RadioGroup>
                      <Radio value={0}>启用</Radio>
                      <Radio value={1}>禁用</Radio>
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
