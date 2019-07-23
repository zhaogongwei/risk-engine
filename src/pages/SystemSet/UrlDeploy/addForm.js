import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Spin,
  TreeSelect,
  Form
} from 'antd';
import styles from '../FilterIpts.less'
import { connect } from 'dva'
const FormItem = Form.Item
@connect()

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      value:[],
      loading:true
    }
  }
  //显示弹窗
  showModal = ()=>{

  }
  //设置加载状态
  setLoading=(status)=>{
    this.setState({
      loading:status
    })
  }
  //点击确定
  submitHandler = ()=>new Promise((resolve,reject)=>{
    const response = {
      status:'000'
    }
    if(!this.props.type){
      this.props.form.validateFields(['assetsTypeName','assetsTypeCode','status'],(err, values) => {
        if(!err){

        }
      })
    }else{
      this.props.form.validateFields(['assetsTypeName','assetsTypeCode','status'],(err, values) => {
        if(!err){
        }
      })
    }
    resolve(response)
  })
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
    this.props.getSubKey(this,'addForm');
    setTimeout(()=>{
      this.setState({
        loading:false
      })
    },3000)
  }
  componentWillReceiveProps(nextProps){
  }
  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };
  render() {
    const {visible,loading} = this.state;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:16},
    }
    return (
            <Form
              className="ant-advanced-search-form"
            >
              <Row className={styles.btmMargin}>
                <Col xxl={20} md={12}>
                  <FormItem label="接口名称" {...formItemConfig}>
                    {getFieldDecorator('username',{
                      initialValue:'',
                      rules:[
                        {
                          required:true,
                        }
                      ]
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.btmMargin}>
                <Col xxl={20} md={12}>
                  <FormItem label="异步通知地址" {...formItemConfig}>
                    {getFieldDecorator('password',{
                      initialValue:'',
                      rules:[
                        {
                          required:true,
                        }
                      ]
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row className={styles.btmMargin}>
                <Col xxl={20} md={12}>
                  <FormItem label="同步跳转地址" {...formItemConfig}>
                    {getFieldDecorator('comfirmWord',{
                      initialValue:'',
                      rules:[
                        {
                          required:true,
                        }
                      ]
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
    )
  }
}
