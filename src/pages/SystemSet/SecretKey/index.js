import React, { Component } from 'react'
import {
	Card,
  Radio,
  Modal,
  Row,
	Col,
	Button,
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

@connect(({ secret }) => ({
  secret
}))

@Form.create()

export default class IndexComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }
  //点击确定
  submitHandler = ()=>{
    this.props.form.validateFields(async(err, values) => {
      if(!err){
				const { dispatch } = this.props;
				const confirmVal = await Swal.fire({
					text: '生成新秘钥会导致原秘钥失效，是否确认生成？',
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				})
				if(confirmVal.value){
					const { dispatch } =  this.props;
					let res = await dispatch({
						type: 'secret/delRole',
						payload: {
							roleId
						}
					})
					if(res && res.status == 1) {
						message.success(res.statusDesc);
						this.change()
					}
				}
      }
    })
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
  }

  render() {
    const { updateVisible, isShowEdit, type } = this.props
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
			<Card bordered={false}>
				<Form>
					<FormItem label="priKey" {...formItemLayout}>
						{getFieldDecorator('roleExplain',{
							initialValue: type == 2 ? roleInfo && roleInfo.roleExplain : null,
							rules:[{
								required:true,
								message: '请输入priKey'
							}]
							})(
								<TextArea rows={6} placeholder="" />
							)}
					</FormItem>
					<FormItem label="pubKey" {...formItemLayout}>
						{getFieldDecorator('pubKey',{
							initialValue: type == 2 ? roleInfo && roleInfo.roleExplain : null,
							rules:[{
								required:true,
								message: '请输入pubKey'
							}]
							})(
								<TextArea rows={6} placeholder="" />
							)}
						</FormItem>
						<FormItem {...submitFormLayout}>
							<Button type="primary" htmlType="submit" onClick={this.submitHandler}>
								生成新密钥
							</Button>
						</FormItem>
      	</Form>
			</Card>
    )
  }
}
