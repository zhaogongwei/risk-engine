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
import AddForm from '@/components/VarListModal/AddForm'
import RuleTable from '@/components/RuleTable';
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils';
import router from 'umi/router';
const Option = Select.Option;
const FormItem = Form.Item
const RadioGroup = Radio.Group;
@connect(({ risklabel, loading,varList}) => ({
  risklabel,
  varList,
  addsubmitLoading: loading.effects['risklabel/addRiskLabel'],
  editsubmitLoading: loading.effects['risklabel/editRiskLabel'],
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
          key:'variableValue',
          dataIndex:'variableValue',
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
      formData:[],//form集合
    };
  }
  async componentDidMount() {
    const {query} = this.props.location;
    const {type,id,strategyId} = query;
    const {tableList} = this.props.risklabel;
    //查询标签信息
    if(type ==0){
      const res = await this.props.dispatch({
        type: 'risklabel/queryLabelInfo',
        payload: {
          labelId:id,
        }
      })
      if(res&&res.status===1){
        this.props.dispatch({
          type: 'risklabel/saveTableList',
          payload: {
            tableList:addListKey([...res.data.variableList,...tableList])
          }
        })
      }
    }
    //请求变量列表
    this.props.dispatch({
      type: 'varList/queryVarList',
      payload: {
        strategyId:strategyId
      }
    })
    //请求一级变量分类
    this.props.dispatch({
      type: 'varList/queryOneClassList',
      payload: {
        firstTypeId:0,
        secondTypeId:'',
      }
    })
  }
  componentWillUnmount(){
    this.props.dispatch({
      type: 'risklabel/saveLabelInfo',
      payload: {
        data:{}
      }
    })
    this.props.dispatch({
      type: 'risklabel/saveTableList',
      payload: {
        tableList:[]
      }
    })
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
      number:record?record['key']:''
    },()=>{
    })
  }
  //删除表格数据
  handleDelete=(key)=>{
    const {labelList} = this.props.risklabel
    const newDataSource = labelList.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'risklabel/saveTableList',
      payload: {
        tableList:addListKey(newDataSource)
      }
    })
  }
  //弹框按钮取消
  handleCancel =()=>{
    this.setState({visible:false})
  }
  //弹框按钮确定
  addFormSubmit =()=>{
    this.setState({visible:false},()=>{
      const records = this.addForm.submitHandler();
      const {tableList} = this.props.risklabel;
      if(Object.keys(records).length){
        if(tableList.find((item)=>item['varId'] ===records['varId'])){
          message.error('不能添加相同的变量!')
          return;
        }
        if(tableList.length>20){
          message.error('最多可配置20个标签')
          return;
        }
        this.props.dispatch({
          type: 'risklabel/saveTableList',
          payload: {
            tableList:addListKey(deepCopy([...tableList,records]))
          }
        })
      }
    })
  }
  //  将每个cell的form保存起来
  handleModify = form => {
    let arr = this.state.formData;
    arr.push(form)
    this.setState({
      formData: arr
    })
  }
  //保存提交
  formSubmit=()=>{
    let count=0;
    this.state.formData.map(item => {
      item.validateFieldsAndScroll((errors,value)=>{
        if(errors)count++;
      })
    })
    const {tableList} = this.props.risklabel;
    const {query} = this.props.location;
    const {id,strategyId,type} = query;
    const formData = this.getFormValue()
    this.props.form.validateFields((error,value)=>{
      if(!error){
        if(tableList.length){
          if(!count){
            if(type==1){
              //新增标签
              this.props.dispatch({
                type: 'risklabel/addRiskLabel',
                payload: {
                  strategyId:strategyId,
                  variableList:tableList,
                  ...formData,
                }
              })
            }else{
              //编辑标签
              this.props.dispatch({
                type: 'risklabel/editRiskLabel',
                payload: {
                  id:id,
                  strategyId:strategyId,
                  variableList:tableList,
                  ...formData,
                }
              })
            }
          }
        }else{
          message.error('请添加相关变量!')
        }
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { tableList,labelInfo } = this.props.risklabel
    const {type} = this.props.location.query;
    const formItemConfig = {
      labelCol:{span:4},
      wrapperCol:{span:18},
    }
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={type==1?'新增标签':'编辑标签'}
        >
          <Form
            //className="ant-advanced-search-form"
          >
            <Row style={{marginBottom:10}}>
              <Col xxl={12} md={8}>
                <FormItem label="标签名称" {...formItemConfig}>
                  {getFieldDecorator('labelName',{
                    initialValue:labelInfo['labelName'],
                    rules:[
                      {
                        required:true,
                        validator:async(rule,val,cb) => {
                          if (!val) {
                            cb('请输入正确内容！')
                            return;
                          }else if(val.length>30){
                            cb('最多输入30位！')
                            return;
                          }
                          if(type ==0)return;
                          const labelName = this.props.form.getFieldValue('labelName')
                          const response = await this.props.dispatch({
                            type: 'risklabel/checkLabelName',
                            payload: {
                              labelName:labelName
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
            <Row style={{marginBottom:10}}>
              <Col xxl={12} md={8}>
                <Row>
                  <Col span={4}></Col>
                  <Col span={18}>
                    <RuleTable
                      bordered
                      pagination={false}
                      columns={this.state.columns}
                      dataSource={tableList}
                      handleAdd={()=>this.clickDialog(1)}
                      handleModify={(form) => this.handleModify(form)}
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
                  type={this.state.type}
                />
              </Modal>
            </Row>
            <Row style={{marginBottom:10}} type="flex" align="middle">
              <Col xxl={12} md={8}>
                <FormItem label="状态" {...formItemConfig}>
                  {getFieldDecorator('status',{
                    initialValue:labelInfo['status'],
                    rules:[
                        {
                          required:true,
                          message:'请选择状态!'
                        }
                      ]
                  })(
                    <RadioGroup>
                      <Radio value={0}>禁用</Radio>
                      <Radio value={1}>启用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              {
                type==1?null:
                  <Col style={{color:'#FF0000'}} push={7}>
                    最近操作时间：{labelInfo['createTime']} 操作人：  {labelInfo['updateTrueName']}
                  </Col>
              }
            </Row>
            <Row type="flex" align="middle">
              <Col xxl={12} md={8}>
                <Row type="flex" align="middle" gutter={24} justify="center">
                  <Col>
                    <Button type="primary" onClick={this.formSubmit} loading={type==1?this.props.addsubmitLoading:this.props.editsubmitLoading}>保存并提交</Button>
                  </Col>
                  <Col>
                    <Button onClick={()=>router.goBack()}>返回</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
