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
const dateFormatTime = 'YYYY-MM-DD HH:mm:ss'
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
      console.log(value,record,type)
      record[type] = value
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.props.form.validateFields((error, values) => {
        console.log(error,values)
        if (error) {

          return;
        }
        this.toggleEdit();
        //handleSave({ ...record, ...values });
      });
    }
    //日历监听事件
    onDateChange=(date,record,type) =>{
      record[type]=moment(date).format(dateFormat)
    }
    //时间监听事件
    onTimeChange=(date,record,type)=>{
      console.log(date)
      record[type]=moment(date).format(dateFormatTime)
    }
    getInput = () => {
      if (this.props.type === 'select') {
        return <Select
          style={{width:'100%'}}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
        >
          {
            this.props.record['variableType']==='num'?
            this.props.value&&this.props.value.map((item,index)=>{
              return (
                <Option value={item.id} key={index}>{item.name}</Option>
              )
            }):this.props.valueOther&&this.props.valueOther.map((item,index)=>{
              return (
                <Option value={item.id} key={index}>{item.name}</Option>
              )
            })
          }
        </Select>;
      }else if(this.props.type === 'input' && this.props.isFocus){
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          //onClick={(e)=>this.props.handleModify()}
          readOnly
        />;
      }else if(this.props.type==='more'){
        if(this.props.record['variableType']==='num'){
          return <Input
            ref={node => (this.inputNum = node)}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          />;
        }else if(this.props.record['variableType']==='char'&&!this.props.record['enumFlag']){
          return <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          />;
        }else if(this.props.record['enumFlag']){
          return <Select
            style={{width:'100%'}}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
          >
            {
              this.props.record['variableEnumList']&&this.props.record['variableEnumList'].map((item,index)=>{
                return (
                  <Option value={item.enumValue} key={index}>{item.enumShow}</Option>
                )
              })
            }
          </Select>;
        }else if(this.props.record['variableType'] ==='date'){
          return <DatePicker
                    onPressEnter={this.save}
                    style={{width:'100%'}}
                    onChange={(date)=>this.onDateChange(date,this.props.record,this.props.dataIndex)}
                  />
        }else if(this.props.record['variableType'] ==='time'){
          return <DatePicker
                    showTime
                    onPressEnter={this.save}
                    style={{width:'100%'}}
                    onChange={(date)=>this.onTimeChange(date,this.props.record,this.props.dataIndex)}/>
        }else{
          return <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          />;
        }
      }else{
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
        />;
      }
    };
    createFormItem = ()=>{
      const { getFieldDecorator } = this.props.form;
      const { type,dataIndex,cols,record,value,valueOther,pattern ,isFocus} = this.props;
      if(type === 'select'){
        return(
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
              initialValue: record[dataIndex]?record[dataIndex]:'',
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
                style={{width:70}}
                onPressEnter={this.save}
                onChange={(e) => this.changeHandler(e, record, dataIndex)}
              >
                {
                  record['variableType']==='num'?
                    value&&value.map((item,index)=>{
                      return (
                        <Option value={item.id} key={index}>{item.name}</Option>
                      )
                    }):valueOther&&valueOther.map((item,index)=>{
                    return (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        )
      }else if(type === 'input' && isFocus){
        return(
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
              initialValue: record[dataIndex]?record[dataIndex]:'',
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
                //onClick={(e)=>this.props.handleModify()}
                readOnly
              />
            )}
          </FormItem>
        )
      }else if(type==='more'){
        if(record['variableType']==='num'){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
                initialValue: record[dataIndex]?record[dataIndex]:'',
                rules:[
                  {
                    pattern:pattern,
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
                  maxLength={21}
                />
              )}
            </FormItem>
          )
        }else if(record['variableType']==='char'&&!record['enumFlag']){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
                initialValue: record[dataIndex]?record[dataIndex]:'',
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
                  maxLength={21}
                />
              )}
            </FormItem>
          )
        }else if(record['enumFlag']){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
                initialValue: record[dataIndex]?record[dataIndex]:'',
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
                  style={{width:'100%'}}
                  onPressEnter={this.save}
                  onChange={(e) => this.changeHandler(e, record, dataIndex)}
                >
                  {
                    record['variableEnumList']&&record['variableEnumList'].map((item,index)=>{
                      return (
                        <Option value={item.enumValue} key={index}>{item.enumShow}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
          )
        }else if(record['variableType'] ==='date'){
          const initData = record[dataIndex]?moment(record[dataIndex]):null
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
                initialValue: initData,
                rules:[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) callback('输入内容不能为空!')
                    }
                  }
                ]
              })(
                <DatePicker
                  style={{width:'100%'}}
                  onChange={(date)=>this.onDateChange(date,record,dataIndex)}
                />
              )}
            </FormItem>
          )
        }else if(record['variableType'] ==='time'){
          const initData = record[dataIndex]?moment(record[dataIndex]):null
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
                initialValue: initData,
                rules:[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) callback('输入内容不能为空!')
                    }
                  }
                ]
              })(
                <DatePicker
                  showTime
                  style={{width:'100%'}}
                  onChange={(date)=>this.onTimeChange(date,record,dataIndex)}/>
              )}
            </FormItem>
          )
        }else{
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
                initialValue:record[dataIndex],
                rules:[
                  {
                    required: true,
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
                  readOnly
                />
              )}
            </FormItem>
          )
        }
      }else{
        return(
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`dataIndex${record['key']}${cols}${record['soleKey']}`, {
              initialValue:record[dataIndex],
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
                maxLength={21}
              />
            )}
          </FormItem>
        )
      }
    }
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
                  this.createFormItem()
                )
                /*return (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                      initialValue: (record['varType']==='date'||record['varType']==='time')&&dataIndex==='compareValue'?moment(record[dataIndex]):record[dataIndex]?record[dataIndex]:'',
                      rules:[
                        {
                          pattern:record['varType']==='num'?pattern:/^.*$/,
                          message:record['varType']==='num'?'只能输入3位的数字!':'',
                        }
                      ]
                    })(
                      this.getInput()
                    )}
                  </FormItem>
                );*/
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
  }