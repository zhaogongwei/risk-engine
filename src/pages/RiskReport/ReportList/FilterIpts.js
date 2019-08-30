import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import styles from '../FilterIpts.less'
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ reportList }) => ({
  reportList
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    const formData = await this.getFormValue()
    await this.props.dispatch({
      type: 'reportList/setQueryConfig',
      payload: formData
    })
    this.props.change(1, this.props.pageSize);
  }
  //   获取表单信息
  getFormValue = () => {
    return this.props.form.getFieldsValue()
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
        <Row className={styles.btmMargin}  gutter={16}>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="资产编号" {...formItemConfig}>
              {getFieldDecorator('assetsCode')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="报告名称" {...formItemConfig}>
              {getFieldDecorator('presentationName')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="审核结果" {...formItemConfig}>
              {getFieldDecorator('approvalResult')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="策略名称" {...formItemConfig}>
              {getFieldDecorator('strategyName')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="报告状态" {...formItemConfig}>
              {getFieldDecorator('assetsTypeCode')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
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
