import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Row,
  Col,
  Button,
  Input,
  Select,
  Radio,
  Form,
  Popconfirm
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
  ({varList}) => ({varList})
)
@Form.create()
export default class EditVar extends PureComponent {
  constructor(props) {
    super(props);
    this.columns=
      [
        {
          title: '序号',
          dataIndex: 'key',
          key:'key',
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
          render: (record) =>
            <Popconfirm title="确定要删除本行吗?" onConfirm={() => this.handleDelete(record.key)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>

        }]
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
  componentDidMount() {
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue();
    formQueryData.enmuList = this.props.varList.dataSource;
    return formQueryData;
  }
  handleAdd = () => {
    const { count, dataSource } = this.props.varList;
    //   要添加表格的对象
    const newData = {
      enumValue:``,
      enumShow:``,
    };
    //   调用models中的方法改变dataSource渲染页面
    this.props.dispatch({
      type: 'varList/addData',
      payload: {
        dataSource:addListKey(deepCopy([...dataSource, newData])),
      }
    })
  }
  //   删除表格
  handleDelete = (key) => {
    const {dataSource,count} = this.props.varList;
    //   调用models的方法去删除dataSource中的数据
    const newData = dataSource.filter(item => item.key !== key)
    this.props.dispatch({
      type: 'varList/delData',
      payload: {
        dataSource: addListKey(deepCopy(newData)),
      }
    })
  }
  handleChange=(e)=>{
    this.setState({
      isShow:e
    })
  }
  goBack=()=>{
    router.goBack()
  }
  formSubmit = ()=>{
    console.log(this.getFormValue())
    console.log(JSON.stringify(this.getFormValue()))
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    const {state}= {...this.props.location}
    return (
      <PageTableTitle title={state.type ===1?'添加变量':'编辑变量'} renderBtn={this.renderTitleBtn}>
        <Form
          className="ant-advanced-search-form"
        >
          <Row className={styles.btmMargin}  type="flex" align="middle">
            <Col xxl={4} md={6}>
              <FormItem label="变量分类" {...formItemConfig}>
                {getFieldDecorator('oneclass',{
                  initialValue:'',
                  rules:[
                    {required:true,message:'请选择一级分类',}
                  ]
                })(
                  <Select allowClear={true}>
                    <Option value={'反欺诈'}>反欺诈</Option>
                    <Option value={'信审模块'}>信审模块</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={3} md={4}>
              <FormItem label="" >
                {getFieldDecorator('parentId',{
                  initialValue:'',
                  rules:[
                    {required:true}
                  ]
                })(
                  <Select allowClear={true}>
                    <Option value={1}>注册</Option>
                    <Option value={2}>评分规则</Option>
                    <Option value={3}>借款人信息</Option>
                    <Option value={4}>借款人信息</Option>
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
                  <Select allowClear={true} onChange={(e)=>this.handleChange(e)}>
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
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          {this.state.isShow?
          <Row className={styles.btmMargin}  type="flex" align="top">
            <Col xxl={4} md={6}>
              <FormItem label="枚举值配置:" {...formItemConfig}>
              </FormItem>
            </Col>
            <Col xxl={8} md={12}>
              <EditableTable
                list={this.props.varList}
                columns={this.columns}
                handleAdd={this.handleAdd}
                handleDelete={this.handleDelete}
              />
            </Col>
          </Row>:null}
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
          </Row>
          <Row type="flex" justify="center">
            <Col>
              <Button type="primary" onClick={this.formSubmit}>保存并提交</Button>
              <Button type="primary" onClick={this.goBack}>返回</Button>
            </Col>
          </Row>
        </Form>
      </PageTableTitle>
    )
  }
}