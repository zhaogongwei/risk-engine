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
  Pagination
} from 'antd';
import styles from '../../../FilterIpts.less'
import { addListKey,deepCopy } from '@/utils/utils'
import { connect } from 'dva'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  {
    name:'年龄',
    type:'数字',
    value:'年龄',
    code:'11',
    length:1,
    order:1,
    id:1,
    kind:'num'
  },
  {
    name:'借款人及其配偶和联系',
    type:'字符',
    value:'借款人与配偶联系',
    code:'22',
    length:1,
    order:1,
    id:2,
    kind:'str',
    isenum:1,
    option:[
      {
        id:1,
        name:'111'
      },
      {
        id:2,
        name:'222'
      },
      {
        id:3,
        name:'333'
      },
    ]
  },
  {
    name:'评分卡得分',
    type:'数字',
    value:'通过评分模型得出的得龄',
    code:'33',
    length:1,
    order:1,
    id:3,
    kind:'num'
  },
  {
    name:'拒绝原因编码',
    type:'字符',
    value:'拒绝原因编码合集',
    code:'44',
    length:1,
    order:1,
    id:4,
    kind:'str',
  },
  {
    name:'日期',
    type:'日期',
    value:'---',
    code:'55',
    length:1,
    order:1,
    id:5,
    kind:'date',
    isenum:0,
  },
  {
    name:'性别',
    type:'字符',
    value:'---',
    code:'66',
    length:1,
    order:1,
    id:5,
    kind:'str',
    isenum:0,
  },
  {
    name:'姓名',
    type:'数字',
    value:'---',
    code:'77',
    length:1,
    order:1,
    id:6,
    kind:'num'
  },
  {
    name:'高风险规则触发数',
    type:'数字',
    value:'---',
    code:'88',
    length:1,
    order:1,
    id:7,
    kind:'num',
    option:[
      {
        id:1,
        name:'111'
      },
      {
        id:2,
        name:'222'
      },
      {
        id:3,
        name:'333'
      },
    ]
  },
  {
    name:'银行卡认证',
    type:'数字',
    value:'---',
    kind:'num',
    code:'99',
    length:1,
    order:1,
    id:8,
    kind:'num'
  },
];
const defaultCheckedList = ['Apple', 'Orange'];
@connect(({scoreModel,rule})=>({
  scoreModel,
  rule,
}))

@Form.create()

export default class DeployDialog extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      visible:false,
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      singleChecked:false,
      radioValue:{},
      type:1,// 0:单选框  1：多选框
    }
  }
  //显示弹窗
  showModal = ()=>{

  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //  分页器改变页数的时候执行的方法
  onPageChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  onChange = (checkedList) => {
    console.log('选中',checkedList)
    this.setState({
      checkedList:checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  //单选按钮onChange事件
  onRadioChange = (e)=>{
    console.log('radio checked', e.target.value);
    this.setState({
      radioValue:e.target.value
    })
  }
  allChecked=(value)=>{
    plainOptions.map((item,index)=>{
      item.checked = value;
    })
  }
  //点击确定
  submitHandler=()=>{
      return this.state
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
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    formQueryData.assetsTypeName=formQueryData.assetsTypeName.trim()
    formQueryData.assetsTypeCode=formQueryData.assetsTypeCode.trim()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'addForm')
  }
  componentWillReceiveProps(newProps){
    this.setState({
      visible:newProps.showState
    })
  }
  render() {
    const {visible,loading} = this.state;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:16},
    }
    return (
        <Form
          className="ant-advanced-search-form"
        >
          <Row className={styles.btmMargin} gutter={0} type="flex" align="middle">
            <Col xxl={6} md={10}>
              <FormItem label="变量分类"  wrapperCol={{span:8}}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:!this.props.type? this.props.assetsTypeName:'',
                  rules: [{ required: true, whitespace:true,message: '请输入资产类型名称!'}],
                })(
                  <Select allowClear={true}>
                    <Option value={1}>王一</Option>
                    <Option value={2}>王二</Option>
                    <Option value={3}>王三</Option>
                    <Option value={4}>王四</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={4} md={8}>
              <FormItem wrapperCol={{span:16}}>
                {getFieldDecorator('assetsTypeCode',{
                  initialValue:!this.props.type?this.props.code:'',
                })(
                  <Select allowClear={true}>
                    <Option value={1}>王一</Option>
                    <Option value={2}>王二</Option>
                    <Option value={3}>王三</Option>
                    <Option value={4}>王四</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col xxl={6} md={10}>
              <FormItem label="状态" {...formItemConfig}>
                {getFieldDecorator('status',{
                  initialValue:!this.props.type?this.props.status:1
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
            <Col offset={2}>
              <Button type="primary">查询</Button>
            </Col>
            <Col>
              <Button type="primary">清空查询</Button>
            </Col>
          </Row>
          <Divider />
          <div className={styles.btmMargin}>
            {
              this.props.type?
                <Checkbox.Group style={{ width: '100%' }} value={this.state.checkedList} onChange={this.onChange}>
                  {
                    plainOptions.map((item, index) => {
                      return  <Row type="flex" align="middle" key={index}>
                        <Col span={8}>
                          <Checkbox value={item}>{item.name}</Checkbox>
                        </Col>
                        <Col span={8}>{item.type}</Col>
                        <Col span={8}>{item.value}</Col>
                      </Row>
                    })
                  }
                </Checkbox.Group>:
                <RadioGroup style={{ width: '100%' }} value={this.state.radioValue} onChange={this.onRadioChange}>
                  {
                    plainOptions.map((item, index) => {
                      return  <Row type="flex" align="middle" key={index}>
                        <Col span={8}>
                          <Radio  value={item}>{item.name}</Radio >
                        </Col>
                        <Col span={8}>{item.type}</Col>
                        <Col span={8}>{item.value}</Col>
                      </Row>
                    })
                  }
                </RadioGroup>
            }
          </div>
          <Divider />
          <Row className={styles.btmMargin} type="flex" align="middle" justify="space-between">
            <Col>
              {
                this.props.type?
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    全选
                  </Checkbox>:null
              }
            </Col>
            <Col>
              <Pagination
                style={{ marginBottom: "50px" }}
                showQuickJumper
                defaultCurrent={1}
                current={this.state.current}
                total={12}
                onChange={this.onPageChange}
                showTotal={(total, range) => this.showTotal(total, range)}
              />
            </Col>
          </Row>
        </Form>
    )
  }
}
