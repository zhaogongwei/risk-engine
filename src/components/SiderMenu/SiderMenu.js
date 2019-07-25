import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import pathToRegexp from 'path-to-regexp';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import { urlToList } from '../_utils/pathTools';

const { Sider } = Layout;

let openKeys = []

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

const findParentPath = (arr, pathname, parent = {}) => {
  arr && arr.forEach((item, idx) => {
    item.parent = parent
    if (item.children && item.children.length) {
      findParentPath(item.children, pathname, item)
    // } else if (item.path === pathname || `/children${item.path}` === pathname) {
    // } else if (pathname.match(item.path)) {
    } else if (pathname.match(item.url)) {
      openKeys = [];
      pushOpenKeys(item)
    }
  })
  return openKeys;
}
/*
 * 功能：
 *     承接findParentPath方法，此方法为递归找到的item，找到其所有父元素，
 *     并将每一层父元素的menuUuid加入到this.openKeys这个变量中，为赋值到menuConfig做好准备
 *
 * @item: Object 需要递归查找其父元素的对象
 *
 * 思路：
 *      首先判断该对象的parent字段是否还存在并且有值，如果有则向openKeys添加menuUid，
 *      并继续调用此函数进行递归，若没有则不进行操作
 */
const pushOpenKeys = (item) => {
  if (item.parent && item.parent.url) {
    openKeys.push(item.parent.url)
    openKeys.push(item.url)
    pushOpenKeys(item.parent)
  }
}

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.url);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, url) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(url))),
    []
  );

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: findParentPath(props.menuData, props.location.pathname),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: findParentPath(props.menuData, props.location.pathname),
      };
    }
    return null;
  }

  

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.url === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo} id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>智能风控引擎</h1>
          </Link>
        </div>
        <BaseMenu
          {...this.props}
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%', overflowX: 'hidden' }}
          {...defaultProps}
        />
      </Sider>
    );
  }
}
