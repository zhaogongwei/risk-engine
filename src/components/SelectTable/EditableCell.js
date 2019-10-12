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
        cols,
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
      console.log(record,dataIndex,cols)
      console.log('tableList',tableList)
      console.log('enumList',enumList)
      let enumValueList = [];
      enumList&&enumList.map((item,index)=>{
        enumValueList.push(item['enumValue'])
      })
      let status = enumValueList.find(item=>item==record[dataIndex])
      console.log('enumValueList',enumValueList)
      return (
        <td ref={node => (this.cell = node)}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  <FormItem style={{ margin: 0,display:'flex',justifyContent:'center' }} {...formItemConfig}>
                    {getFieldDecorator(`${dataIndex}${record['key']}${cols}${record['soleKey']}`, {
                      initialValue: status?record[dataIndex]?record[dataIndex]:'':'',
                      rules:[
                        {
                          required:true,
                          validator: async(rule, value, callback) => {
                            if (!value) callback('输入内容不能为空!')
                          }
                        }
                      ]
                    })(
                      <Select
                        style={{width:120}}
                        onPressEnter={this.save}
                        onChange={(e) => {this.changeHandler(e, this.props.record, dataIndex,record['row'],cols,tableList)}}
                      >
                        {
                          enumList&&enumList.map((item,index)=>{
                            return (
                              <Option value={item.enumValue} key={index}>{item.enumShow}</Option>
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