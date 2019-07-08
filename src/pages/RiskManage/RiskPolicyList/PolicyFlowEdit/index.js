import React from 'react';
import { Row, Col, Button } from 'antd';
import GGEditor, { Flow,RegisterNode } from 'gg-editor';
import { connect } from 'dva'
import FlowBird from '@/pages/Editor/GGEditor/components/EditorItemPanel/flowBird'
import FlowCircleExtend from '@/pages/Editor/GGEditor/components/EditorItemPanel/flowCircleExtend'
import FlowWrapper from '@/pages/Editor/GGEditor/components/EditorItemPanel/flowWrapper'
import EditorMinimap from '@/pages/Editor/GGEditor/components/EditorMinimap';
import { FlowContextMenu } from '@/pages/Editor/GGEditor/components/EditorContextMenu';
import { FlowToolbar } from '@/pages/Editor/GGEditor/components/EditorToolbar';
import { FlowItemPanel } from '@/pages/Editor/GGEditor/components/EditorItemPanel';
import { FlowDetailPanel } from '@/pages/Editor/GGEditor/components/EditorDetailPanel';
import styles from './index.less';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

GGEditor.setTrackable(false);
@connect(({ editorFlow,global }) => ({
  editorFlow,
  global
}))

class FlowPage extends React.Component {
  constructor (props) {
    super(props)
  }

  submitData = () => {
    console.log(this.myRef.graph.save())
    console.log(this.props.editorFlow.selectId)
  }

  componentDidMount(){
    console.log(this.props.editorFlow, 'editorFlow')
  }

  render () {
    const { selectId, selectItem, editorData } = this.props.editorFlow
    console.log(editorData,'=================>editorData')
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
              <FlowWrapper />
            </Col>
            <Col span={4} className={styles.editorSidebar}>
              <FlowDetailPanel />
              <div>
                <Row type="flex" justify="center" align="middle" gutter={16} style={{marginBottom:10}}>
                  <Col><Button type="primary">保存</Button></Col>
                  <Col><Button style={{width:100}}>保存并检查</Button></Col>
                </Row>
                <Row type="flex" justify="center" align="middle" gutter={16}>
                  <Col><Button type="primary">导入</Button></Col>
                  <Col><Button style={{width:100}}>返回</Button></Col>
                </Row>
              </div>
              <FlowBird/>
              <FlowCircleExtend/>
              <EditorMinimap />
            </Col>
          </Row>
          <FlowBird />
          <FlowContextMenu selectId={selectId} selectItem={selectItem} />
        </GGEditor>
        <Button type="primary" onClick={this.submitData}>提交</Button>
      </PageHeaderWrapper>
    );
  }
}
export default FlowPage;
