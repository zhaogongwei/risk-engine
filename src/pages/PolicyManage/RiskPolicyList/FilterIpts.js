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

@permission
@connect(({policyList})=>({
  policyList
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    this.props.changeDefault(1)
    const formData = this.getFormValue()
    await this.props.dispatch({
      type: 'policyList/saveQueryData',
      payload: {
        ...formData
      }
    })
    this.props.change(1, this.props.pageSize)
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
    const { policyTypeList } = this.props.policyList
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
    const {permission} = this.props;
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin}  gutter={16}>
          <Col 
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="策略类型" {...formItemConfig}>
              {getFieldDecorator('strategyType',{
                initialValue:''
              })(
                <Select allowClear={true}>
                  {
                    policyTypeList&&policyTypeList.map((item,index)=>{
                      return (
                        <Option value={item.code} key={index}>{item.value}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col 
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="策略名称" {...formItemConfig}>
              {getFieldDecorator('strategyName',{
                initialValue:'',
                rules:[
                  {max:20,message:'最多输入20位!'}
                ]
              })(
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
            <FormItem label="策略代码" {...formItemConfig}>
              {getFieldDecorator('strategyCode',{
                initialValue:'',
                rules:[
                  {max:20,message:'最多输入20位!'}
                ]
              })(
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
              {
                permission.includes('re:strategy:list')?
                  <Button type="primary" onClick={this.formSubmit}>查询</Button> : null
              }
              <Button type="primary" onClick={this.reset}>清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
