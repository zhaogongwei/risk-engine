import React, { PureComponent, Fragment } from 'react';
import { 
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
  
  export default class EditableCell extends PureComponent {
    constructor(props){
      super(props)
      this.state = {
          editing: false,
      }
    }
  
    componentDidMount() {
      if (this.props.editable) {
        document.addEventListener('click', this.handleClickOutside, true);
      }
    }
  
    componentWillUnmount() {
      if (this.props.editable) {
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    }
    
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    }

    handleClickOutside = (e) => {
      const { editing } = this.state;
      if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
        this.save();
      }
    }
  
    changeHandler(value, record, type) {
      record[type] = value
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.props.form.validateFields((error, values) => {
        if (error) {

          return;
        }
        this.toggleEdit();
        //handleSave({ ...record, ...values });
      });
    }
    render() {
      const { editing } = this.state;
      const {
        editable,
        dataIndex,
        title,
        isRequired,
        pattern,
        record,
        max,
        index,
        handleSave,
        handleModify,
        ...restProps
      } = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
        <td ref={node => (this.cell = node)}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                      rules: [{
                        required: !isRequired ? true : false,
                        message: `请填写正确的格式.`,
                        pattern:pattern?pattern:'',
                        max:max?max:''
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onChange={(e) => this.changeHandler(e.target.value, this.props.record, dataIndex)}
                        readOnly
                      />
                    )}
                  </FormItem>
                );
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
  }