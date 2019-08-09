import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Icon,
  Row,
  Col,
  Input,
  Select,
  message,
  Radio,
  Tooltip,
  Form,
  Card
} from 'antd';
import { connect } from 'dva'
// 验证权限的组件
import { findInArr,exportJudgment,addListKey,deepCopy } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const spanStyle = {
  fontSize: '12px',
  marginRight: '10px'
}

@connect(({ policyList, loading }) => ({
  policyList,
}))
@Form.create()
export default class PolicyEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '变量名称',
        dataIndex: 'name',
        key:'name'
      },{
        title: '变量代码',
        dataIndex: 'code',
        key:'code'
      },{
        title: '长度',
        key:'length',
        dataIndex:'length'
      },
        {
          title: '类型',
          dataIndex: 'type',
          key:'type'
        }
        ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:true,
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      selectedRowKeys: [],
    };
  }
  componentDidMount() {
    this.props.returnSubKey(this, 'edit')
  }
  //   获取子组件数据的方法
  getSubKey = (ref,name) => {
    this[name] = ref;
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    return (
      <Form>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略类型" {...formItemConfig}>
              {getFieldDecorator('policyType',{
                initialValue:'',
                rules:[{required:true}]
              })(
                <Select allowClear={true}>
                  <Option value={1}>主策略</Option>
                  <Option value={2}>次策略</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略名称" {...formItemConfig}>
              {getFieldDecorator('policyName',{
                initialValue:'',
                rules:[
                  {required:true},
                  {max:15,message:'最多输入15位!'}
                ]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略代码" {...formItemConfig}>
              {getFieldDecorator('policyCode',{
                initialValue:'',
                rules:[
                  {
                    required:true,
                    pattern:/^[a-zA-Z]{1,15}$/,
                    message:'只能输入15位的大写或小写字母!'
                  },
                ]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="策略负责人" {...formItemConfig}>
              {getFieldDecorator('policyLeader',{
                initialValue:'',
                rules:[{required:true}]
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
        </Row>
        <Row type="flex" align="middle" xxl={24}>
          <Col xxl={19}>
            <FormItem
              label = "策略排序"
              labelCol = {{ span: 7  }}
              wrapperCol = {{ span: 16 }}
            >
              {getFieldDecorator('assetsTypeName',{
                initialValue:'',
                rules:[{required:true}]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col style={{ marginBottom: '23px' }}>
            <Tooltip title="A-EMS接收资产后,按策略排序校验是否符合当前策略标签,如符合则资产进入当前策略">
              <Icon type="question-circle" style={{fontSize:'24px',cursor:'pointer'}}/>
            </Tooltip>
          </Col>
        </Row>
        <Row>
          <Col xxl={22}>
            <FormItem label="变量状态" {...formItemConfig}>
              {getFieldDecorator('status',{
                initialValue: 1
              })(
                <RadioGroup name="radiogroup">
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
        <Col offset={12}>
          <span style={{ ...spanStyle }}>
            最后编辑时间: 2019-07-31
          </span>
          <span style={{ ...spanStyle }}>
            操作人: 王大大
          </span>
        </Col>
      </Form>
    )
  }
}
