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
import router from 'umi/router';
import { findInArr,exportJudgment } from '@/utils/utils'
import SelectTable from '@/components/SelectTable'
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
      resultQueryData:{},//输出结果查询参数
    };
  }
  async componentDidMount() {
    const {query} = this.props.location;
    //查询节点信息
    const res = await this.props.dispatch({
      type: 'decision/querydecInfo',
      payload: {
        nodeId:query['id']
      }
    })
    if(res&&res.status===1){
      this.restoreColList(res.data.colVarList);
      this.restoreTableCol(res.data.colVarList);
      this.restoreRowList(res.data.rowVarList);
      this.restoreTableRow(res.data.rowVarList);
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
  componentWillUnmount(){
    //离开页面时销毁数据
    this.props.dispatch({
      type: 'decision/makeTableCol',
      payload: {
        tableCol:[]
      }
    })
    this.props.dispatch({
      type: 'decision/makeTableRow',
      payload: {
        tableRow:[]
      }
    })
    this.props.dispatch({
      type: 'decision/saveColData',
      payload: {
        dataSource:[]
      }
    })
    this.props.dispatch({
      type: 'decision/saveRowData',
      payload: {
        dataSource:[]
      }
    })

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
        indexKey:item['rowVarInfo']['id'],
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
    //先设置列变量，再设置行变量，不然table无法显示
    //先判断有没有设置行变量
    //必须设置输出变量不然table中的下拉框无法显示值
    const {rowVar,colVar,resultVarId} = this.state;
    const {rowList,colList} = this.props.decision;
    if(!colList.dataSource.length){
      message.error('请设置列变量!');
      return;
    }
    if(!Object.keys(rowVar).length){
      message.error('请选择行变量!');
      return;
    }
    if(!Object.keys(resultVarId).length){
      message.error('请选择输出变量!');
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
    const {rowVar,colVar,resultVarId} = this.state;
    if(!Object.keys(colVar).length){
      message.error('请选择列变量!');
      return;
    }
    if(!Object.keys(resultVarId).length){
      message.error('请选择输出变量!');
      return;
    }
    this.setState({
      show:true,
      type:1
    })
  }
  //弹框确定事件
  handleOk=()=>{
    const {colList,rowList,tableCol,tableRow,tableList} = this.props.decision;
    this.setState({visible:false},()=>{
      const records = this.addForm.submitHandler();
      //设置行
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
        },()=>{
          //重新选择行列变量时，只替换变量，上下限条件不变
          if(rowList.dataSource.length){
            rowList.dataSource.forEach((item,index)=>{
              item['variableName']=records['varName']
              item['variableId']=records['varId']
            })
            this.props.dispatch({
              type: 'decision/makeTableRow',
              payload: {
                tableRow: [],
              }
            })
          }
        })
      }else if(this.state.inputType === 1){
        //设置列
        if(records['varType']!=='num'){
          message.error('此处选择弹框中只展示数字类型变量!')
          return
        }
        this.setState({
          colVar:{
            colVarId:records['varId'],
            colVarValue:records['varName']
          }
        },()=>{
          //重新选择行列变量时，只替换变量，上下限条件不变
          if(colList.dataSource.length){
            //改造colList
            colList.dataSource.forEach((item,index)=>{
              item['variableName']=records['varName']
              item['variableId']=records['varId']
            })
            this.props.dispatch({
              type: 'decision/makeTableCol',
              payload: {
                tableCol: [],
              }
            })
          }
        })
      }else if(this.state.inputType === 2){
        //设置输出结果
        if(records['varType']!=='char'){
          message.error('此处选择弹框中只展示字符类型变量!')
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
    const {rowVar, colVar} = this.state;
    if(type===1){
      //列变量
      if(Object.keys(colVar).length){
        message.warning('重新选择列变量后，请重新设置列!')
          .then(()=>{
            this.setState({
              visible:true,
              inputType:type,
              resultQueryData:{
                types:['num']
              },//输出结果查询参数
            })
          })
      }else{
        this.setState({
          visible:true,
          inputType:type,
          resultQueryData:{
            types:['num']
          },//输出结果查询参数
        })
      }
    }else if(type ===0){
      if(Object.keys(rowVar).length){
        message.warning('重新选择行变量后，请重新设置行!')
          .then(()=>{
            this.setState({
              visible:true,
              inputType:type,
              resultQueryData:{
                types:['num']
              },//输出结果查询参数
            })
          })
      }else{
        this.setState({
          visible:true,
          inputType:type,
          resultQueryData:{
            types:['num']
          },//输出结果查询参数
        })
      }
    }else if(type==2){
      //输出结果
      this.setState({
        visible:true,
        inputType:type,
        resultQueryData:{
          types:['char']
        },//输出结果查询参数
      })
    }
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
  handleSave = async()=>{
    console.log(this.props.decision)
    console.log(this.props.decision.tableList)
    const formData = this.child.getFormValue();
    const {query} = this.props.location;
    const {colList,rowList,tableCol,tableRow,tableList} = this.props.decision;
    let count=0;
    if(!tableRow.length || !tableCol.length){
      message.error('请添加数据!')
      return
    }
    this.state.decFormList.map(item => {
      item.validateFieldsAndScroll((errors,value)=>{
        if(errors)count++;
      })
    })
    let tableColNew = deepCopy(tableCol);
    tableColNew.shift()
    let tableColList=[]
    tableColNew.map((item,index)=>{
      tableColList.push(item.colVarInfo)
    })
    if(!count){
     const response =  await this.props.dispatch({
        type: 'decision/savedecInfo',
        payload: {
          ...formData,
          ruleType:'decision',
          colVarInfoList:tableColList,
          rowVarInfoList:tableRow,
          nodeId:query['id']
        }
      })
      if(response && response.status === 1){
        message.success(response.statusDesc)
          .then(()=>{
            router.goBack()
          })
      }else{
        message.error(response.statusDesc)
      }
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
    const { query } = this.props.location
    const { resultQueryData } = this.state
    const { title } = query
    const queryData = {
      ...resultQueryData,
      strategyId:query['strategyId']
    }
    const {colList,rowList,tableCol,tableRow,tableList} = this.props.decision;
    return (
           <PageHeaderWrapper>
             <Card
                bordered={false}
                title={title}
             >
               <FilterIpts
                 getSubKey={this.getSubKey}
                 openDialog={this.openDialog}
                 resultVarId={this.state.resultVarId}
                 rowVar={this.state.rowVar}
                 colVar={this.state.colVar}
               />
               <SelectTable
                 list={this.props.decision}
                 columns={tableCol}
                 setRow={this.setRow}
                 setCol={this.setCol}
                 tableList={tableList}
                 resultVarId={this.state.resultVarId}
                 handleModify={(form)=>this.handleModify(form)}
                 loading={this.props.loading}
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
                 destroyOnClose={true}
                 maskClosable={false}
                 visible={this.state.visible}
                 onOk={this.handleOk}
                 onCancel={()=>this.setState({visible:false})}
                 width={1040}
               >
                 <AddForm
                   number={this.state.number}
                   getSubKey={this.getSubKey}
                   queryData={queryData}
                 />
               </Modal>
               <Row type="flex" gutter={24} justify="center" style={{marginTop:20}}>
                 <Col>
                   <Button type="primary" onClick={this.handleSave} loading={this.props.buttonLoading}>保存并提交</Button>
                 </Col>
                 <Col>
                   <Button type="primary" onClick={()=>router.goBack()}>返回</Button>
                 </Col>
               </Row>
             </Card>
          </PageHeaderWrapper>
    )
  }
}
