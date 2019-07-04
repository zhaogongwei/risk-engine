import React from 'react';
import { RegisterBehaviour  } from 'gg-editor';

class addEdges extends React.Component {
  render() {
    const config = {
      getDefaultCfg() {
        return {
          multiple: true
        };
      },
      getEvents() {
        return {
          'node:click': 'onNodeClick',
          'canvas:click': 'onCanvasClick',
          'anchor:mousedown':'onAnchorMouseDown'
        };
      },
      onAnchorMouseDown(e){
        console.log(e,'anchor')
      },
      onNodeClick(e) {
        console.log(e,'e')
        const graph = this.graph;
        const item = e.item;
        if (item.hasState('active')) {
          graph.setItemState(item, 'active', false);
          return;
        }
        // this 上即可取到配置，如果不允许多个active，先取消其他节点的active状态
        if (!this.multiple) {
          this.removeNodesState();
        }
        // 置点击的节点状态为active
        graph.setItemState(item, 'active', true);
      },
      onCanvasClick(e) {
        // shouldUpdate可以由用户复写，返回 true 时取消所有节点的active状态
        if (this.shouldUpdate(e)) {
          removeNodesState();
        }
      },
      removeNodesState() {
        graph.findAllByState('active').forEach(node => {
          graph.setItemState(node, 'active', false);
        });
      }
    };

    return <RegisterBehaviour  name="addEdges" behaviour={config}  />;
  }
}

export default addEdges;
