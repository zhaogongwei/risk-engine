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

@connect(({ varclass }) => ({
  varclass,
}))

@Form.create()

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:false,
      title:'添加一级分类',
      confirmLoadingFlag:false
    }
  }
  //显示弹窗
  showModal = ()=>{

  }
  //点击确定
  handleOk = ()=>{
//  if(!this.props.type){
//    this.props.form.validateFields(['assetsTypeName','assetsTypeCode','status'],(err, values) => {
//      if(!err){
//          const formData = this.getFormValue()
//          this.props.dispatch({
//            type: 'assetDeploy/riskDeploy',
//            payload: {
//              ...formData,
//              //id:this.props.id
//            },
//            callback:()=>{
//              this.setState({visible:false},()=>{
//                this.props.onChange(this.state.visible)
//              })
//              this.props.changeDefault()
//              this.props.callback()
//              this.reset()
//            }
//          })
//      }
//    })
//  }else{
//    this.props.form.validateFields(['assetsTypeName','assetsTypeCode','projectStatus'],(err, values) => {
//        if(!err){
//            const formData = this.getFormValue()
//            this.props.dispatch({
//              type: 'assetDeploy/riskAdd',
//              payload: {
//                ...formData,
//                
//              },
//              callback:()=>{
//                this.setState({visible:false},()=>{
//                  this.props.onChange(this.state.visible);
//                })
//                this.props.changeDefault()
//                this.props.callback()
//                this.reset()
//              }
//            })
//        }
//    })
//  }
    this.setState({
      confirmLoadingFlag:true
    })
		if(this.props.type==1){//添加一级分类
			this.props.form.validateFields(['remark','typeName','orderNum'],(err, values) => {
	      if(!err){
		      const formData = this.getFormValue()
		      this.props.dispatch({
		        type: 'varclass/addVarClass',
		        payload: {
		          ...formData,
		        },
		        callback:()=>{
		        	this.props.changeDefault(1)
		          this.props.resatSelect.classChangeGetSelect()
		          this.props.change(1)
		          this.setState({visible:false},()=>{
		            this.props.onChange(this.state.visible);
		          })
		          this.setState({
                confirmLoadingFlag:false
              })
		          this.reset()
		        }
		      })
		    }
  		})
		}else if(this.props.type==2){ //添加二级分类
			this.props.form.validateFields(['remark','typeName','orderNum','parentId'],(err, values) => {
	      if(!err){
		      const formData = this.getFormValue()
		      this.props.dispatch({
		        type: 'varclass/addVarClass',
		        payload: {
		          ...formData,
		        },
		        callback:()=>{
		          this.setState({visible:false},()=>{
		            this.props.onChange(this.state.visible);
              })
              this.setState({
                confirmLoadingFlag:false
              })
		          this.props.changeDefault(1)
		         this.props.resatSelect.classChangeGetSelect()
		         this.props.change(1)
		          this.reset()
		        }
		      })
		    }
  		})
		}else if(this.props.type==3){//编辑一级分类
			this.props.form.validateFields(['remark','typeName','orderNum'],(err, values) => {
	      if(!err){
		      const formData = this.getFormValue(1)
		      this.props.dispatch({
		        type: 'varclass/editVarClass',
		        payload: {
		          ...formData,
		          id:this.props.record['id']
		        },
		        callback:()=>{
		          this.setState({visible:false},()=>{
		            this.props.onChange(this.state.visible);
              })
              this.setState({
                confirmLoadingFlag:false
              })
              this.props.resatSelect.getSelect()
              this.props.change(this.props.current)
		          this.reset()
		        }
		      })
		    }
  		})
		}else if(this.props.type==4){//编辑二级分类
			this.props.form.validateFields(['remark','typeName','orderNum'],(err, values) => {
	      if(!err){
		      const formData = this.getFormValue()
		      this.props.dispatch({
		        type: 'varclass/editVarClass',
		        payload: {
		          ...formData,
		          id:this.props.record['id']
		        },
		        callback:()=>{
		          this.setState({visible:false},()=>{
		            this.props.onChange(this.state.visible);
              })
              this.setState({
                confirmLoadingFlag:false
              })
              this.props.resatSelect.selectchange(this.props.varclass.filterIpts.parentId || '')
		          this.props.change(this.props.current)
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
//  formQueryData.assetsTypeName=formQueryData.assetsTypeName.trim()
//  formQueryData.assetsTypeCode=formQueryData.assetsTypeCode.trim()
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
    return (
      <Modal
        title={this.props.title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        confirmLoading={this.state.confirmLoadingFlag}
      >
        <Form
          className="ant-advanced-search-form"
        >
          {this.props.type===2?<Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="选择上级" {...formItemConfig}>
                {getFieldDecorator('parentId',{
                  initialValue:this.props.type===2?this.props.record['id']:''
                })(
                  <Select allowClear={true} disabled>
                      <Option value={this.props.record['id']} key={1}>{this.props.record['typeName']}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>:null}
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="名称" {...formItemConfig}>
                {getFieldDecorator('typeName',{
                  initialValue:(this.props.type === 3 || this.props.type ===4)?this.props.record['typeName']:'',
                  rules:[
                  {
                    required:true,
                    message:'请输入名称'
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
              <FormItem label="描述" {...formItemConfig}>
                {getFieldDecorator('remark',{
                  initialValue:(this.props.type === 3 || this.props.type ===4)?this.props.record['remark']:'',
                  rules:[
                  {
                    required:true,
                    message:'请输入描述'
                    
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
              <FormItem label="排序" {...formItemConfig}>
                {getFieldDecorator('orderNum',{
                  initialValue:(this.props.type === 3 || this.props.type ===4)?this.props.record['orderNum']:'',
                  rules:[
                  {
                    required:true,
                    message:'请输入排序'
                  }
                  ]
                })(
                  <Input type="number" placeholder="数字大排列表上方"/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}
