import React, { PureComponent, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Popconfirm,
  Button,
  Table,
  Pagination,
  Icon
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import FilterIpts from './FilterIpts';
import AddForm from './AddForm';
import { findInArr,exportJudgment } from '@/utils/utils'
import SelectableTable from '@/components/SelectTable'

@connect(
  ({ decision}) => ({decision})
)




export default class BorrowerList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columnsOne:[
        {
          title: '序号',
          dataIndex: 'key',
          editable:true,
          key:'key',
        },{
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
      checkedData: [],
      currentPage:1,
      current:'',
      dataSet:[],
      dataList:[],
      type:0,//0:设置行变量  1：设置列变量
      tableList:[
      ]
    };
  }
  componentDidMount() {
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //   页面右上角按钮
  renderTitleBtn = () => {
    return (
      <Fragment>
        {findInArr(this.props.permission, 'EXPORT')&&<Button loading={this.props.exportLoading} onClick={this.exporExcel}><Icon type="export" />导出列表</Button>}
      </Fragment>
    )
  }
  formSubmit = ()=>{
    this.props.dispatch({
      type: 'decision/litiCaseSubmit',
      data: {
        assetsCode:this.props.code,
        litigationList:this.props.decision.dataSource
      },
    })
    ;
    const NewData = this.props.decision.one.dataSource.map((item,index)=>{
      return {
        title:item.lowVal+item.lowCon+'高风险触发规则'+item.topCon+item.topVal,
        key:index+1,
        dataIndex:'tableValue'+index,
        editable:true
      }
    })
    this.setState({
      dataSet:NewData
    })
    const { count, dataSet } = this.props.decision;
    //   要添加表格的对象
    this.props.dispatch({
      type: 'decision/addDataSet',
      payload: {
        dataSet: [...dataSet, ...NewData],
        count: count + 1,
      }
    })

    console.log('NewData',NewData)
    console.log(this.props.decision.dataSet)
  }
  formSubmitRow=()=>{
    console.log(this.props.decision.two)
    const { count, dataList } = this.props.decision;
    const NewDatas = this.props.decision.two.dataSource.map((item,index)=>{
      return {
        title:item.lowVal+item.lowCon+'评分卡评分'+item.topCon+item.topVal,
        key:index,
        editable:true
      }
    })
    this.setState({
      dataList:NewDatas
    })
    this.props.dispatch({
      type: 'decision/addDataList',
      payload: {
        dataList: [...dataList, ...NewDatas],
        count: count + 1,
      }
    })
    console.log(this.state.dataList)
    console.log(this.props.decision.dataList)
  }
  formSubmitTable=()=>{
    console.log(this.props.decision)
    console.log(this.state.tableList)
  }
  //   添加表格
  handleAdd = () => {
    const { count, dataSource } = this.props.decision.one;
    //   要添加表格的对象
    const newData = {
      key: count,
      lowCon:'',
      lowVal:'',
      topCon:'',
      topVal:'',
    };
    //   调用models中的方法改变dataSource渲染页面
    this.props.dispatch({
      type: 'decision/addDataSource',
      payload: {
        dataSource: [...dataSource, newData],
        count: count + 1,
      }
    })
    console.log(this.props)
  }
  //   获取子组件数据的方法
  getSubKey = (ref,key) => {
    this[key]=ref;
  }
  //监听子组件数据变化
  handleChildChange = (newState)=>{
    this.setState({
      modalStatus:newState
    })
  }
  //设置行
  setRow=()=>{
    this.setState({
      modalStatus:true,
      type:0
    })
  }
  //设置列
  setCol=()=>{
    this.setState({
      modalStatus:true,
      type:1
    })
  }
  render() {
    const { permission } = this.props
    const newData = [{
      key:'',
      userName:'',
      assetsAbbr:'',
      trueName:'',
      mobile:'',
    }];
    return (
           <PageTableTitle title={'决策模型'} renderBtn={this.renderTitleBtn}>
             <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
             {/*<p>列设置:</p>
             <SetRowCol
               list={this.props.decision.one}
               columns={this.state.columnsOne}
               handleAdd={this.handleAdd}
               handleDelete={this.handleDelete}
             />
             <Button type="primary" onClick={this.formSubmit}>保存列</Button>
             <p>行设置：</p>
             <SetRowCol
               list={this.props.decision.two}
               columns={this.state.columnsTwo}
               handleAdd={this.handleAddTwo}
               handleDelete={this.handleDeleteRow}
             />
             <Button type="primary" onClick={this.formSubmitRow}>保存行</Button>*/}
             <SelectableTable
               list={this.props.decision}
               columns={this.props.decision.tableCol}
               setRow={this.setRow}
               setCol={this.setCol}
               tableList={this.state.tableList}
             />
             <AddForm
               showState={this.state.modalStatus}
               type={this.state.type}
               number={this.state.number}
               onChange={this.handleChildChange}
               getSubKey={this.getSubKey}
               colVar="高风险规则触发数"
               rowVar="评分卡得分"
             />
             <Button type="primary" onClick={this.formSubmitTable}>保存表格</Button>
          </PageTableTitle>
    )
  }
}