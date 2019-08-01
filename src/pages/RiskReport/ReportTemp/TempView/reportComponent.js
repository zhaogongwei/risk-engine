import React, { Component } from 'react'
import {
  Row,
  Col,
  Divider
} from 'antd';
export default class ReportComponent extends Component{

  render(){
    for(let item of this.props.list){
      for(let j of item['list']){
        var num = 5-item['list'].length%5;
        if(item['list'].length%5 !==0){
          for(var a=0;a<num;a++){
            item['list'].push({name:'',value:''})
          }
        }
      }
    }
   /* var  i = 5-this.props.dataSource.length%5;
    if(this.props.dataSource.length%5 !== 0){
      for(var a=0; a<i;a++){
        this.props.dataSource.push({name:'',value:''})
      }
    }*/
    const style={
      borderTop:'1px dashed #E4E4E4',
      paddingTop:10,
      paddingBottom:10
    }
    const othStyle={
      paddingTop:10,
      paddingBottom:10
    }
    const {list}=this.props;
    return (
      <div>
        {
          list&&list.map((item,index)=>{
            return(
              <div>
                <div className={'titleWrapper'}>
                  <span>{item['title']}</span>
                  <span>{item['time']?`生成日期${item['time']}`:null}</span>
                </div>
                <div className={'rptCont'}>
                  <Row type="flex">
                    {
                      item['list']&&item['list'].map((con,num)=>{
                        return <Col>
                                  <p>{con['name']?con['name']:'-----'}</p>
                                  <p>{con['value']?con['value']:'-----'}</p>
                               </Col>
                      })
                    }
                  </Row>
                </div>
              </div>
            )
          })
        }
        {/*<Row type={'flex'} align="bottom">
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
        </Row>*/}
      </div>
    )
  }
}