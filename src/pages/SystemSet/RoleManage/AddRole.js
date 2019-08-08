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
import styles from '../FilterIpts.less'

const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
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

@connect(({ role }) => ({
  role
}))

@Form.create()

export default class IndexComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      value:[]
    }
  }
  //点击确定
  submitHandler = ()=>{
    this.props.form.validateFields((err, values) => {
      if(!err){

      }
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

  }
  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };
  render() {
    const { updateVisible, isShowEdit } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const tProps = {
      treeData,
      onChange: this.onChange,
      treeCheckable: true,
      maxTagCount: 0,
      dropdownStyle: { maxHeight: 600, overflow: 'auto' },
      allowClear: true
    };
    return (
      <div>
        <Modal
         title={this.state.type===1?'新增角色':'修改角色'}
         visible={updateVisible}
         onOk={this.submitHandler}
         onCancel={() => isShowEdit(false)}
       >
        <Form className="ant-advanced-search-form">
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="角色名称" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:'',
                    rules:[{
                      required:true,
                      message: '请输入角色名称'
                    }]
                  })(
                    <Input />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="角色说明" {...formItemConfig}>
                {getFieldDecorator('assetsTypeCode',{
                  initialValue:'',
                  rules:[{
                    required:true,
                    message: '请输入角色说明'
                  }]
                })(
                  <TextArea rows={4}  style={{width:330}} placeholder="" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="状态"  {...formItemConfig}>
                {getFieldDecorator('status',{
                  initialValue: null,
                  rules: [{ required: true, message: '请选择角色状态'}],
                  })(
                    <RadioGroup>
                      <Radio value={1}>启用</Radio>
                      <Radio value={2}>禁用</Radio>
                    </RadioGroup>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="授权" {...formItemConfig}>
                {getFieldDecorator('combotreeListSrch', {
                  rules: [{ required: true, message: '请授权'}],
                  // initialValue: []
                })(
                  <TreeSelect {...tProps} allowClear={true}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        </Modal>
      </div>
    )
  }
}
