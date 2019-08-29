import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form,
  Card,
  DatePicker,
  message,
  Spin
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment'
import { connect } from 'dva'
import router from 'umi/router';
const Option = Select.Option;
const FormItem = Form.Item
@connect(({testTemp,loading})=>({
  testTemp,
  submitLoading:loading.effects['testTemp/saveTest']
}))

@Form.create()
export default class TestTemp extends Component {
  state={
    visible:false,//控制风控报告显隐
    completeFlag:'N',
    loading:false,//节点加载状态
  }
  //保存并执行测试
  formSubmit = async (e) => {
    this.props.form.validateFields((error,value)=>{
      console.log(error);
      console.log(this.props.form.getFieldsError());
      if(!error){
        const {query} = this.props.location;
        const formData = this.getFormValue();
        const res =  this.props.dispatch({
          type: 'testTemp/saveTest',
          payload:{
            id:query['id']?query['id']:null,
            strategyId:query['strategyId'],
            inputVarList:formData,
            templateName:this.props.form.getFieldValue('templateName'),
          }
        })
        if(res&&res.status===1){
          message.success(res.statusDesc)
          const response =  this.props.dispatch({
            type: 'testTemp/queryTestResult',
            payload:{
              assetsCode:res.data.assetCode,
              flowId:query['flowId'],
            }
          })
          if(response&&response.status===1){
            //开始加载节点
            this.setState({
              loading:true,
            })
            this.queryResult = setInterval(()=>{
              this.queryTestResult(res.data.assetCode,query['flowId'])
            },5000)
            if(this.state.completeFlag !== 'N'){
              //循环结束
              clearInterval(this.queryResult);
              //显示风控报告按钮
              this.setState({
                visible:true,
                loading:false,
              })
            }
          }
        }else{
          message.error(res.statusDesc)
        }
      }
    })
  }
  queryTestResult = (assetsCode,flowId)=>{
    const res = this.props.dispatch({
      type: 'testTemp/queryTestResult',
      payload:{
        assetsCode:assetsCode,
        flowId:flowId
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
    const {strategyId,type} = query
    if(type==1){
      this.props.dispatch({
        type: 'testTemp/fetchTestTempVarArray',
        payload:{
          strategyId:strategyId,
        }
      })
    }else{
      this.props.dispatch({
        type: 'testTemp/fetchTestTempVarList',
        payload:{
          testTemplateId:strategyId,
        }
      })
    }
  }
  componentWillUnmount(){
    this.queryResult&&clearInterval(this.queryResult)
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
      const initData = item.variableValue?moment(item.variableValue):null
      return (
        <FormItem label={item.variableName} {...formItemConfig} key={index}>
          {getFieldDecorator(item.variableCode, {
            initialValue: initData,
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
      const initData = item.variableValue?moment(item.variableValue):null
      return (
        <FormItem label={item.variableName} {...formItemConfig} key={index}>
          {getFieldDecorator(item.variableCode, {
            initialValue: initData,
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
    const { query } = this.props.location;
    const { type } = query;
    const { tempVarList,templateName,resultList } = this.props.testTemp;
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:14},
    }
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={type==1?'新增测试模板':'编辑测试模板'}
        >
            <Row type="flex" align="top"  gutter={16}>
              <Col span={16} style={{marginRight:10}}>
                <Row gutter={24} style={{textAlign:'center',lineHeight:'60px',fontSize:20,backgroundColor:'#F2F2F2',}}>输入变量</Row>
                <Form
                  className="ant-advanced-search-form"
                  labelAlign={'left'}
                >
                  <Row type="flex" gutter={24} style={{backgroundColor:'#F2F2F2',paddingLeft:80,paddingBottom:20}}>
                    {
                      tempVarList&&tempVarList.map((item,index)=>
                        (
                          <Col span={10} key={index}>
                            {
                              this.createFormItem(item,index)
                            }
                          </Col>
                        )
                      )
                    }
                  </Row>
                  <Row gutter={24} style={{backgroundColor:'#F2F2F2',marginTop:10,paddingLeft:80,paddingTop:10,paddingBottom:10}}>
                    <Col span={10}>
                      <FormItem label={'模板标题'} {...formItemConfig}>
                        {getFieldDecorator('templateName',{
                          initialValue:templateName,
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
                </Form>
                <Row type="flex" gutter={32} justify="center" style={{marginTop:20}}>
                  <Button type="primary" onClick={this.formSubmit} loading={this.props.submitLoading}>保存并执行测试</Button>
                  <Button onClick={()=>router.goBack()}>返回</Button>
                </Row>
              </Col>
              <Col span={6} style={{backgroundColor:'#F2F2F2',minHeight:600}}>
                <Row style={{textAlign:'center',lineHeight:'60px',fontSize:20}}>测试结果</Row>
                <Row type="flex" justify="center">
                  <Col span={18}>
                    {
                      resultList&&resultList.map((item,index)=>{
                        return (
                          <Row type="flex" align="bottom" style={{marginBottom:20}} key={index}>
                            <Col style={{ width:100,lineHeight:'40px',textAlign:'center',backgroundColor:'#27304D',color:'#fff',fontSize:16,marginRight:20,borderRadius:5}}>{item.nodeTypeName}</Col>
                            <Col>{item.resultName}</Col>
                          </Row>
                        )
                      })
                    }
                    <Row>
                      <Col style={{lineHeight:'40px',textAlign:'center'}}>
                        <Spin spinning={this.state.loading}/>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row type="flex" justify="center">
                  {
                    this.state.visible?
                      <Col span={18}>
                        <p style={{backgroundColor:'#27304D',color:'#fff',fontSize:16,textAlign:'center',borderRadius:5,lineHeight:'40px'}}>
                          风控报告
                        </p>
                      </Col>:null
                  }
                </Row>
              </Col>
            </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
