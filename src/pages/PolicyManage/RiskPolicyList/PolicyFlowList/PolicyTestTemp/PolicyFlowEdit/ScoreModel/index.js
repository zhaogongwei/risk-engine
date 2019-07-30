import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Row,
  Col,
  Button,
  Table,
  Pagination,
  Icon,
  Popconfirm,
  message,
  Modal,
  Card
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import FilterIpts from './FilterIpts';
import AddForm from './AddForm';
import ScoreModelTable from '@/components/ScoreModelTable'
import SetRowCol from '@/components/SetRowCol'
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'

@connect(({ editorFlow,scoreModel, loading }) => ({
  editorFlow,
  scoreModel,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class ScoreModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '变量名称',
        dataIndex: 'variableName',
        key:'variableName',
        editable: true,
      },{
        title: '代码',
        dataIndex: 'variableCode',
        key:'variableCode'
      },{
        title: '类型',
        key:'variableType',
        dataIndex:'variableType'
      },
        {
          title: '操作',
          key:'action',
          render: (record) => {
            return <div style={{display:'flex',justifyContent:'center'}}>
                      <Button type="primary" style={{marginRight:20}} onClick={()=>this.handledit(record)}>编辑</Button>
                      <Popconfirm title="是否确认删除本行?" onConfirm={()=>this.handleDeleteLeft(record.key)}  okText="Yes" cancelText="No">
                        <Button type="primary">删除</Button>
                      </Popconfirm>
                    </div>
          },
        }],
      columnNum:[
        {
          title: '序号',
          dataIndex: 'key',
          key:'key'
        },
        {
          title: '下限条件',
          dataIndex: 'lowerCondition',
          editable:true,
          key:'lowerCondition',
          type:'select',
          value:[
            {
              name:'>',
              id:'>'
            },
            {
              name:'>=',
              id:'>='
            },
            {
              name:'=',
              id:'='
            }
          ]
        },{
          title: '下限值',
          dataIndex: 'lowerValue',
          editable:true,
          key:'lowerValue',
          type:'input'
        },{
          title: '上限条件',
          dataIndex: 'highCondition',
          editable:true,
          key:'highCondition',
          type:'select',
          value:[
            {
              name:'<',
              id:'<'
            },
            {
              name:'<=',
              id:'<='
            },
            {
              name:'=',
              id:'='
            }
          ]
        },{
          title: '上限值',
          dataIndex: 'highValue',
          editable:true,
          key:'highValue',
          type:'input'
        },
        {
          title: '评分',
          dataIndex: 'score',
          editable:true,
          key:'score',
          type:'input'
        },
        {
          title: '操作',
          key: 'action',
          render: (record) => {
            return(<Popconfirm title="确定要删除本行吗?" onConfirm={() => this.handleDeleteRight(record.key)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>)
          }
        }
      ],
      columnStr:[
        {
          title: '序号',
          dataIndex: 'key',
          key:'key'
        },
        {
          title: '条件',
          dataIndex: 'highCondition',
          editable:true,
          type:'select',
          key:'highCondition',
          value:[
            {
              name:'==',
              id:'=='
            },
            {
              name:'!=',
              id:'!='
            }
          ]
        },
        {
          title: '值',
          dataIndex: 'highValue',
          editable:true,
          key:'highValue',
        },
        {
          title: '评分',
          dataIndex: 'score',
          editable:true,
          key:'score',
          type:'input'
        },
        {
          title: '操作',
          key: 'action',
          render: (record) => {
            return(<Popconfirm title="确定要删除本行吗?" onConfirm={() => this.handleDeleteRight(record.key)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>)
          }
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//0:单选按钮，1：多选按钮
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,//状态判断 1:表格 0：输出结果
      number:'',//单选时选中变量的key
      tableState:false,//右侧表格显示状态
      varType:0,//变量类型 0：字符 1:数字
      varKey:0,//变量key值
      visible:false,
      resultVarId:{},//输出结果
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
    this[key]=ref
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //点击配置弹窗
  clickDialog=(type,record)=>{
    console.log(type,record)
    this.setState({
      status:1,
      visible:true,
      type:type,
      number:record?record['key']:''
    })
  }
  //输出结果
  outResult=()=>{
    this.setState({
      visible:true,
      status:0,
      type:0,
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
       <Button><Icon type="plus" theme="outlined" />选择变量</Button>
      </Fragment>
    )
  }
  //删除左侧表格数据
  handleDeleteLeft=(key)=>{
    const {scoreList} = this.props.scoreModel
    const newDataSource = scoreList.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'scoreModel/scoreListHandle',
      payload: {
        scoreList:addListKey(newDataSource)
      }
    })
  }
  //右侧表格添加数据
  handleAddRight = () => {
    if(!this.state.varType){
      //变量为字符类型
      const {option,kind,isenum} = this.props.scoreModel.scoreList[this.state.varKey-1]
      console.log(option)
      const {count, dataSource} = this.props.scoreModel.two;
      const newData = {
        term:'',
        val:'',
        score:'',
        enum:option,
        kind:kind,
        isenum:isenum
      };
      this.props.dispatch({
        type: 'scoreModel/addTwoData',
        payload: {
          dataSource: addListKey([...dataSource, newData]),
        }
      })

    }else{
      //变量为数字类型
      const { count, dataSource } = this.props.scoreModel.one;
      //   要添加表格的对象
      const newData = {
        lowerCondition:'',
        lowerValue:'',
        highCondition:'',
        highValue:'',
        score:'',
      };
      //   调用models中的方法改变dataSource渲染页面
      this.props.dispatch({
        type: 'scoreModel/addDataSource',
        payload: {
          dataSource: addListKey([...dataSource, newData]),
        }
      })
      console.log(this.props)
    }
  }
  //   删除右侧表格数据
  handleDeleteRight = (key) => {
    if(!this.state.varType){
      //变量为字符类型
      const {dataSource,count} = this.props.scoreModel.two
      const newDataSource = dataSource.filter(item => item.key !== key)
      this.props.dispatch({
        type:'scoreModel/delStrData',
        payload:{
          dataSource:addListKey(newDataSource),
        }
      })
    }else{
      //变量为数字类型
      const {dataSource,count} = this.props.scoreModel.one;
      //   调用models的方法去删除dataSource中的数据
      const newDataSource = dataSource.filter(item => item.key !== key)
      console.log('newDataSource',newDataSource)
      this.props.dispatch({
        type: 'scoreModel/delNumData',
        payload: {
          dataSource: addListKey(newDataSource),
        }
      })
    }

  }
  //表格编辑
  handledit=(record)=>{
    console.log(record)
    this.setState({
      tableState:true,
      varKey:record.key,
      varType:record.kind == 'num'?1:0
    },()=>{
      //点击不同的变量的编辑时，先清除数据右边表格数据
      const {key} = record
      const {scoreList} = this.props.scoreModel
      const {detailist} =scoreList[key-1]
      //点击编辑时，先判断该变量是否有变量明细值
      if(detailist&&detailist.length>0){
        if(this.state.varType){
          this.props.dispatch({
            type: 'scoreModel/delNumData',
            payload: {
              dataSource: addListKey(detailist),
            }
          })
        }else{
          this.props.dispatch({
            type:'scoreModel/delStrData',
            payload:{
              dataSource:addListKey(detailist),
            }
          })
        }
      }else{
        this.props.dispatch({
          type: 'scoreModel/delNumData',
          payload: {
            dataSource: [],
          }
        })
        this.props.dispatch({
          type:'scoreModel/delStrData',
          payload:{
            dataSource:[],
          }
        })
      }
    })
  }
  //右侧表格数据保存
  handleSave = ()=>{
    const {scoreList,one,two} = this.props.scoreModel
    const {varKey} = this.state
    //右侧保存按钮点击时，把表格数据和左侧对应的变量合在一起；
    //变量为数字类型
    if(this.state.varType){
      Object.assign(scoreList[varKey-1],{variableInfoList:one.dataSource})
    }else{
      //变量为字符类型
      Object.assign(scoreList[varKey-1],{variableInfoList:two.dataSource})
    }
    message.success('保存成功')
    console.log(this.props.scoreModel)
  }
  //弹框按钮取消
  handleCancel =()=>{
    this.setState({visible:false})
  }
  //弹框按钮确定
  addFormSubmit=()=>{
    this.setState({visible:false},()=>{
      if(this.state.status){
        const {checkedList,radioValue }= this.addForm.submitHandler();
        console.log(this.state.checkedList)
        if(this.state.type){
          this.props.dispatch({
            type: 'scoreModel/scoreListHandle',
            payload: {
              scoreList:addListKey(deepCopy([...this.props.scoreModel.scoreList,...checkedList]))
            }
          })
          console.log(this.props.scoreModel)
        }else{
          if(Object.keys(radioValue).length){
            const {scoreList} = this.props.scoreModel
            scoreList.splice(this.state.number-1,1,radioValue)
            this.props.dispatch({
              type: 'scoreModel/scoreListHandle',
              payload: {
                scoreList:addListKey(deepCopy(scoreList))
              }
            })
          }
        }
      }else{
        //输出结果值选择
        const {checkedList,radioValue} = this.addForm.submitHandler();
        this.setState({
          resultVarId:radioValue,
        })
      }
    })
  }
  save=()=>{
    const data = {
      nodeId:this.props.editorFlow.selectId,
      ruleCondition:this.child.getFormValue().ruleCondition,
      resultVarId:this.child.getFormValue().resultVarId,
      ruleType:'score',
      variables:this.props.scoreModel.scoreList,
    }
    console.log(this.props.scoreModel.scoreList)
    console.log(JSON.stringify(data))
  }
  render() {
    const { permission } = this.props
    const list = [
      {
        key:1,
        varName:'zgw'
      },
      {
        key:2,
        varName:'ld'
      }
    ]
    return (
      <PageHeaderWrapper >
        <Card
          bordered={false}
          title={'评分模型'}
        >
          <FilterIpts
            getSubKey={this.getSubKey}
            change={this.onChange}
            current={this.state.currentPage}
            changeDefault={this.changeDefault}
            outResult={this.outResult}
            resultVarId={this.state.resultVarId}
          />
          <Row type="flex" gutter={24} align="top">
            <Col span={12}>
              <ScoreModelTable
                dataSource={this.props.scoreModel.scoreList}
                columns={this.state.columns}
                handleAdd={()=>this.clickDialog(1)}
                handleModify={this.clickDialog}
              />
            </Col>
            <Col span={12}>
              {
                this.state.tableState?
                  <div>
                    <Row>
                      <SetRowCol
                        title={'评分明细'}
                        list={this.state.varType?this.props.scoreModel.one:this.props.scoreModel.two}
                        columns={this.state.varType?this.state.columnNum:this.state.columnStr}
                        handleAdd={this.handleAddRight}
                      />
                    </Row>
                    <Row type="flex" justify="center">
                      <Button type="primary" style={{marginTop:20}} onClick={this.handleSave}>保存</Button>
                    </Row>
                  </div>
                  :''
              }

            </Col>
          </Row>
          <Row type="flex" gutter={24} justify="center" style={{marginTop:20}}>
            <Col>
              <Button type="primary" onClick={this.save}>保存并提交</Button>
            </Col>
            <Col>
              <Button>返回</Button>
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
