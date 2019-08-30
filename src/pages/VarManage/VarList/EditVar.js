import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Row,
  Col,
  Button,
  Input,
  Select,
  Radio,
  Form,
  Popconfirm,
  message,
  Card
} from 'antd';
import router from 'umi/router';
import styles from '../FilterIpts.less'
import EditableTable from '@/components/EditableTable'
import { addListKey,deepCopy } from '@/utils/utils'
import { connect } from 'dva'
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item
const { TextArea } = Input;
@connect(
  ({varlist}) => ({varlist})
)
@Form.create()
export default class EditVar extends PureComponent {
  constructor(props) {
    super(props);
    this.columns=[
      {
        title: '序号',
        dataIndex: 'key',
        key:'key',
        editable: false,
      },
      {
        title: '枚举值',
        dataIndex: 'enumValue',
        editable: true,
        max:20,
        nonRequired: true,
        key:'enumValue'
      },
      {
        title: '枚举值展示',
        dataIndex: 'enumShow',
        key:'enumShow',
        max:200,
        nonRequired: true,
        editable: true,
      },
      {
        title: '操作',
        editable: false,
        render: (record) => (
          <Popconfirm title="确定要删除本行吗?" onConfirm={() => this.handleDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        )
      }
    ]
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '资产类型名称',
        dataIndex: 'assetsTypeName',
        key:'assetsTypeName'
      },{
        title: '资产类型编号',
        dataIndex: 'assetsTypeCode',
        key:'assetsTypeCode'
      },{
        title: '状态',
        key:'status',
        render:(record)=>{
          if(record.status === 1){
            return <span>启用</span>
          }
          if(record.status === 2){
            return <span>禁用</span>
          }
        }
      },
        {
          title: '操作',
          key:'action',
          render: (record) => (
            <div style={{color:'#6BC7FF',cursor:'pointer'}}>
              <span>编辑</span>
              <span style={{paddingLeft:10,paddingRight:10}}>删除</span>
              <span>应用策略</span>
            </div>
          )
        }],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:true,
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      isShow:0,
    };
  }
  componentDidMount = async () => {
		await this.props.dispatch({
      type: 'varlist/getSelectLevel1',
      payload: {
      }
    })
    const query={...this.props.location.query}
    if(query.type==2){
      const res = await this.props.dispatch({
        type: 'varlist/selectVariableById',
        payload: {
          variableId:query.id
        }
      })
      if(res.status=='1'){
        const data = res.data

        this.props.form.setFieldsValue({
          firstTypeId:Number(data.firstTypeId),
          defaultValue: data.defaultValue,
          enumFlag: data.enumFlag,
          maxValue: data.maxValue,
          minValue: data.minValue,
          remark: data.remark,
          status: data.status,
          variableCode: data.variableCode,
          variableLength: data.variableLength,
          variableName: data.variableName,
          variableType: data.variableType
        })
        this.props.dispatch({
          type: 'varlist/saveEnumeration',
          payload: data.variableEnumList || []
        })
        const firstType = this.props.form.getFieldValue('firstTypeId')
        await this.selectchange(firstType)
        this.props.form.setFieldsValue({
          parentId: Number(data.secondTypeId),
        })
      }
    }
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    //formQueryData.enmuList = this.props.varList.dataSource;
    return formQueryData;
  }
  selectchange = async(value) => {
  	await this.props.dispatch({
      type: 'varlist/getSelectLevel2',
      payload: {
      	parentId:value
      }
    })
    this.props.form.setFieldsValue({
      parentId: ''
    })
  }
  //枚举添加
  handleAdd = () => {
    let enumeration = this.props.varlist.enumeration
    //   要添加表格的对象
    const newData = {
      enumValue: ``,
      enumShow: ``
    }
    enumeration.push(newData)
    //   调用models中的方法改变dataSource渲染页面
    this.props.dispatch({
      type: 'varlist/addData',
      payload: enumeration
    })
  }
  //   枚举删除表格
  handleDelete = (key) => {
    const { enumeration } = this.props.varlist
    //   调用models的方法去删除dataSource中的数据
    const newData = enumeration.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'varlist/addData',
      payload: newData
    })
  }
  handleChange = (val) => {
    this.setState({
      isShow: val
    })
  }
  goBack=()=>{
    router.goBack()
  }
  formSubmit = async()=>{
    this.props.form.validateFields(err => {
      if (!err) {
        let data=this.getFormValue()
        const query={...this.props.location.query}
        if(query.type==2){
          //编辑变量
          const updateVarRes=this.props.dispatch({
            type: 'varlist/updateVariable',
            payload: {
              ...data,
              id:query.id ,
              enumList:this.props.varlist.enumeration
            }
          })
          updateVarRes.then((value)=>{
            if(value.status==1){
              message.success('提交成功').then(() => {
                router.push({
                  pathname:'/varManage/varlist',
                })
              }) 
            }else{
              message.error(value.statusDesc || "提交失败").then(() => {
                router.push({
                  pathname:'/varManage/varlist',
                })
              })
            }
          })
          
        }else{
        //添加变量
          const addVarRes=this.props.dispatch({
            type: 'varlist/addVar',
            payload: {
              ...data,
              enumList:this.props.varlist.enumeration
            }
          })
          addVarRes.then((value)=>{
            if(value.status==1){
              message.success('提交成功').then(() => {
                router.push({
                  pathname:'/varManage/varlist',
                })
              })
            }else{
              message.error(value.statusDesc || "提交失败").then(() => {
                router.push({
                  pathname:'/varManage/varlist',
                })
              })
            }
          })   
        }
        
      }
      
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const query= {...this.props.location.query}
    console.log(this.props.varlist.enumeration, 'this.props.varlist.enumeration')
    return (
      <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
        <Card
          bordered={false}
          title={query.type ===1?'新增变量':'编辑变量'}
        >
          <Form
            className="ant-advanced-search-form"
          >
            <Row className={styles.btmMargin}  type="flex" align="middle">
              <Col xxl={4} md={6}>
                <FormItem label="变量分类" {...formItemConfig}>
                  {getFieldDecorator('firstTypeId',{
                    initialValue:'请选择一级分类',
                    rules:[
                      {required:true,}
                    ]
                  })(
                    <Select allowClear={true} onChange={this.selectchange}>
                    {this.props.varlist.selectItem.map((item,index)=> (
				             <Option value={item.id} key={index}>{item.name}{item.typeName}</Option>
				          	))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xxl={3} md={4}>
                <FormItem label="" >
                  {getFieldDecorator('parentId',{
                    initialValue:'请选择二级分类',
                    rules:[
                      {required:true}
                    ]
                  })(
                    <Select allowClear={true} >
                     {this.props.varlist.secondSelectItem.map( (item,index) => (
				             <Option value={item.id} key={index}>{item.typeName}</Option>
				          	))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xxl={4} md={6}>
                <FormItem label="变量名" {...formItemConfig}>
                  {getFieldDecorator('variableName',{
                    initialValue:'',
                    rules:[
                      {required:true,}
                    ]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col xxl={4} md={6}>
                <FormItem label="变量代码" {...formItemConfig}>
                  {getFieldDecorator('variableCode',{
                    initialValue:'',
                    rules:[
                      {required:true}
                    ]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col xxl={4} md={6}>
                <FormItem label="变量类型" {...formItemConfig}>
                  {getFieldDecorator('variableType',{
                    initialValue:'',
                    rules:[
                      {required:true}
                    ]
                  })(
                    <Select allowClear={true}>
                      <Option value={'num'}>数字</Option>
                      <Option value={'character'}>字符</Option>
                      <Option value={'date'}>日期</Option>
                      <Option value={'time'}>时间</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.btmMargin}  type="flex" align="middle">
              <Col xxl={4} md={6}>
                <FormItem label="是否枚举" {...formItemConfig}>
                  {getFieldDecorator('enumFlag',{
                    initialValue:'',
                    rules:[
                      {required:true}
                    ]
                  })(
                    <Select allowClear={true} onChange={(val)=>this.handleChange(val)}>
                      <Option value={1}>是</Option>
                      <Option value={0}>否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xxl={3} md={4}>
              </Col>
              <Col xxl={4} md={6}>
                <FormItem label="长度" {...formItemConfig}>
                  {getFieldDecorator('variableLength',{
                    initialValue:'',
                    rules:[
                      {required:true}
                    ]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col xxl={4} md={6}>
                <FormItem label="最小值" {...formItemConfig}>
                  {getFieldDecorator('minValue',{
                    initialValue:'',
                    rules:[
                      {required:true}
                    ]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
              <Col xxl={4} md={6}>
                <FormItem label="最大值" {...formItemConfig}>
                  {getFieldDecorator('maxValue',{
                    initialValue:'',
                    rules:[
                      {required:true}
                    ]
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            {
              this.state.isShow ?
                <Row className={styles.btmMargin}  type="flex" align="top">
                  <Col xxl={4} md={6}>
                    <FormItem label="枚举值配置:" {...formItemConfig}>
                    </FormItem>
                  </Col>
                  <Col xxl={8} md={12}>
                    <EditableTable
                      list={{ dataSource: this.props.varlist.enumeration }}
                      columns={this.columns}
                      handleAdd={this.handleAdd}
                      handleDelete={this.handleDelete}
                    />
                  </Col>
                </Row> : null
            }
            <Row className={styles.btmMargin}  type="flex" align="middle">
              <Col xxl={4} md={6}>
                <FormItem label="缺省值" {...formItemConfig}>
                  {getFieldDecorator('defaultValue',{
                    initialValue:''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.btmMargin}  type="flex" align="top">
              <Col xxl={8} md={12}>
                <FormItem label="变量说明" labelCol={{span:4}} wrapperCol={{span:20}}>
                  {getFieldDecorator('remark',{
                    initialValue:''
                  })(
                    <TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入你的阶段性工作目标"
                      rows={5}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.btmMargin}  type="flex" align="middle">
              <Col xxl={4} md={6}>
                <FormItem label="变量状态" {...formItemConfig}>
                  {getFieldDecorator('status',{
                    initialValue:''
                  })(
                    <RadioGroup name="radiogroup">
                      <Radio value={1}>启用</Radio>
                      <Radio value={0}>禁用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col style={{color:'#FF0000'}} push={10}>
                {
                  query.type===1?null:'最近操作时间：2018-08-08 00:00:00 操作人：  王大大'
                }
              </Col>
            </Row>
            <Row>
              <Col xxl={8} md={12}  style={{color:'#FF0000'}}>
                {
                  query.type ===1?null:'编辑变量可能会导致决策引擎失效,请谨慎操作!!'
                }
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <Button type="primary" onClick={this.formSubmit}>保存并提交</Button>
                <Button type="primary" onClick={this.goBack}>返回</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
