import React from 'react';
import { Row, Col, Button,Input,Form,Modal } from 'antd';
import GGEditor, { Flow,RegisterNode,withPropsAPI } from 'gg-editor';
import { connect } from 'dva'
import FlowBird from '@/pages/Editor/GGEditor/components/EditorItemPanel/flowBird'
import router from 'umi/router';
import FlowWrapper from '@/pages/Editor/GGEditor/components/EditorItemPanel/flowWrapper'
import EditorMinimap from '@/pages/Editor/GGEditor/components/EditorMinimap';
import { FlowContextMenu } from '@/pages/Editor/GGEditor/components/EditorContextMenu';
import { FlowToolbar } from '@/pages/Editor/GGEditor/components/EditorToolbar';
import { FlowItemPanel } from '@/pages/Editor/GGEditor/components/EditorItemPanel';
import { FlowDetailPanel } from '@/pages/Editor/GGEditor/components/EditorDetailPanel';
import styles from './index.less';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddForm from './addForm';
const FormItem = Form.Item
GGEditor.setTrackable(false);
@Form.create()
@connect(({ editorFlow,global }) => ({
  editorFlow,
  global
}))

class FlowPage extends React.Component {
  constructor (props) {
    super(props);
    this.state={
      visible:false,
      updateTime:'',
      updateTrueName:''
    }
  }
  async componentDidMount(){
    const res = await this.props.dispatch({
      type: 'editorFlow/queryItemInfo',
      payload: {
        strategyFlowId:21,
      }
    })
    if(res&&res.status===1){
      const data = JSON.parse(res.data.nodeJson)
      this.setState({
        updateTime:res.data.updateTime,
        updateTrueName:res.data.updateTrueName,
      })
      this.flow.myRef.graph.read(data)
    }
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  handleOk=()=>{
    this.setState({
      visible:false
    })
  }
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //   获取表单信息
  getFormValue = () => {
    let formQueryData = this.props.form.getFieldsValue()
    return formQueryData;
  }
  //保存策略流数据
  submitData = async () => {
    const data = this.flow.myRef.graph.save();
    const formData = this.getFormValue();
    console.log(this.flow.myRef.graph)
    console.log(data)
    /*this.props.form.validateFields(['variableName'],(error,value)=>{
      if(!error){
        this.props.dispatch({
          type: 'editorFlow/saveItem',
          payload: {
            strategyId:1,
            nodeJson:JSON.stringify(data),
            remark:formData['variableName']
          }
        })
      }
    })*/
  }
  save=()=>{
    console.log(JSON.stringify({nodeJson:JSON.stringify(this.props.editorFlow.editorData)}))
  }
  render () {
    const { selectId, selectItem, editorData,type } = this.props.editorFlow;
    const { getFieldDecorator } = this.props.form;
    const { updateTrueName,updateTime } = this.state;
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    console.log(editorData,'=================>editorData')
    console.log(this.props.editorFlow, 'editorFlow')
    return (
      <PageHeaderWrapper>
        <GGEditor className={styles.editor} >
          <Row type="flex" className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar />
            </Col>
          </Row>
          <Row type="flex" className={styles.editorBd}>
            <Col span={4} className={styles.editorSidebar}>
              <FlowItemPanel />
            </Col>
            <Col span={16} className={styles.editorContent}>
              <Form
                className="ant-advanced-search-form"
              >
                <Col xxl={8} md={12}>
                  <FormItem label="" {...formItemConfig}>
                    {getFieldDecorator('variableName',{
                      initialValue:'',
                      rules:[
                        {
                          required:true,
                          max:20,
                          message:'最多输入20位!'
                        }
                      ]
                    })(
                      <Input placeholder="请输入版本备注（必填）" allowClear/>
                    )}
                  </FormItem>
                </Col>
              </Form>
              <FlowWrapper getSubKey={this.getSubKey}/>
              <p style={{color:'#FF0000',textAlign:'right'}}>最近操作时间：{updateTime} 操作人：  {updateTrueName}</p>
            </Col>
            <Col span={4} className={styles.editorSidebar}>
              <FlowDetailPanel />
              <div>
                <Row type="flex" justify="center" align="middle" gutter={16} style={{marginBottom:10}}>
                  <Col><Button type="primary" onClick={this.submitData}>保存</Button></Col>
                  <Col><Button onClick={()=>this.setState({visible:true})}>导入</Button></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" gutter={16}>
                  <Col><Button onClick={()=>router.goBack()}>返回</Button></Col>
                  <Col span={6}></Col>
                </Row>
              </div>
              <FlowBird/>
              <EditorMinimap />
            </Col>
          </Row>
          <FlowBird />
          <FlowContextMenu selectId={selectId} selectItem={selectItem} type={type}/>
        </GGEditor>
        <Modal
          width="360px"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={()=>this.setState({visible:false})}
        >
        <AddForm
          getSubKey={this.getSubKey}
        />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
export default FlowPage
