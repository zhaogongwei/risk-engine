import React from 'react';
import { NodeMenu, EdgeMenu, GroupMenu, MultiMenu, CanvasMenu, ContextMenu } from 'gg-editor';
import MenuItem from './MenuItem';
import SetMenuItem from './SetMenuItem';
import styles from './index.less';

const FlowContextMenu = (props) => {
  console.log(props, 'props')
  const {type,remark}=props
  return (
    <ContextMenu className={styles.contextMenu}>
      <NodeMenu>
        <MenuItem command="copy" text="复制" />
        {(type !=='start'&&type !=='end')&&<SetMenuItem command="copy" text="编辑" remark={remark}/>}
        <MenuItem command="delete" text="删除"/>
      </NodeMenu>
      <EdgeMenu>
        <MenuItem command="delete" text="删除"/>
      </EdgeMenu>
      <GroupMenu>
        <MenuItem command="copy" />
        <MenuItem command="delete" />
        <MenuItem command="unGroup" icon="ungroup" text="Ungroup" />
      </GroupMenu>
      <MultiMenu>
        <MenuItem command="copy" />
        <MenuItem command="paste" />
        <MenuItem command="addGroup" icon="group" text="Add Group" />
        <MenuItem command="delete" />
      </MultiMenu>
      <CanvasMenu>
        <MenuItem command="undo" />
        <MenuItem command="redo" />
        <MenuItem command="pasteHere" icon="paste" text="Paste Here" />
      </CanvasMenu>
    </ContextMenu>
  );
};

export default FlowContextMenu;
