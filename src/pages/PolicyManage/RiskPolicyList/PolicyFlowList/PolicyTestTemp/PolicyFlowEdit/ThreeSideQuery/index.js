import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Checkbox ,
  Form,
  Card,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({threeSide,loading})=>({
  threeSide,
  buttonLoading:loading.effects['threeSide/saveThreeSideInfo'],
}))

@Form.create()

export default class ThreeSideQuery extends Component {
  state={
    checkedList:[],
  }
  async componentDidMount () {
    const {query} = this.props.location;
    const res = this.props.dispatch({
      type: 'threeSide/queryThreeSideInfo',
      payload: {
        nodeId:query['id']
      }
    })
  }
  onChange=(checkedValues)=>{
    console.log('checked = ', checkedValues);
    this.setState({
      checkedList:checkedValues
    })
  }
  formSubmit=()=>{
    const {query} = this.props.location;
    const {checkedList} = this.state;
    if(!checkedList.length){
      message.error('请勾选第三方选项!')
      return;
    }
    this.props.dispatch({
      type: 'threeSide/saveThreeSideInfo',
      payload: {
        ruleType:'third',
        thirds:checkedList,
        nodeId:query['id']
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { thirds } = this.props.threeSide;
    const { checkedList } = this.state;
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    console.log(thirds)
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={'三方查询'}
          style={{height:800}}
        >
          <Form.Item>
            {getFieldDecorator('checkbox-group', {
              initialValue: thirds,
            })(
              <Checkbox.Group style={{ width: '100%',marginTop:50 }} onChange={this.onChange}>
                <Row type="flex" justify="center" style={{marginBottom:20}}>
                  <Col span={6}>
                    <Checkbox value={1}>大圣个人征信报告</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={2}>安融反欺诈报告</Checkbox>
                  </Col>
                  <Col span={6}>
                    <Checkbox value={3}>大圣共债报告</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>,
            )}
          </Form.Item>
          <Row type="flex" justify="center" gutter={24} style={{marginTop:50}}>
            <Col>
              <Button type="primary" onClick={this.formSubmit} loading={this.props.buttonLoading}>保存并提交</Button>
            </Col>
            <Col>
              <Button  onClick={()=>router.goBack()}>返回</Button>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}
