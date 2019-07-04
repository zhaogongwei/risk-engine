import React, { PureComponent, Fragment } from 'react';
import { Input, Button, Form } from 'antd';
import { withPropsAPI } from 'gg-editor';
import router from 'umi/router';
import { connect } from 'dva';
import { getQueryString } from '@/utils/utils';

const { Item } = Form;

@connect(({
  editorFlow
}) => ({
  editorFlow
}))

class SetRule extends PureComponent {
  get item() {
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }

  componentDidMount() {
    const { propsAPI } = this.props;
    const { editorData } = this.props.editorFlow;
    if (!Object.keys(editorData).length > 0) router.push('/editor/flow')
  }

  submitData = () => {
    const { form, propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    const { editorData } = this.props.editorFlow;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      // editorData.nodes && editorData.nodes.length && editorData.nodes.map((item, idx) => {
      //   if (item.id === getQueryString('id', this.props.location.search)) {
      //     item.comfig = values
      //   }
      // })
      // this.props.dispatch({
      //   type: 'editorFlow/fetchNotices',
      //   payload: editorData
      // })
      router.push('/editor/flow')
    });
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