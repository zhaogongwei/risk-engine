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
  Form,
  message
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
    this.props.form.validateFields(async(err, values) => {
      if(!err){
        const { dispatch } = this.props;
        if(this.props.type == 1) {
          let res = await dispatch({
            type: 'role/addRole',
            payload: {
              ...values
            }
          })
          if(res && res.status == 1) {
            message.success(res.statusDesc);
            this.props.isShowEdit(false);
            this.props.change()
          }
        }
        if(this.props.type == 2) {
          let res = await dispatch({
            type: 'role/updateRole',
            payload: {
              ...values,
              roleId: this.props.roleId
            }
          })
          if(res && res.status == 1) {
            message.success(res.statusDesc);
            this.props.isShowEdit(false);
            this.props.change()
          }
        }
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
    const { dispatch, roleId } = this.props; 
    dispatch({
      type: 'role/fetchInitData',
      payload: {
        roleId
      }
    })
    
  }
  onChange = value => {
    console.log('onChange ', value);
    this.setState({ value });
  };
  render() {
    const { updateVisible, isShowEdit, type } = this.props
    const { menuTree, roleInfo, activeList } = this.props.role.infoData;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const tProps = {
      treeData: menuTree,
      onChange: this.onChange,
      treeCheckable: true,
      maxTagCount: 0,
      dropdownStyle: { maxHeight: 600, overflow: 'auto' },
      allowClear: true
    };
   
    return (
      <div>
        <Modal
         title={this.props.type === 1 ? '新增角色' : '修改角色'}
         visible={updateVisible}
         onOk={this.submitHandler}
         onCancel={() => isShowEdit(false)}
       >
        <Form className="ant-advanced-search-form">
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="角色名称" {...formItemConfig}>
                {getFieldDecorator('roleName',{
                  initialValue: type == 2 ? roleInfo && roleInfo.roleName : null,
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
                {getFieldDecorator('roleExplain',{
                  initialValue: type == 2 ? roleInfo && roleInfo.roleExplain : null,
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
                  initialValue: type == 2 ? roleInfo && roleInfo.status : null,
                  rules: [{ required: true, message: '请选择角色状态'}],
                  })(
                    <RadioGroup>
                      <Radio value={0}>启用</Radio>
                      <Radio value={1}>禁用</Radio>
                    </RadioGroup>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.btmMargin}>
            <Col xxl={20} md={12}>
              <FormItem label="授权" {...formItemConfig}>
                {getFieldDecorator('menuIds', {
                  rules: [{ required: true, message: '请授权'}],
                  initialValue: type == 2 ? activeList : []
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
