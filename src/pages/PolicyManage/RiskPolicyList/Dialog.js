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
import styles from '../FilterIpts.less'
import { connect } from 'dva'
import {addListKey,deepCopy } from '@/utils/utils'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  {
    name:'年龄',
    type:'数字',
    value:'年龄',
    length:4,
    code:'age',
    id:1
  },
  {
    name:'借款人及其配偶和联系',
    type:'字符',
    value:'借款人与配偶联系',
    length:4,
    code:'age',
    id:2
  },
  {
    name:'评分卡得分',
    type:'数字',
    value:'通过评分模型得出的得龄',
    length:4,
    code:'age',
    id:3
  },
  {
    name:'拒绝原因编码',
    type:'字符',
    value:'拒绝原因编码合集',
    length:4,
    code:'age',
    id:4
  },
  {
    name:'性别',
    type:'字符',
    value:'---',
    length:4,
    code:'age',
    id:5
  },
  {
    name:'姓名',
    type:'数字',
    value:'---',
    length:4,
    code:'age',
    id:6
  },
  {
    name:'高风险规则触发数',
    type:'数字',
    value:'---',
    length:4,
    code:'age',
    id:7
  },
  {
    name:'银行卡认证',
    type:'数字',
    value:'---',
    length:4,
    code:'age',
    id:8
  },
  {
    name:'身份证号',
    type:'字符',
    value:'---',
    length:4,
    code:'age',
    id:9
  },
  {
    name:'审核结果',
    type:'数字',
    value:'---',
    length:4,
    code:'age',
    id:10
  },
];
const defaultCheckedList = ['Apple', 'Orange'];
@connect(({policyList})=>({
  policyList
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
      pageSize:10,
      currentPage:1,
      current:1,
    }
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
    console.log(checkedList)
    this.setState({
      checkedList:checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    console.log(e)
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  //点击确定
  submitHanler=()=>{
    return this.state;
  }
  //请客勾选
  emptyCheck=()=>{
    this.setState({
      checkedList:[],
      checkAll:false,
    })
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
    this.props.getSubKey(this,'dialog')
  }
  componentWillReceiveProps(newProps){
  }
  render() {
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
                  </Checkbox.Group>

          </div>
          <Divider />
          <Row className={styles.btmMargin} type="flex" align="middle" justify="space-between">
            <Col>
              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={this.onCheckAllChange}
                checked={this.state.checkAll}
              >
                全选
              </Checkbox>
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
