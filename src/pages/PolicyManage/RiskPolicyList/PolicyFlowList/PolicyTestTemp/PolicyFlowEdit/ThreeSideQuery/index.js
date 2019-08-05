import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Checkbox ,
  Form,
  Card
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({threeSide})=>({
  threeSide
}))

@Form.create()

export default class ThreeSideQuery extends Component {
  state={
    checkedList:[],
  }
  componentDidMount () {
  }
  onChange=(checkedValues)=>{
    console.log('checked = ', checkedValues);
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title={'三方查询'}
        >
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
            <Row type="flex" justify="center" style={{marginBottom:20}}>
              <Col span={6}>
                <Checkbox value="1">安融个人征信报告</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="2">安融反欺诈报告</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="3">大圣个人征信报告</Checkbox>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col span={6}>
                <Checkbox value="4">大圣共债报告</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="5">大圣逾期宝</Checkbox>
              </Col>
              <Col span={6}>
                <Checkbox value="6">百行个人征信报告</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>,
          <Row type="flex" justify="center" gutter={24}>
            <Col>
              <Button type="primary" onClick={this.formSubmit}>保存并提交</Button>
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
