import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from 'components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Icon,
  Row,
  Col,
  Input,
  Select,
  Form,
  Radio
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
// 验证权限的组件
import { findInArr,exportJudgment } from '@/utils/utils'
const Option = Select.Option;
const FormItem = Form.Item
const RadioGroup = Radio.Group;
@connect(({ assetDeploy, loading }) => ({
  assetDeploy,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
@Form.create()
export default class LabelEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '变量名称',
        dataIndex: 'assetsTypeName',
        key:'assetsTypeName'
      },{
        title: '变量代码',
        dataIndex: 'assetsTypeCode',
        key:'assetsTypeCode'
      },{
        title: '长度',
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
          title: '类型',
          dataIndex: 'assetsTypeCodea',
          key:'assetsTypeCodea'
        },
        {
          title: '添加时间',
          dataIndex: 'assetsTypeCodeb',
          key:'assetsTypeCodeb'
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
    this.change()
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    let formData ;
    if(this.child){
      formData = this.child.getFormValue()
    }else{
      formData = {}
    }
    this.props.dispatch({
      type: 'assetDeploy/riskSubmit',
      data: {
        ...formData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubData = (ref) => {
    this.child = ref;
  }
  //   获取子组件数据的方法
  getSubDeploy = (ref) => {
    this.childDeploy = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //新增
  btnAdd=()=>{
    this.childDeploy.reset()
    this.setState({
      modalStatus:true,
      type:true
    })
  }
  //点击配置弹窗
  clickDialog=(record)=>{
    this.childDeploy.reset()
    this.setState({
      modalStatus:true,
      assetsTypeName:record.assetsTypeName,
      code:record.assetsTypeCode,
      id:record.id,
      status:record.status,
      type:false
    })
  }
  //监听子组件数据变化
  handleChildChange = (newState)=>{
    this.setState({
      modalStatus:newState
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //查询时改变默认页数
  changeDefault=(value)=>{
    this.setState({
      current:value
    })
  }
  //右上角渲染
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={this.goAddPage}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = ()=>{
    this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
  }
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    formQueryData['borrowDate'] = this.getDateValue()
    return formQueryData;
  }
  getDateValue = () =>{
    let DateValue = this.props.form.getFieldsValue(['borrowDate1','borrowDate2','borrowDate3','borrowDate4','borrowDate5','borrowDate6','borrowDate7'])
    let DateArray = [];
    for(var date in DateValue){
      DateArray.push(DateValue[date])
    }
    return DateArray
  }
  formSubmit=()=>{
    console.log(this.getFormValue())
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:14},
    }
    const {selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageTableTitle title={'新增/编辑标签'}>
        <Form
          className="ant-advanced-search-form"
        >
          <Row style={{marginBottom:10}} type="flex" align="middle" >
            <Col xxl={8} md={8}>
              <FormItem label="标签名称" {...formItemConfig}>
                {getFieldDecorator('status',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginBottom:10}} type="flex" align="middle" offset={4}>
            <Col xxl={8} md={8}>
              <FormItem label="资产来源" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
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
          <Row style={{marginBottom:10}} type="flex" align="middle" >
            <Col xxl={8} md={8}>
              <FormItem label="资产类型" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
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
          <Row style={{marginBottom:10}} type="flex" align="middle">
            <Col xxl={8} md={8}>
              <FormItem label="还款方式" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
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
          <Row style={{marginBottom:10}} type="flex" align="middle" offset={2}>
            <Col xxl={8} md={8}>
              <FormItem label="借款期限" labelCol={{span:6}} wrapperCol={{span:3}}>
                {getFieldDecorator('borrowDate1',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={1} md={2} pull={5}>
              <FormItem>
                {getFieldDecorator('borrowDate2',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={1} md={2} pull={5}>
              <FormItem>
                {getFieldDecorator('borrowDate3',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={1} md={2} pull={5}>
              <FormItem >
                {getFieldDecorator('borrowDate4',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={1} md={2} pull={5}>
              <FormItem >
                {getFieldDecorator('borrowDate5',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={1} md={2} pull={5}>
              <FormItem>
                {getFieldDecorator('borrowDate6',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col xxl={1} md={2} pull={5}>
              <FormItem>
                {getFieldDecorator('borrowDate7',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={6} pull={3}>
              <FormItem  wrapperCol={{span:12}}>
                {getFieldDecorator('name',{
                  initialValue:'',
                })(
                  <RadioGroup>
                    <Radio value={0}>日</Radio>
                    <Radio value={1}>月</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{marginBottom:10}} type="flex" align="middle" offset={4}>
            <Col xxl={8} md={8}>
              <FormItem label="状态" {...formItemConfig}>
                {getFieldDecorator('assetsTypeName',{
                  initialValue:'',
                  rules:[{required:true}]
                })(
                  <RadioGroup>
                    <Radio value={0}>禁用</Radio>
                    <Radio value={1}>启用</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" align="middle" gutter={16}>
            <Col offset={3}>
              <Button type="primary" onClick={this.formSubmit}>保存并提交</Button>
            </Col>
            <Col>
              <Button>返回</Button>
            </Col>
          </Row>
        </Form>
      </PageTableTitle>
    )
  }
}
