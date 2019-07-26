import React, { Component } from 'react'
import { Divider } from 'antd'
import styles from './index.less'

export default class PageTitle extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children, title, records } = this.props
    console.log('dnasd', records)
    return (
      <div style={{fontSize: 14}} className="titleButton">
        {title}
      </div>
    )
  }
}