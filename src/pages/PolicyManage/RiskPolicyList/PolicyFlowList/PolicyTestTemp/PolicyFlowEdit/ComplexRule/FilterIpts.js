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

@connect(({complex})=>({
  complex
}))

@Form.create()

export default class FilterIpts extends Component {
  state={
    visible:false,
  }
  //   获取表单信息
  getFormValue = () => {
    const {resultVarId,countResult} = this.props;
    let formQueryData = this.props.form.getFieldsValue();
    formQueryData.resultVarId=resultVarId['resultVarId'];
    formQueryData.ruleCondition==='count'?formQueryData.countVarId=countResult['countVarId']:formQueryData.countVarId='';
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
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
  componentDidMount () {
    this.props.getSubKey(this,'child')
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const { resultVarId,countResult } = this.props;
    const { formData } = this.props.complex;
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
                initialValue:formData['ruleCondition'],
                rules:[
                  {
                    required:true,
                    message:'规则条件不能为空!'
                  }
                ]
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
                initialValue:resultVarId['resultVarValue']?resultVarId['resultVarValue']:'',
                rules:[
                  {
                    required:true,
                    message:'输出结果不能为空!'
                  }
                ]
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
                  {getFieldDecorator('countVarId',{
                    initialValue:countResult['countVarValue']?countResult['countVarValue']:'',
                    rules:[
                      {
                        required:true,
                        message:'计数结果不能为空!'
                      }
                    ]
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



