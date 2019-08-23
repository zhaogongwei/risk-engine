import React from 'react';
import { Card } from 'antd';
import { ItemPanel, Item } from 'gg-editor';
import styles from './index.less';
import start from '@/assets/start.svg';
import rule from '@/assets/rule.svg';
import complex from '@/assets/complex.svg';
import scoreModel from '@/assets/scoreModel.svg';
import setVar from '@/assets/setVar.svg';
import desModel from '@/assets/desModel.svg';
import query from '@/assets/query.svg';


const FlowItemPanel = () => {
  return (
    <ItemPanel className={styles.itemPanel}>
      <Card bordered={false} >
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',marginTop:40}}>
          <div style={{display:'flex',alignItems:'center',marginBottom:16}}>
            <Item
              type="node"
              size="72*72"
              shape="flow-bird"
              model={{
                label: '开始',
                type: 'start',
                src:start,
                style:[100,16]
              }}
              src={start}
            />
            <span style={{fontSize:16,color:'#101D36',marginLeft:12}}>开始</span>
          </div>
          <div style={{display:'flex',alignItems:'center',marginBottom:16}}>
            <Item
              type="node"
              size="72*72"
              shape="flow-bird"
              model={{
                label: '规则',
                type: 'simple',
                src:rule,
                title:'规则',
                style:[60,16]
              }}
              src={rule}
            />
            <span style={{fontSize:16,color:'#101D36',marginLeft:12}}>规则</span>
          </div>
          <div style={{display:'flex',alignItems:'center',marginBottom:16}}>
            <Item
              type="node"
              size="72*72"
              shape="flow-bird"
              model={{
                label: '复杂规则',
                type: 'complex',
                src:complex,
                title:'复杂规则',
                style:[60,16]
              }}
              src={complex}
            />
            <span style={{fontSize:16,color:'#101D36',marginLeft:12}}>复杂规则</span>
          </div>
          <div style={{display:'flex',alignItems:'center',marginBottom:16}}>
            <Item
              type="node"
              size="72*72"
              shape="flow-bird"
              model={{
                label: '评分模型',
                type: 'score',
                src:scoreModel,
                title:'评分模型',
                style:[60,16]
              }}
              src={scoreModel}
            />
            <span style={{fontSize:16,color:'#101D36',marginLeft:12}}>评分模型</span>
          </div>
          <div style={{display:'flex',alignItems:'center',marginBottom:16}}>
            <Item
              type="node"
              size="72*72"
              shape="flow-bird"
              model={{
                label: '设置变量',
                type: 'setVar',
                src:setVar,
                title:'设置变量',
                style:[60,16]
              }}
              src={setVar}
            />
            <span style={{fontSize:16,color:'#101D36',marginLeft:12}}>设置变量</span>
          </div>
          <div style={{display:'flex',alignItems:'center',marginBottom:16}}>
            <Item
              type="node"
              size="72*72"
              shape="flow-bird"
              model={{
                label: '决策模型',
                type: 'decision',
                src:desModel,
                title:'决策模型',
                style:[60,16]
              }}
              src={desModel}
            />
            <span style={{fontSize:16,color:'#101D36',marginLeft:12}}>决策模型</span>
          </div>
          <div style={{display:'flex',alignItems:'center',marginBottom:16}}>
            <Item
              type="node"
              size="72*72"
              shape="flow-bird"
              model={{
                label: '第三方数据查询',
                type: 'third',
                src:query,
                title:'第三方数据查询',
                style:[60,16]
              }}
              src={query}
            />
            <span style={{fontSize:16,color:'#101D36',marginLeft:12}}>第三方数据查询</span>
          </div>
        </div>
      </Card>
    </ItemPanel>
  );
};

export default FlowItemPanel;
