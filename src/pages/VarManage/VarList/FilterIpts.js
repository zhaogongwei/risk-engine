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

@connect(({ varlist }) => ({
  varlist,
}))
@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    const formData = this.getFormValue()
    await this.props.dispatch({
      type: 'varlist/changefilterIpts',
      payload: formData,
    })
		this.props.changeDefault(1)
		this.props.change(1)
  }
   selectchange = value => {
  	this.props.dispatch({
      type: 'varlist/getSelectLevel2',
      payload: {
      	id:value
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
  	this.props.dispatch({
      type: 'varlist/getSelectLevel1',
      payload: {
      	
      }
    })
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
        <Row className={styles.btmMargin}  type="flex" align="middle">
          <Col xxl={4} md={6}>
            <FormItem label="变量名" {...formItemConfig}>
              {getFieldDecorator('assetsTypeName',{
                initialValue:''
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="变量分类" {...formItemConfig}>
              {getFieldDecorator('status',{
                initialValue:''
              })(
                <Select allowClear={true} onChange={this.selectchange}>
                  {this.props.varlist.selectItem.map((item,index)=> (
				             <Option value={item.id} key={index}>{item.name}</Option>
				          ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={3} md={4}>
            <FormItem label="" >
               {getFieldDecorator('itemStatus',{
                initialValue:''
              })(
                <Select allowClear={true}>
                 {this.props.varlist.secondSelectItem.map( (item,index) => (
				             <Option value={item.id} key={index}>{item.name}</Option>
				          ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="变量代码" {...formItemConfig}>
              {getFieldDecorator('assetsTypeCode',{
                initialValue:''
              })(
                <Input />
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
