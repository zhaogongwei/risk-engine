import React from 'react';
import { RegisterNode } from 'gg-editor';

class FlowCircleExtend extends React.Component {
  render() {
    const config = {
      draw(item) {
        const keyShape = this.drawKeyShape(item);
        // draw label
        // this.drawLabel(item);
        // this.removeEdge(item);

        // draw image
        const group = item.getGraphicGroup();
        const model = item.getModel();
        console.log(this,'this')
        console.log(item,'item')
        console.log(group,'group')
        console.log(model,'model')
        console.log(this.getStyle(item),'getStyle')
        console.log(this.getSelectedStyle(item),'getSelectedStyle')
        console.log(this.getPath(item),'getPath')
        console.log(item.getEdges(),'getEdges')
        const size = model.size.split('*')
        const width = size[0];
        const height = size[1];
        group.addShape('image', {
          attrs: {
            x: -width/2,
            y: -height/2,
            width,
            height,
            img: model.src,
          }
        });
        /* group.addShape('path',{
          attrs: {
            //  / 1 \
            // 4     2
            //  \ 3 /
            path: [
              ['M', 0, 0 - height / 2], // 上部顶点
              ['L', width / 2, 0], // 右侧点
              ['L', 0, height / 2], // 下部
              ['L', - width / 2, 0], // 左侧
              ['Z'] // 封闭
            ],
            stroke: '#c33',// 颜色应用到边上，如果应用到填充，则使用 fill: cfg.color
          }
        }) */
        group.addShape('path',{
          attrs:{
            path:this.getPath(item),
          }
        })
        group.addShape('text', {
          attrs: {
            x: 0,
            y: height,
            width: model.style[0],
            height: model.style[1],
            textAlign: 'center',
            text: model.label,
            fill: '#c33'
          }
        });
        return keyShape;
      },
      /* getPath(item){
        const model = item.getModel();
        const size = model.size.split('*');
        const width = size[0];
        const height = size[1];
        const path = [
          ['M', 0, 0 - height / 2], // 上部顶点
          ['L', width / 2, 0], // 右侧点
          ['L', width / 2, height / 2], // 下部
          ['L', - width / 2, 0], // 左侧
          ['Z'] // 封闭
        ]
        return path
      }, */
      afterDraw(item){
        console.log(item,'afterDraw')
      },
      update(item){
        console.log(item,'update')
      },
      afterUpdate(item){
        console.log(item,'afterUpdate')
      },
    };

    return <RegisterNode name="flow-circle-extend" config={config} extend="flow-circle" />;
  }
}

export default FlowCircleExtend;
