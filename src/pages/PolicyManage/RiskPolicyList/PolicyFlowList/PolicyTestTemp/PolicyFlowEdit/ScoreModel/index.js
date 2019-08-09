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
//import AddForm from './AddForm';
import AddForm from '@/components/VarListModal/AddForm'
import EditForm from './editForm';
import ScoreModelTable from '@/components/ScoreModelTable'
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'

@connect(({ editorFlow,scoreModel, loading,varList }) => ({
  editorFlow,
  scoreModel,
  varList,
  loading:loading.effects['scoreModel/queryScoreInfo'],
  buttonLoading:loading.effects['scoreModel/saveScoreInfo'],
  submiting:loading.effects['scoreModel/verifyMixed'],
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
        dataIndex: 'varName',
        key:'varName',
        editable: true,
      },{
        title: '代码',
        dataIndex: 'varCode',
        key:'varCode'
      },{
        title: '类型',
        key:'varType',
        dataIndex:'varType'
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
      checkedData: [],
      modalStatus:false,
      code:'',
      type:0,//0:单选按钮，1：多选按钮
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,//状态判断 1:表格 0：输出结果
      number:'',//单选时选中变量的key
      tableState:false,//右侧表格显示状态
      varType:0,//变量类型 0：字符 1:数字
      varKey:0,//变量key值
      visible:false,//选择变量弹框显隐状态
      editShow:false,//编辑弹框显隐状态
      resultVarId:{},//输出结果
      varObjRow:{},//每行的变量对象
    };
  }
  async componentDidMount() {
    const {query} = this.props.location;
    //请求变量列表
    this.props.dispatch({
      type: 'varList/queryVarList',
      payload: {
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
    //查询节点信息
    const res = await this.props.dispatch({
      type: 'scoreModel/queryScoreInfo',
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
      })
    }
  }
  //   获取子组件数据的方法
  getSubKey = (ref,key) => {
    this[key]=ref
  }
  //点击配置弹窗
  clickDialog=(type,record)=>{
    console.log(type,record)
    this.setState({
      status:1,
      visible:true,
      number:record?record['key']:''
    })
  }
  //输出结果
  outResult=()=>{
    this.setState({
      visible:true,
      status:0,
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
  //表格编辑
  handledit=async (record)=>{
    console.log(record)
    this.setState({
      editShow:true,
      varKey:record.key,
      varObjRow:record,
      varType:record.varType == 'num'?1:0
    },()=>{
      //点击不同的变量的编辑时，先清除数据右边表格数据
      const {key} = record
      const {scoreList} = this.props.scoreModel
      const {variableInfoList} =scoreList[key-1]
      //点击编辑时，先判断该变量是否有变量明细值
      if(variableInfoList&&variableInfoList.length>0){
        //变量为数字类型
        if(this.state.varType){
          this.props.dispatch({
            type: 'scoreModel/delNumData',
            payload: {
              dataSource: addListKey(variableInfoList),
            }
          })
        }else{
          //字符类型
          this.props.dispatch({
            type:'scoreModel/delStrData',
            payload:{
              dataSource:addListKey(variableInfoList),
            }
          })
        }
      }else{
        //清空数据
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
  //弹框按钮取消
  handleCancel =()=>{
    this.setState({visible:false})
  }
  //弹框按钮确定
  addFormSubmit=()=>{
    this.setState({visible:false},()=>{
      //弹框选择的值
      const records= this.addForm.submitHandler();
      //table输入框值选择
      if(this.state.status){
        if(Object.keys(records).length){
          const {scoreList} = this.props.scoreModel
          if(records['varType']==='num'||(records['varType']==='char'&&records['enumFlag'])){
            const keyList = scoreList.filter(item => item['varId']===records['varId'])
            console.log('key',keyList)
            if(scoreList.length&&keyList.length){
              message.error('不能添加重复变量!')
              return;
            }
            this.props.dispatch({
              type: 'scoreModel/scoreListHandle',
              payload: {
                scoreList:addListKey(deepCopy([...scoreList,{...records}]))
              }
            })
          }else{
            message.error('只能添加数字、设置了枚举值的字符变量!')
          }
        }
      }else{
        //输出结果值选择
        if(records['varType']!=='num'){
          message.error('此处选择弹框中只能选择数字类型变量!');
          return;
        }
        this.setState({
          resultVarId:{
            resultVarId:records['varId'],
            resultVarValue:records['varName'],
          },
        })
      }
    })
  }
  //编辑弹框保存事件
  //弹框表格数据保存(必须点击保存否则数据不予保存)（交集验证通过保存,不通过不保存）
  editFormSubmit=async ()=>{
    const {scoreList,numList,strList} = this.props.scoreModel;
    const {varKey} = this.state;
    if(this.state.varType){
      const res = await this.props.dispatch({
        type:'scoreModel/verifyMixed',
        payload:{
          variableInfoList:numList.dataSource,
        }
      })
      if(res&&res.status ===1 ){
        message.success(res.statusDesc)
        Object.assign(scoreList[varKey-1],{variableInfoList:numList.dataSource})
        this.setState({editShow:false,})
      }else{
        message.error(res.statusDesc)
      }
    }else{
      //变量为字符类型
      message.success('保存成功')
      Object.assign(scoreList[varKey-1],{variableInfoList:strList.dataSource})
      this.setState({editShow:false,})
    }
  }
  //保存数据
  handleSave=()=>{
    const formData = this.child.getFormValue();
    const {scoreList} = this.props.scoreModel;
    const {query} = this.props.location;
    this.props.dispatch({
      type: 'scoreModel/saveScoreInfo',
      payload: {
        ...formData,
        ruleType:'score',
        variables:scoreList,
        nodeId:query['id']
      }
    })
  }
  render() {
    return (
      <PageHeaderWrapper >
        <Card
          bordered={false}
          title={'评分模型'}
        >
          <FilterIpts
            getSubKey={this.getSubKey}
            change={this.onChange}
            outResult={this.outResult}
            resultVarId={this.state.resultVarId}
          />
          <Row type="flex" gutter={24} align="top">
            <Col span={12}>
              <ScoreModelTable
                dataSource={this.props.scoreModel.scoreList}
                columns={this.state.columns}
                handleAdd={()=>this.clickDialog(1)}
                loading={this.props.loading}
                handleModify={this.clickDialog}
              />
            </Col>
          </Row>
          <Row style={{marginTop:20}}>
            <Col span={12}>
              <Row type="flex" gutter={24} justify="center" >
                <Col>
                  <Button type="primary" loading={this.props.buttonLoading} onClick={this.handleSave}>保存并提交</Button>
                </Col>
                <Col>
                  <Button>返回</Button>
                </Col>
              </Row>
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
          <Modal
            title={'评分明细'}
            visible={this.state.editShow}
            onOk={this.editFormSubmit}
            onCancel={()=>this.setState({editShow:false})}
            okText="保存"
            width={1040}
            confirmLoading={this.props.submiting}
          >
            <EditForm
              varType={this.state.varType}
              varKey={this.state.varKey}
              getSubKey={this.getSubKey}
              varObjRow={this.state.varObjRow}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
