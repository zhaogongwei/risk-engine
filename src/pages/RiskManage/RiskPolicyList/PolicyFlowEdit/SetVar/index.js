import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Row,
  Col,
  Select,
  Button,
  Table,
  Pagination,
  Icon,
  Form,
  Modal,
  Popconfirm
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import AddForm from './AddForm';
import RuleTable from '@/components/RuleTable'
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ assetDeploy, loading,rule}) => ({
  assetDeploy,
  rule,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
@Form.create()
export default class AssetTypeDeploy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '变量名称',
        dataIndex: 'name',
        key:'name',
        editable:true,
        type:'input',
        isFocus:true
      },{
        title: '条件',
        key:'term',
        dataIndex:'term',
        render:()=>'=' +
          ''
      },
      {
        title: '值',
        key:'compare',
        dataIndex:'compare',
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
      type:1,//0:单选按钮，1：多选按钮
      number:'',
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      visible:false,
    };
  }
  componentDidMount() {
    this.change()
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    let formData ;
    if(this.child){
      formData = this.child.getFormValue()
    }else{
      formData = {}
    }
    this.props.dispatch({
      type: 'assetDeploy/riskSubmit',
      data: {
        ...formData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubKey = (ref,key) => {
    this[key]=ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //新增
  btnAdd=()=>{
    this.childDeploy.reset()
    this.setState({
      modalStatus:true,
      type:true
    })
  }
  //点击配置弹窗
  clickDialog=(type,record)=>{
    console.log(type,record)
    this.setState({
      visible:true,
      type:type,
      number:record?record['key']:''
    })
  }
  //监听子组件数据变化
  handleChildChange = (newState)=>{
    this.setState({
      modalStatus:newState
    })
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
        {findInArr(this.props.permission, 'ADD')&&<Button onClick={this.btnAdd}><Icon type="plus" theme="outlined" />新增</Button>}
      </Fragment>
    )
  }
  //删除表格数据
  handleDelete=(key)=>{
    const {ruleList} = this.props.rule
    const newDataSource = ruleList.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'rule/ruleListHandle',
      payload: {
        ruleList:addListKey(newDataSource)
      }
    })
  }
  //保存数据
  handleSave = ()=>{
    console.log(this.props.rule.ruleList)
  }
  //弹框按钮取消
  handleCancel =()=>{
    this.setState({visible:false})
  }
  //弹框确定
  addFormSubmit=()=>{
    this.setState({visible:false},()=>{
      const {checkedList,radioValue }= this.addForm.submitHandler();
      console.log(checkedList)
      if(this.state.type){
        this.props.dispatch({
          type: 'rule/ruleListHandle',
          payload: {
            ruleList:addListKey(deepCopy([...this.props.rule.ruleList,...checkedList]))
          }
        })
      }else{
        console.log(this.state.radioValue)
        console.log(this.props.rule)
        const {ruleList} = this.props.rule
        ruleList.splice(this.props.number-1,1,radioValue)
        this.props.dispatch({
          type: 'rule/ruleListHandle',
          payload: {
            ruleList:addListKey(deepCopy(ruleList))
          }
        })
      }

    })
  }
  render() {
    const { permission } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <PageTableTitle title={'设置变量'}>
        <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>

        <RuleTable
          bordered
          pagination={false}
          columns={this.state.columns}
          dataSource={this.props.rule.ruleList}
          handleAdd={()=>this.clickDialog(1)}
          handleModify={this.clickDialog}
          loading={this.props.loading}
        />
        <Row type="flex" gutter={24} justify="center" style={{marginTop:20}}>
          <Col>
            <Button type="primary" onClick={this.handleSave}>保存并提交</Button>
          </Col>
          <Col>
            <Button type="primary">返回</Button>
          </Col>
        </Row>
        <Modal
          title={'选择变量'}
          visible={this.state.visible}
          onOk={this.addFormSubmit}
          onCancel={this.handleCancel}
          width={1040}
        >
          <AddForm
            type={this.state.type}
            number={this.state.number}
            getSubKey={this.getSubKey}
          />
        </Modal>
      </PageTableTitle>
    )
  }
}
