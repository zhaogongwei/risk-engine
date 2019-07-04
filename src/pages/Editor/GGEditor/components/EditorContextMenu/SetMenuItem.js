import React from 'react';
import { Command, withPropsAPI } from 'gg-editor';
import upperFirst from 'lodash/upperFirst';
import IconFont from '../../common/IconFont';
import styles from './index.less';
import router from 'umi/router';
import { connect } from 'dva'

const change = (props) => {
  const { getSelected, save } = props.propsAPI;
  const id = getSelected()[0].id
  const selectedItem = getSelected()[0].getModel()
  if (id && selectedItem.shape === 'flow-circle') {
    router.push(`/editor/flow/setRule?id=${id}`)
  }
  const data = save();
  props.dispatch({
    type:'editorFlow/fetchNotices',
    payload:data
  })
  props.dispatch({
    type:'editorFlow/saveId',
    payload:id
  })
  props.dispatch({
    type:'editorFlow/saveItem',
    payload:selectedItem
  })
  props.dispatch({
    type:'editorFlow/change',
    payload:true
  })
}

const SetMenuItem = props => {
  const { command, icon, text } = props;
  return (
    <div className={styles.item} onClick={() => change(props)}>
      <IconFont type={`icon-${icon || command}`} />
      <span>{text}</span>
    </div>
  );
};

export default withPropsAPI(connect(({
  editorFlow
}) => ({
  editorFlow
}))(SetMenuItem));
