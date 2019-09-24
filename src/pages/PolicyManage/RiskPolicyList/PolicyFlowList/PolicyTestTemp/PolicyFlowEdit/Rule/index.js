import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Highlighter from 'react-highlight-words';
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
  Input,
  message,
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import AddForm from '@/components/VarListModal/AddForm'
import RuleTable from '@/components/RuleTable'
import FilterIpts from './FilterIpts';
import router from 'umi/router';
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
        sorter: (a, b) => this.compareFunction(a['varName'],b['varName']),
        sortDirections: ['ascend'],
          ...this.getColumnSearchProps('varName'),
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
          <Popconfirm title="是否确认删除本行?" onConfirm={()=>this.handleDelete(record.key)}>
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
      searchText: '',
      ruleData: [],  //   简单规则form数据
      resultQueryData:{},//输出结果查询参数
    };
  }
 async componentDidMount () {
    const {query} = this.props.location;
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
     if(res.data.ruleCondition === 'count'){
       this.child.changeHandle('count')
     }
   }

  }
  componentWillUnmount(){
    this.props.dispatch({
      type: 'rule/InitruleListHandle',
      payload: {
        data:{
          variables:[],
          countVarId:'',
          countVarValue:'',
          resultVarId:'',
          resultVarValue:'',
          ruleCondition:'',
        }
      }
    })
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
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
      number:record?record['key']:'',
      resultQueryData:{}
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
          types:['num']
        }
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
  handleDelete=async(key)=>{
    const {ruleList} = this.props.rule
    const newDataSource = ruleList.filter(item => item.key !== key)
    await this.props.dispatch({
      type: 'rule/ruleListHandle',
      payload: {
        ruleList:addListKey(newDataSource)
      }
    })
  }
  //保存数据
  handleSave = ()=>{
    let count=0;
    this.state.ruleData.map(item => {
      item.validateFieldsAndScroll((errors,value)=>{
        if(errors)count++;
      })
    })
    const formData = this.child.getFormValue();
    const {ruleList} = this.props.rule;
    const {selectId} = this.props.editorFlow;
    const {query} = this.props.location;
    this.child.props.form.validateFields(async(errors,value)=>{
      if(!errors){
        if(ruleList.length>0){
          if(!count){
            const res = await this.props.dispatch({
              type: 'rule/saveRuleInfo',
              payload: {
                ...formData,
                ruleType:'simple',
                variables:ruleList,
                nodeId:query['id']
              }
            })
            if(res&&res.status===1){
              message.success(res.statusDesc)
                .then(()=>{
                  router.goBack()
                })

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
            //规则输出变量只能是字符串且未设置枚举值
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
  //table 按变量名称搜索
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  //按照变量首字母排序
  compareFunction=(a,b)=>{
    return a.localeCompare(b);
  }
  //  将每个cell的form保存起来
  handleModify = form => {
    let arr = this.state.ruleData
    arr.push(form)
    this.setState({
      ruleData: arr
    })
  }
  render() {
    const { permission } = this.props
    const { resultQueryData } = this.state
    const { query } = this.props.location
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
      <PageHeaderWrapper >
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
          <RuleTable
            bordered
            pagination={false}
            getSubKey={this.getSubKey}
            columns={this.state.columns}
            dataSource={this.props.rule.ruleList}
            handleAdd={()=>this.clickDialog(1)}
            handleModify={(form) => this.handleModify(form)}
            loading={this.props.loading}
          />
          <Row type="flex" gutter={24} justify="center" style={{marginTop:20}}>
            <Col>
              <Button type="primary" loading={this.props.buttonLoading} onClick={this.handleSave}>保存并提交</Button>
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
          >
            <AddForm
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
