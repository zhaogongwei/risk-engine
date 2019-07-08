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
  if (id && selectedItem.type === 'rule') {
    router.push(`/riskManage/riskpolicylist/flow/setRule?id=${id}`)
  }else if(id && selectedItem.type === 'complex'){
    router.push(`/riskManage/riskpolicylist/flow/complex?id=${id}`)
  }else if(id && selectedItem.type === 'scoModel'){
    router.push(`/riskManage/riskpolicylist/flow/scoreModel?id=${id}`)
  }else if(id && selectedItem.type === 'setVar'){
    router.push(`/editor/flow/setRule?id=${id}`)
  }else if(id && selectedItem.type === 'desModel'){
    router.push(`/editor/flow/setRule?id=${id}`)
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
  const { getSelected, save } = props.propsAPI;
  const id = getSelected()[0].id
  const selectedItem = getSelected()[0].getModel();
  const type = selectedItem.type;
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
