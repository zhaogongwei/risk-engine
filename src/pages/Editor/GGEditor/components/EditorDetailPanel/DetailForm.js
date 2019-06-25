import React, { Fragment } from 'react';
import { Card, Form, Input, Select, Button } from 'antd';
import { withPropsAPI } from 'gg-editor';
import upperFirst from 'lodash/upperFirst';
import { connect } from 'dva'
import router from 'umi/router';

const { Item } = Form;
const { Option } = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};
@connect(({ editorFlow }) => ({
  editorFlow,
}))

class DetailForm extends React.Component {
  get item() {
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }

  componentDidMount(){
    const { form, propsAPI } = this.props;
    const { read ,save,executeCommand} = propsAPI;
    console.log(propsAPI)
    console.log('重新渲染','componentDidMount')
    if(this.props.editorFlow.status){
      read(this.props.editorFlow.editorData)
      this.props.dispatch({
        type:'editorFlow/change',
        payload:false
      })
    }

  }

  componentWillMount(){
    console.log('重新渲染','componentWillMount')
  }

  componentWillUpdate(){
    console.log('重新渲染','componentWillUpdate')
  }

  componentDidUpdate(){
    console.log('重新渲染','componentDidUpdate')
  }

  handleSubmit = e => {
    
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }

        const item = getSelected()[0];
        console.log(item, values)

        if (!item) {
          return;
        }

        executeCommand(() => {
          update(item, {
            ...values,
          });
        });
      });
    }, 0);
  };

  renderEdgeShapeSelect = () => {
    return (
      <Select onChange={this.handleSubmit}>
        <Option value="flow-smooth">Smooth</Option>
        <Option value="flow-polyline">Polyline</Option>
        <Option value="flow-polyline-round">Polyline Round</Option>
      </Select>
    );
  };
  
  setRule = () => {
    const { label, jump } = this.item.getModel();
    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update,save } = propsAPI;

    console.log(propsAPI)
    console.log(this.item)
    const data = save();
    console.log(data,'data')
    const id = getSelected()[0].id
    const selectedItem = getSelected()[0].getModel()
    this.props.dispatch({
      type:'editorFlow/fetchNotices',
      payload:data
    })
    this.props.dispatch({
      type:'editorFlow/saveId',
      payload:id
    })
    this.props.dispatch({
      type:'editorFlow/saveItem',
      payload:selectedItem
    })
    this.props.dispatch({
      type:'editorFlow/change',
      payload:true
    })
    console.log(selectedItem,'666')
    router.push(`/editor/flow/setRule?id=${  jump}`)
  }

  readData = ()=>{
    const { form, propsAPI } = this.props;
    const { read,find} = propsAPI;
    // find(this.props.editorFlow.selectId)['isSelected']=true;
    read(this.props.editorFlow.editorData);

    console.log(find(this.props.editorFlow.selectId))
  }

  renderNodeDetail = () => {
    const { form } = this.props;
    const { label, jump,title } = this.item.getModel();

    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
          initialValue: label
        })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="rule" {...inlineFormItemLayout}>
          {form.getFieldDecorator('rule', {
            initialValue: jump
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="title" {...inlineFormItemLayout}>
          {form.getFieldDecorator('title', {
            initialValue: title
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Button onClick={this.setRule}>设置规则</Button>
      </Fragment>
    );
  };

  renderEdgeDetail = () => {
    const { form } = this.props;
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();

    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        {/* <Item label="Shape" {...inlineFormItemLayout}>
          {form.getFieldDecorator('shape', {
            initialValue: shape,
          })(this.renderEdgeShapeSelect())}
        </Item> */}
      </Fragment>
    );
  };

  renderGroupDetail = () => {
    const { form } = this.props;
    const { label = '新建分组' } = this.item.getModel();

    return (
      <Item label="Label" {...inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={this.handleSubmit} />)}
      </Item>
    );
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }
    return (
      <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
          {type === 'group' && this.renderGroupDetail()}
        </Form>
      </Card>
    );
  }
}

export default Form.create()(withPropsAPI(DetailForm));
