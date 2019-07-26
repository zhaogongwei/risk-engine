import React, { Component, Fragment } from 'react';
import EditableCell from './EditableCell'
import {
  Row,
  Col,
  Icon,
  Button,
  Form,
  Popconfirm,
  Pagination,
  Table,
  Input
} from 'antd';
import { connect } from 'dva'

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@Form.create()

export default class Editable extends Component {
  constructor(props) {
    super(props);
    this.state={
      selectedRowKeys: [],
      current:1,
      tableList:[],
      pageList:[]
    }
  }
  componentWillReceiveProps(newProps){
    console.log('newProps',newProps)
    this.emptySelect()
    this.setState({
      tableList:newProps.titleList
    })
    this.pagination(10,1,newProps.titleList);

  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
    this.props.saveSelectVar(this.props.index,selectedRowKeys)
  }
  //勾选框置空
  emptySelect=()=>{
    this.setState({
      selectedRowKeys:[]
    })
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    //this.pagination(10,current,this.state.tableList)
  }
  //前端分页
  pagination=(pageSize=10,currentPage=1,array=[])=>{
    console.log(array)
    if(array.length>0){
      //起始位置
      this.setState({
        current:currentPage
      })
      var offset = (currentPage-1)*pageSize
      var list =[]
      array.length>10?list = array.slice(offset,offset+pageSize):list = array
      this.setState({
        pageList:list
      })
    }else{
      this.setState({
        pageList:[]
      })
    }

  }
  componentDidMount(){
    console.log('props',this.props)
    const {dataSource} = this.props
    /*this.setState({
      tableList:dataSource
    })
    this.pagination(10,1,dataSource);*/
    this.props.getSubKey(this,'child')
  }
  render() {
    const { dataSource } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.props.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          isRequired: col.nonRequired,
          pattern:col.pattern,
          max:col.max
        })
      };
    });
    const {selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {loading} = this.props
    console.log(this.state)
    return (
      <div>
        <Row style={{marginBottom:20}} gutter={16} type="flex" align="middle">
          <Col span={2} style={{textAlign:'right'}}>
            输出变量
          </Col>
          <Col> <Button type="primary" onClick={this.props.addVar}>新增</Button></Col>
          <Col><Button type="primary" onClick={this.props.deleteVar}>删除</Button></Col>
          {/*<Col  span={1} push={14} style={{display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
            <Button  onClick={this.props.handleAdd} ><Icon type="plus" theme="outlined" style={{transform: 'translateX(-20%)'}}/></Button>
            {
              this.props.index>0?<Button onClick={this.props.handleDelete}><Icon type="minus" theme="outlined" style={{transform: 'translateX(-20%)'}}/></Button>:''
            }
          </Col>*/}
        </Row>
        <Row>
          <Col span={18} push={2}>
            <Table
              key={this.props.key}
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              pagination={false}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={this.state.pageList}
              loading={loading}
            />
          </Col>
        </Row>
        <Row>
          <Col span={18} push={2}>
            <Pagination
              style={{ marginBottom: "50px" }}
              showQuickJumper
              defaultCurrent={1}
              current={this.state.current}
              total={100}
              onChange={this.onChange}
              showTotal={(total, range) => this.showTotal(total, range)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}


