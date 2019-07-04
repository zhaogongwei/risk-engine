import React, { Component, Fragment } from 'react';
import Editable from './Editable'
import {
  Icon,
  Row,
  Col,
  Button,
  Pagination,
  Form,
  Popconfirm,
  Table,
  Input
} from 'antd';
import { connect } from 'dva'

const FormItem = Form.Item;



@Form.create()

export default class RptTable extends Component {
  constructor(props) {
    super(props);
    this.state={
    }
  }
  changeHandler(value, record, type) {
    console.log(value,record,type)
    record[type]?record[type]['title']=value:''
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  reloadTit = (title,index)=>{
    this.props.form.setFieldsValue({
      title:''
    });
  }
  componentDidMount(){
  }
  render() {
    const {columns,dataSource,loading,} = this.props;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    debugger
    console.log(this.child)
    const formItem = dataSource.map((item,index)=>
      (
        <div style={{marginBottom:20,paddingTop:20,paddingBottom:20,border:'1px solid #E4E4E4'}} key={index}>
          <Row style={{marginBottom:20}}  gutter={24} type="flex" align="top" justify="space-between">
            <Col xxl={6} md={12}>
              <FormItem label="标题" {...formItemConfig}>
                {getFieldDecorator(`names${Math.random()}`,{
                  initialValue:item.title,
                  rules:[]
                })(
                  <Input placeholder="passenger name" onChange={(e) => this.changeHandler(e.target.value, dataSource, index)} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Editable
              key={index}
              columns={columns}
              dataSource={item['checkList']}
              loading={loading}
              index={index}
              handleDelete={()=>this.props.handleDelete(index)}
              handleAdd={()=>this.props.handleAdd(index)}
              addVar={()=>this.props.addVar(index,this.child.emptySelect)}
              deleteVar={()=>this.props.deleteVar(index,this.child.state.selectedRowKeys,this.child.emptySelect)}
              getSubKey={this.getSubKey}
              saveSelectVar={this.props.saveSelectVar}
            />
          </Row>
        </div>
      )
    )
    return (
      <div>
        <Form className="ant-advanced-search-form">
          <Row style={{marginBottom:20}}  gutter={24} type="flex" align="middle">
            <Col xxl={6} md={12}>
              <FormItem label="报告模板名称" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:'',
                  rules:[{required:true}]
                  })(
                    <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          {formItem}
        </Form>
      </div>
    );
  }
}


