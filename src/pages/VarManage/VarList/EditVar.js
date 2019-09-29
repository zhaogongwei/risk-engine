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
  Card,
  InputNumber,
  TimePicker,
  DatePicker 
} from 'antd';
import router from 'umi/router';
import styles from '../FilterIpts.less'
import EditableTable from '@/components/EditableTable'
import { addListKey,deepCopy } from '@/utils/utils'
import { connect } from 'dva'
import moment from 'moment'
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
        key:'enumValue',
        only:true,
      },
      {
        title: '枚举值展示',
        dataIndex: 'enumShow',
        key:'enumShow',
        max:20,
        nonRequired: true,
        editable: true,
        only:true,
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
      disable:false,
      updateTime:'',
      updateTrueName:'',
      defaultVal:'',
      emDelFlag:true,
      varData:{}
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
      //获取变量信息
      const res = await this.props.dispatch({
        type: 'varlist/selectVariableById',
        payload: {
          variableId:query.id
        }
      })
      if(res.status=='1'){
        const data = res.data
        //设置input值
        await this.props.form.setFieldsValue({
          firstTypeId:Number(data.firstTypeId),
          remark: data.remark,
          status: data.status,
          variableCode: data.variableCode,
          variableName: data.variableName,
          variableType: data.variableType
        })
        //设置缺省值和显示枚举flag
        this.setState({
          isShow:data.enumFlag,
          varData:{
            firstTypeId:Number(data.firstTypeId),
            enumFlag: data.enumFlag,
            maxValue: data.maxValue,
            minValue: data.minValue,
            remark: data.remark,
            status: data.status,
            variableCode: data.variableCode,
            variableLength: data.variableLength,
            variableName: data.variableName,
            variableType: data.variableType
          }
        })
        //时间和日期控件的默认值需要经过moment处理，没有值时，不能为''，只能为null
        if(data.variableType==='time'&&data.variableType){
          this.setState({
            defaultVal:moment(data.defaultValue,'HH:mm:ss'),
          })
        }else if(data.variableType==='date'&&data.variableType){
          this.setState({
            defaultVal:moment(data.defaultValue,'YYYY-MM-DD'),
          })
        }else{
          this.setState({
            defaultVal:data.defaultValue,
          })
        }
        //设置不可更改,修改人，日期
        this.state.disable = true;
        this.state.updateTime = data.updateTime
        this.state.updateTrueName = data.updateTrueName
        //获取枚举列表
        this.props.dispatch({
          type: 'varlist/saveEnumeration',
          payload: data.variableEnumList || []
        })
        //获取应用策略列表如果不为空则禁止删除枚举
        const strategy=this.props.dispatch({
          type: 'varlist/getStrategy',
          payload: {
            variableId:query.id
          }
        })
        strategy.then(value => {
          if(value.status==1){
            if(value.data.length != 0){
              this.setState({
                emDelFlag: false,
              });
            }
          }
        })
        //获取二级变量类型
        const firstType = this.props.form.getFieldValue('firstTypeId')
        await this.selectchange(firstType)
        this.props.form.setFieldsValue({
          parentId: Number(data.secondTypeId),
        })
      }
    }
  }
  componentWillUnmount(){
    this.props.dispatch({
      type: 'varlist/clearfilterIpts',
      payload: {}
    })
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    console.log(formQueryData.defaultValue)
    if(formQueryData.variableType=='date'){
      formQueryData.defaultValue=formQueryData.defaultValue==null?"":moment(formQueryData.defaultValue).format('YYYY-MM-DD')
    }else if(formQueryData.variableType=='time'){
      formQueryData.defaultValue=formQueryData.defaultValue==null?"":moment(formQueryData.defaultValue).format('YYYY-MM-DD HH:mm:ss')
    }
    
    //formQueryData.enmuList = this.props.varList.dataSource;
    return formQueryData;
  }
  selectchange = async(value) => {//选择变量一级分类触发事件
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
    if(this.state.emDelFlag){
      let {enumeration} = this.props.varlist
      //   要添加表格的对象
      const newData = {
        enumValue:'',
        enumShow:''
      }
      enumeration.push(newData)
      //   调用models中的方法改变dataSource渲染页面
      this.props.dispatch({
        type: 'varlist/addData',
        payload: enumeration
      })
    }else{
      message.error('已绑定应用策略')
    }
  }
  //枚举值保存
  enumListSave=(obj)=>{
    let {enumeration} = this.props.varlist
    enumeration.length&&enumeration.map((item,index)=>{
      if(item['key']===obj['key']){
        enumeration.splice(obj['key']-1,1,obj)
        this.props.dispatch({
          type: 'varlist/addData',
          payload: enumeration
        })
      }
    })

  }
  //   枚举删除表格
  handleDelete = (key) => {
    const { enumeration } = this.props.varlist
    //   调用models的方法去删除dataSource中的数据
    if(this.state.emDelFlag){
      const newData = enumeration.filter(item => item.key !== key)
      this.props.dispatch({
        type: 'varlist/addData',
        payload: newData
      })
    }else{
      message.error('已绑定应用策略')
    }
     
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
    //提交
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
                return ;
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
                return ;
              })
            }
          })   
        }
        
      }
      
    });
  }
  checkNum=(rule, val, cb)=>{
    let re = new RegExp("^[0-9]*$")
    if(val.length==0 || val==null ){
      cb()
      return;
    }else if(!re.test(val)){
      cb('请输入数字')
      return;
    }else if(val.length>5){
      cb('超过最大字数限制')
      return;
    }
    cb()
    return;
  }
  checkVarCode=async(rule, val, cb)=>{
    let re = new RegExp("^(?!\d+$)[\da-zA-Z]+$");
    if(val.length==0 || val==null ){
      cb()
      return;
    }else if(!re.test(val)){
      cb('请输入正确的变量代码')
      return;
    }else if(val.length>30){
        cb('超过最大字数限制')
        return;
    }else{
      let res=await this.props.dispatch({
        type: 'varlist/checkVarCode',
        payload: {
          variableCode: val,
          id:this.props.location.query.id || ''
        }
      })
      if(res.status==1){
        cb()
        return;
      }else{
        cb(res.statusDesc)
        return;
      }
    }
  }
  checkVarName=async(rule, val, cb)=>{
    if(val.length==0 || val==null ){
      cb()
      return;
    }else if(val.length>15){
        cb('超过最大字数限制')
        return;
    }else{
      let res=await this.props.dispatch({
        type: 'varlist/checkVarName',
        payload: {
          variableName: val,
          id:this.props.location.query.id || ''
        }
      })
      if(res.status==1){
        cb()
        return;
      }else{
        cb(res.statusDesc)
        return;
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const enumConfig = {
      labelCol:{span:3},
      wrapperCol:{span:16},
    }
    const query= {...this.props.location.query}
    const {enumeration} = this.props.varlist
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={query.type *1===1?'新增变量':'编辑变量'}
        >
          <Form
            className="ant-advanced-search-form"
          >
            <Row className={styles.btmMargin}  type="flex" align="middle">
              <Col xxl={4} md={6}>
                <FormItem label="变量分类" {...formItemConfig}>
                  {getFieldDecorator('firstTypeId',{
                    initialValue:'',
                    rules:[
                      {required:true, message:'请选择一级分类'}
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
                <FormItem>
                  {getFieldDecorator('parentId',{
                    initialValue:'',
                    rules:[
                      {required:true,message:'请选择二级分类'}
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
                      {required:true,message:'请输入变量名称'},
                      {validator:this.checkVarName}
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
                      {required:true,message:'请输入变量代码'},
                      {validator:this.checkVarCode}
                    ]
                  })(
                    <Input disabled={this.state.disable}/>
                  )}
                </FormItem>
              </Col>
              <Col xxl={4} md={6}>
                <FormItem label="变量类型" {...formItemConfig}>
                  {getFieldDecorator('variableType',{
                    initialValue:'',
                    rules:[
                      {required:true,message:'请选择变量类型'}
                    ]
                  })(
                    <Select allowClear={true} disabled={this.state.disable}>
                      <Option value={'num'}>数字</Option>
                      <Option value={'char'}>字符</Option>
                      <Option value={'date'}>日期</Option>
                      <Option value={'time'}>时间</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className={styles.btmMargin}  type="flex" align="middle">
            {this.props.form.getFieldValue('variableType') == 'char'?
              <Col xxl={4} md={6}>
                <FormItem label="是否枚举" {...formItemConfig}>
                  {getFieldDecorator('enumFlag',{
                    initialValue:query.type==2 && this.state.varData.enumFlag!==undefined ?this.state.varData.enumFlag:'',
                    rules:[
                      {required:true,message:'请选择是否枚举'}
                    ]
                  })(
                    <Select allowClear={true} onChange={(val)=>this.handleChange(val)} disabled={this.state.disable}>
                      <Option value={1}>是</Option>
                      <Option value={0}>否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>:null
            }
            {this.props.form.getFieldValue('variableType') != 'date'&&this.props.form.getFieldValue('variableType') != 'time'?
              <Col xxl={4} md={6}>
                <FormItem label="长度" {...formItemConfig}>
                  {getFieldDecorator('variableLength',{
                    initialValue:query.type==2 && this.state.varData.variableLength!==undefined ?this.state.varData.variableLength:'',
                    rules:[
                      {validator:(rule, val, cb)=>{
                        let re = new RegExp("^[0-9]*$")
                        if(val==''|| val==null ){
                          cb()
                          return;
                        }else if(!re.test(val)){
                          cb('请输入数字')
                          return;
                        }else if(val.length>5){
                          cb('超过最大字数限制')
                          return;
                        }
                        cb()
                        return;
                      }}
                     ]
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>:null
            }
            {this.props.form.getFieldValue('variableType') == 'num'?
              <Col xxl={4} md={6}>
                <FormItem label="最小值" {...formItemConfig} >
                  {getFieldDecorator('minValue',{
                    initialValue:query.type==2 && this.state.varData.minValue!==undefined ?this.state.varData.minValue:'',
                    rules:[
                      {required:true,message:'请输入最小值'},
                     {validator:this.checkNum}
                    ]
                  })(
                    <Input disabled={this.state.disable} />
                  )}
                </FormItem>
              </Col>:null
            }
            {this.props.form.getFieldValue('variableType') == 'num'?
              <Col xxl={4} md={6}>
                <FormItem label="最大值" {...formItemConfig} >
                  {getFieldDecorator('maxValue',{
                    initialValue:query.type==2 && this.state.varData.maxValue!==undefined ? this.state.varData.maxValue:'',
                    rules:[
                      {required:true,message:'请输入最大值'},
                      {validator:this.checkNum}
                    ]
                  })(
                    <Input disabled={this.state.disable}/>
                  )}
                </FormItem>
              </Col>:null
            }
            </Row>   
            {
              this.state.isShow && this.props.form.getFieldValue('variableType') == 'char'?
                <Row className={styles.btmMargin}  type="flex" align="top">
                  <Col xxl={10} md={14}>
                    <FormItem label="枚举值配置:" {...enumConfig}>
                    <EditableTable
                      list={{ dataSource: this.props.varlist.enumeration }}
                      columns={this.columns}
                      handleAdd={this.handleAdd}
                      handleDelete={this.handleDelete}
                      emDelFlag={this.state.emDelFlag}
                      enumListSave={(list)=>this.enumListSave(list)}
                    />
                    </FormItem>
                  </Col>
                  <Col xxl={8} md={12}>
                    
                  </Col>
                </Row> : null
            }
            
            <Row className={styles.btmMargin}  type="flex" align="middle">
              <Col xxl={4} md={6}>
                {
                  this.props.form.getFieldValue('enumFlag') ==1 && this.props.form.getFieldValue('variableType') == 'char'?
                  <FormItem label="缺省值" {...formItemConfig}>
                  {getFieldDecorator('defaultValue',{
                    initialValue:this.state.defaultVal,
                  })(
                      <Select allowClear={true} >
                        {enumeration.length>0&&enumeration.map( (item,index) =>
                          (
                            <Option value={item.enumValue} key={index}>{item.enumShow}</Option>
                          ))}
                      </Select>
                  )}
                  </FormItem>:null

                }
                {
                  this.props.form.getFieldValue('variableType') == 'char' && this.props.form.getFieldValue('enumFlag') !=1?
                  <FormItem label="缺省值" {...formItemConfig}>
                  {getFieldDecorator('defaultValue',{
                    initialValue:this.state.defaultVal,
                    rules:[
                      {max:10,message:'超过最大字数限制'},
                    ]
                  })(
                    <Input />
                  )}
                  </FormItem>:null

                }
                {
                  this.props.form.getFieldValue('variableType') == 'num' && this.props.form.getFieldValue('enumFlag') !=1?
                  <FormItem label="缺省值" {...formItemConfig}>
                  {getFieldDecorator('defaultValue',{
                    initialValue:this.state.defaultVal,
                  })(
                    <InputNumber />
                  )}
                  </FormItem>:null

                }
                {
                  this.props.form.getFieldValue('variableType') == 'date' && this.props.form.getFieldValue('enumFlag') !=1?
                  <FormItem label="缺省值" {...formItemConfig}>
                  {getFieldDecorator('defaultValue',{
                    initialValue:this.state.defaultVal,
                  })(
                    <DatePicker />
                  )}
                  </FormItem>:null
                }
                {
                   this.props.form.getFieldValue('variableType') == 'time' && this.props.form.getFieldValue('enumFlag') !=1?
                   <FormItem label="缺省值" {...formItemConfig}>
                   {getFieldDecorator('defaultValue',{
                     initialValue:this.state.defaultVal,
                   })(
                    <TimePicker/>
                   )}
                   </FormItem>:null
                }
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
                    initialValue:'',
                    rules:[
                      {required:true,message:'请选择变量状态'}
                    ]
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
                  query.type*1===1?null:`最近操作时间：${this.state.updateTime} 操作人：  ${this.state.updateTrueName}`
                }
              </Col>
            </Row>
            <Row>
              <Col xxl={8} md={12}  style={{color:'#FF0000'}}>
                {
                  query.type *1===1?null:'编辑变量可能会导致决策引擎失效,请谨慎操作!!'
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
