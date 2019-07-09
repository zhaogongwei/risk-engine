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

export default class SelectableTable extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { tableRow,colList,rowList } = this.props.list;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.props.columns.map((col,i,arr) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          colList:colList['dataSource'],
          rowList:rowList['dataSource'],
          col:col.col,
          tableList:this.props.tableList,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          isRequired: col.nonRequired,
          pattern:col.pattern,
          max:col.max
        })
      };
    });

    return (
      <div>
        <Row type="flex" align="middle" style={{marginTop:10,marginBottom: 16}}>
          <Col>
             输出变量设置
          </Col>
          <Col>
            <Button onClick={this.props.setRow} type="primary" style={{marginLeft:10,marginRight:10}}>
              设置行
            </Button>
          </Col>
          <Col>
            <Button onClick={this.props.setCol} type="primary">
              设置列
            </Button>
          </Col>
        </Row>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={tableRow}
          columns={columns}
        />
      </div>
    );
  }
}


