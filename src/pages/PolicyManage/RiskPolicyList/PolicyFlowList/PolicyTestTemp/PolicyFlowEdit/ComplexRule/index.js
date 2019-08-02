import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Row,
  Col,
  Select,
  Button,
  Table,
  Pagination,
  Icon,
  Form,
  Popconfirm,
  Modal,
  Card
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import AddForm from './AddForm';
import ComplexTable from '@/components/ComplexTable'
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment,addListKey,deepCopy} from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ editorFlow, loading,complex}) => ({
  editorFlow,
  complex,
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
      },
        {
        title: '变量名称',
        dataIndex: 'variableName',
        key:'variableName',
        editable:true,
        type:'input',
        isFocus:true,
        mold:0,
      },{
        title: '变量代码',
        dataIndex: 'variableCode',
        key:'variableCode',
      },{
        title: '条件',
        key:'compareCondition',
        dataIndex:'compareCondition',
        editable:true,
        type:'select',
        value:[
          {
            name:'<=',
            id:'<='
          },
          {
            name:'<',
            id:'<'
          },
          {
            name:'=',
            id:'='
          },
          {
            name:'>=',
            id:'>='
          },
          {
            name:'>',
            id:'>'
          },
          {
            name:'!=',
            id:'!='
          },
        ]
      },
        {
          title: '变量名称',
          dataIndex: 'variableNameTwo',
          mold:1,
          key:'variableNameTwo',
          editable:true,
          type:'input',
          isFocus:true
        },
        {
          title: '变量代码',
          mold:1,
          dataIndex: 'variableCodeTwo',
          key:'variableCodeTwo',
        },
      {
        title: '规则编码',
        key:'ruleCode',
        dataIndex:'ruleCode',
        editable:true,
        type:'input'
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
      status:1,//状态判断 1:表格 0：输出结果
      visible:false,
      mold:0,
      isCount:0,//计数结果类型判断
      resultVarId:{},//输出结果
      countResult:{},//计数结果
    };
  }
  componentDidMount() {
    //this.change()
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
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //表格变量添加
  handleAdd=()=>{
    const {ruleList} = this.props.complex
    //   要添加表格的对象
    const newData = {
      varId:'',
      variableName:'',
      variableCode:'',
      compareCondition:'',
      compareVarId:'',
      variableNameTwo:'',
      variableCodeTwo:'',
      ruleCode:'',
    };
    //   调用models中的方法改变dataSource渲染页面
    this.props.dispatch({
      type: 'complex/ruleListHandle',
      payload: {
        ruleList: addListKey([...ruleList, newData]),
      }
    })
  }
  //点击配置弹窗
  clickDialog=(type,record,mold)=>{
    console.log(type,record,mold)
    this.setState({
      status:1,
      visible:true,
      type:type,
      mold:mold,
      number:record?record['key']:''
    },()=>{
    })
  }
  //输出结果
  outResult=(type)=>{
    this.setState({
      visible:true,
      status:0,
      type:0,
      isCount:type,
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //删除表格数据
  handleDelete=(key)=>{
    const {ruleList} = this.props.complex
    const newDataSource = ruleList.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'complex/ruleListHandle',
      payload: {
        ruleList:addListKey(newDataSource)
      }
    })
  }
  //保存数据
  handleSave = ()=>{
    const data = {
      nodeId:this.props.editorFlow.selectId,
      ruleCondition:this.child.getFormValue().ruleCondition,
      resultVarId:this.child.getFormValue().resultVarId,
      ruleType:'complex',
      variables:this.props.complex.ruleList,
    }
    console.log(this.child.getFormValue())
    console.log(this.props.complex.ruleList)
    console.log(JSON.stringify(data))
    console.log(JSON.stringify({nodeJson:JSON.stringify(this.props.editorFlow.editorData)}))
  }
  //弹框按钮取消
  handleCancel =()=>{
    this.setState({visible:false})
  }
  //弹框按钮确定
  addFormSubmit =()=>{
      this.setState({visible:false},()=>{
        if(this.state.status){
          const {checkedList,radioValue} = this.addForm.submitHandler();
          const radioValueCopy = deepCopy(radioValue)
          console.log(radioValue)
          if(this.state.type){
            this.props.dispatch({
              type: 'complex/ruleListHandle',
              payload: {
                ruleList:addListKey(deepCopy([...this.props.complex.ruleList,...checkedList]))
              }
            })
          }else{
            if(Object.keys(radioValueCopy).length){
              //编辑后一个变量
              if(this.state.mold){
                const {ruleList} = this.props.complex;
                const ruleRadio = ruleList[this.state.number-1];
                let newData = {};
                newData['compareVarId'] = radioValue['varId'];
                newData['variableNameTwo'] = radioValue['variableName'];
                newData['variableCodeTwo'] = radioValue['variableCode'];
                newData['variableType'] = radioValue['variableType'];
                ruleList.splice(this.state.number-1,1,{...ruleRadio,...newData,})
                this.props.dispatch({
                  type: 'complex/ruleListHandle',
                  payload: {
                    ruleList:addListKey(deepCopy(ruleList))
                  }
                })
              }else{
                //编辑前一个变量
                console.log(radioValueCopy)
                console.log(this.props.complex)
                const {ruleList} = this.props.complex
                console.log(ruleList,'ruleList')
                const ruleRadio = ruleList[this.state.number-1];
                ruleList.splice(this.state.number-1,1,{...ruleRadio,...radioValue})
                this.props.dispatch({
                  type: 'complex/ruleListHandle',
                  payload: {
                    ruleList:addListKey(deepCopy(ruleList))
                  }
                })
              }
            }
          }
        }else{
          //输出结果值选择
          const {checkedList,radioValue} = this.addForm.submitHandler();
          const {isCount} = this.state;
          if(isCount){
            this.setState({
              countResult:radioValue,
            })
          }else{
            this.setState({
              resultVarId:radioValue,
            })
          }
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
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={'复杂规则'}
        >
          <FilterIpts
            getSubKey={this.getSubKey}
            change={this.onChange}
            current={this.state.currentPage}
            changeDefault={this.changeDefault}
            outResult={this.outResult}
            resultVarId={this.state.resultVarId}
            countResult={this.state.countResult}
          />
          <ComplexTable
            bordered
            pagination={false}
            columns={this.state.columns}
            dataSource={this.props.complex.ruleList}
            handleAdd={this.handleAdd}
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
          ><AddForm
              type={this.state.type}
              number={this.state.number}
              getSubKey={this.getSubKey}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
