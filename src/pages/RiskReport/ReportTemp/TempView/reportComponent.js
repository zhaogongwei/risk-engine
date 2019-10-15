import React, { Component } from 'react'
import moment from 'moment'
import {
  Row,
  Col,
  Divider,
  Tooltip
} from 'antd';
import './report.less'
export default class ReportComponent extends Component{
  subName=(name)=>{
    let newName;
    if(name&&name.length>20){
      newName=name.substring(0,20)+'...'
    }else{
      newName=name
    }
    return newName;
  }
  render(){
    if(this.props.list&&this.props.list.length){
      for(let item of this.props.list){
        for(let j of item['variable']){
          var num = 6-item['variable'].length%6;
          if(item['variable'].length%6 !==0){
            for(var a=0;a<num;a++){
              item['variable'].push({variableName:'',variableValue:''})
            }
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
    const titleStyle_1={
      background:'#EDF3FB',
    }
    const titleStyle_2={
      background:'#F6F6F6'
    }
    const {list}=this.props;
    return (
      <div style={{paddingLeft:10,paddingRight:10}}>
        {
          list&&list.map((item,index)=>{
            return(
              <div id={`list${index}`} key={index} style={{paddingTop:20}}>
                <div className={'titleWrapper'} style={{marginTop:25,marginBottom:30,}}>
                  <span style={{fontSize:24,color:"#333"}}>{item['title']}</span>
                  <span style={{fontSize:14,color:"#333",marginLeft:20}}>{index===0?`生成日期${moment().format('YYYY-MM-DD HH:mm:ss')}`:null}</span>
                </div>
                <div className={'rptCont'}>
                  <Row type="flex">
                    <Col span={20}>
                      {
                        item['variable']&&item['variable'].map((con,num)=>{
                          return <Col span={4} key={num}>
                            <p className={'titleStyle'} style={index>0?titleStyle_2:titleStyle_1}>{con['variableName']?con['variableName']:'-----'}</p>
                            <div className={'conStyle'}>
                              {
                                con['variableValue']&&con['variableValue'].length>20?
                                  <Tooltip title={con['variableValue']}>
                                    <span>{con['variableValue']?this.subName(con['variableValue']):'-----'}</span>
                                  </Tooltip>:
                                  <span>{con['variableValue']?con['variableValue']:'-----'}</span>
                              }
                            </div>
                          </Col>
                        })
                      }
                    </Col>
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