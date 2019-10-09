import React from 'react';
import { Command, withPropsAPI } from 'gg-editor';
import {message } from 'antd';
import upperFirst from 'lodash/upperFirst';
import IconFont from '../../common/IconFont';
import styles from './index.less';
import router from 'umi/router';
import { connect } from 'dva'

const change =async props => {
  console.log('props',props)
  const { getSelected, save, } = props.propsAPI;
  const { strategyId,flowId,type,remark,submitData } = props
  const id = getSelected()[0].id
  const selectedItem = getSelected()[0].getModel();
  const nodeTitle = selectedItem['label'];
  //点击编辑时进行节点保存
  submitData()
    .then(res=>{
      if (id && selectedItem.type === 'simple'&&res.status === 1) {
        router.push(`/policyManage/riskpolicylist/policyFlow/edit/setRule?id=${id}&strategyId=${strategyId}&title=${nodeTitle}`)
      }else if(id && selectedItem.type === 'complex'&&res.status === 1){
        router.push(`/policyManage/riskpolicylist/policyFlow/edit/complex?id=${id}&strategyId=${strategyId}&title=${nodeTitle}`)
      }else if(id && selectedItem.type === 'score'&&res.status === 1){
        router.push(`/policyManage/riskpolicylist/policyFlow/edit/scoreModel?id=${id}&strategyId=${strategyId}&title=${nodeTitle}`)
      }else if(id && selectedItem.type === 'setVar'&&res.status === 1){
        router.push(`/policyManage/riskpolicylist/policyFlow/edit/setVar?id=${id}&strategyId=${strategyId}&title=${nodeTitle}`)
      }else if(id && selectedItem.type === 'decision'&&res.status === 1){
        router.push(`/policyManage/riskpolicylist/policyFlow/edit/decModel?id=${id}&strategyId=${strategyId}&title=${nodeTitle}`)
      }else if(id && selectedItem.type === 'third'&&res.status === 1){
        router.push(`/policyManage/riskpolicylist/policyFlow/edit/threeSide?id=${id}&strategyId=${strategyId}&title=${nodeTitle}`)
      }
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
