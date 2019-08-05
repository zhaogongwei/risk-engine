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
  state={
    visible:false,
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
  //计数结果显隐控制
  changeHandle=(e)=>{
    if(e==='count'){
      this.setState({
        visible:true,
      })
    }else{
      this.setState({
        visible:false,
      })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { resultVarId,countResult } = this.props
    const { visible } = this.state
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
                <Select allowClear={true} onChange={this.changeHandle}>
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
                  onClick={()=>this.props.outResult(0)}
                  readOnly
                />
              )}
            </FormItem>
          </Col>
          {
            visible?
              <Col xxl={4} md={6}>
                <FormItem label="计数结果" {...formItemConfig}>
                  {getFieldDecorator('tally',{
                    initialValue:countResult['variableName']?countResult['variableName']:''
                  })(
                    <Input
                      onClick={()=>this.props.outResult(1)}
                      readOnly
                    />
                  )}
                </FormItem>
              </Col>:null
          }
        </Row>
      </Form>
    )
  }
}



