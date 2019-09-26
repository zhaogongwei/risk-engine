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
      const{record,cols,dataIndex,max}=this.props;
      if (this.props.type === 'select') {
        if(this.props.record['varType']==='num'){
          return <Select
            style={{width:70}}
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
            style={{width:70}}
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
          onClick={(e)=>{this.reset(`${dataIndex}${record['key']}${cols}${record['soleKey']}`);this.props.selectVar()}}
          readOnly
        />;
      }else{
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          maxLength={max?max+1:''}
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
        noRequired,
        pattern,
        record,
        max,
        index,
        handleSave,
        isFocus,
        handleModify,
        dataSource,
        only,
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
                          required:noRequired?false:true,
                          validator: (rule, value, callback) => {
                            if (!value&&!noRequired) {
                              callback('输入内容不能为空!')
                              return;
                            }
                            if (value.length>max) {
                              callback(`输入内容不超过${max}位!`)
                              return;
                            }
                            if(only){
                              let ruleCode = dataSource.filter((item)=>item['ruleCode']===value)
                              let onlyruleCode = ruleCode.filter((item)=>item['ruleCode']!=='')
                              if(onlyruleCode.length>1){
                                callback('该值已存在,请重新填写!')
                                return
                              }
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