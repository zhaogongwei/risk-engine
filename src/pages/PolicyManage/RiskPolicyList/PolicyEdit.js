import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Icon,
  Row,
  Col,
  Input,
  Select,
  message,
  Radio,
  Tooltip,
  Form,
  Card
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const spanStyle = {
  fontSize: '12px',
  marginRight: '10px'
}

@connect(({ policyList, loading }) => ({
  policyList,
}))
@Form.create()
export default class PolicyEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedData: [],
      modalStatus:false,
      code:'',
      type:true,
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      selectedRowKeys: [],
    };
  }
  componentDidMount() {
    this.props.returnSubKey(this, 'edit')
  }
  //   获取子组件数据的方法
  getSubKey = (ref,name) => {
    this[name] = ref;
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  //确定时间
  submitHandler = ()=>new Promise((resolve,reject)=>{
    const {status,id} = this.props;
    const formData = this.getFormValue();
    this.props.form.validateFields(async(err,values)=>{
      if(!err){
        let response;
        if(status){
          //新增策略
          response = await this.props.dispatch({
            type: 'policyList/addPolicy',
            payload: {
              ...formData,
            }
          })

        }else{
          //编辑策略
          response = await this.props.dispatch({
            type: 'policyList/editPolicy',
            payload: {
              id:id,
              ...formData,
            }
          })

        }
        resolve(response)
      }
    })
  })
  componentWillUnmount(){
    this.props.dispatch({
      type: 'policyList/savePolicyInfo',
      payload: {
        data:{}
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { policyTypeList,userList,policyInfo} = this.props.policyList
    const { status } = this.props
    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    return (
      <Form>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略类型" {...formItemConfig}>
              {getFieldDecorator('strategyType',{
                initialValue:status?'':policyInfo['strategyType'],
                rules:[{required:true}]
              })(
                <Select allowClear={true}>
                  {
                    policyTypeList&&policyTypeList.map((item,index)=>{
                      return (
                        <Option value={item.code} key={index}>{item.value}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略名称" {...formItemConfig}>
              {getFieldDecorator('strategyName',{
                initialValue:status?'':policyInfo['strategyName'],
                rules:[
                  {
                    required:true,
                    validator: async (rule, val, cb) => {
                      if (!val) {
                        cb('请输入正确内容！')
                        return;
                      }else if(val.length>15){
                        cb('最多输入15位！')
                        return;
                      }
                      if(!status){
                        cb();
                        return;
                      }
                      const strategyName = this.props.form.getFieldValue('strategyName')
                      const response = await this.props.dispatch({
                        type: 'policyList/checkPolicyName',
                        payload: {
                          strategyName:strategyName
                        }
                      })
                      if(response&&response.status===1){
                        cb()
                      }else{
                        cb(response.statusDesc)
                      }
                    }
                  },
                ]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略代码" {...formItemConfig}>
              {getFieldDecorator('strategyCode',{
                initialValue:status?'':policyInfo['strategyCode'],
                rules:[
                  {
                    required:true,
                    validator: async (rule, val, cb) => {
                      const reg = /^[a-zA-Z]{1,15}$/;
                      if(!reg.test(val)){
                        cb('最多只能输入15位的大写或小写字母！')
                        return;
                      }
                      if(!status){
                        cb();
                        return;
                      }
                      const strategyCode = this.props.form.getFieldValue('strategyCode')
                      const response = await this.props.dispatch({
                        type: 'policyList/checkPolicyCode',
                        payload: {
                          strategyCode:strategyCode
                        }
                      })
                      if(response&&response.status===1){
                        cb()
                      }else{
                        cb(response.statusDesc)
                      }
                    }
                  },
                ]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略负责人" {...formItemConfig}>
              {getFieldDecorator('dutyId',{
                initialValue:status?'':policyInfo['dutyId'],
                rules:[{required:true}]
              })(
                <Select allowClear={true}>
                  {
                    userList&&userList.map((item,index)=>{
                      return (
                        <Option value={item.id} key={index}>{item.trueName}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="middle" xxl={24}>
          <Col xxl={19}>
            <FormItem
              label = "策略排序"
              labelCol = {{ span: 7  }}
              wrapperCol = {{ span: 16 }}
            >
              {getFieldDecorator('orderNum',{
                initialValue:status?'':policyInfo['orderNum'],
                rules:[
                  {
                    required:true,
                    validator: async (rule, val, cb) => {
                      const reg = /^\d{1,15}$/;
                      if(!reg.test(val)){
                        cb('最多只能输入15位的数字!')
                        return;
                      }
                      if(!status){
                        cb();
                        return;
                      }
                      const orderNum = this.props.form.getFieldValue('orderNum')
                      const response = await this.props.dispatch({
                        type: 'policyList/checkPolicySort',
                        payload: {
                          orderNum:orderNum
                        }
                      })
                      if(response&&response.status===1){
                        cb()
                      }else{
                        cb(response.statusDesc)
                      }
                    }
                  }
                  ]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: '23px' }}>
            <Tooltip title="A-EMS接收资产后,按策略排序校验是否符合当前策略标签,如符合则资产进入当前策略">
              <Icon type="question-circle" style={{fontSize:'24px',cursor:'pointer'}}/>
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="变量状态" {...formItemConfig}>
              {getFieldDecorator('status',{
                initialValue: status?'':policyInfo['status']
              })(
                <RadioGroup name="status">
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        {
            !status?
            <Col offset={2}>
              <span style={{ ...spanStyle }}>
                创建时间: {policyInfo.createTime}
              </span>
              <span style={{ ...spanStyle }}>
                最后编辑时间: {policyInfo.updateTime}
              </span>
              <span style={{ ...spanStyle }}>
                操作人: {policyInfo.updateTrueName}
              </span>
            </Col>:null
        }
      </Form>
    )
  }
}
