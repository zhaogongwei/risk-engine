import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Form
} from 'antd';
import { connect } from 'dva'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect()

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:false,
      title:'添加一级分类'
    }
  }
  //显示弹窗
  showModal = ()=>{

  }
  //点击确定
  submitHandler = ()=>{
    return this.getFormValue()
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
    this.props.getSubKey(this,'addForm')
  }
  componentWillReceiveProps(newProps){
    this.setState({
      visible:newProps.showState
    })
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
         <Row style={{marginBottom:10}} type="flex" justify="center">
            <Col xxl={20} md={20}>
              <FormItem label="策略名称" {...formItemConfig}>
                {getFieldDecorator('projectStatus',{
                  initialValue:''
                })(
                  <Select allowClear={true}>
                    <Option value={1}>准入策略1</Option>
                    <Option value={2}>准入策略2</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xxl={20} md={20}>
              <FormItem label="版本号" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:'',
                })(
                  <Select allowClear={true}>
                    <Option value={1}>1.0.0</Option>
                    <Option value={2}>2.0.0</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
    )
  }
}
