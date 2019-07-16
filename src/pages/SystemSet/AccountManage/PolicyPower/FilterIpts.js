import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Select,
  Form
} from 'antd';
import styles from '../../FilterIpts.less'
import { connect } from 'dva'
const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item

@connect()

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    this.props.changeDefault(1)
    const formData = this.getFormValue()
    this.props.dispatch({
      type: 'assetDeploy/riskSubmit',
      data: {
        ...formData,
        "currPage": 1,
        "pageSize": 10
      }
    })

  }
  //   获取表单信息
  getFormValue = () => {
    let formData = this.props.form.getFieldsValue();
    if (formData.metaTime&&formData.metaTime.length) {
      formData.createTimeStart = moment(formData.metaTime[0]).format('YYYY-MM-DD')
      formData.createTimeEnd = moment(formData.metaTime[1]).format('YYYY-MM-DD')
    }
    return formData;
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
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin}  type="flex" align="middle">
          <Col xxl={4} md={6}>
            <FormItem label="策略名称" {...formItemConfig}>
              {getFieldDecorator('policyName',{
                initialValue:''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="授权状态" {...formItemConfig}>
              {getFieldDecorator('status',{
                initialValue:''
              })(
                <Select allowClear={true}>
                  <Option value={1}>启用</Option>
                  <Option value={2}>禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="当前负责人" {...formItemConfig}>
              {getFieldDecorator('status',{
                initialValue:''
              })(
                <Select allowClear={true}>
                  <Option value={1}>启用</Option>
                  <Option value={2}>禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col className={styles.registBtn} xxl={{ span: 4}} md={{ span: 6}} offset={1}>
            <Button type="primary" onClick={this.formSubmit}>查询</Button>
            <Button type="primary" onClick={this.reset}>清空</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
