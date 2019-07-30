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
  changeHandler=(e)=>{
    console.log(e)
  }
  componentDidMount () {
    this.props.getSubKey(this,'child')
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { resultVarId } = this.props
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row  gutter={24} >
          <Col xxl={4} md={6}>
            <FormItem label="规则条件" {...formItemConfig}>
              {getFieldDecorator('ruleCondition',{
                initialValue:''
              })(
                <Select allowClear={true}>
                  <Option value={'or'}>命中任一规则</Option>
                  <Option value={'and'}>命中全部规则</Option>
                  <Option value={'count'}>计数命中规则</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="输出结果" {...formItemConfig}>
              {getFieldDecorator('resultVarId',{
                initialValue:resultVarId['variableName']?resultVarId['variableName']:''
              })(
                <Input
                  onClick={()=>this.props.outResult()}
                  readOnly
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}



