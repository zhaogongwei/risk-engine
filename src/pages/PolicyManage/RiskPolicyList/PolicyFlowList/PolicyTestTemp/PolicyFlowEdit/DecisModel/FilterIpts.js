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
  componentDidMount () {
    this.props.getSubKey(this,'child')
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { resultVarId,rowVar,colVar } = this.props
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
            <FormItem label="行变量" {...formItemConfig}>
              {getFieldDecorator('assetsTypeName',{
                initialValue:rowVar['variableName']?rowVar['variableName']:''
              })(
                <Input
                  onClick={()=>this.props.openDialog(0)}
                  readOnly
                />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="列变量" {...formItemConfig}>
              {getFieldDecorator('assetsTypeCode',{
                initialValue:colVar['variableName']?colVar['variableName']:''
              })(
                <Input
                  onClick={()=>this.props.openDialog(1)}
                  readOnly
                />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="输出变量" {...formItemConfig}>
              {getFieldDecorator('assetsTypeCode1',{
                initialValue:resultVarId['variableName']?resultVarId['variableName']:''
              })(
                <Input
                  onClick={()=>this.props.openDialog(2)}
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



