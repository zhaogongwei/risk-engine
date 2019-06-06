import React from 'react';
import { Row, Col, Button } from 'antd';
import GGEditor, { Flow } from 'gg-editor';
import EditorMinimap from '../components/EditorMinimap';
import { FlowContextMenu } from '../components/EditorContextMenu';
import { FlowToolbar } from '../components/EditorToolbar';
import { FlowItemPanel } from '../components/EditorItemPanel';
import { FlowDetailPanel } from '../components/EditorDetailPanel';
import styles from './index.less';
import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

GGEditor.setTrackable(false);

export default class FlowPage extends React.Component {
  submitData = () => {
    console.log(this.myRef.graph.save())
  }
  render () {
    console.log(this.props, 'props')
    return (
      <PageHeaderWrapper>
        <GGEditor className={styles.editor}>
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
              <Flow ref={ node =>(this.myRef = node)} className={styles.flow} />
            </Col>
            <Col span={4} className={styles.editorSidebar}>
              <FlowDetailPanel />
              <EditorMinimap />
            </Col>
          </Row>
          <FlowContextMenu />
        </GGEditor>
        <Button type="primary" onClick={this.submitData}>提交</Button>
      </PageHeaderWrapper>
    );
  }
}
