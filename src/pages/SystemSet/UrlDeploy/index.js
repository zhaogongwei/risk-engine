import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  Modal,
  message,
  Icon,
  Card,
  Menu,
  Dropdown,
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import Swal from 'sweetalert2'
// 验证权限的组件
import AddForm from './addForm';
import DropdownDetail from '@/components/DropdownDetail/DropdownDetail'
import { findInArr, exportJudgment } from '@/utils/utils'

@connect(({ urldeploy, loading }) => ({
  urldeploy,
  loading: loading.effects['urldeploy/fetchInterfaceList']
}))
export default class UrlDeploy extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
      {
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },
      {
        title: '接口名称',
        dataIndex: 'name',
        key:'name'
      },
      {
        title: '异步通知地址',
        dataIndex: 'asyncNotifiAddress',
        key:'asyncNotifiAddress'
      },
      {
        title: '同步跳转地址',
        key:'syncJumpAddress',
        dataIndex:'syncJumpAddress'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={() => this.addEditPage(true, 2, record)}>
                <Icon type="edit"/>编辑
              </Menu.Item>
              <Menu.Item onClick={()=>this.deleteUrl(record.id)}>
                <Icon type="delete"/>删除
              </Menu.Item>
            </Menu>
          )
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作<Icon type="down"/>
              </a>
            </Dropdown>
          )
        }
      }
      ],
      checkedData: [],
      modalStatus:false,
      type:1,//1:添加 2：编辑
      pageSize:10,
      currPage:1,
      status:1,
    };
  }
  componentDidMount() {
    this.change()
  }
  //  分页器改变页数的时候执行的方法
  onChange = (currPage,pageSize) => {
    this.setState({
      currPage,
      pageSize
    })
    this.change(currPage,pageSize)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'urldeploy/fetchInterfaceList',
      payload: {
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //右上角渲染
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={()=>this.addEditPage(true, 1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  addEditPage=(flag, type, record = {})=>{
    if(type == 2) {
      const { dispatch } = this.props;
      dispatch({
        type: 'urldeploy/viewInfo',
        payload: {
          id: record.id
        }
      })
    }
    

    this.setState({
      id: record.id,
      type,
      visible: !!flag,
    })
  }
  //删除接口
  deleteUrl = async(id) => {
    const { dispatch } = this.props;
    const confirm = await Swal({
      text: '确定要删除该接口吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if (confirm.value) {
      // 请求开启/停用方法
      let res = await dispatch({
        type: 'urldeploy/delInterface',
        payload: {
          id
        }
      })
      if(res && res.status == 1) {
        message.success(res.statusDesc);
        this.change()
      }
    }
  }
  render() {
    const { roleList } =  this.props.urldeploy
    const { type } = this.state;
    const modalParams = {
      type: this.state.type,
      visible: this.state.visible,
      addEditPage: this.addEditPage,
      change: this.change,
      id: this.state.id
    }
    return (
     <PageHeaderWrapper renderBtn={this.renderTitleBtn}>
       <Card
        bordered={false}
        title={'接口配置'}
       >
         <Table
           bordered
           pagination={false}
           columns={this.state.columns}
           dataSource={roleList.records}
           loading={this.props.loading}
         />
         <Pagination
           style={{ marginBottom: "50px" }}
           showQuickJumper
           defaultCurrent={1}
           current={this.state.currPage}
           total={roleList.total}
           onChange={this.onChange}
           showTotal={(total, range) => this.showTotal(total, range)}
         />
         {
           this.state.visible ? 
           <AddForm
            getSubKey={this.getSubKey}
            {...modalParams}
          /> : null
         }
       </Card>
      </PageHeaderWrapper>
    )
  }
}
