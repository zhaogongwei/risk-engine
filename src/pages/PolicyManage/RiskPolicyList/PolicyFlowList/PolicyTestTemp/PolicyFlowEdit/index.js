import React from 'react';
import { Row, Col, Button,Input,Form,Modal,Card,message, } from 'antd';
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
      updateTime:'',//更新时间
      updateTrueName:'',//操作人
      remark:'',//备注
      mold:0,//0:编辑 1：新增
      flowId:40,//编辑时从策略流列表带过来的，新增时没有
    }
  }
  async componentDidMount(){
    const {query} = this.props.location;
    //const {flowId} = this.props.location.query;
    const {flowId} = this.state;
    if(query['type'])return;
    const res = await this.props.dispatch({
      type: 'editorFlow/queryItemInfo',
      payload: {
        flowId:flowId,
      }
    })
    if(res&&res.status===1){
      const {policyObj} = this.props.editorFlow
      const data = JSON.parse(policyObj['nodeJson'])
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
    const edgesList = data['edges'];
    const nodesList = data['nodes'];
    const nodefineEdges = edgesList.filter((item)=>!item['type'])
    const formData = this.getFormValue();
    const {flowId,mold} = this.state;
    console.log(this.flow.myRef.graph)
    console.log(data)
    this.props.form.validateFields(['remark'],(error,value)=>{
      if(error)return;
      if(!nodesList.length){
        message.error('请设置相关节点!')
        return
      }
      if(edgesList.length&&nodefineEdges.length){
        message.error('请设置连线的相关属性!')
        return
      }
        const res = this.props.dispatch({
          type: 'editorFlow/savePolicyData',
          payload: {
            strategyId:1,
            nodeJson:JSON.stringify(data),
            remark:formData['remark'],
            flowId:mold?null:flowId
          }
        })
        if(res&&res.status===1){
          if(!mold){
            this.setState({
              flowId:res.data.flowId
            })
          }
        }
    })
  }
  save=()=>{
    console.log(JSON.stringify({nodeJson:JSON.stringify(this.props.editorFlow.editorData)}))
  }
  render () {
    const { selectId, selectItem, editorData,type,policyObj } = this.props.editorFlow;
    const { getFieldDecorator } = this.props.form;
    const {mold} = this.state;
    const { updateTrueName,updateTime,remark } = {...policyObj};
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    console.log(editorData,'=================>editorData')
    console.log(this.props.editorFlow, 'editorFlow')
    return (
      <PageHeaderWrapper >
        <Card
          bordered={false}
          title={mold?'新增策略流':'编辑策略流'}
        >
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
                      {getFieldDecorator('remark',{
                        initialValue:remark,
                        rules:[
                          {
                            required:true,
                            max:20,
                            message:'最多输入20位!'
                          }
                        ]
                      })(
                        <Input placeholder="请输入版本备注（必填）" allowClear />
                      )}
                    </FormItem>
                  </Col>
                </Form>
                <FlowWrapper getSubKey={this.getSubKey}/>
                <p style={{color:'#FF0000',textAlign:'right'}}>{updateTime?`最近操作时间:${updateTime}`:null} {updateTrueName?`操作人:${updateTrueName}`:null}</p>
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
            <FlowContextMenu  type={type} remark={this.getFormValue()} mold={this.state.mold} flowId={this.state.flowId}/>
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default FlowPage
