import React, { Component } from 'react'
import {
  Row,
  Col,
  Divider
} from 'antd';
export default class RiskList extends Component{

  render(){
    var  i = 3-this.props.dataSource.length%3;
    if(this.props.dataSource.length%3 !== 0){
      for(var a=0; a<i;a++){
        this.props.dataSource.push({name:'',value:''})
      }
    }
    const style={
      borderTop:'1px dashed #E4E4E4',
      paddingTop:10,
      paddingBottom:10
    }
    const othStyle={
      paddingTop:10,
      paddingBottom:10
    }
    return (
      <div style={{padding:'10px 20px',background:'#F2F2F2'}}>
        <Row type={'flex'} align="bottom">
          <Col span={8} >
            <p style={{width:160,textAlign:'center',margin:0,fontSize:20,color:'#333'}}>{this.props.title}</p>
          </Col>
          <Col pull={5}>{this.props.time?'生成日期':'' }{this.props.time?this.props.time:''}</Col>
        </Row>
        <Row>
        {
          this.props.dataSource.map((item,index)=>{
            return  <Col span={8} style={index>2?style:othStyle} key={index}>
                      <p style={{width:160,textAlign:'center',margin:0}}>{item.name?item.name:'-----'}</p>
                      <p style={{width:160,textAlign:'center',margin:0,color:'#333'}}>{item.value?item.value:'-----'}</p>
                    </Col>
          })
        }
        </Row>
      </div>
    )
  }
}