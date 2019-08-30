import React, { Component } from 'react'
import {
  Radio,
  Modal,
  Row,
  Col,
  Input,
  Form,
  Select,
  Button,
  Divider,
  Checkbox,
  Pagination,
  Popconfirm
} from 'antd';
import SetRowCol from '@/components/SetRowCol'
import { addListKey,deepCopy } from '@/utils/utils'
import { connect } from 'dva'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;


@connect(({decision})=>({
  decision
}))

@Form.create()

export default class EditForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:this.props.showState,
      column:[
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
          cols:1,
          value:[
            {
              name:'>',
              id:'>'
            },
            {
              name:'>=',
              id:'>='
            },
          ]
        },{
          title: '下限值',
          dataIndex: 'lowerValue',
          editable:true,
          cols:2,
          key:'lowerValue',
          type:'input'
        },{
          title: '上限条件',
          dataIndex: 'highCondition',
          editable:true,
          cols:3,
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
          ]
        },{
          title: '上限值',
          dataIndex: 'highValue',
          editable:true,
          cols:4,
          key:'highValue',
          type:'input'
        },
        {
          title: '操作',
          key: 'action',
          render: (record) => {
            return(<Popconfirm title="确定要删除本行吗?" onConfirm={() => this.handleDelete(record.key)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>)
          }
        }
      ],
      tableList:[],
      decFormData:[],//决策模型form数据
    }
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'editForm')
  }
  componentWillReceiveProps(newProps){
    this.setState({
      visible:newProps.showState
    })
  }
  //添加表格数据
  handleAdd = () => {
    //判断是设置行还是设置列
    const { rowList,colList,} = this.props.decision;
    if(this.props.type){
      //列设置
      const {dataSource } = colList;
      //生成id以便后面生成dataIndex
      const lastColVarId = dataSource.length?dataSource[dataSource.length-1]['id']:0
      const newData = {
        lowerCondition:'',
        lowerValue:'',
        highCondition:'',
        highValue:'',
        id:lastColVarId+1,
        variableName:this.props.colVar['colVarValue'],
        variableId:this.props.colVar['colVarId'],
      };
      this.props.dispatch({
        type: 'decision/saveColData',
        payload: {
          dataSource: addListKey([...dataSource, newData]),
        }
      })
    }else{
      const {dataSource } = rowList;
      //生成id以便后面生成dataIndex
      const lastRowVarId = dataSource.length?dataSource[dataSource.length-1]['id']:0
      const newData = {
        lowerCondition:'',
        lowerValue:'',
        highCondition:'',
        highValue:'',
        id:lastRowVarId+1,
        indexKey:lastRowVarId+1,
        variableName:this.props.rowVar['rowVarValue'],
        variableId:this.props.rowVar['rowVarId'],
      };
      this.props.dispatch({
        type: 'decision/saveRowData',
        payload: {
          dataSource: addListKey([...dataSource, newData]),
        }
      })
    }
  }
  //删除表格数据
  handleDelete = (key) => {
    if(this.props.type){
      //删除列
      const {dataSource} = this.props.decision.colList;
      //   调用models的方法去删除dataSource中的数据
      const newDataSource = dataSource.filter(item => item.key !== key)
      this.props.dispatch({
        type: 'decision/saveColData',
        payload: {
          dataSource: addListKey(newDataSource),
        }
      })
    }else{
      const {dataSource} = this.props.decision.rowList;
      //   调用models的方法去删除dataSource中的数据
      const newDataSource = dataSource.filter(item => item.key !== key)
      this.props.dispatch({
        type: 'decision/saveRowData',
        payload: {
          dataSource: addListKey(newDataSource),
        }
      })
    }

  }
  //生成行
  makeRow=()=>{
    const { rowList,colList,tableCol,tableRow} = this.props.decision;
    console.log('tableCol',tableCol)
    //循环生成行数据
    const newRow = rowList.dataSource.map((item,index)=>{
      //从tableRow 里通过id找到对应的值，把值赋给新创的变量
      let selectObj = tableRow.find((value,index)=>item['id']===value['rowVarInfo']['id']);
      let rowObj = selectObj?selectObj:{resultVarMap:{}}
      console.log('keys',selectObj)
      return {
        key:index+1,
        row:index+1,
        editable:true,
        resultVarMap:rowObj['resultVarMap'],
        ...rowObj['resultVarMap'],
        index_0:this.createRowColTitle(item),
        rowVarInfo:item,
      }
    })
    this.props.dispatch({
      type: 'decision/makeTableRow',
      payload: {
        tableRow: newRow,
      }
    })

  }
  //生成列
  makeCol=()=>{
    const { rowList,colList,tableCol,tableRow} = this.props.decision;
    //循环生成columns 以id生成对应的dataIndex（id没有的话，就以key值生成相应的dataIndex）
    const newCol= colList.dataSource.map((item,index)=>{
      return {
        title:this.createRowColTitle(item),
        key:index+1,
        col:index+1,
        id:item['id']?item['id']:null,
        dataIndex:item['id']?`index_${item['id']}`:`index_${index+1}`,
        editable:true,
        colVarInfo:{...item,indexKey:item['id']?`index_${item['id']}`:`index_${index+1}`},
      }
    })
    //   要添加表格的对象
    const res = this.props.dispatch({
      type: 'decision/makeTableCol',
      payload: {
        tableCol: [
          {
            key:0,
            col:0,
            title:'',
            dataIndex:'index_0'
          }, ...newCol],
      },
    })
    //columns变化后 tableRow中的resultVarMap也需要变化(resultVarMap是存储对应dataIndex的值)
    //重新生成tableRow中的 resultVarMap
    console.log('res',colList)
    //根据新的rowlist生成tableRow中新的resultMap 和对应dataIndex的值
    let varValue={}
    const newRow = rowList.dataSource.map((item,num)=>{
      //重新生成tableRow中的 resultVarMap
      newCol.length&&newCol.map((item,index)=>{
        console.log(index)
        //对应列(dataIndex)的值
        let currentDataIndex = tableRow[num]?tableRow[num]['resultVarMap'][`${item['dataIndex']}`]:'';
        varValue = {...varValue,...{[`${item['dataIndex']}`]:currentDataIndex}};
        varValue['resultVarMap']=Object.assign({...varValue['resultVarMap']},{[`${item['dataIndex']}`]:currentDataIndex})
      })
      return {
        index_0:this.createRowColTitle(item),
        key:num+1,
        row:num+1,
        editable:true,
        rowVarInfo:item,
        ...varValue,
      }
    })
    this.props.dispatch({
      type: 'decision/makeTableRow',
      payload: {
        tableRow: newRow,
      }
    })
  }
  //行列title生成函数
  //根据上下限条件和上下限值生成相应的title对象
  createRowColTitle=(item)=>{
    let title;
    const {variableName,lowerCondition,lowerValue,highCondition,highValue} = item;
    let newlowerCondition = `${lowerCondition==='>'?'<':'<='}`;
    title=`${lowerValue}${newlowerCondition}${variableName}${highCondition}${highValue}`;
    return title;

  }
  //  将每个cell的form保存起来
  handleModify = form => {
    let arr = this.state.decFormData;
    arr.push(form)
    this.setState({
      decFormData: arr
    })
  }
  render() {
    const {visible,column} = this.state;
    const {type,decision,rowVar,colVar} = this.props
    return (
      <SetRowCol
        title={type?colVar['colVarValue']:rowVar['rowVarValue']}
        list={type?decision.colList:decision.rowList}
        columns={column}
        handleAdd={this.handleAdd}
        handleDelete={this.handleDelete}
        handleModify={(form)=>this.handleModify(form)}
      />
    )
  }
}
