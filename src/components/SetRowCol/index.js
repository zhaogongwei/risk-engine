import React, { PureComponent, Fragment } from 'react';
import EditableCell from './EditableCell'
import {
  Row,
  Col,
  Button,
  Form,
  Popconfirm,
  Table,
  Input
} from 'antd';
import { connect } from 'dva'

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

@Form.create()

export default class SetRowCol extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { dataSource } = this.props.list;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.props.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          isRequired: col.nonRequired,
          pattern:col.pattern,
          max:col.max,
          type:col.type,
          value:col.value?col.value:null
        })
      };
    });

    return (
      <div>
        <Row type="flex" align="middle" justify="space-between" style={{marginBottom:16}}>
          <Col>
            {this.props.title?this.props.title:''}
          </Col>
          <Col>
            <Button onClick={this.props.handleAdd} type="primary">
              添加
            </Button>
          </Col>
        </Row>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}


