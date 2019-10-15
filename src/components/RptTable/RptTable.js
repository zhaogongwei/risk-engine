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
  Input,
  message,
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
      selectKey:0,//当前选中标题
    }
  }
  changeHandler=(value, record, type) =>{
    if(this.checkTitle(value)){
      record[type]?record[type]['title']=value:''
    }else{
      setTimeout(()=>{
        record[type]?record[type]['title']='':''
        this.props.form.setFields({
          [`table-title-${type}`]:{
            value: '',
            errors: [new Error('标题已存在!')],
          }
        })
      },0)
    }

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
  addFormSubmit=()=>{
    const title = this.child.submitHandler();
    const {titleList} = this.props;
    console.log(titleList)
    if(title && Object.keys(title).length){
      if(titleList.length>=10){
        message.error('最多只能添加10个子标题!')
        return
      }
      titleList.push({...title,variable:[]})
      this.setState({
        visible:false
      })
    }
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
      //最后一个标题不能删除
      if(titleList.length===1){
        message.error('最后一个标题不能删除!')
        return;
      }
      titleList.splice(this.state.selectKey,1);
      this.props.setNumber(0)
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
    this.props.getSubKey(this,'rptable')
  }
  componentDidUpdate(){}
  //tab切换
  handleTab=(index)=>{
      this.setState({
        selectKey:index
      })
    this.props.setNumber(index)
    console.log(index)
  }
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //标题名称校验(在同一个报告中，标题唯一)
  checkTitle=(title)=>{
    const {titleList} = this.props.tempEdit;
    let status = true;
    for(let item of titleList){
      if(item['title'].trim()===title.trim()){
        status = false;
        break;
      }
    }
    return status
  }
  render() {
    const {columns,dataSource,loading} = this.props;
    const {titleList} = this.props.tempEdit;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const formItem = titleList&&titleList.map((item,index)=>
      (
        <div style={{marginBottom:20,paddingTop:20,paddingBottom:20,border:'1px solid #E4E4E4'}}
             key={index}
             className={`${this.state.selectKey!=index?"tableActive":null}`}
        >
          <Row style={{marginBottom:20}}  gutter={24} type="flex" align="top" justify="space-between">
            <Col xxl={6} md={12}>
              <FormItem label="标题" {...formItemConfig} >
                {getFieldDecorator(`table-title-${index}`,{
                  initialValue:item.title?item.title:'',
                  rules:[
                    {
                      required:true,
                      validator:async (rule,val,cb)=>{
                        if(!val&&val!==0){
                          cb('请输入内容!');
                          return;
                        }
                        if(val.length>8){
                          cb('最多输入8位!')
                          return;
                        }
                      }
                    }
                  ],
                })(
                  <Input placeholder="请输入标题名称!" maxLength={9} onChange={(e) => this.changeHandler(e.target.value, titleList, index)} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Editable
              key={index}
              columns={columns}
              dataSource={item['variable']}
              loading={loading}
              index={index}
              handleDelete={()=>this.props.handleDelete(index)}
              handleAdd={()=>this.props.handleAdd(index)}
              addVar={()=>this.props.addVar(index,this.child.emptySelect)}
              deleteVar={()=>this.props.deleteVar(index,this.child.state.selectedRowKeys,this.child.emptySelect)}
              getSubKey={this.getSubKey}
              handleModify={(form)=>this.props.handleModify(form)}
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
                {getFieldDecorator('name',{
                  initialValue:this.props.presentationName,
                  rules:[
                    {
                      required:true,
                      validator:async(rule, val, cb)=>{
                        if(!val&&val!==0){
                          cb('报告模板名称内容不能为空!')
                          return
                        }
                        if(val.length>15){
                          cb('报告模板名称长度最多15位!')
                          return
                        }
                      }
                    }
                    ]
                  })(
                    <Input placeholder="请输入报告模板名称!" maxLength={16}/>
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
          width={500}
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


