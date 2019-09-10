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
import styles from '../FilterIpts.less'
import { connect } from 'dva'
const FormItem = Form.Item

@connect(({ urldeploy, loading }) => ({
  urldeploy,
  loading: loading.models.urldeploy
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
    const { dispatch, type, id, addEditPage, change, currPage, pageSize } = this.props;
    this.props.form.validateFields(async(err, values) => {
      if(!err){
        if(type == 1) {
          let res = await dispatch({
            type: 'urldeploy/addInterface',
            payload: values
          })
          if(res && res.status === 1) {
            message.success(res.statusDesc)
            addEditPage(false);
            change()
          }
        }
        if(type == 2) {
          let res = await dispatch({
            type: 'urldeploy/updateInterface',
            payload: {
              ...values,
              id
            }
          })
          if(res && res.status == 1) {
            message.success(res.statusDesc)
            addEditPage(false)
            change(currPage, pageSize)
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
  
  componentDidMount () {
    this.props.getSubKey(this,'addForm');
  }

  render() {
    const { visible, type, addEditPage } = this.props;
    const { Detail } =  this.props.urldeploy;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{ span: 6 },
      wrapperCol:{ span: 16 },
    }
    return (
      <Modal
        title={this.props.type === 1 ? '新增接口' : '修改接口'}
        confirmLoading={this.props.loading}
        visible={visible}
        onOk={this.submitHandler}
        onCancel={()=> addEditPage(false)}
      >
        <Form>
          <FormItem label="接口名称" {...formItemConfig}>
            {getFieldDecorator('name',{
              initialValue: this.props.type === 2 ? Detail.name : null,
              rules:[{
                required:true,
                message: '请输入接口名称'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="异步通知地址" {...formItemConfig}>
            {getFieldDecorator('asyncNotifiAddress',{
              initialValue: this.props.type === 2 ? Detail.asyncNotifiAddress : null,
              rules:[{
                required:true,
                message: '请输入异步通知地址'
              }]
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="同步跳转地址" {...formItemConfig}>
            {getFieldDecorator('syncJumpAddress',{
              initialValue: this.props.type === 2 ? Detail.syncJumpAddress : null,
              rules:[{
                required:true,
                message: '请输入同步跳转地址'
              }]
            })(
                <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
