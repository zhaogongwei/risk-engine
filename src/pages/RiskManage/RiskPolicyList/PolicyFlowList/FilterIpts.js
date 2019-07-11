import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import styles from '../../FilterIpts.less'
import { connect } from 'dva'
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
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin}  gutter={24} type="flex" align="middle">
          <Col xxl={4} md={6}>
            <FormItem label="策略类型" {...formItemConfig}>
              {getFieldDecorator('policyType',{
                initialValue:''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
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
            <FormItem label="负责人" {...formItemConfig}>
              {getFieldDecorator('modelName',{
                initialValue:''
              })(
                <Select  allowClear={true}  >
                  <Option value={'month'}>等额本息</Option>
                  <Option value={'end'}>按月计息,到期还本还息</Option>
                  <Option value={'endmonth'}>先息后本</Option>
                  <Option value={'endday'}>按天计息,到期还本还息</Option>
                  <Option value={'principal'}>等额本金</Option>
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
