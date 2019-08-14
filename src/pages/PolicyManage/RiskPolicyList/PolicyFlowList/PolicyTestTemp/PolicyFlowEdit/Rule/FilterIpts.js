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

@connect(({rule})=>({
  rule
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
    formQueryData.ruleCondition==='count'?formQueryData.countVarId=countResult['countVarId']:formQueryData.countVarId='';
    formQueryData.resultVarId=resultVarId['resultVarId'];
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'child');
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
    const { getFieldDecorator } = this.props.form;
    const { resultVarId,countResult } = this.props;
    const { formData } = this.props.rule;
    const { visible } = this.state;
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    console.log(resultVarId,countResult)
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
            (visible||formData['ruleCondition']==='count')?
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



