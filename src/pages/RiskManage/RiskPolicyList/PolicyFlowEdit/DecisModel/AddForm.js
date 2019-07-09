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

export default class AddForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:false,
      column:[
        {
          title: '序号',
          dataIndex: 'key',
          key:'key'
        },
        {
          title: '下限条件',
          dataIndex: 'lowCon',
          editable:true,
          key:'lowCon',
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
          dataIndex: 'lowVal',
          editable:true,
          key:'lowVal',
          type:'input'
        },{
          title: '上限条件',
          dataIndex: 'topCon',
          editable:true,
          key:'topCon',
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
          dataIndex: 'topVal',
          editable:true,
          key:'topVal',
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
      tableList:[]
    }
  }

  //点击确定
  handleOk = ()=>{
    this.setState({visible:false},()=>{
      this.props.type?this.makeCol():this.makeRow()
      const row = this.props.decision.tableRow;
      const col = this.props.decision.tableCol;
      for(var i=1;i<=row.length;i++){
        for(var j=1;j<=col.length;j++){
          console.log(i,j)
        }
      }
      console.log(this.props.decision)
      this.props.onChange(this.state.visible)
    })
  }
  deepCopy =(obj)=> {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是一个对象
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj;
  }
  handleCancel =()=>{
    this.setState({visible:false},()=>{
      this.props.onChange(this.state.visible)
    })

  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    formQueryData.assetsTypeName=formQueryData.assetsTypeName.trim()
    formQueryData.assetsTypeCode=formQueryData.assetsTypeCode.trim()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'addForm')
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
      const { count, dataSource } = this.props.decision.colList;
      const newData = {
        lowCon:'',
        lowVal:'',
        topCon:'',
        topVal:'',
        name:this.props.colVar
      };
      this.props.dispatch({
        type: 'decision/saveColData',
        payload: {
          dataSource: addListKey(deepCopy([...dataSource, newData])),
          count: count + 1,
        }
      })
    }else{
      const { count, dataSource } = this.props.decision.rowList;
      const newData = {
        lowCon:'',
        lowVal:'',
        topCon:'',
        topVal:'',
        name:this.props.rowVar
      };
      this.props.dispatch({
        type: 'decision/saveRowData',
        payload: {
          dataSource: addListKey(deepCopy([...dataSource, newData])),
          count: count + 1,
        }
      })
    }
  }
  //删除表格数据
  handleDelete = (key) => {
    if(this.props.type){
      //删除列
      const {dataSource,count} = this.props.decision.colList;
      //   调用models的方法去删除dataSource中的数据
      const newDataSource = dataSource.filter(item => item.key !== key)
      this.props.dispatch({
        type: 'decision/saveColData',
        payload: {
          dataSource: addListKey(deepCopy(newDataSource)),
          count:newDataSource.length === 0?1:newDataSource[newDataSource.length-1].key+1,
        }
      })
    }else{
      const {dataSource,count} = this.props.decision.rowList;
      //   调用models的方法去删除dataSource中的数据
      const newDataSource = dataSource.filter(item => item.key !== key)
      this.props.dispatch({
        type: 'decision/saveRowData',
        payload: {
          dataSource: addListKey(deepCopy(newDataSource)),
          count:newDataSource.length === 0?1:newDataSource[newDataSource.length-1].key+1,
        }
      })
    }

  }
  //生成行
  makeRow=()=>{
    const { count, rowList,tableRow } = this.props.decision;
    const newRow = rowList.dataSource.map((item,index)=>{
      return {
        tableValue0:item.lowVal+item.lowCon+item.name+item.topCon+item.topVal,
        key:index+1,
        row:index+1,
        editable:true
      }
    })
    this.props.dispatch({
      type: 'decision/makeTableRow',
      payload: {
        tableRow: newRow,
        count: count + 1,
      }
    })
  }
  //生成列
  makeCol=()=>{
    const { count, colList,tableCol } = this.props.decision;
    const newCol= colList.dataSource.map((item,index)=>{
      return {
        title:item.lowVal+item.lowCon+item.name+item.topCon+item.topVal,
        key:index+1,
        col:index+1,
        dataIndex:'tableValue'+(index+1),
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
        count: count + 1,
      }
    })
  }
  render() {
    const {visible,column} = this.state;
    const {type,decision} = this.props
    return (
      <Modal
        title={type?'列变量设置':'行变量设置'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={1040}
      >
      <SetRowCol
        list={type?decision.colList:decision.rowList}
        columns={column}
        handleAdd={this.handleAdd}
        handleDelete={this.handleDelete}
      />
      </Modal>
    )
  }
}
