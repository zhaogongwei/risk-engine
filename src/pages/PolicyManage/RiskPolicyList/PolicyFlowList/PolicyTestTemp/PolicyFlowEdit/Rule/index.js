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
import RuleTable from '@/components/RuleTable'
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment,addListKey,deepCopy} from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ editorFlow, loading,rule}) => ({
  editorFlow,
  rule,
  loading: loading.effects['rule/queryRuleInfo'],
  buttonLoading: loading.effects['rule/saveRuleInfo'],
}))
@Form.create()
export default class SimpleRule extends PureComponent {
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
        dataIndex: 'varName',
        key:'varName',
        editable:true,
        type:'input',
        isFocus:true,
        cols:1,
        sorter: (a, b) => a.varName.length - b.varName.length,
        sortDirections: ['ascend'],
      },{
        title: '变量代码',
        dataIndex: 'varCode',
        key:'varCode',
        cols:2
      },{
        title: '条件',
        key:'compareCondition',
        dataIndex:'compareCondition',
        editable:true,
        type:'select',
        cols:3,
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
        ],
        valueOther:[
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
        title: '比较值',
        key:'compareValue',
        dataIndex:'compareValue',
        width:200,
        editable:true,
        type:'more',
        cols:4,
        pattern:/^\d{1,3}$/
      },
      {
        title: '命中标记',
        key:'ruleCode',
        dataIndex:'ruleCode',
        editable:true,
        type:'input',
        cols:5,
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
      number:'',
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,//状态判断 1:表格 0：输出结果
      visible:false,
      isCount:0,//计数结果类型判断
      resultVarId:{},//输出结果
      countResult:{},//计数结果
    };
  }
 async componentDidMount () {
    console.log(this.props.editorFlow.selectId,'selectId')
    console.log(this.props.editorFlow.editorData,'editorData')
    const {query} = this.props.location;
    //请求变量列表
    this.props.dispatch({
      type: 'rule/queryVarList',
      payload: {
      }
    })
    //请求一级变量分类
    this.props.dispatch({
      type: 'rule/queryOneClassList',
      payload: {
        firstTypeId:0,
        secondTypeId:'',
      }
    })
    //查询节点信息
    const res = await this.props.dispatch({
      type: 'rule/queryRuleInfo',
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
   }

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
  //点击配置弹窗
  clickDialog=(type,record)=>{
    console.log(type,record)
    this.setState({
      status:1,
      visible:true,
      number:record?record['key']:''
    },()=>{
    })
  }
  //输出结果
  outResult=(type)=>{
    this.setState({
      visible:true,
      status:0,
      isCount:type
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
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
    const formData = this.child.getFormValue();
    const {ruleList} = this.props.rule;
    const {selectId} = this.props.editorFlow;
    const {query} = this.props.location;
    this.props.dispatch({
      type: 'rule/saveRuleInfo',
      payload: {
        ...formData,
        ruleType:'simple',
        variables:ruleList,
        nodeId:query['id']
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
        //添加变量
        if(this.state.status){
          const records = this.addForm.submitHandler();
            if(Object.keys(records).length){
              this.props.dispatch({
                type: 'rule/ruleListHandle',
                payload: {
                  ruleList:addListKey(deepCopy([...this.props.rule.ruleList,records]))
                }
              })
            }
        }else{
          //输出结果值选择
          const records = this.addForm.submitHandler();
          const {isCount} = this.state;
          if(isCount){
            this.setState({
              countResult:{
                countVarId:records['varId'],
                countVarValue:records['varName'],
              },
            })
          }else{
            this.setState({
              resultVarId:{
                resultVarId:records['varId'],
                resultVarValue:records['varName'],
              },
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
    console.log('ruleList',this.props)
    return (
      <PageHeaderWrapper >
        <Card
          bordered={false}
          title={'硬规则'}
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
              <Button type="primary" loading={this.props.buttonLoading} onClick={this.handleSave}>保存并提交</Button>
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
        </Card>
      </PageHeaderWrapper>
    )
  }
}
