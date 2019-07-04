import React from 'react';
import { Row, Col, Button } from 'antd';
import GGEditor, { Flow,RegisterNode } from 'gg-editor';
import { withPropsAPI } from 'gg-editor';
import { connect } from 'dva'
import FlowBird from '../components/EditorItemPanel/flowBird'
import AddEdges from '../components/EditorItemPanel/addEdges'
import FlowWrapper from '../components/EditorItemPanel/flowWrapper'
import EditorMinimap from '../components/EditorMinimap';
import { FlowContextMenu } from '../components/EditorContextMenu';
import { FlowToolbar } from '../components/EditorToolbar';
import { FlowItemPanel } from '../components/EditorItemPanel';
import { FlowDetailPanel } from '../components/EditorDetailPanel';
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
    console.log(this.myRef.graph.find(this.props.editorFlow.selectId))
     // this.myRef.graph.find(this.props.editorFlow.selectId)['model']['fill']="#ffd591"
    // const item = this.myRef.graph.find(this.props.editorFlow.selectId)
  }

  componentDidMount(){
    // console.log(G6)
    // console.log(this.myRefs)
    const { form, propsAPI } = this.props;
    const { read ,save,executeCommand} = propsAPI;
    const data = {
      nodes: [{
        type: 'node',
        size: '80*70',
        shape: 'card',
        color: '#fff',
        label: '云雀',
        x: 55,
        y: 55,
        id: 'ea1184e8',
        index: 0,
        src:'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg'
      }, {
        type: 'node',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '结束节点',
        x: 55,
        y: 255,
        id: '481fbb1a',
        index: 2,
      }],
      edges: [{
        source: 'ea1184e8',
        sourceAnchor: 2,
        target: '481fbb1a',
        targetAnchor: 0,
        id: '7989ac70',
        index: 1,
      }],
    };
  }
  undo=()=>{
    const { form, propsAPI } = this.props;
    const { read ,save,executeCommand} = propsAPI;
    console.log(executeCommand)
    //executeCommand('undo')
  }

  render () {
    console.log(this.props, 'props')
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
              <EditorMinimap />
            </Col>
          </Row>
          <FlowBird />
          <AddEdges />
          <FlowContextMenu />
        </GGEditor>
        <Button type="primary" onClick={this.submitData}>提交</Button>
      </PageHeaderWrapper>
    );
  }
}
export default withPropsAPI(FlowPage);
