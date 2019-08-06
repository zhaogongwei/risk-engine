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
    onInput=(value)=>{
      console.log(this.inputNum)
    }
    getInput = () => {
      debugger;
      if (this.props.type === 'select') {
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
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
          >
            {
              this.props.record['variableEnumList']&&this.props.record['variableEnumList'].map((item,index)=>{
                return (
                  <Option value={item.variableId} key={index}>{item.enumValue}</Option>
                )
              })
            }
          </Select>;
        }else if(this.props.record['variableType'] ==='date'){
          return <DatePicker onChange={(date)=>this.onDateChange(date,this.props.record,this.props.dataIndex)}/>
        }else if(this.props.record['variableType'] ==='time'){
          return <DatePicker showTime onChange={(date)=>this.onDateChange(date,this.props.record,this.props.dataIndex)}/>
        }else{
          return <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
            readOnly
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
                    {getFieldDecorator(`dataIndex${Math.random()}`, {
                      initialValue: record['variableType']==='date'&&dataIndex==='compareValue'?moment(record[dataIndex]?record[dataIndex]:new Date(), dateFormat):record[dataIndex]?record[dataIndex]:'',
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