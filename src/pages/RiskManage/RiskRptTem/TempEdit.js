import React, { Component, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import RptTable from '@/components/RptTable/RptTable'
import AddForm from './AddForm';
import {
  Button,
  Table,
  Pagination,
  Modal,
  Icon,
  Row,
  Col,
  Input,
  Select,
  Form,
  message,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ riskRptTem, loading }) => ({
  riskRptTem,
  loading: loading.effects['riskRptTem/riskSubmit']
}))
@Form.create()
export default class TempEdit extends Component {
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
        key:'name'
      },{
        title: '变量代码',
        dataIndex: 'code',
        key:'code'
      },{
        title: '长度',
        key:'length',
        dataIndex:'length'
      },
        {
          title: '类型',
          dataIndex: 'type',
          key:'type'
        },
        {
          title: '排序',
          key:'order',
          dataIndex:'order',
          editable:true
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:true,
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      selectedRowKeys: [],
      tableList:[{key:0,checkList:[]}],
      number:0,
      addModalVisible:false
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
      type: 'riskRptTem/riskSubmit',
      data: {
        ...formData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    console.log(total,range)
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
  //表格新增变量
  addVar=(index)=>{
    console.log(index)
    //this.child.reset()
    this.setState({
      addModalVisible:true,
      number:index
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
// 按钮点击确定事件执行的方法
  addFormSubmit=async ()=>{
    //选择的变量集合
    const checkedList = this.child.submitHandler();
    console.log(checkedList)
    //table数据集合
    let {reportList} =this.props.riskRptTem
    let newlist =[...reportList[this.state.number]['checkList'],...checkedList];
    const newData = addListKey(deepCopy(newlist))
    reportList.splice(this.state.number,1,{...reportList[this.state.number],...{checkList:newData}})
    this.props.dispatch({
      type: 'riskRptTem/rptListHandle',
      payload: {
        reportList:reportList
      }
    })
    this.setState({
      addModalVisible: false
    })
  }
  reset = () => {
    this.props.form.resetFields()
  }
  //添加table
  handleAdd = (key)=>{
    const {reportList }= this.props.riskRptTem
    reportList.splice(key+1,0,{checkList:[],title:''})
    this.props.dispatch({
      type: 'riskRptTem/rptListHandle',
      payload: {
        reportList:reportList,
      }
    })

    console.log(key)
    console.log(reportList)
  }
  //减少table
  handleDelete = (key)=>{
    const {reportList}= this.props.riskRptTem
      const newlist = reportList.filter((item,index) => index !== key)

    this.props.dispatch({
      type: 'riskRptTem/rptListHandle',
      payload: {
        reportList:addListKey(newlist),
      }
    })
      console.log(key)
      console.log(newlist)
  }
  //删除对应表格变量
  deleteVar=(key,list,callback)=>{
    console.log(key,list)
    const {reportList}= this.props.riskRptTem;
    const selectVar= reportList[key]['selectVar'];
    //对应表格的数据
    let checkList = reportList[key]['checkList'];
    if(selectVar.length>0){
      for(var i of selectVar){
        checkList.forEach((item,index)=>{
          if(item['key'] ===i){
            checkList.splice(index,1)
          }
        })
      }
      addListKey(reportList[key]['checkList'])
      /*console.log(newlist)
      reportList.splice(this.state.number,1,{key:this.state.number,title:reportList[this.state.number]['title'],checkList:newlist})*/
      this.props.dispatch({
        type: 'riskRptTem/rptListHandle',
        payload: {
          reportList:reportList
        }
      })
      callback()
    }else{
      message.error('删除失败,请勾选要删除的项目!');
    }
    console.log(reportList)
    console.log(key,list)
  }
  //存储对应table选中的变量
  saveSelectVar=(index,list)=>{
    console.log(index,list)
    const {reportList}= this.props.riskRptTem;
    reportList[index]['selectVar']=list;
  }
  saveData=()=>{
    console.log(this.props.riskRptTem)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <PageTableTitle title={'新增/编辑报告模板'}>
        <RptTable
          loading={this.props.loading}
          columns={this.state.columns}
          dataSource={this.props.riskRptTem.reportList}
          tableList={this.props.riskRptTem.reportList}
          handleDelete={this.handleDelete}
          handleAdd={this.handleAdd}
          addVar={this.addVar}
          deleteVar={this.deleteVar}
          saveSelectVar={this.saveSelectVar}
        />
        <Modal
          className={'ant-modal-sm'}
          width={1000}
          title={''}
          visible={this.state.addModalVisible}
          onOk={this.addFormSubmit}
          destroyOnClose={true}
          confirmLoading={this.props.submitLoading}
          onCancel={() => this.setState({ addModalVisible: false })}
        >
          <AddForm
            number={this.state.number}
            getSubKey={this.getSubKey}
          />
        </Modal>
        <Row type="flex" gutter={16} align="middle" justify="center">
          <Col col={8}>
            <Button type="primary" onClick={this.saveData}>保存</Button>
          </Col>
          <Col col={8}>
            <Button type="primary">预览</Button>
          </Col>
          <Col col={8}>
            <Button type="primary">取消</Button>
          </Col>
        </Row>
      </PageTableTitle>
    )
  }
}
