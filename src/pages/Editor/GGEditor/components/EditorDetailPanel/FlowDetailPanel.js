import React from 'react';
import { Card } from 'antd';
import { NodePanel, EdgePanel, GroupPanel, MultiPanel, CanvasPanel, DetailPanel } from 'gg-editor';
import { connect } from 'dva'
import DetailForm from './DetailForm';
import styles from './index.less';


const FlowDetailPanel = () => {
  return (
    <DetailPanel className={styles.detailPanel}>
      <NodePanel>
        <DetailForm type="node" text="节点"/>
      </NodePanel>
      <EdgePanel>
        <DetailForm type="edge" text="连线"/>
      </EdgePanel>
      <GroupPanel>
        <DetailForm type="group" />
      </GroupPanel>
      <MultiPanel>
        <Card type="inner" size="small" title="Multi Select" bordered={false} />
      </MultiPanel>
      <CanvasPanel>
        <Card type="inner" size="small" title="画布" bordered={false} />
      </CanvasPanel>
    </DetailPanel>
  );
};

export default FlowDetailPanel;
