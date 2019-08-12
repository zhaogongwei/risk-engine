import React from 'react';
import { Divider } from 'antd';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';

const FlowToolbar = () => {
  return (
    <Toolbar className={styles.toolbar}>
      <ToolbarButton command="undo" text="回退"/>
      <ToolbarButton command="redo" text="撤销"/>
      <Divider type="vertical" />
      <ToolbarButton command="copy" text="复制"/>
      <ToolbarButton command="paste" text="粘贴"/>
      <ToolbarButton command="delete" text="删除"/>
      <Divider type="vertical" />
      <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
      <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
    </Toolbar>
  );
};

export default FlowToolbar;
