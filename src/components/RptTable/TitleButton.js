import React, { Component } from 'react';
import  './index.less'

export default class TitleButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { children, title, records,num,selectKey,handleTab} = this.props
    return (
      <div className={`titleButton ${num===selectKey?"active":null}`} onClick={handleTab}>
        {title}
      </div>
    )
  }
}