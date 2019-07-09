import React, { PureComponent, Fragment } from 'react';
import { 
  Button,
  Form,
  Popconfirm,
  Table,
  Input,
  Select
} from 'antd';
import { connect } from 'dva'
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
  
    changeHandler(value, record, type,col,tableList) {
      record[type] = value
      const row =record['row']
      console.log(row,col,value)
      this.checkVal(row,col,value,tableList)?this.changeVal(row,col,value,tableList):tableList.push({row:row,col:col,val:value,colList:this.props.colList[col-1],rowList:this.props.rowList[row-1]})
    }
    //查询当前值是否存在
    checkVal=(row,col,val,arr)=>{
      var status = ''
      for(const item of arr){
        if(item['row']===row&&item['col']===col){
          status = 1
          break;
        }else{
          status = 0
        }
      }
      return status;
    }
    changeVal=(row,col,val,arr)=>{
      arr.forEach((item,index,arrary)=>{
        if(item['row']===row&&item['col']===col){
          arrary[index] = {row:row,col:col,val:val,colList:this.props.colList[col-1],rowList:this.props.rowList[row-1]}
        }
      })
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
        tableList,
        editable,
        dataIndex,
        colList,
        rowList,
        col,
        title,
        isRequired,
        pattern,
        record,
        max,
        index,
        handleSave,
        ...restProps
      } = this.props;
      const formItemConfig = {
        labelCol:{span:8},
        wrapperCol:{span:16},
      }
      const { getFieldDecorator } = this.props.form;
      console.log(record,dataIndex,col)
      console.log('tableList',tableList)
      return (
        <td ref={node => (this.cell = node)}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  <FormItem style={{ margin: 0,display:'flex',justifyContent:'center' }} {...formItemConfig}>
                    {getFieldDecorator(dataIndex, {
                      initialValue: record[dataIndex],
                    })(
                      <Select
                        style={{width:120}}
                        onPressEnter={this.save}
                        onChange={(e) => this.changeHandler(e, this.props.record, dataIndex,col,tableList)}
                      >
                        <Option value={1}>审核结果</Option>
                        <Option value={2}>自动审核通过</Option>
                        <Option value={3}>自动审核拒绝</Option>
                        <Option value={4}>人工审核</Option>
                      </Select>
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