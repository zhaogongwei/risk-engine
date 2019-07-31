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
  Form,
  Radio,
  Modal,
  Popconfirm,
  Card,
  message,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import AddForm from './AddForm';
import RuleTable from '@/components/RuleTable';
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils';
import router from 'umi/router';
const Option = Select.Option;
const FormItem = Form.Item
const RadioGroup = Radio.Group;
@connect(({ risklabel, loading }) => ({
  risklabel,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
@Form.create()
export default class LabelEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      }
        ,{
          title: '变量名称',
          dataIndex: 'variableName',
          key:'variableName',
          editable:true,
          type:'input',
          isFocus:true
        },
        {
          title: '值',
          key:'compareValue',
          dataIndex:'compareValue',
          editable:true,
          type:'more'
        },
        {
          title: '操作',
          key:'action',
          render: (record) => (
            <Popconfirm title="是否确认删除本行?" onConfirm={()=>this.handleDelete(record.key)}  okText="Yes" cancelText="No">
              <Button type="primary">删除</Button>
            </Popconfirm>
          ),
        }],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:0,//0:单选按钮，1：多选按钮
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      selectedRowKeys: [],
      visible:false,
    };
  }
  componentDidMount() {
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //查询时改变默认页数
  changeDefault=(value)=>{
    this.setState({
      current:value
    })
  }
  //右上角渲染
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={this.goAddPage}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = ()=>{
    this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
  }
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  formSubmit=()=>{
    console.log(this.getFormValue())
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  //点击配置弹窗
  clickDialog=(type,record)=>{
    console.log(type,record)
    this.setState({
      visible:true,
      type:type,
      number:record?record['key']:''
    },()=>{
    })
  }
  //删除表格数据
  handleDelete=(key)=>{
    const {labelList} = this.props.risklabel
    const newDataSource = labelList.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'risklabel/labelListHandle',
      payload: {
        labelList:addListKey(newDataSource)
      }
    })
  }
  //保存数据
  handleSave = ()=>{
    const data = {
      nodeId:this.props.editorFlow.selectId,
      ruleCondition:this.child.getFormValue().ruleCondition,
      resultVarId:this.child.getFormValue().resultVarId,
      ruleType:'simple',
      variables:this.props.rule.ruleList,
    }
    console.log(this.child.getFormValue())
    console.log(this.props.rule.ruleList)
    console.log(JSON.stringify(data))
  }
  //弹框按钮取消
  handleCancel =()=>{
    this.setState({visible:false})
  }
  //弹框按钮确定
  addFormSubmit =()=>{
    this.setState({visible:false},()=>{
      const {checkedList,radioValue} = this.addForm.submitHandler();
      const {labelList} = this.props.risklabel;
      if(Object.keys(radioValue).length){
        if(labelList.find((item)=>item['varId'] ===radioValue['varId'])){
          message.error('不能添加相同的变量!')
          return;
        }
        if(labelList.length>20){
          message.error('最多可配置20个标签')
          return;
        }
        this.props.dispatch({
          type: 'risklabel/labelListHandle',
          payload: {
            labelList:addListKey(deepCopy([...labelList,radioValue]))
          }
        })
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {type} = this.props.location.query;
    const formItemConfig = {
      labelCol:{span:4},
      wrapperCol:{span:16},
    }

    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={type===1?'新增标签':'编辑标签'}
        >
          <Form
            className="ant-advanced-search-form"
          >
            <Row style={{marginBottom:10}} gutter={24} type="flex" align="middle">
              <Col xxl={10} md={8}>
                <FormItem label="标签名称" {...formItemConfig}>
                  {getFieldDecorator('status',{
                    initialValue:'',
                    rules:[
                      {required:true},
                      {max:30,message:'最多输入30位!'}
                    ]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{marginBottom:10}}>
              <Col xxl={10} md={8}>
                <Row>
                  <Col span={4}></Col>
                  <Col span={16}>
                    <RuleTable
                      bordered
                      pagination={false}
                      columns={this.state.columns}
                      dataSource={this.props.risklabel.labelList}
                      handleAdd={()=>this.clickDialog(1)}
                      handleModify={this.clickDialog}
                      loading={this.props.loading}
                    />
                  </Col>
                </Row>
              </Col>
              <Modal
                title={'选择变量'}
                visible={this.state.visible}
                onOk={this.addFormSubmit}
                onCancel={this.handleCancel}
                width={1040}
              >
                <AddForm
                  number={this.state.number}
                  getSubKey={this.getSubKey}
                />
              </Modal>
            </Row>
            <Row style={{marginBottom:10}} type="flex" align="middle">
              <Col xxl={10} md={8}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('assetsTypeName',{
                    initialValue:'',
                    rules:[{required:true}]
                  })(
                    <RadioGroup>
                      <Radio value={0}>禁用</Radio>
                      <Radio value={1}>启用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col style={{color:'#FF0000'}} push={7}>
                最近操作时间：2018-08-08 00:00:00 操作人：  王大大
              </Col>
            </Row>
            <Row type="flex" align="middle">
              <Col xxl={10} md={8}>
                <Row type="flex" align="middle" justify="center">
                  <Button type="primary">保存并提交</Button>
                  <Button onClick={()=>router.goBack()}>取消</Button>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
