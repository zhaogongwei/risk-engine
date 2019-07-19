import React from 'react';
import { Row, Col, Button,Input,Form,Modal } from 'antd';
import GGEditor, { Flow,RegisterNode } from 'gg-editor';
import { connect } from 'dva'
import FlowBird from '@/pages/Editor/GGEditor/components/EditorItemPanel/flowBird'
import router from 'umi/router';
//import FlowCircleExtend from '@/pages/Editor/GGEditor/components/EditorItemPanel/flowCircleExtend'
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
      visible:false
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
  submitData = () => {
    console.log(this.myRef.graph.save())
    console.log(this.props.editorFlow.selectId)
  }

  componentDidMount(){
  }
  save=()=>{
    console.log(JSON.stringify({nodeJson:JSON.stringify(this.props.editorFlow.editorData)}))
  }
  render () {
    const { selectId, selectItem, editorData,type } = this.props.editorFlow;
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    console.log(editorData,'=================>editorData')
    console.log(this.props.editorFlow, 'editorFlow')
    return (
      <PageHeaderWrapper>
        <GGEditor className={styles.editor} ref={node => (this.myRefs = node)}>
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
                        {required:true,}
                      ]
                    })(
                      <Input placeholder="请输入版本备注（必填）"/>
                    )}
                  </FormItem>
                </Col>
              </Form>
              <FlowWrapper />
              <p style={{color:'#FF0000',textAlign:'right'}}>最近操作时间：2018-08-08 00:00:00 操作人：  王大大</p>
            </Col>
            <Col span={4} className={styles.editorSidebar}>
              <FlowDetailPanel />
              <div>
                <Row type="flex" justify="center" align="middle" gutter={16} style={{marginBottom:10}}>
                  <Col><Button type="primary" onClick={this.save}>保存</Button></Col>
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
export default FlowPage;
