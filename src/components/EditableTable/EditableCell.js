import React, { PureComponent, Fragment } from 'react';
import { 
  Button,
  Form,
  Popconfirm,
  Table,
  Input,
  message,
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
    validateFields(value, record, type){
      const {dataSource,only} = this.props;
      if(dataSource&&dataSource.length>0){
        if(only){
          dataSource.forEach((item,index)=>{
            if(item['key']!==record['key'] && item[type]===value){
              value=''
              record[type] = ''
              message.error('该值已存在,不能重复添加!',1)
            }else{
              record[type] = value
            }
          })
        }
      }
      this.props.enumListSave?this.props.enumListSave(record):null
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
    checkInput=(value, record, type)=>{
      this.props.form.validateFields([type],(error, values) => {
        //验证 1：不通过，2：通过
        if(error){
          record[type]='error'
        }else{
          record[type] = value
        }
      })
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
                    {getFieldDecorator(`${dataIndex}${Math.random()}`, {
                      rules: [{
                        required: !isRequired ? true : false,
                        message: `请填写正确的格式.`,
                        pattern:pattern?pattern:'',
                        max:max?max:''
                      }],
                      initialValue: record[dataIndex]?record[dataIndex]:'',
                    })(
                      <Input
                        maxLength={max?max:''}
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onChange={(e) => this.changeHandler(e.target.value, this.props.record, dataIndex)}
                        //onBlur={(e)=>this.props.enumListSave?this.props.enumListSave(record):null}
                        onBlur={(e)=>this.validateFields(e.target.value, this.props.record, dataIndex)}
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