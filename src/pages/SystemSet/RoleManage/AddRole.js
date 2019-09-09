import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Select,
  Spin,
  Tree,
  Form,
  message
} from 'antd';
import { connect } from 'dva'
import styles from '../FilterIpts.less'

const FormItem = Form.Item
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TreeNode } = Tree;

@connect(({ role }) => ({
  role
}))

@Form.create()

export default class IndexComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
    }
  }
  //点击确定
  submitHandler = ()=>{
    this.props.form.validateFields(async(err, values) => {
      if(!err){
        const { dispatch, currPage, pageSize } = this.props;
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
              roleId: this.props.roleId,
              menuIds: this.props.role.activeList,
            }
          })
          if(res && res.status == 1) {
            message.success(res.statusDesc);
            this.props.isShowEdit(false);
            this.props.change(currPage, pageSize)
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
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  renderTreeNodes = data =>
    data && data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
  });

  onCheck = (checkedKeys) => {
    console.log(checkedKeys)
    this.props.dispatch({
      type: 'role/modifyMenuAuthorize',
      payload: checkedKeys
    })
  }

  onSelect = (activeList, info) => {
    console.log(activeList, 'roleInfo ')
  };

  render() {
    const { updateVisible, isShowEdit, type } = this.props
    const { infoData: { menuTree, roleInfo }, activeList } = this.props.role;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    // const tProps = {
    //   treeData: menuTree,
    //   onChange: this.onChange,
    //   treeCheckable: true,
    //   maxTagCount: 0,
    //   dropdownStyle: { maxHeight: 600, overflow: 'auto' },
    //   allowClear: true
    // };
   
    return (
      <div>
        <Modal
         title={this.props.type === 1 ? '新增角色' : '修改角色'}
         visible={updateVisible}
         onOk={this.submitHandler}
         maskClosable={false}
         destroyOnClose={true}
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
          {
            type == 2 ? 
            <FormItem label="授权" {...formItemConfig}>
              {getFieldDecorator('menuIds')(
                <Tree
                  checkable
                  onExpand={this.onExpand}
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={activeList}
                  onSelect={this.onSelect}
                  selectedKeys={this.state.selectedKeys}
                >
                  {this.renderTreeNodes(menuTree)}
                </Tree>
              )}
            </FormItem> : null
          }
        </Form>
        </Modal>
      </div>
    )
  }
}
