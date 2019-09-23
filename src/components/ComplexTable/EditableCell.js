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
      if (this.props.handleModify) this.props.handleModify(this.props.form)
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
    //清空当前输入框状态
    reset=(name)=>{
      this.props.form.resetFields([name])
    }
    getInput = () => {
      const{record,cols,dataIndex}=this.props;
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
          onClick={(e)=>{this.reset(`${dataIndex}${record['key']}${cols}`);this.props.selectVar()}}
          readOnly
        />;
      }else{
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          maxLength={21}
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
                    {getFieldDecorator(`${dataIndex}${record['key']}${cols}${record['soleKey']}`, {
                      initialValue: record[dataIndex]?record[dataIndex]:'',
                      rules:[
                        {
                          required:true,
                          validator: (rule, value, callback) => {
                            if (!value) callback('输入内容不能为空!')
                            if (value.length>20) callback('输入内容不超过20位!')
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