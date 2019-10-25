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
  Card,
  message,
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
//import AddForm from './AddForm';
import ComplexTable from '@/components/ComplexTable'
import AddForm from '@/components/VarListModal/AddForm'
import FilterIpts from './FilterIpts';
import router from 'umi/router';
import { findInArr,exportJudgment,addListKey,deepCopy} from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ editorFlow, loading,complex,varList}) => ({
  editorFlow,
  complex,
  varList,
  loading:loading.effects['complex/queryComplexInfo'],
  buttonLoading:loading.effects['complex/saveComplexInfo'],
}))
@Form.create()
export default class ComplexRule extends PureComponent {
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
        dataIndex: 'varName',
        key:'varName',
        cols:1,
        editable:true,
        type:'input',
        isFocus:true,
        mold:0,
      },{
        title: '变量代码',
        dataIndex: 'varCode',
        key:'varCode',
        cols:2,
      },{
        title: '条件',
        key:'compareCondition',
        dataIndex:'compareCondition',
        cols:3,
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
            name:'==',
            id:'=='
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
        ],
        valueOth:[
          {
            name:'==',
            id:'=='
          },
          {
            name:'!=',
            id:'!='
          },
        ]
      },
        {
          title: '变量名称',
          dataIndex: 'compareVarName',
          mold:1,
          key:'compareVarName',
          cols:4,
          editable:true,
          type:'input',
          isFocus:true
        },
        {
          title: '变量代码',
          mold:1,
          dataIndex: 'compareVarCode',
          key:'compareVarCode',
          cols:5,
        },
      {
        title: '命中标记',
        key:'ruleCode',
        dataIndex:'ruleCode',
        editable:true,
        cols:6,
        noRequired:true,
        only:true,
        type:'input',
        max:10,
      },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <Popconfirm title="是否确认删除本行?" onConfirm={()=>this.handleDelete(record.key)}  okText="确认" cancelText="取消">
            <Button type="primary">删除</Button>
          </Popconfirm>
        ),
      }],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:0,//0:单选按钮，1：多选按钮
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
      submiting:true,//提交状态，
      complexData: [],  //   复杂规则form数据
      resultQueryData:{},//输出结果查询参数
    };
  }
  async componentDidMount() {
    const {query} = this.props.location;
    //查询节点信息
    const res = await this.props.dispatch({
      type: 'complex/queryComplexInfo',
      payload: {
        nodeId:query['id']
      }
    })
    if(res&&res.status===1){
      this.setState({
        resultVarId:{
          resultVarId:res.data.resultVarId,
          resultVarValue:res.data.resultVarValue,
        },
        countResult:{
          countVarId:res.data.countVarId,
          countVarValue:res.data.countVarValue,
        },
      })
      if(res.data.ruleCondition === 'count'){
        this.child.changeHandle('count')
      }
    }
  }
  componentWillUnmount(){
    this.props.dispatch({
      type: 'complex/InitComplexListHandle',
      payload: {
        data:{
          variables:[],
          countVarId:'',//计数结果id
          countVarValue:'',//计数结果
          resultVarId:'',//输出结果id
          resultVarValue:'',//输出结果
          ruleCondition:'',//规则条件
        }
      }
    })
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //表格变量添加
  handleAdd=()=>{
    const {complexList} = this.props.complex
    //   要添加表格的对象
    const newData = {
      varId:'',
      varName:'',
      varCode:'',
      compareCondition:'',
      compareVarId:'',
      compareVarCode:'',
      compareVarName:'',
      ruleCode:'',
    };
    //   调用models中的方法改变dataSource渲染页面
    this.props.dispatch({
      type: 'complex/complexListHandle',
      payload: {
        complexList: addListKey([...complexList, newData]),
      }
    })
  }
  //点击配置弹窗
  clickDialog=(type,record,mold)=>{
    console.log(type,record,mold)
    this.setState({
      status:1,
      visible:true,
      mold:mold,
      number:record?record['key']:'',
      resultQueryData:{},//输出结果查询参数
    },()=>{
    })
  }
  //输出结果
  outResult=(type)=>{
    if(type){
      this.setState({
        visible:true,
        status:0,
        isCount:type,
        resultQueryData:{
          outFlag:1,
          types:['num']
        },//输出结果查询参数
      })
    }else{
      this.setState({
        visible:true,
        status:0,
        isCount:type,
        resultQueryData:{
          types:['char'],
          outFlag:1,
          enumFlag:0,
        }
      })
    }
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //删除表格数据
  handleDelete=(key)=>{
    const {complexList} = this.props.complex
    const newDataSource = complexList.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'complex/complexListHandle',
      payload: {
        complexList:addListKey(newDataSource)
      }
    })
  }
  //保存数据
  handleSave = ()=>{
      let count=0;
      this.state.complexData.map(item => {
        item.validateFieldsAndScroll((errors,value)=>{
          if(errors)count++;
        })
      })
      const formData = this.child.getFormValue();
      const {complexList} = this.props.complex;
      const {selectId} = this.props.editorFlow;
      const {query} = this.props.location;
      this.child.props.form.validateFields(async(errors,value)=>{
        if(!errors){
          if(complexList.length>0){
            if(!count){
              const res = await this.props.dispatch({
                type: 'complex/saveComplexInfo',
                payload: {
                  ...formData,
                  ruleType:'complex',
                  variables:complexList,
                  nodeId:query['id']
                }
              })
              if(res&&res.status===1){
                message.success(res.statusDesc)
                router.goBack()
              }else{
                message.error(res.statusDesc)
              }
            }
          }else{
            message.error('请选择变量!')
          }
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
        //table选择弹框
        if(this.state.status){
          const records = this.addForm.submitHandler();
          if(Object.keys(records).length){
            //编辑后一个变量
            if(this.state.mold){
              const {complexList} = this.props.complex;
              //当前选中的后一个变量
              const selectedVar = complexList[this.state.number-1];
              let newData = {};
              newData['compareVarId'] = records['varId'];
              newData['compareVarName'] = records['varName'];
              newData['compareVarCode'] = records['varCode'];
              newData['compareVarType'] = records['varType'];
              if(selectedVar['varType']){
                if(selectedVar['varType']!==records['varType']){
                  message.error('字符类型必须一致!')
                  return
                }
              }
              complexList.splice(this.state.number-1,1,{...selectedVar,...newData,})
              this.props.dispatch({
                type: 'complex/complexListHandle',
                payload: {
                  complexList:addListKey(complexList)
                }
              })
            }else{
              //编辑前一个变量
              const {complexList} = this.props.complex
              //前一个选中的变量
              const selectedVar = complexList[this.state.number-1];
              complexList.splice(this.state.number-1,1,{...selectedVar,...records})
              this.props.dispatch({
                type: 'complex/complexListHandle',
                payload: {
                  complexList:addListKey(complexList)
                }
              })
            }
          }
        }else{
          //输出结果值选择
          const records = this.addForm.submitHandler();
          const {isCount} = this.state;
          if(isCount){
            //计数结果
            this.child.props.form.resetFields(['countVarId'])
            this.setState({
              countResult:{
                countVarId:records['varId'],
                countVarValue:records['varName'],
              },
            })
          }else{
            //输出结果
            //复杂规则输出变量只能是字符串且未设置枚举值
            if(!records['enumFlag']&&records['varType']=='char'){
              this.child.props.form.resetFields(['resultVarId'])
              this.setState({
                resultVarId:{
                  resultVarId:records['varId'],
                  resultVarValue:records['varName'],
                },
              })
            }else{
              message.error('规则输出变量只能是字符串且未设置枚举值!')
            }
          }
        }
      })
  }
  //  将每个cell的form保存起来
  handleModify = form => {
    let arr = this.state.complexData;
    arr.push(form)
    this.setState({
      complexData: arr
    })
  }
  render() {
    const { permission } = this.props
    const { query } = this.props.location
    const { resultQueryData } = this.state
    const {title} = query
    const queryData = {
      ...resultQueryData,
      strategyId:query['strategyId']
    }
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={title}
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
            dataSource={this.props.complex.complexList}
            handleAdd={this.handleAdd}
            handleModify={(form) => this.handleModify(form)}
            selectVar={this.clickDialog}
            loading={this.props.loading}
            getSubKey={this.getSubKey}
          />
          <Row type="flex" gutter={24} justify="center" style={{marginTop:20}}>
            <Col>
              <Button type="primary" onClick={this.handleSave} loading={this.props.buttonLoading}>保存并提交</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={()=>router.goBack()}>返回</Button>
            </Col>
          </Row>
          <Modal
            title={'选择变量'}
            destroyOnClose={true}
            maskClosable={false}
            visible={this.state.visible}
            onOk={this.addFormSubmit}
            onCancel={this.handleCancel}
            width={1040}
          ><AddForm
              type={this.state.type}
              number={this.state.number}
              getSubKey={this.getSubKey}
              queryData={queryData}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
