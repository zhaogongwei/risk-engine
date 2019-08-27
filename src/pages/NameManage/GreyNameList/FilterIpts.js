import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({
  greyName
}) => ({
  greyName
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    // this.props.changeDefault(1)
    const formData = this.getFormValue()
    console.log(formData, 'formData')
    await this.props.dispatch({
      type: 'greyName/saveQueryData',
      payload: formData
    })
    this.props.change(1)
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
    this.props.getSubKey(this,'child')
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{
        xs: { span: 3 },
        sm: { span: 7 }
      },
      wrapperCol:{
        xs: { span: 21 },
        sm: { span: 17 }
      },
    }
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row  style={{ marginBottom: 20 }} gutter={16}>
          <Col 
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="姓名" {...formItemConfig}>
              {getFieldDecorator('name')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="身份证号" {...formItemConfig}>
              {getFieldDecorator('idcard')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="手机号" {...formItemConfig}>
              {getFieldDecorator('mobile')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="灰名单来源" {...formItemConfig}>
              {getFieldDecorator('greyType')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col 
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem>
              <Button type="primary" onClick={this.formSubmit}>查询</Button>
              <Button type="primary" onClick={this.reset}>清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
