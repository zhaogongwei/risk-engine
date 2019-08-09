import React, { PureComponent, Fragment } from 'react';
import { 
  Button,
  Form,
  Popconfirm,
  Table,
  Select,
  Input,
  DatePicker
} from 'antd';
import { connect } from 'dva'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DD'
const FormItem = Form.Item;
const Option = Select.Option;
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
    getInput = () => {
      if (this.props.type === 'select') {
        if(this.props.record['varType']==='num'){
          return <Select
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
          >
            {
              this.props.value&&this.props.value.map((item,index)=>{
                return (
                  <Option value={item.id} key={index}>{item.name}</Option>
                )
              })
            }
          </Select>;
        }else{
          return <Select
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
          >
            {
              this.props.valueOth&&this.props.valueOth.map((item,index)=>{
                return (
                  <Option value={item.id} key={index}>{item.name}</Option>
                )
              })
            }
          </Select>;
        }
      }else if(this.props.type === 'input' && this.props.isFocus){
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          onClick={(e)=>this.props.handleModify()}
          readOnly
        />;
      }else{
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
        />;
      }
    };
    render() {
      const { editing } = this.state;
      const {
        editable,
        dataIndex,
        cols,
        title,
        isRequired,
        pattern,
        record,
        max,
        index,
        handleSave,
        isFocus,
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
                    {getFieldDecorator(`${dataIndex}${record['key']}${cols}`, {
                      initialValue: record[dataIndex]?record[dataIndex]:'',
                      rules:[
                        {
                          required: true,
                          validator: (rule, val, cb) => {
                            console.log('val',val)
                            if (!val) {
                              cb('内容不能为空！')
                              return
                            }
                            if(val.length>10){
                              cb('内容长度不能超过20位!')
                              return
                            }
                          }
                        }
                      ]
                    })(
                      this.getInput()
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