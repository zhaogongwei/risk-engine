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
  console.log(selectedItem)
  if (id && selectedItem.type === 'simple') {
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/setRule?id=${id}`)
  }else if(id && selectedItem.type === 'complex'){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/complex?id=${id}`)
  }else if(id && selectedItem.type === 'score'){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/scoreModel?id=${id}`)
  }else if(id && selectedItem.type === 'setVar'){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/setVar`)
  }else if(id && selectedItem.type === 'desModel'){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/decModel?id=${id}`)
  }else if(id && selectedItem.type === 'query'){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/threeSide?id=${id}`)
  }
  const data = save();
  props.dispatch({
    type:'editorFlow/saveEditorData',
    payload:data
  })
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
