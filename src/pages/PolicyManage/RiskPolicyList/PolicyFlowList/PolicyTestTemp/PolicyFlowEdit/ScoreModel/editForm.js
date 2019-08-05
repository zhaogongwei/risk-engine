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
  message,
  Popconfirm,
} from 'antd';
import { addListKey,deepCopy } from '@/utils/utils'
import SetRowCol from '@/components/SetRowCol'
import { connect } from 'dva'


@connect(({scoreModel})=>({
  scoreModel
}))

@Form.create()

export default class EditForm extends Component {
  constructor(props){
    super(props)
    this.state = {
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
      varType:0,//变量类型 0：字符 1:数字
      varKey:0,//变量key值
    }
  }
  //点击确定
  submitHandler = ()=>{
    return this.state;
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
  //重置
  componentDidMount () {
    this.props.getSubKey(this,'editForm')
  }
  //右侧表格添加数据
  handleAddRight = () => {
    if(!this.props.varType){
      //变量为字符类型
      const {option,kind,isenum} = this.props.scoreModel.scoreList[this.props.varKey-1]
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
    if(!this.props.varType){
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
  //右侧表格数据保存(必须点击保存否则数据不予保存)
  handleSave = ()=>{
    const {scoreList,one,two} = this.props.scoreModel
    const {varKey} = this.props
    //右侧保存按钮点击时，把表格数据和左侧对应的变量合在一起；
    //变量为数字类型
    if(this.props.varType){
      Object.assign(scoreList[varKey-1],{variableInfoList:one.dataSource})
    }else{
      //变量为字符类型
      Object.assign(scoreList[varKey-1],{variableInfoList:two.dataSource})
    }
    message.success('保存成功')
    console.log(this.props.scoreModel)
  }
  render() {
    return (
      <Row>
        <Col>
          <SetRowCol
            list={this.props.varType?this.props.scoreModel.one:this.props.scoreModel.two}
            columns={this.props.varType?this.state.columnNum:this.state.columnStr}
            handleAdd={this.handleAddRight}
          />
        </Col>
      </Row>
    )
  }
}
