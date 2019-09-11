import React, { Component,Fragment } from 'react'
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
  message,
  Button
} from 'antd';
import { connect } from 'dva'
import forge from 'node-forge';
const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account
}))

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      value:[],
      changePsw:false
    }
  }

  // MD5加密
  MD5 = (val) => {
    const md5 = forge.md.md5.create();
    const psw = md5.update(val).digest().toHex();
    return psw
  }
  //点击确定
  submitHandler = ()=> {
    const { dispatch } = this.props;
    const { infoData }=  this.props.account;
    this.props.form.validateFields(async(err, values) => {
      if(!err){
        if(this.props.type == 1) {
          values.password = await this.MD5(values.password);
          values.confirmPassword = await this.MD5(values.confirmPassword);
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
        if(this.props.type == 2) {
          if(this.state.changePsw) {
            let res = await dispatch({
              type: 'account/updatePsw',
              payload: {
                password: await this.MD5(values.password),
                confirmPassword: await this.MD5(values.confirmPassword),
                id: infoData.id
              }
            })
            if(res && res.status == 1){
              message.success(res.statusDesc);
            }else {
              message.error(res.statusDesc);
            }
          }
          let res = await dispatch({
            type: 'account/updateAccount',
            payload: {
              id: infoData.id,
              ...values
            }
          })
          if(res && res.status == 1) {
            message.success(res.statusDesc);
            this.props.addEdit(false);
            this.props.change(this.props.currPage, this.props.pageSize);
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
    
  }

  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };
   // 校验用户名
   checkUserName = async(rules, value, callback) => {
    const { dispatch } =  this.props;
    const { infoData }=  this.props.account;
    if (!value) {
      callback('请输入用户名');
      return;
    }
    if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,15}$/).test(value)) {
      callback('用户名必须为5-15位数的字母+数字')
      return;
    }
    let res = await dispatch({
      type: 'account/checkUserName',
      payload: {
        userName: value,
        id: infoData.id
      }
    })
    if(res && res.status == 1) {
      callback()
    }else {
      callback(res.statusDesc)
    }
    callback()
  }

  // 校验确认密码
  checkConfirmPassword = (rules, value, callback) => {
    if (!value) {
      callback(new Error('请输入确认密码'));
      return;
    }
    if (value && value !== this.props.form.getFieldValue('password')) {
      callback(new Error('密码不一致'))
      return
    }
    callback()
  }

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
        confirmLoading={this.props.loading}
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
                    validator: this.checkUserName
                  }]
                })(
                  <Input autoComplete="off"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginBottom:10, display: type == 2 ? 'block' : 'none' }}>
            <Col xxl={20} md={12}>
              <FormItem label="修改密码" {...formItemConfig}>
                <Button type="primary" onClick={()=>{
                  this.setState({
                    changePsw: true
                  })
                }}>修改</Button>
              </FormItem>
            </Col>
          </Row>
          {
            type == 1 || this.state.changePsw ? 
            <Fragment>
              <Row style={{ marginBottom:10 }}>
                <Col xxl={20} md={12}>
                  <FormItem label="密码" {...formItemConfig}>
                    {getFieldDecorator('password',{
                      rules:[{
                        required:true,
                        message: '请输入密码'
                      }]
                    })(
                      <Input type="password" autoComplete="new-password" onChange={()=>{
                        if(this.props.form.getFieldValue('confirmPassword')){
                          this.props.form.setFieldsValue({
                            confirmPassword: ''
                          })
                        }
                      }}/>
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
                        validator: this.checkConfirmPassword
                      }]
                    })(
                      <Input type="password"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
          </Fragment> : null
          }
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
                  <Input maxLength={15}/>
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
                  },{
                    type: 'email',
                    message: '应为邮箱格式'
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
                    pattern: /^1[34578]\d{9}$/,
                    message: '请输入手机号码'
                  }]
                })(
                  <Input maxLength={11}/>
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
