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
import { connect } from 'dva'
const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { SHOW_PARENT } = TreeSelect;
const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];
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
    const tProps = {
      treeData,
      onChange: this.onChange,
      treeCheckable: true,
      maxTagCount: 0,
      dropdownStyle: { maxHeight: 600, overflow: 'auto' },
      treeDefaultExpandedKeys: [],
      showCheckedStrategy: SHOW_PARENT,
      style: {
        width: 450,
      },
      allowClear: true
    };
    return (
            <Form
              className="ant-advanced-search-form"
            >
              <Row style={{marginBottom:10}}>
                <Col xxl={20} md={12}>
                  <FormItem label="姓名" {...formItemConfig}>
                    {getFieldDecorator('trueName',{
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
              <Row style={{marginBottom:10}}>
                <Col xxl={20} md={12}>
                  <FormItem label="身份证号" {...formItemConfig}>
                    {getFieldDecorator('idCard',{
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
              <Row style={{marginBottom:10}}>
                <Col xxl={20} md={12}>
                  <FormItem label="性别" {...formItemConfig}>
                    {getFieldDecorator('sex',{
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
              <Row style={{marginBottom:10}}>
                <Col xxl={20} md={12}>
                  <FormItem label="手机号" {...formItemConfig}>
                    {getFieldDecorator('mobile',{
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
              <Row style={{marginBottom:10}}>
                <Col xxl={20} md={12}>
                  <FormItem label="状态"  {...formItemConfig}>
                    {getFieldDecorator('status',{
                      initialValue:'',
                      rules: [
                        { required: true, message: '角色状态为必选'}
                      ],
                    })(
                      <RadioGroup>
                        <Radio value={1}>启用</Radio>
                        <Radio value={2}>禁用</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
    )
  }
}
