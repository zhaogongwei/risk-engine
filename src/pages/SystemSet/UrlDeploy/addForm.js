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
import styles from '../FilterIpts.less'
import { connect } from 'dva'
const FormItem = Form.Item

@connect(({ urldeploy }) => ({
  urldeploy
}))

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
    this.props.getSubKey(this,'addForm');
  }

  render() {
    const { visible, type, addEditPage } = this.props;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{ span: 6 },
      wrapperCol:{ span: 16 },
    }
    return (
      <Modal
        title={this.state.type === 1 ? '新增接口' : '修改接口'}
        visible={visible}
        onOk={this.submitHandler}
        onCancel={()=> addEditPage(false)}
      >
        <Form className="ant-advanced-search-form">
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="接口名称" {...formItemConfig}>
                {getFieldDecorator('username',{
                  initialValue:'',
                  rules:[{
                    required:true,
                    message: '请输入接口名称'
                  }]
                })(
                  <Input/>
                  )}
                </FormItem>
            </Col>
          </Row>
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="异步通知地址" {...formItemConfig}>
                {getFieldDecorator('password',{
                  initialValue:'',
                  rules:[{
                    required:true,
                    message: '请输入异步通知地址'
                  }]
                  })(
                  <Input/>
                  )}
                </FormItem>
            </Col>
          </Row>
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="同步跳转地址" {...formItemConfig}>
                {getFieldDecorator('comfirmWord',{
                  initialValue:'',
                  rules:[{
                    required:true,
                    message: '请输入同步跳转地址'
                  }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
