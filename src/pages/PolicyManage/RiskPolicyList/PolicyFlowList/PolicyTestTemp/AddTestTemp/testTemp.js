import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item
const data = [
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
  {
    label:'评分卡得分',
    wrapperType:'input',
    default:999
  },
  {
    label:'年龄',
    wrapperType:'input',
    default:54
  },
  {
    label:'是否有房',
    wrapperType:'select',
    option:[
      {
        id:1,
        value:'是'
      },
      {
        id:2,
        value:'否'
      },
    ],
    default:'否'
  },
  {
    label:'在网时长',
    wrapperType:'input',
    default:4
  },
]
const result = [
  {
    title:'开始',
    content:'开始'
  },
  {
    title:'规则',
    content:'准入规则'
  },
  {
    title:'复杂规则',
    content:'复杂准入规则:否'
  },
  {
    title:'评分卡',
    content:'评分卡得分:900'
  },
  {
    title:'决策模型',
    content:'审核结果:审核通过'
  },
  {
    title:'结束',
    content:'结束'
  },
]
@connect()

@Form.create()
export default class testTemp extends Component {
  //查询
  formSubmit = async (e) => {
    this.props.changeDefault(1)
    const formData = this.getFormValue()
    this.props.dispatch({
      type: 'assetDeploy/riskSubmit',
      data: {
        ...formData,
        "currPage": 1,
        "pageSize": 10
      }
    })

  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:6},
      wrapperCol:{span:14},
    }
    return (
      <PageTableTitle  title={'新增测试模板'}>
        <Form
          className="ant-advanced-search-form"
          labelAlign="left"
        >
          <Row type="flex" align="top"  gutter={16}>
            <Col span={16} style={{marginRight:10}}>
                <Row gutter={24} style={{textAlign:'center',lineHeight:'60px',fontSize:20,backgroundColor:'#F2F2F2',}}>输入变量</Row>
                <Row type="flex" gutter={24} style={{backgroundColor:'#F2F2F2',paddingLeft:80}}>
                  {
                    data.map((item,index)=>{
                      return(
                        <Col span={10} key={index}>
                          {
                            item.wrapperType=='input'?
                              <FormItem label={item.label} {...formItemConfig}>
                                {getFieldDecorator('policyType',{
                                  initialValue:item.default
                                })(
                                  <Input />
                              )}
                              </FormItem>:
                              <FormItem label={item.label} {...formItemConfig}>
                                {getFieldDecorator('modelName',{
                                  initialValue:item.default
                                })(
                                  <Select  allowClear={true}  >
                                    {
                                      item.option.map((item,index)=>{
                                        return (
                                          <Option value={item.id} key={index}>{item.value}</Option>
                                        )
                                      })
                                    }
                                  </Select>
                                )}
                              </FormItem>
                          }
                        </Col>
                      )
                    })
                  }
                </Row>
                <Row gutter={24} style={{backgroundColor:'#F2F2F2',marginTop:10,paddingLeft:80,paddingTop:10,paddingBottom:10}}>
                  <Col span={10}>
                    <FormItem label={'模板标题'} {...formItemConfig}>
                      {getFieldDecorator('policyType',{
                        initialValue:''
                      })(
                        <Input />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row type="flex" gutter={32} justify="center" style={{marginTop:20}}>
                  <Button type="primary">保存并执行测试</Button>
                  <Button type="primary">返回</Button>
                </Row>
            </Col>
            <Col span={6} style={{backgroundColor:'#F2F2F2',minHeight:600}}>
              <Row style={{textAlign:'center',lineHeight:'60px',fontSize:20}}>测试结果</Row>
              <Row type="flex" justify="center">
                <Col span={18}>
                  {
                    result.map((item,index)=>{
                      return (
                        <Row type="flex" align="bottom" style={{marginBottom:20}} key={index}>
                          <Col style={{ width:100,lineHeight:'40px',textAlign:'center',backgroundColor:'#27304D',color:'#fff',fontSize:16,marginRight:20,borderRadius:5}}>{item.title}</Col>
                          <Col>{item.content}</Col>
                        </Row>
                      )
                    })
                  }
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span={18}>
                  <p style={{backgroundColor:'#27304D',color:'#fff',fontSize:16,textAlign:'center',borderRadius:5,lineHeight:'40px'}}>
                    风控报告
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </PageTableTitle>
    )
  }
}
