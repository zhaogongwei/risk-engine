import React, { Component, Fragment } from 'react'
import styles from './DropdownDetail.less'
import classNames from 'classnames'
import { Icon, Menu, Dropdown, Button } from 'antd'
import { withRouter } from 'react-router'

@withRouter

export default class DropdownDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showArr: true
    }
  }
  hoverDetail = (e) => {
    this.setState({
      showArr: false
    })
  }
  leaveDetail = (e) => {
    this.setState({
      showArr: true
    })
  }
  hrefLink = (link) => {
    this.props.history.push(link)
  }
  // 遍历props中的linkArr，分析其中的标志位show，返回有效的linkArr数组
  getTrueLinkArr = () => {
    let linkArr = []
    if (this.props.linkArr && this.props.linkArr.length) {
      this.props.linkArr.map(item => {
        if (item.show !== false) linkArr.push(item)
      })
    }
    return linkArr
  }
  dropdownOperation(linkArr) {
    let menu = (
      <Menu>
        {linkArr && linkArr.length > 0 && linkArr.map((item, index) => (
          <Menu.Item key={index}>
            <a onClick={item.clickHandler}>{item.label}</a>
          </Menu.Item>
        ))}
      </Menu>
    );
    return menu;
  }
  componentDidMount() {
  }
  render() {
    // 遍历props的值，并且筛选出show为false的值，将有效元素push到state中
    const linkArr = this.getTrueLinkArr()
    return(
      <Fragment>
        {
          linkArr.length > 1 ? (
            <Dropdown overlay={this.dropdownOperation(linkArr)}>
              <a className="ant-dropdown-link">
                操作<Icon type="down" />
              </a>
            </Dropdown>
          ) : linkArr.length === 1?<a onClick={linkArr[0].clickHandler}>{linkArr[0].label}</a>:''
        }
      </Fragment>
    )
  }
}