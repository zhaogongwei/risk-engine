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
  const { getSelected, save } = props.propsAPI;
  const { remark,flowId,mold } = props
  const id = getSelected()[0].id
  const selectedItem = getSelected()[0].getModel()
  const data = save();
  const edges = data['edges'];
  const nodefineEdges = edges.filter((item)=>!item['type'])
  console.log(selectedItem)
  console.log(nodefineEdges)
  //点击编辑时进行节点保存
  console.log(data)
  if(!remark['remark']){
    message.error('备注不能为空!')
    return;
  }else if(nodefineEdges.length){
    message.error('edges属性没有设置!')
    return;
  }else{
    var res = await props.dispatch({
                type:'editorFlow/savePolicyData',
                payload:{
                  strategyId:1,
                  nodeJson:JSON.stringify(data),
                  remark:remark['remark'],
                  flowId:mold?null:flowId
                }
              })
    props.dispatch({
      type:'editorFlow/saveId',
      payload:id
    })
  }
  if (id && selectedItem.type === 'simple'&&res.status===1) {
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/setRule?id=${id}`)
  }else if(id && selectedItem.type === 'complex'&&res.status===1){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/complex?id=${id}`)
  }else if(id && selectedItem.type === 'score'&&res.status===1){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/scoreModel?id=${id}`)
  }else if(id && selectedItem.type === 'setVar'&&res.status===1){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/setVar?id=${id}`)
  }else if(id && selectedItem.type === 'desModel'&&res.status===1){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/decModel?id=${id}`)
  }else if(id && selectedItem.type === 'query'&&res.status===1){
    router.push(`/policyManage/riskpolicylist/policyFlow/edit/threeSide?id=${id}`)
  }
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
