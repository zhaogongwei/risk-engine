import React, { Component } from 'react';
import { Button } from 'antd'
import  './index.less'

export default class TitleButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children, title, records, num, selectKey, handleTab} = this.props
    return (
      <Button onClick={ handleTab } type={ num === selectKey ? 'primary' : '' }>{ title }</Button>
    )
  }
}