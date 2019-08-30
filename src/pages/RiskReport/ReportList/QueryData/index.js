import React, { Component } from 'react'
import Arfake from './Arfake'
import Dscredit from './Dscredit'
import Dsdebt from './Dsdebt'
import { connect } from 'dva'
import { sleep } from '@/utils/utils'
import TabControl from './tabControl'
import  './index.less'

@connect(({auditAsset}) => ({
  auditAsset
}))

export default class QueryReport extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount () {
  }
  render() {
    return (
      <div className="container">
        <TabControl>
          <div name = "安融个人反欺诈报告">
            <Arfake location={this.props.location}/>
          </div>
          <div name = "大圣信用报告">
            <Dscredit location={this.props.location}/>
          </div>
          <div name = "大圣共债报告" >
            <Dsdebt location={this.props.location}/>
          </div>
          <div name = "返回" state={1}>
          </div>
        </TabControl>
      </div>
    )
  }
}
