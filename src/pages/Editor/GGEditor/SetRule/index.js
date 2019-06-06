import React, { PureComponent, Fragment } from 'react';
import { Input, Button, Form } from 'antd';
import { withPropsAPI } from 'gg-editor';
import router from 'umi/router';

const { Item } = Form;

class SetRule extends PureComponent {
  get item() {
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }
  submitData = () => {
    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }

        console.log(item, values)
      });
    }, 0);
  }
  render() {
    const { form } = this.props;
    return (
      <Form>
        <Item label="aaa">
          {form.getFieldDecorator('aaa')(<Input />)}
        </Item>
        <Button onClick={this.submitData}>提交</Button>
      </Form>
    )
  }
}

export default Form.create()(withPropsAPI(SetRule));