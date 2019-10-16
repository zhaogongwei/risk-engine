import React from 'react';
import { Flow,withPropsAPI } from 'gg-editor';
import { message,} from 'antd';
import { connect } from 'dva'
import styles from './index.less';
@connect(({ editorFlow,global }) => ({
  editorFlow,
  global
}))
class FlowWrapper extends React.Component{
  constructor (props) {
    super(props)
    this.state={
      currentId:''
    }
  }
  componentDidMount(){
    this.props.getSubKey(this,'flow')
  }
  apiAction = (command)=>{
    const {propsApI} = this.props;
    console.log(this.props)
    setTimeout(()=>{
      this.props.propsAPI.executeCommand(command)
    },0)
  }
  handleAddItem = (e)=>{
    this.apiAction('undo')
  }
  onChange=(e)=>{
    const {propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    if(e.item && e.model){
      //console.log(e,'e')
      const Nodetype = e.model.type;
      this.props.dispatch({
        type:'editorFlow/saveNodeType',
        payload:Nodetype
      })
      const graph = e.item.graph;
      const group = e.item.group;
      const type = e.item.type;
      /*console.log(e,'e');
      console.log(graph.getEdges());
      console.log(graph.getNodes());
      console.log('getSource',graph.getSource());*/
      //const edges = e.item.getOutEdges();
      //console.log(e.item,'edges')
      const node = type === 'edge'?e.item.getSource():''
      const outEdges = node?node.getOutEdges():''
      const inEdges = node?node.getInEdges():''
      console.log(e.item,'node')
      console.log(node,'node1')
      const nodeType = node['model']?node['model']['type']:'';
      /*console.log(nodeType,'nodeType')
      console.log(outEdges,'outEdges')
      console.log(inEdges,'inEdges')*/
      if(nodeType=='simple'||nodeType=='complex'){
        if(outEdges.length>2){
          message.error('该节点最多只能输出两条线!')
          this.handleAddItem()
        }else if( e.item.type ==='edge'){
          //连线的终点必须是节点
          if(e.item.target.id&&e.item.target.type==='node'){
            executeCommand(() => {
              update(e.item, {
                label:'是',
                type:'Y'
              });
            });
          }else{
            message.error('连线的终点不能为空!')
            this.handleAddItem()
          }
        }
      }else{
        if(outEdges.length>1){
          message.error('该节点最多只能输出一条线!')
          this.handleAddItem()
        }else if( e.item.type ==='edge'){
          //连线的终点必须是节点
          if(e.item.target.id&&e.item.target.type==='node'){
            executeCommand(() => {
              update(e.item, {
                label:'是',
                type:'Y'
              });
            });
          }else{
            message.error('连线的终点不能为空!')
            this.handleAddItem()
          }
        }
      }

    }
  }
  render(){
    return(
        <Flow ref={node =>(this.myRef = node)} className={styles.flow}  data={this.props.editorFlow.editorData} onAfterChange={(e)=>this.onChange(e)}/>
    )
  }
}

export default withPropsAPI(FlowWrapper)
