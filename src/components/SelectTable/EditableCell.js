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
      if(this.props.handleModify){
        this.props.handleModify(this.props.form)
      }
    }
  
    componentWillUnmount() {
      console.log(888)
      if (this.props.editable) {
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    }
    componentWillReceiveProps(newProps){
      /*console.log(777,newProps)
      const {record,dataIndex,tableList,col}=this.props;
      console.log('tableList111',tableList)
      if(!record)return;
      const row = record['row']
      if(!record[dataIndex])return;
      this.changeHandler(record[dataIndex], record, dataIndex,record['row'],col,tableList)*/

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
  
    changeHandler(value, record, type,row,col,tableList) {
      const {colList,rowList} = this.props;
      record['resultVarMap'][type] = value;
      record[type] = value;
      //const row =record['row']
      /*console.log(value, record, type,row,col,tableList)
      this.checkVal(row,col,value,tableList)?
      this.changeVal(row,col,value,tableList):
      tableList.push({row:row,col:col,varValue:value,colVarInfo:colList[col-1],rowVarInfo:rowList[row-1]})*/
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
    //生成新的table
    changeVal=(row,col,val,arr)=>{
      arr.forEach((item,index,array)=>{
        if(item['row']===row&&item['col']===col){
          array[index] = {row:row,col:col,varValue:val,colVarInfo:this.props.colList[col-1],rowVarInfo:this.props.rowList[row-1]}
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
        enumList,
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
      console.log('enumList',enumList)
      return (
        <td ref={node => (this.cell = node)}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  <FormItem style={{ margin: 0,display:'flex',justifyContent:'center' }} {...formItemConfig}>
                    {getFieldDecorator(`dataIndex${Math.random()}`, {
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
                        style={{width:120}}
                        onPressEnter={this.save}
                        onChange={(e) => {this.changeHandler(e, this.props.record, dataIndex,record['row'],col,tableList)}}
                      >
                        {
                          enumList&&enumList.map((item,index)=>{
                            return (
                              <Option value={item.enumValue} key={index}>{item.enumValue}</Option>
                            )
                          })
                        }
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