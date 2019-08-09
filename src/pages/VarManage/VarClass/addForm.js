import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Form
} from 'antd';
import styles from '../FilterIpts.less'
import { connect } from 'dva'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect()

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:false,
      title:'添加一级分类'
    }
  }
  //显示弹窗
  showModal = ()=>{

  }
  //点击确定
  handleOk = ()=>{
    if(!this.props.type){
      this.props.form.validateFields(['assetsTypeName','assetsTypeCode','status'],(err, values) => {
        if(!err){
            const formData = this.getFormValue()
            this.props.dispatch({
              type: 'assetDeploy/riskDeploy',
              payload: {
                ...formData,
                id:this.props.id
              },
              callback:()=>{
                this.setState({visible:false},()=>{
                  this.props.onChange(this.state.visible)
                })
                this.props.changeDefault()
                this.props.callback()
                this.reset()
              }
            })
        }
      })
    }else{
      this.props.form.validateFields(['assetsTypeName','assetsTypeCode','projectStatus'],(err, values) => {
          if(!err){
              const formData = this.getFormValue()
              this.props.dispatch({
                type: 'assetDeploy/riskAdd',
                payload: {
                  ...formData
                },
                callback:()=>{
                  this.setState({visible:false},()=>{
                    this.props.onChange(this.state.visible);
                  })
                  this.props.changeDefault()
                  this.props.callback()
                  this.reset()
                }
              })
          }
      })
    }
  }
  //点击取消
  handleCancel =()=>{
    this.setState({visible:false},()=>{
      this.props.onChange(this.state.visible)
    })

  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    formQueryData.assetsTypeName=formQueryData.assetsTypeName.trim()
    formQueryData.assetsTypeCode=formQueryData.assetsTypeCode.trim()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'addForm')
  }
  componentWillReceiveProps(newProps){
    this.setState({
      visible:newProps.showState
    })
  }
  render() {
    const {visible,loading} = this.state;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:16},
    }
    console.log(this.props.record)
    return (
      <Modal
        title={this.props.title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form
          className="ant-advanced-search-form"
        >
          {this.props.type===2?<Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="选择上级" {...formItemConfig}>
                {getFieldDecorator('projectStatus',{
                  initialValue:this.props.type===2?this.props.record['id']:''
                })(
                  <Select allowClear={true} disabled>
                      <Option value={this.props.record['id']} key={1}>{this.props.record['name']}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>:null}
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="名称" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:(this.props.type === 3 || this.props.type ===4)?this.props.record['name']:'',
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="排序" {...formItemConfig}>
                {getFieldDecorator('assetsTypeCode',{
                  initialValue:'',
                })(
                  <Input placeholder="数字大排列表上方"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
