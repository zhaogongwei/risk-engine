import React, { PureComponent, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Popconfirm,
  Button,
  Table,
  Pagination,
  Icon,
  Card,
  Modal,
  Row,
  Col,
  message
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import FilterIpts from './FilterIpts';
import EditForm from './EditForm';
import AddForm from '@/components/VarListModal/AddForm'
import { findInArr,exportJudgment } from '@/utils/utils'
import SelectableTable from '@/components/SelectTable'
import { addListKey,deepCopy } from '@/utils/utils'

@connect(({ decision,varList,loading}) => ({
    decision,
    varList,
    loading:loading.effects['decision/querydecInfo'],
    buttonLoading:loading.effects['decision/savedecInfo'],
  })
)

export default class DecisModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedData: [],
      currentPage:1,
      current:'',
      type:0,//0:设置行变量  1：设置列变量
      visible:false,//弹框
      inputType:0,//0:行变量，1：列变量 2：输出结果
      resultVarId:{},//输出变量
      rowVar:{},//行变量
      colVar:{},//列变量
      show:false,//行列设置弹框显隐控制
      decFormList:[],//可编辑table form 集合
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
      type: 'decision/querydecInfo',
      payload: {
        nodeId:query['id']
      }
    })
    if(res&&res.status===1){
      /*this.restoreColList(res.data.colVarList);
      this.restoreTableCol(res.data.colVarList);
      this.restoreRowList(res.data.rowVarList);
      this.restoreTableRow(res.data.rowVarList);*/
      this.setState({
        resultVarId:{
          resultVarId:res.data.resultVarId,
          resultVarValue:res.data.resultVarName,
          enumList:res.data.variableEnumList,
        },
        colVar:{
          colVarId:res.data.colVarId,
          colVarValue:res.data.colVarName,
        },
        rowVar:{
          rowVarId:res.data.rowVarId,
          rowVarValue:res.data.rowVarName,
        }
      })
    }
  }
  //colList 还原函数
  restoreColList = (arr=[])=>{
    if(!arr.length)return;
    let dataSource=[];
    arr.map((item,index)=>{
      dataSource.push({
        lowerCondition:item['lowerCondition'],
        lowerValue:item['lowerValue'],
        highCondition:item['highCondition'],
        highValue:item['highValue'],
        variableName:item['variableName'],
        id:item['id'],
        variableId:item['variableId'],
      })
    })
    this.props.dispatch({
      type: 'decision/saveColData',
      payload: {
        dataSource:addListKey(dataSource)
      }
    })
  }
  //rowList 还原函数
  restoreRowList=(arr=[])=>{
    if(!arr.length)return;
    let dataSource=[];
    arr.map((item,index)=>{
      dataSource.push({
        lowerCondition:item['rowVarInfo']['lowerCondition'],
        lowerValue:item['rowVarInfo']['lowerValue'],
        highCondition:item['rowVarInfo']['highCondition'],
        highValue:item['rowVarInfo']['highValue'],
        variableName:item['rowVarInfo']['variableName'],
        id:item['rowVarInfo']['id'],
        variableId:item['rowVarInfo']['variableId'],
      })
    })
    this.props.dispatch({
      type: 'decision/saveRowData',
      payload: {
        dataSource:addListKey(dataSource)
      }
    })
  }
  //tableCol 还原
  restoreTableCol=(arr=[])=>{
    if(!arr.length)return;
    let dataSource=[];
    arr.map((item,index)=>{
      dataSource.push({
        title:item['showName'],
        key:index+1,
        col:index+1,
        id:item['id'],
        colVarInfo:item,
        dataIndex:item['indexKey'],
        editable:true
      })
    })
    this.props.dispatch({
      type: 'decision/makeTableCol',
      payload: {
        tableCol: [
          {
            key:0,
            col:0,
            title:'',
            dataIndex:'index_0'
          }, ...dataSource],
      }
    })
  }
  //tableRow 还原
  restoreTableRow=(arrRow=[],arrCol=[])=>{
    const {tableCol,tableRow} = this.props.decision;
    if(!arrRow.length)return;
    let dataSource=[];
    arrRow.map((item,index)=>{
      dataSource.push({
        index_0:item['rowVarInfo']['showName'],
        key:index+1,
        row:index+1,
        rowVarInfo:item['rowVarInfo'],
        resultVarMap:item['resultVarMap'],
        ...item['resultVarMap']
      })
    })
    this.props.dispatch({
      type: 'decision/makeTableRow',
      payload: {
        tableRow:dataSource,
      }
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //   获取子组件数据的方法
  getSubKey = (ref,key) => {
    this[key]=ref;
  }
  //设置行
  setRow=()=>{
    //先判断有没有设置行变量
    const {rowVar,colVar} = this.state;
    if(!Object.keys(rowVar).length){
      message.error('请选择行变量!');
      return;
    }
    this.setState({
      show:true,
      type:0
    })
  }
  //设置列
  setCol=()=>{
    //先判断有没有设置列变量
    const {rowVar,colVar} = this.state;
    if(!Object.keys(colVar).length){
      message.error('请选择列变量!');
      return;
    }
    this.setState({
      show:true,
      type:1
    })
  }
  //弹框确定事件
  handleOk=()=>{
    this.setState({visible:false},()=>{
      const records = this.addForm.submitHandler();
      if(this.state.inputType === 0){
        if(records['varType']!=='num'){
          message.error('此处选择弹框中只展示数字类型变量!')
          return
        }
        this.setState({
          rowVar:{
            rowVarId:records['varId'],
            rowVarValue:records['varName'],
          }
        })
      }else if(this.state.inputType === 1){
        if(records['varType']!=='num'){
          message.error('此处选择弹框中只展示数字类型变量!')
          return
        }
        this.setState({
          colVar:{
            colVarId:records['varId'],
            colVarValue:records['varName']
          }
        })
      }else if(this.state.inputType === 2){
        if(records['varType']!=='char' || !records['enumFlag']){
          message.error('此处选择弹框中只展示有枚举值的字符类型变量!')
          return
        }
        this.setState({
          resultVarId:{
            resultVarId:records['varId'],
            resultVarValue:records['varName'],
            enumList:records['enumList']
          },
        })
      }
    })
  }
  //弹框唤起事件
  openDialog=(type)=>{
    this.setState({
      visible:true,
      inputType:type,
    })
  }
  //行列设置编辑弹框确定事件
  handleFix=()=>{
      let count=0;
      this.editForm.state.decFormData.map(item => {
        item.validateFieldsAndScroll((errors,value)=>{
          if(errors)count++;
        })
      })
      const {rowList,colList} = this.props.decision
      if(this.state.type){
        //列变量
        if(!colList['dataSource'].length){
          message.error('请添加列变量!')
          return
        }
      }else{
        //行变量
        if(!rowList['dataSource'].length){
          message.error('请添加行变量!')
          return
        }
      }if(!count){
          this.state.type?this.editForm.makeCol():this.editForm.makeRow();
          this.setState({show:false})
      }
  }
  //保存提交事件
  handleSave = ()=>{
    console.log(this.props.decision)
    console.log(this.props.decision.tableList)
    const formData = this.child.getFormValue();
    const {query} = this.props.location;
    const {colList,rowList,tableCol,tableRow,tableList} = this.props.decision;
    let count=0;
    if(!tableRow.length){
      message.error('请添加行变量!')
      return
    }else if(!tableCol.length){
      message.error('请添加列变量!')
      return
    }
    this.state.decFormList.map(item => {
      item.validateFieldsAndScroll((errors,value)=>{
        if(errors)count++;
      })
    })
    if(!count){
      /*this.props.dispatch({
        type: 'decision/savedecInfo',
        payload: {
          ...formData,
          ruleType:'strategy',
          variableInfoList:tableList,
          nodeId:query['id']
        }
      })*/
    }

  }
  //  将每个cell的form保存起来
  handleModify = form => {
    let arr = this.state.decFormList;
    arr.push(form)
    this.setState({
      decFormList: arr
    })
  }
  render() {
    console.log(this.props.decision)
    const { permission } = this.props
    const {colList,rowList,tableCol,tableRow,tableList} = this.props.decision;
    return (
           <PageHeaderWrapper>
             <Card
                bordered={false}
                title={'决策模型'}
             >
               <FilterIpts
                 getSubKey={this.getSubKey}
                 openDialog={this.openDialog}
                 resultVarId={this.state.resultVarId}
                 rowVar={this.state.rowVar}
                 colVar={this.state.colVar}
               />
               <SelectableTable
                 list={this.props.decision}
                 columns={tableCol}
                 setRow={this.setRow}
                 setCol={this.setCol}
                 tableList={tableList}
                 resultVarId={this.state.resultVarId}
                 handleModify={(form)=>this.handleModify(form)}
               />
               <Modal
                 title={this.state.type?'列变量设置':'行变量设置'}
                 visible={this.state.show}
                 onOk={this.handleFix}
                 onCancel={()=>this.setState({show:false})}
                 width={1040}
               >
                 <EditForm
                   type={this.state.type}
                   number={this.state.number}
                   onChange={this.handleChildChange}
                   getSubKey={this.getSubKey}
                   colVar={this.state.colVar}
                   rowVar={this.state.rowVar}
                 />
               </Modal>
               <Modal
                 title={'选择变量'}
                 visible={this.state.visible}
                 onOk={this.handleOk}
                 onCancel={()=>this.setState({visible:false})}
                 width={1040}
               >
                 <AddForm
                   number={this.state.number}
                    getSubKey={this.getSubKey}
                 />
               </Modal>
               <Row type="flex" gutter={24} justify="center" style={{marginTop:20}}>
                 <Col>
                   <Button type="primary" onClick={this.handleSave} loading={this.props.buttonLoading}>保存并提交</Button>
                 </Col>
                 <Col>
                   <Button type="primary">返回</Button>
                 </Col>
               </Row>
             </Card>
          </PageHeaderWrapper>
    )
  }
}
