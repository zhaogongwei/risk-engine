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
    if(this.props.type){
      //列设置
      const {dataSource } = this.props.decision.colList;
      const newData = {
        lowerCondition:'',
        lowerValue:'',
        highCondition:'',
        highValue:'',
        name:this.props.colVar['colVarValue'],
        variableId:this.props.colVar['colVarId'],
      };
      this.props.dispatch({
        type: 'decision/saveColData',
        payload: {
          dataSource: addListKey(deepCopy([...dataSource, newData])),
        }
      })
    }else{
      const {dataSource } = this.props.decision.rowList;
      const newData = {
        lowerCondition:'',
        lowerValue:'',
        highCondition:'',
        highValue:'',
        name:this.props.rowVar['rowVarValue'],
        variableId:this.props.rowVar['rowVarId'],
      };
      this.props.dispatch({
        type: 'decision/saveRowData',
        payload: {
          dataSource: addListKey(deepCopy([...dataSource, newData])),
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
          dataSource: addListKey(deepCopy(newDataSource)),
        }
      })
    }else{
      const {dataSource} = this.props.decision.rowList;
      //   调用models的方法去删除dataSource中的数据
      const newDataSource = dataSource.filter(item => item.key !== key)
      this.props.dispatch({
        type: 'decision/saveRowData',
        payload: {
          dataSource: addListKey(deepCopy(newDataSource)),
        }
      })
    }

  }
  //生成行
  makeRow=()=>{
    const { rowList} = this.props.decision;
    const newRow = rowList.dataSource.map((item,index)=>{
      return {
        tableValue0:this.createRowColTitle(item),
        key:index+1,
        row:index+1,
        editable:true
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
    const { colList,} = this.props.decision;
    const newCol= colList.dataSource.map((item,index)=>{
      return {
        title:this.createRowColTitle(item),
        key:index+1,
        col:index+1,
        dataIndex:`tableValue${index+1}`,
        editable:true
      }
    })
    //   要添加表格的对象
    this.props.dispatch({
      type: 'decision/makeTableCol',
      payload: {


        tableCol: [
          {
            key:0,
            col:0,
            title:'',
            dataIndex:'tableValue0'
          }, ...newCol],
      }
    })
  }
  //行列title生成函数
  //根据上下限条件和上下限值生成相应的title对象
  createRowColTitle=(item)=>{
    let title;
    const {name,lowerCondition,lowerValue,highCondition,highValue} = item;
    let newlowerCondition = `${lowerCondition==='>'?'<':'<='}`;
    title=`${lowerValue}${newlowerCondition}${name}${highCondition}${highValue}`;
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
    const {type,decision} = this.props
    return (
      <SetRowCol
        list={type?decision.colList:decision.rowList}
        columns={column}
        handleAdd={this.handleAdd}
        handleDelete={this.handleDelete}
        handleModify={(form)=>this.handleModify(form)}
      />
    )
  }
}
