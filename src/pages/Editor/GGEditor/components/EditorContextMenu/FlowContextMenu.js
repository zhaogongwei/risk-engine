import React from 'react';
import { NodeMenu, EdgeMenu, GroupMenu, MultiMenu, CanvasMenu, ContextMenu } from 'gg-editor';
import MenuItem from './MenuItem';
import SetMenuItem from './SetMenuItem';
import styles from './index.less';

const FlowContextMenu = (props) => {
  console.log(props, 'props')
  const {nodeType,strategyId,flowId,type,remark}=props
  return (
    <ContextMenu className={styles.contextMenu}>
      <NodeMenu>
        {/*<MenuItem command="copy" text="复制" />*/}
        {(nodeType !=='start'&&nodeType !=='end')&&<SetMenuItem command="copy" text="编辑" type={type} remark={remark}  strategyId={strategyId} flowId={flowId}/>}
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
        <MenuItem command="undo" text="回退"/>
        <MenuItem command="redo" text="撤销"/>
        {/*<MenuItem command="pasteHere" icon="paste" text="粘贴在这里" />*/}
      </CanvasMenu>
    </ContextMenu>
  );
};

export default FlowContextMenu;
