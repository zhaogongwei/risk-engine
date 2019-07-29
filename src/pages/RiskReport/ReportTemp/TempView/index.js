import React, { PureComponent} from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Affix,
  Button,
  Row,
  Col,
  Tabs,
  Anchor,
  List,
  Card
} from 'antd';
const { Link } = Anchor;
const TabPane = Tabs.TabPane;
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import ReportComponent from './ReportComponent'
import router from 'umi/router';
@connect(({ riskReport}) => ({
  riskReport,
}))

export default  class Index extends  PureComponent{
  constructor(props){
    super(props)

  }
  //初始化信息
  componentDidMount(){
  }
  //返回
  goBack=()=>{
  }
  render(){
    const data = [
      {
        title:'综合决策报告',
        createTime:'2018-09-12',
        list:[
          {
            name:'风控决策结果',
            value:'通过',
          },
          {
            name:'评分卡得分',
            value:780,
          },
          {
            name:'风险拒绝原因编码',
            value:'000、001 、002、003 、004、005、006、007',
          },
          {
            name:'姓名',
            value:'王**',
          },
          {
            name:'手机号码',
            value:'139***64998',
          },
          {
            name:'身份证号',
            value:'12345678909876',
          },
          {
            name:'年龄',
            value:'34',
          },
          {
            name:'姓名',
            value:'',
          },
        ]
      },
      {
        title:'基本信息认证',
        createTime:'',
        list:[
          {
            name:'身份证信息认证',
            value:'通过',
          },
          {
            name:'手机实名验证',
            value:'通过',
          },
          {
            name:'银行卡三要素验证',
            value:'通过',
          },
          {
            name:'蚂蚁信用认证',
            value:'已认证',
          },
          {
            name:'职业认证',
            value:'已认证',
          },
          {
            name:'学历认证',
            value:'已认证',
          },
          {
            name:'运营商认证',
            value:'已认证',
          },
          {
            name:'联系人认证',
            value:'已认证',
          },
          {
            name:'银行卡认证',
            value:'已认证',
          },
        ]
      },
      {
        title:'信用评估',
        createTime:'',
        list:[
          {
            name:'芝麻信用分',
            value:'780',
          },
          {
            name:'信用报告认证',
            value:'已认证',
          },
          {
            name:'历史逾期次数',
            value:0,
          },
          {
            name:'法院黑名单',
            value:'未命中',
          },
          {
            name:'被执行人名单',
            value:'未命中',
          },
          {
            name:'共享风险名单',
            value:'未命中',
          },
          {
            name:'年龄',
            value:34,
          },
          {
            name:'本地黑名单库',
            value:'未命中',
          },
          {
            name:'本地灰名单',
            value:'未命中',
          },
        ]
      },
      {
        title:'反欺诈报告',
        createTime:'',
        list:[
          {
            name:'使用代理登录',
            value:'未使用',
          },
          {
            name:'登录设备标识确实异常',
            value:'未命中',
          },
          {
            name:'登录发生在凌晨1到5点之间',
            value:'未命中',
          },
          {
            name:'设备登录关联信息较多',
            value:'未命中',
          },
          {
            name:'借款时设备标识异常',
            value:'未命中',
          },
          {
            name:'24小时内设备借款次数超过3次',
            value:'未命中',
          },
          {
            name:'使用代理借款',
            value:'未命中',
          },
          {
            name:'借款手机归属地与IP城市不匹配',
            value:'未命中',
          },
          {
            name:'借款时间发生在凌晨1点到5点之间',
            value:34,
          },
        ]
      },
    ]
    return(
      <PageHeaderWrapper >
        <Card
          bordered={false}
          title={'报告预览'}
        >
        </Card>
        <Row>
          <Col span={5}>资产编号 180630304040333</Col>
          <Col span={4}>姓名 王*</Col>
          <Col span={5}>身份证号 123456789</Col>
          <Col span={5}>报告编号 123456789</Col>
          <Col span={5}>审批结果 自动审核通过</Col>
        </Row>
        <Row>
          <Col span={2}>
            <Affix style={{ position: 'fixed', top: '50%'}}>
              <Anchor>
                {
                  data.map((item,index)=>{
                    return (
                      <Link href={`#list${index}`} key={index} title={item.title} />
                    )
                  })
                }
              </Anchor>
            </Affix>
          </Col>
          <Col span={1}></Col>
          <Col span={18}>
            {
              data.map((item,index)=>{
                return (
                  <div id={`list${index}`} style={{marginBottom:10}} key={index}>
                    <ReportComponent
                      title={item.title}
                      time={item.createTime}
                      dataSource={item.list}
                    />
                  </div>
                )
              })
            }
            <Button type="primary" onClick={()=>router.goBack()}>返回</Button>
          </Col>
        </Row>
      </PageHeaderWrapper>
    )
  }
}