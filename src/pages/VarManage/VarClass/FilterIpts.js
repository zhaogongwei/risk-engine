import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
} from 'antd';
import styles from '../FilterIpts.less'
import { connect } from 'dva'
import permission from '@/utils/PermissionWrapper';
const Option = Select.Option;
const FormItem = Form.Item

@permission
@connect(({ varclass }) => ({
  varclass,
}))
@Form.create()

export default class FilterIpts extends Component {
	state = {
		
	}
  //查询
  formSubmit = async(e) => {
    
    const formData = this.getFormValue()
    await this.props.dispatch({
      type: 'varclass/changefilterIpts',
      payload: formData,
    })
		this.props.changeDefault(1)
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
  selectchange = value => {
    // 清空操作 不请求接口
    if(!value){
      // 清空二级分类选项 
      // TODO: 清空二级分类的选项值  以及 整合此处逻辑
      this.props.dispatch({
        type: 'varclass/changeSecondSelect',
        payload: {
          data:[]
        }
      })
      return false;
    }
  	this.props.dispatch({
      type: 'varclass/getSelectLevel2',
      payload: {
      	parentId:value
      }
    })
    this.props.form.setFieldsValue({
      id:''
    })
  }

    //编辑变量后清空数据
  classChangeGetSelect = async()=>{
  	this.props.dispatch({
      type: 'varclass/getSelectLevel1',
      payload: {
      	
      }
    })
  	await this.props.dispatch({
      type: 'varclass/changefilterIpts',
      payload: {},
    })
  	this.reset()
  }
  componentDidMount () {
  	this.getSelect()
    this.props.getSubKey(this,'child')
  }
  getSelect =() =>{
    this.props.dispatch({
      type: 'varclass/getSelectLevel1',
      payload: {
      	
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const {permission} = this.props;
    return (
      <Form
        className="ant-advanced-search-form"
        layout="inline" 
      >
       
        <Row className={styles.btmMargin}  type="flex" align="middle">
          <Col xxl={4} md={6}>
            <FormItem label="分类" {...formItemConfig}>
              {getFieldDecorator('parentId',{
                initialValue: ''
              })(
                  <Select allowClear={true} onChange={this.selectchange}>
                  {this.props.varclass.selectItem.map((item,index)=> (
				             <Option value={item.id} key={index}>{item.typeName}</Option>
				          ))}
                  </Select>
              )}
            </FormItem>
           
          </Col>
          <Col xxl={3} md={4}>
            <FormItem>
              {getFieldDecorator('id',{
                initialValue: ''
              })(
                <Select allowClear={true}>
                 {this.props.varclass.secondSelectItem.map( (item,index) => (
				             <Option value={item.id} key={index}>{item.typeName}</Option>
				          ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col  xxl={{ span: 4}} md={{ span: 6}} offset={2}>
            {
              permission.includes('re:variableType:list') ?
                <Button type="primary" onClick={this.formSubmit}>查询</Button> : null
            }
            <Button type="primary" onClick={this.reset}>清空</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
