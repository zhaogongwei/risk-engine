import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Icon,
  Card,
  Menu,
  Dropdown,
  Modal,
} from 'antd';
import Swal from 'sweetalert2'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import permission from '@/utils/PermissionWrapper';
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@permission
@connect(({ varlist, loading }) => ({
  varlist,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class VarList extends PureComponent {
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
        title: '一级分类',
        dataIndex: 'firstTypeName',
        key:'firstTypeName'
      },
      {
        title: '二级分类',
        dataIndex: 'secondTypeName',
        key:'secondTypeName'
      },
      {
        title: '变量名',
        key:'variableName',
        dataIndex:'variableName'
      },
      {
        title: '变量代码',
        key:'variableCode',
        dataIndex:'variableCode'
      },
      {
        title: '变量类型',
        key:'variableTypeStr',
        dataIndex:'variableTypeStr'
      },
      {
        title: '是否枚举',
        key:'enumFlag',
        dataIndex:'enumFlag',
        render:(val)=>{
          return val===1?'是':'否'
        }
      },
      {
        title: '长度',
        key:'variableLength',
        dataIndex:'variableLength',
        render:(val)=>{
          return val==null?'不限':val
        }
      },
      {
        title: '缺省值',
        key:'defaultValue',
        dataIndex:'defaultValue'
      },
      {
        title: '最大值',
        key:'maxValue',
        dataIndex:'maxValue'
      },
      {
        title: '最小值',
        key:'minValue',
        dataIndex:'minValue'
      },
      {
        title: '枚举值',
        key:'variableEnumStr',
        dataIndex:'variableEnumStr'
      },
      {
        title:'状态',
        key:'status',
        dataIndex:'status',
        render:(record)=>record===1?'启用':'禁用'
      },
      {
        title:'更新时间',
        key:'updateTime',
        dataIndex:'updateTime',
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const { permission } =  this.props;
          const action = (
            <Menu>
              {
                permission.includes('re:variable:update')?
                  <Menu.Item onClick={() => this.goAddPage({ ...record, type: 2 })}>
                    <Icon type="edit"/>编辑
                  </Menu.Item> : null
              }
              {
                permission.includes('re:variable:delete')?
                  <Menu.Item onClick={() => this.deleteVar(record)}>
                    <Icon type="delete"/>删除
                  </Menu.Item> : null
              }
              {
                permission.includes('re:variable:inStrategy')?
                  <Menu.Item onClick={() => this.goPolicyList(record)}>
                    <Icon type="snippets"/>应用策略
                  </Menu.Item> : null
              }
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
      }],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1:添加 2：编辑
      pageSize:10,
      id:'',
      status:1,
      visible:false,
      policyList:[],
    };
  }
  componentDidMount = async()=> {
    const query= {...this.props.location.query}
    if(query.parentId && query.parentId!=""){
      //判断如果存在parentId赋值
      await this.props.dispatch({
        type: 'varlist/changefilterIpts',
        payload: {
          firstTypeId:query.parentId || '',
          secondTypeId:query.id || '',
        },
      })
    }
    this.change(this.props.varlist.current);
    this.child && this.child.selectchange(this.props.varlist.filterIpts.firstTypeId)
  }
  //  分页器改变页数的时候执行的方法
  onChange = async(current) => {
    await this.props.dispatch({
      type: 'varlist/changeCurrent',
      payload: {
        current:current
      }
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'varlist/fetchVarList',
      payload: {
      	...this.props.varlist.filterIpts,
      	currPage:currPage,
      	pageSize:pageSize,
      }
    })
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //监听子组件数据变化
  handleChildChange = (newState)=>{
    this.setState({
      modalStatus:newState
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //查询时改变默认页数
  changeDefault=(value)=>{
    this.props.dispatch({
      type: 'varlist/changeCurrent',
      payload: {
        current:value
      }
    })
  }
  //右上角新增
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={()=>this.goAddPage({type:1})}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = (obj={})=>{
    //this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
    let query={
    	id:obj.id||'',
    	type:obj.type
    }
    router.push({
      pathname:'/varManage/varlist/editPage',
      query:query
    })
    
  }
  //去风控策略列表
  goPolicyList = async(record)=>{
    const res=this.props.dispatch({
      type: 'varlist/getStrategy',
      payload: {
        variableId:record['id']
      }
    })
    res.then(value => {
      if(value.status==1){
        if(value.data.length != 0){
          this.state.policyList = value.data
          this.setState({
            visible: true,
          });
        }else{
          message.info( '无应用策略')
        }
        
      }else{
        message.error(value.statusDesc || '操作失败')
      }
     
    })
  }
  policyOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.setState({
      policyList: [],
    });
  };
  //删除变量
  deleteVar=async(record={})=>{
    const confirmVal = await Swal.fire({
      text: '确定要删除该变量吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(confirmVal.value){
			const res=this.props.dispatch({
	      type: 'varlist/delVar',
	      payload: {
	      	variableId:record['id']
	      }
      })
      res.then(value => {
        if(value.status==1){
          message.success('操作成功').then(() => {
            this.change(this.props.varlist.current)
          })
        }else{
          message.error(value.statusDesc || "删除失败")
        }
        
      })
    }
  }

  render() {
    const { permission } =  this.props;
    return (
     <PageHeaderWrapper renderBtn={permission.includes('re:variable:add')?this.renderTitleBtn:null}>
       {
         permission.includes('re:variable:view')?
           <Card bordered={false}>
             <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.props.varlist.current}
                         changeDefault={this.changeDefault}/>
             <Table
               bordered
               pagination={false}
               columns={this.state.columns}
               dataSource={this.props.varlist.varList}
             />
             <Pagination
               style={{ marginBottom: "50px" }}
               showQuickJumper
               defaultCurrent={1}
               current={this.props.varlist.current}
               total={this.props.varlist.total}
               onChange={this.onChange}
               showTotal={(total, range) => this.showTotal(total, range)}
             />
           </Card> : null
       }
        <Modal
          title="应用策略"
          visible={this.state.visible}
          onOk={this.policyOk}
          onCancel={this.policyOk}
        >
          
          {
            this.state.policyList.map((item,key) => <p key={key}>{item}</p>)
          }
        </Modal>
      </PageHeaderWrapper>
    )
  }
}
