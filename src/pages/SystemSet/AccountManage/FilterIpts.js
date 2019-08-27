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
import { connect } from 'dva'
import moment from 'moment';
import styles from '../FilterIpts.less'

const Option = Select.Option;
const { RangePicker } = DatePicker;
const FormItem = Form.Item

@connect(({ account }) => ({
  account
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    const formData = this.getFormValue()
    const { dispatch } =  this.props;
    await dispatch({
      type:'account/setQueryConfig',
      payload: formData
    })
    this.props.change(1, this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    let formData = this.props.form.getFieldsValue();
    if (formData.createTime && formData.createTime.length) {
      formData.startTime = moment(formData.createTime[0]).format('YYYY-MM-DD')
      formData.endTime = moment(formData.createTime[1]).format('YYYY-MM-DD')
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
              {getFieldDecorator('userName')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="姓名" {...formItemConfig}>
              {getFieldDecorator('trueName')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="邮箱" {...formItemConfig}>
              {getFieldDecorator('email')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="手机号码" {...formItemConfig}>
              {getFieldDecorator('mobile')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="添加时间" {...formItemConfig}>
              {getFieldDecorator('createTime')(
                <RangePicker style={{width:210}}/>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="用户状态" {...formItemConfig}>
              {getFieldDecorator('status')(
                <Select allowClear={true}>
                  <Option value={0}>启用</Option>
                  <Option value={1}>禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="角色" {...formItemConfig}>
              {getFieldDecorator('roleName')(
                <Input />
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
