import React, { Component } from 'react'
import { Divider } from 'antd'
import styles from './PageTitle.less'

export default class PageTitle extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children, title, records } = this.props
    console.log('dnasd', records)
    return (
      <div style={{fontSize: 14}} className="pageTitle">
        <div>
          { title ? (
            <div className={styles.titleContain}>
              <i className={styles.line} />
              <span>{ title }</span>
            </div>
          ) : null }
          { records - 0 !== 0 ? <Divider /> : null }
        </div>
        <div>{ children }</div>
      </div>
    )
  }
}