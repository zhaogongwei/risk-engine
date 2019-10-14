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
import permission from '@/utils/PermissionWrapper';
const Option = Select.Option;
const FormItem = Form.Item
const Status = [{
  key: 1,
  value: '初始'
},{
  key: 2,
  value: '生成中',
},{
  key: 3,
  value: '已生成'
},{
  key: 4,
  value: '异常'
}]

const verify = [
  {
    key:1,
    value:'自动审核拒绝'
  },
  {
    key:2,
    value:'自动审核通过'
  },
  {
    key:3,
    value:'待人工审核'
  },
  {
    key:4,
    value:'异常'
  },
]
@permission
@connect(({ reportList }) => ({
  reportList
}))

@Form.create()

export default class FilterIpts extends Component {
  state={
  }
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
    this.props.form.setFields({
      presentationName:{
        value:''
      }
    })
    this.props.dispatch({
      type: 'reportList/setTemplateId',
      payload: ''
    })
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'child')
    this.props.form.setFields({
      presentationName:{
        value:this.props.presentationName
      }
    })
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
    const {permission}=this.props;
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin} gutter={16}>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="资产编号" {...formItemConfig}>
              {getFieldDecorator('assetsCode')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="报告名称" {...formItemConfig}>
              {getFieldDecorator('presentationName',{
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem label="审核结果" {...formItemConfig}>
              {getFieldDecorator('approvalResult')(
                <Select>
                  {
                    verify.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
                  }
                </Select>
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
              {getFieldDecorator('status')(
                <Select>
                  {
                    Status.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} xl={6} lg={8} md={10}>
            <FormItem>
              {
                permission.includes('re:reportReturn:list')?
                  <Button type="primary" onClick={this.formSubmit}>查询</Button>:null
              }
              <Button type="primary" onClick={this.reset}>清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
