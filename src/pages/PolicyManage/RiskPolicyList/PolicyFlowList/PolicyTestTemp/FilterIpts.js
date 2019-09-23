import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import styles from '../../../FilterIpts.less'
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({policyTestTemp})=>({
  policyTestTemp
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    this.props.changeDefault(1)
    const formData = this.getFormValue()
    await this.props.dispatch({
      type: 'policyTestTemp/saveQueryData',
      payload: {
        ...formData,
      }
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
    const { getFieldDecorator } = this.props.form;
    const { userList } = this.props.policyTestTemp;
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin}  gutter={24}>
          <Col
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="模板名称" {...formItemConfig}>
              {getFieldDecorator('templateName',{
                initialValue:'',
                rules:[
                  {max:20,message:'最多输入20位!'}
                ]
              })(
                <Input maxLength={21}/>
              )}
            </FormItem>
          </Col>
          <Col
            xxl = { 4 }
            xl = { 6 }
            lg = { 8 }
            md = { 10 }
          >
            <FormItem label="负责人" {...formItemConfig}>
              {getFieldDecorator('updateBy',{
                initialValue:''
              })(
                <Select  allowClear={true}  >
                  {
                    userList.length&&userList.map((item,index)=>{
                      return (
                        <Option value={item.id} key={index}>{item.trueName}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <FormItem>
            <Button type="primary" onClick={this.formSubmit}>查询</Button>
            <Button type="primary" onClick={this.reset}>清空</Button>
          </FormItem>
        </Row>
      </Form>
    )
  }
}
