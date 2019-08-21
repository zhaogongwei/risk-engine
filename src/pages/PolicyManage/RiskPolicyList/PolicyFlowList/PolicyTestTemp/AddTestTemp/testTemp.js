import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  Card,
  DatePicker
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment'
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item
const result = [
  {
    title:'开始',
    content:'开始'
  },
  {
    title:'规则',
    content:'准入规则'
  },
  {
    title:'复杂规则',
    content:'复杂准入规则:否'
  },
  {
    title:'评分卡',
    content:'评分卡得分:900'
  },
  {
    title:'决策模型',
    content:'审核结果:审核通过'
  },
  {
    title:'结束',
    content:'结束'
  },
]
@connect(({testTemp,loading})=>({
  testTemp,
  submitLoading:loading.effects['testTemp/saveTest']
}))

@Form.create()
export default class TestTemp extends Component {
  //保存并执行测试
  formSubmit = (e) => {
    const {query} = this.props.location;
    const formData = this.getFormValue();
    console.log(this.props.form.getFieldsError())
    console.log(this.getFormValue())
    this.props.dispatch({
      type: 'testTemp/saveTest',
      payload:{
        strategyId:query['testTemplateId'],
        inputVarList:formData,
        templateName:this.props.form.getFieldValue('templateName'),
      }
    })
  }
  //   获取表单信息
  getFormValue = () => {
    let formList=[]
    let formQueryData = this.props.form.getFieldsValue();
    for(let i in formQueryData){
      let obj = {};
      obj['variableCode']=i;
      obj['variableValue']=formQueryData[i];
      formList.push(obj)
    }
    return formList;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    const {query} = this.props.location;
    this.props.dispatch({
      type: 'testTemp/fetchTestTempVarList',
      payload:{
        ...query,
      }
    })
  }
  //根据变量的类型创建不同的formItem;
  createFormItem=(item,index)=>{
    const { getFieldDecorator } = this.props.form;
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:14},
    }
    if(item.variableType==='char'){
      if(item.enumFlag){
        return(
          <FormItem label={item.variableName} {...formItemConfig} key={index}>
            {getFieldDecorator(item.variableCode, {
              initialValue: item.variableValue?item.variableValue:'',
              rules:[
                {
                  required:true,
                  message:'输入内容不能为空!',
                  validator: (rule, value, callback) => {
                    if (!value) callback('输入内容不能为空!')
                  }
                }
              ]
            })(
              <Select
                style={{width:'100%'}}
              >
                {
                  item['enumList']&&item['enumList'].map((item,index)=>{
                    return (
                      <Option value={item.enumValue} key={index}>{item.enumValue}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        )
      }else{
        return (
          <FormItem label={item.variableName} {...formItemConfig} key={index}>
            {getFieldDecorator(item.variableCode, {
              initialValue: item.variableValue?item.variableValue:'',
              rules:[
                {
                  required:true,
                  message:'输入内容不能为空!',
                  validator: (rule, value, callback) => {
                    if (!value) callback('输入内容不能为空!')
                  }
                }
              ]
            })(
              <Input/>
            )}
          </FormItem>
        )
      }
    }else if(item.variableType==='num'){
      return (
        <FormItem label={item.variableName} {...formItemConfig} key={index}>
          {getFieldDecorator(item.variableCode, {
            initialValue: item.variableValue?item.variableValue:'',
            rules:[
              {
                required:true,
                message:'输入内容不能为空!',
                pattern:/^\d{1,3}$/,
                validator: (rule, value, callback) => {
                  if (!value) callback('输入内容不能为空!')
                }
              }
            ]
          })(
            <Input/>
          )}
        </FormItem>
      )
    }else if(item.variableType==='date'){
      return (
        <FormItem label={item.variableName} {...formItemConfig} key={index}>
          {getFieldDecorator(item.variableCode, {
            initialValue: moment(item.variableValue),
            rules:[
              {
                required:true,
                message:'输入内容不能为空!',
                validator: (rule, value, callback) => {
                  if (!value) callback('输入内容不能为空!')
                }
              }
            ]
          })(
            <DatePicker
              style={{width:'100%'}}
            />
          )}
        </FormItem>
      )
    }else if(item.variableType==='time'){
      return (
        <FormItem label={item.variableName} {...formItemConfig} key={index}>
          {getFieldDecorator(item.variableCode, {
            initialValue: moment(item.variableValue),
            rules:[
              {
                required:true,
                message:'输入内容不能为空!',
                validator: (rule, value, callback) => {
                  if (!value) callback('输入内容不能为空!')
                }
              }
            ]
          })(
            <DatePicker
              showTime
              style={{width:'100%'}}
            />
          )}
        </FormItem>
      )
    }
  }
  createFormInput=(item)=>{

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tempVarList } = this.props.testTemp;
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:14},
    }
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={'新增测试模板'}
        >
          <Form
            className="ant-advanced-search-form"
            labelAlign={'left'}
          >
            <Row type="flex" align="top"  gutter={16}>
              <Col span={16} style={{marginRight:10}}>
                <Row gutter={24} style={{textAlign:'center',lineHeight:'60px',fontSize:20,backgroundColor:'#F2F2F2',}}>输入变量</Row>
                <Row type="flex" gutter={24} style={{backgroundColor:'#F2F2F2',paddingLeft:80,paddingBottom:20}}>
                  {
                    tempVarList.length&&tempVarList.map((item,index)=>{
                      return(
                        <Col span={10} key={index}>
                          {
                            this.createFormItem(item,index)
                          }
                        </Col>
                      )
                    })
                  }
                </Row>
                <Row gutter={24} style={{backgroundColor:'#F2F2F2',marginTop:10,paddingLeft:80,paddingTop:10,paddingBottom:10}}>
                  <Col span={10}>
                    <FormItem label={'模板标题'} {...formItemConfig}>
                      {getFieldDecorator('templateName',{
                        initialValue:'',
                        rules:[
                          {
                            required:true,
                            message:'输入内容不能为空!'
                          }
                        ]
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" gutter={32} justify="center" style={{marginTop:20}}>
                  <Button type="primary" onClick={this.formSubmit} loading={this.props.submitLoading}>保存并执行测试</Button>
                  <Button type="primary">返回</Button>
                </Row>
              </Col>
              <Col span={6} style={{backgroundColor:'#F2F2F2',minHeight:600}}>
                <Row style={{textAlign:'center',lineHeight:'60px',fontSize:20}}>测试结果</Row>
                <Row type="flex" justify="center">
                  <Col span={18}>
                    {
                      result.map((item,index)=>{
                        return (
                          <Row type="flex" align="bottom" style={{marginBottom:20}} key={index}>
                            <Col style={{ width:100,lineHeight:'40px',textAlign:'center',backgroundColor:'#27304D',color:'#fff',fontSize:16,marginRight:20,borderRadius:5}}>{item.title}</Col>
                            <Col>{item.content}</Col>
                          </Row>
                        )
                      })
                    }
                  </Col>
                </Row>
                <Row type="flex" justify="center">
                  <Col span={18}>
                    <p style={{backgroundColor:'#27304D',color:'#fff',fontSize:16,textAlign:'center',borderRadius:5,lineHeight:'40px'}}>
                      风控报告
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
