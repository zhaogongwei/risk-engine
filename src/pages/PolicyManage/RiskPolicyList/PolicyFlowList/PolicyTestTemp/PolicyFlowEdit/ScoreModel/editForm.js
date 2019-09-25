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
import ScoreCard from '@/components/ScoreCard'
import { connect } from 'dva'


@connect(({scoreModel,loading})=>({
  scoreModel,
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
          cols:1,
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
          ]
        },{
          title: '下限值',
          dataIndex: 'lowerValue',
          editable:true,
          cols:2,
          key:'lowerValue',
          type:'input',
          max:10,
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
          type:'input',
          max:10
        },
        {
          title: '评分',
          dataIndex: 'score',
          editable:true,
          cols:5,
          key:'score',
          type:'input',
          max:10,
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
          cols:1,
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
          cols:2,
          key:'highValue',
        },
        {
          title: '评分',
          dataIndex: 'score',
          editable:true,
          cols:3,
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
      scoreFormData:[],//评分卡编辑表单form
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
  //取消事件
  handleCancel =()=>{
    this.setState({visible:false},()=>{
      this.props.onChange(this.state.visible)
    })

  }
  //重置
  componentDidMount () {
    this.props.getSubKey(this,'editForm')
  }
  //弹框表格添加数据
  handleAddRight = () => {
    const {varKey} = this.props;
    const {scoreList} = this.props.scoreModel;
    const {varType,enumList,enumFlag} = scoreList[varKey-1];
    console.log(scoreList)
    console.log(scoreList[varKey-1])
    if(!this.props.varType){
      //变量为字符类型
      const {dataSource} = this.props.scoreModel.strList;
      const newData = {
        highCondition:'',
        highValue:'',
        score:'',
      };
      this.props.dispatch({
        type: 'scoreModel/addStrData',
        payload: {
          dataSource: addListKey([...dataSource, newData]),
        }
      })

    }else{
      //变量为数字类型
      const { dataSource } = this.props.scoreModel.numList;
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
        type: 'scoreModel/addNumData',
        payload: {
          dataSource: addListKey([...dataSource, newData]),
        }
      })
      console.log(this.props)
    }
  }
  //删除弹框表格数据
  handleDeleteRight = (key) => {
    if(!this.props.varType){
      //变量为字符类型
      const {dataSource,count} = this.props.scoreModel.strList
      const newDataSource = dataSource.filter(item => item.key !== key)
      this.props.dispatch({
        type:'scoreModel/delStrData',
        payload:{
          dataSource:addListKey(newDataSource),
        }
      })
    }else{
      //变量为数字类型
      const {dataSource,count} = this.props.scoreModel.numList;
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
  //  将每个cell的form保存起来
  handleModify = form => {
    let arr = this.state.scoreFormData
    arr.push(form)
    this.setState({
      scoreFormData: arr
    })
  }
  render() {
    const {varObjRow} = this.props;
    return (
      <Row>
        <Col>
          <ScoreCard
            list={this.props.varType?this.props.scoreModel.numList:this.props.scoreModel.strList}
            columns={this.props.varType?this.state.columnNum:this.state.columnStr}
            handleAdd={this.handleAddRight}
            varObjRow={varObjRow}
            handleModify={(form)=>this.handleModify(form)}
          />
        </Col>
      </Row>
    )
  }
}
