import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  DatePicker,
  Form
} from 'antd';
import styles from '../FilterIpts.less'
import { connect } from 'dva'
const { RangePicker } = DatePicker;
const Option = Select.Option;
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
            <FormItem label="用户名" {...formItemConfig}>
              {getFieldDecorator('username',{
                initialValue:''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="姓名" {...formItemConfig}>
              {getFieldDecorator('name',{
                initialValue:''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="操作时间" {...formItemConfig}>
              {getFieldDecorator('metaTime',{
                initialValue:''
              })(
                <RangePicker style={{width:210}}/>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="操作类型" {...formItemConfig}>
              {getFieldDecorator('assetsTypeCode',{
                initialValue:''
              })(
                <Select allowClear={true}>
                  <Option value={1}>启用</Option>
                  <Option value={2}>禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col className={styles.registBtn} xxl={{ span: 4}} md={{ span: 6}} offset={2}>
            <Button type="primary" onClick={this.formSubmit}>查询</Button>
            <Button type="primary" onClick={this.reset}>清空</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
