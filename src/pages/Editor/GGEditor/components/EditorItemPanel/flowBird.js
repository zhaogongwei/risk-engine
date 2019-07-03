import React from 'react';
import { RegisterNode } from 'gg-editor';

class FlowBird extends React.Component {
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
        const size = model.size.split('*')
        const width = size[0];
        const height = size[1];
        group.addShape('image', {
          attrs: {
            x: -width/2,
            y: -height/2,
            width,
            height,
            fill:'#c33',
            lineWidth:0,
            shadowColor:'rgba(255, 255, 255, 1)',
            shadowBlur:0,
            // path:this.getPath(item),
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
            stroke:'#fff',
            strokeOpacity:1,
            radius:0,
            fill:'',
            shadowColor:'rgba(255, 255, 255, 1)',
            shadowBlur:100,
            shadowOffsetX:0,
            shadowOffsetY:0,
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
            fill: '#444'
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
      // 锚点的位置
      getAnchorPoints() {
        return  [
          [0,0]
        ]
      },
    };

    return <RegisterNode name="flow-bird" config={config} extend="single-shape" />;
  }
}

export default FlowBird;
