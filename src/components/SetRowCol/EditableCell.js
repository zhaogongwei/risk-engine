import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Form,
  Popconfirm,
  Table,
  Input,
  Select,
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
  //日历监听事件
  onDateChange=(date,record,type) =>{
    record[type]=moment(date).format(dateFormat)
  }
  getInput = () => {
    const { type,dataIndex,cols,record,value,pattern ,max,isFocus} = this.props;
    if (this.props.type === 'select') {
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
    }else if(this.props.type === 'input' || this.props.record['varType']==='num'){
      return <Input
        ref={node => (this.input = node)}
        onPressEnter={this.save}
        onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
        maxLength={max?max+1:''}
      />;
    }else if(this.props.record['varType']==='char'){
      if(this.props.record['enumFlag']){
        return <Select
          style={{width:'100%'}}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
        >
          {
            this.props.record['enumList']&&this.props.record['enumList'].map((item,index)=>{
              return (
                <Option value={item.enumValue} key={index}>{item.enumValue}</Option>
              )
            })
          }
        </Select>;
      }else{
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          maxLength={max?max+1:''}
        />;
      }
    }
  };
  createFormItem = ()=>{
    const { getFieldDecorator } = this.props.form;
    const { type,dataIndex,cols,record,value,pattern ,isFocus} = this.props;
    if (type === 'select') {
      return (
        <FormItem style={{ margin: 0 }}>
          {getFieldDecorator(`${dataIndex}${record['key']}${cols}`, {
            initialValue: record[dataIndex],
            rules:[
              {
                required:true,
                validator: (rule, value, callback) => {
                  if (!value) callback('输入内容不能为空!')
                }
              }
            ]
          })(
            <Select
              onPressEnter={this.save}
              onChange={(e) => this.changeHandler(e, record, dataIndex)}
            >
              {
                value&&value.map((item,index)=>{
                  return (
                    <Option value={item.id} key={index}>{item.name}</Option>
                  )
                })
              }
            </Select>
          )}
        </FormItem>
      );
    }else if(type === 'input' || record['varType']==='num'){
      return (
        <FormItem style={{ margin: 0 }}>
          {getFieldDecorator(`${dataIndex}${record['key']}${cols}`, {
            initialValue: record[dataIndex],
            rules:[
              {
                required:true,
                validator: (rule, value, callback) => {
                  if (!value) callback('输入内容不能为空!')
                }
              }
            ]
          })(
            <Input
              ref={node => (this.input = node)}
              onPressEnter={this.save}
              onChange={(e) => this.changeHandler(e.target.value, record, dataIndex)}
            />
          )}
        </FormItem>
      );
    }else if(record['varType']==='char'){
      if(record['enumFlag']){
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`${dataIndex}${record['key']}${cols}`, {
              initialValue: record[dataIndex],
              rules:[
                {
                  required:true,
                  validator: (rule, value, callback) => {
                    if (!value) callback('输入内容不能为空!')
                  }
                }
              ]
            })(
              <Select
                onPressEnter={this.save}
                onChange={(e) => this.changeHandler(e, record, dataIndex)}
              >
                {
                  record['enumList']&&record['enumList'].map((item,index)=>{
                    return (
                      <Option value={item.enumValue} key={index}>{item.enumValue}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        );
      }else{
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`${dataIndex}${record['key']}${cols}`, {
              initialValue: record[dataIndex],
              rules:[
                {
                  required:true,
                  validator: (rule, value, callback) => {
                    if (!value) callback('输入内容不能为空!')
                    if (value.length>20) callback('输入内容最多20位!')
                  }
                }
              ]
            })(
              <Input
                ref={node => (this.input = node)}
                onPressEnter={this.save}
                onChange={(e) => this.changeHandler(e.target.value, record, dataIndex)}
              />
            )}
          </FormItem>
        );
      }
    }
  }
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
      type,
      value,
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
                  {getFieldDecorator(`${dataIndex}${record['key']}${cols}${record['id']}${record['soleKey']}`, {
                    initialValue: record[dataIndex],
                    rules:[
                      {
                        required:noRequired?false:true,
                        validator: (rule, value, callback) => {
                          const reg = pattern;
                          if(pattern){
                            if(!reg.test(value)){
                              callback(`最多只能输入${max}位的数字!`)
                              return;
                            }
                          }
                          if (!value&&!noRequired) callback('输入内容不能为空!')
                          if (value.length>max) callback(`输入内容最多${max}位!`)
                        }
                      }
                    ]
                  })(this.getInput())}
                </FormItem>
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}