import React, { Component, Fragment } from 'react'
import { Divider, Button, Icon } from 'antd'
import styles from './PageTitle.less'

export default class PageTitle extends Component {
  constructor(props) {
    super(props)
  }

  reload = () => {
    console.log('do something reload data')
  }

  render() {
    const { children, title, customIcon, records } = this.props
    return (
      <div style={{fontSize: 14}}>
        <div>
          <div className={styles.titleTableHeader}>
            { title && !customIcon ? (
              <div className={styles.titleContain}>
                <i className={styles.line} />
                <span>{ title }</span>
              </div>
            ) : null }
            { title && customIcon ? (
              <div className={styles.titleContain}>
                {customIcon()}
                <span style={{marginLeft: '10px'}}>{ title }</span>
              </div>
            ) : null }
            <div className={styles.titleHeaderSet}>
              { this.props.renderBtn ? this.props.renderBtn() : null }
            </div>
          </div>
          { records === undefined ? <Divider /> : null }
        </div>
        <div>{ children }</div>
      </div>
    )
  }
}