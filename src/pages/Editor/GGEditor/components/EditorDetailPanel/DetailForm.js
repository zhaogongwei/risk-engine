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
      <Select onChange={this.handleChange}>
        <Option value="Y">是</Option>
        <Option value="N">否</Option>
      </Select>
    );
  };
  handleChange=(e)=>{
    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const item = getSelected()[0];
    const value_y={
      label:'是',
      type:'Y'
    }
    const value_n={
      label:'否',
      type:'N'
    }
    if(e=='Y'){
      this.props.form.setFields({
        label: {
          value: '是'
        },
      });
      executeCommand(() => {
        update(item, value_y);
      });
    }else{
      this.props.form.setFields({
        label: {
          value: '否'
        },
      });
      executeCommand(() => {
        update(item,value_n);
      });
    }
    console.log(e)
    console.log(item)
  }
  renderNodeDetail = () => {
    const { form } = this.props;
    const { label, jump, title } = this.item.getModel();

    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
          initialValue: label,
          rules:[
            {
              max:10,
              message:'最多输入10位!'
            }
          ]
        })(<Input onBlur={this.handleSubmit} />)}
        </Item>
      </Fragment>
    );
  };

  renderEdgeDetail = () => {
    const { form } = this.props;
    const { label = '', type } = this.item.getModel();

    return (
      <Fragment>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={this.handleSubmit} />)}
        </Item>
        <Item label="type" {...inlineFormItemLayout}>
          {form.getFieldDecorator('type', {
            initialValue: type,
          })(this.renderEdgeShapeSelect())}
        </Item>
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
