import React, { Component, Fragment } from 'react';
import Editable from './Editable'
import AddForm from './AddForm'
import TitleButton from './TitleButton'
import {
  Icon,
  Row,
  Col,
  Button,
  Modal,
  Pagination,
  Form,
  Popconfirm,
  Table,
  Input
} from 'antd';
import  './index.less'
import { connect } from 'dva'
import Swal from 'sweetalert2';

const FormItem = Form.Item;

@connect(({ tempEdit, loading }) => ({
  tempEdit,
}))

@Form.create()

export default class RptTable extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible:false,
      selectKey:0,
    }
  }
  changeHandler(value, record, type) {
    console.log(value,record,type)
    record[type]?record[type]['title']=value:''
  }
  //输入框值校验
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  reloadTit = (title,index)=>{
    this.props.form.setFieldsValue({
      title:''
    });
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //添加子标题
  addFormSubmit=async ()=>{
    const title = await this.child.submitHandler();
    const {titleList} = this.props;
    titleList.push({...title,tableList:[]})
    this.setState({
      visible:false
    })
  }
  //删除子标题
  delTitle = async (index) => {
    const confirmVal = await Swal.fire({
      text: '确定要执行该操作吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){
      const {titleList} = this.props;
      titleList.splice(this.state.selectKey,1);
      this.props.dispatch({
        type: 'tempEdit/titleListHandle',
        payload: {
          titleList:titleList
        }
      })
      this.setState({
        selectKey:0
      })
    }
  }
  componentDidMount(){
  }
  //tab切换
  handleTab=(index)=>{
      this.setState({
        selectKey:index
      })
    console.log(index)
  }
  render() {
    const {columns,dataSource,loading} = this.props;
    const {titleList} = this.props.tempEdit;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const formItem = titleList.map((item,index)=>
      (
        <div style={{marginBottom:20,paddingTop:20,paddingBottom:20,border:'1px solid #E4E4E4'}}
             key={index}
             className={`${this.state.selectKey!=index?"tableActive":null}`}
        >
          <Row style={{marginBottom:20}}  gutter={24} type="flex" align="top" justify="space-between">
            <Col xxl={6} md={12}>
              <FormItem label="标题" {...formItemConfig} >
                {getFieldDecorator(`names${Math.random()}`,{
                  initialValue:item.title,
                  rules:[
                    {min:3,message:'最少输入3位!'},
                    {max:20,message:'最多输入20位!'}
                  ],
                  validator:(rule,val,cb)=>{
                    if(!val){
                      cb('请输入内容!');
                      return;
                    }
                  }
                })(
                  <Input placeholder="passenger name" onChange={(e) => this.changeHandler(e.target.value, titleList, index)} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Editable
              key={index}
              columns={columns}
              dataSource={item['tableList']}
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
              <FormItem label="报告模板名称" {...formItemConfig} labelAlign="left">
                {getFieldDecorator('assetsTypeName',{
                  initialValue:'',
                  rules:[{required:true}]
                  })(
                    <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginBottom:20}}  gutter={24} type="flex" align="middle">
            <Col>
              <Button onClick={()=>this.setState({visible:true})}>新增子标题</Button>
            </Col>
            <Col>
              <Button type="danger" onClick={this.delTitle}>删除子标题</Button>
            </Col>
          </Row>
          <Row type="flex" align="middle" gutter={24} style={{marginBottom:20}}>
            {
              titleList.map((item,index)=>{
                return (
                  <Col key={index}>
                    <TitleButton
                      title={item['title']}
                      key={index}
                      num={index}
                      selectKey={this.state.selectKey}
                      handleTab={()=>this.handleTab(index)}
                    />
                  </Col>
                )
              })
            }
          </Row>
          {formItem}
        </Form>
        <Modal
          className={'ant-modal-sm'}
          title={'新增标题'}
          width={400}
          visible={this.state.visible}
          onOk={this.addFormSubmit}
          destroyOnClose={true}
          onCancel={() => this.setState({ visible: false })}
        >
          <AddForm
            number={this.state.number}
            getSubKey={this.getSubKey}
          />
        </Modal>
      </div>
    );
  }
}


