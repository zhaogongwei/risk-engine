export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/default' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/default',
            name: '默认页',
            component: './Dashboard',
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu:true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      //  editor
      //变量管理
      {
        name:'varManage',
        icon:'highlight',
        path:'/varManage',
        routes:[
          //变量分类
          {
            path: '/varManage/varclass',
            name: 'varclass',
            component: './VarManage/VarClass',
          },
          //变量列表
          {
            path: '/varManage/varlist',
            name: 'varlist',
            component: './VarManage/VarList',
          },
          //变量添加、编辑
          {
            path: '/varManage/varlist/editPage',
            name: 'varedit',
            component: './VarManage/VarList/EditVar',
            hideInMenu:true
          },
        ]
      },
      //策略管理
      {
        name:'policyManage',
        icon:'highlight',
        path:'/policyManage',
        routes:[
          //风控策略列表
          {
            name: 'policylist',
            path:'/policyManage/riskpolicylist',
            routes:[
              {
                path: '/policyManage/riskpolicylist',
                redirect:'/policyManage/riskpolicylist/list'
              },
              //风控策略列表
              {
                path: '/policyManage/riskpolicylist/list',
                name: 'list',
                component: './PolicyManage/RiskPolicyList',
              },
              //风控策略列表添加、编辑
              {
                path: '/policyManage/riskpolicylist/list/edit',
                name: 'edit',
                component: './PolicyManage/RiskPolicyList/PolicyEdit',
                hideInMenu:true
              },
              //风控策略列表、输入输出配置
              {
                path: '/policyManage/riskpolicylist/list/deploy',
                name: 'deploy',
                component: './PolicyManage/RiskPolicyList/InputDeploy',
                hideInMenu:true
              },
              //风控标签
              {
                path: '/policyManage/riskpolicylist/risklabel',
                name: 'risklabel',
                component: './PolicyManage/RiskPolicyList/RiskLabel',
              },
              //风控标签 >新增/编辑
              {
                path: '/policyManage/riskpolicylist/risklabel/edit',
                name: 'edit',
                component: './PolicyManage/RiskPolicyList/RiskLabel/LabelEdit',
                hideInMenu:true

              },
              //策略流列表
              {
                path: '/policyManage/riskpolicylist/policyFlow',
                name: 'policyFlow',
                routes:[
                  {
                    path: '/policyManage/riskpolicylist/policyFlow',
                    redirect:'/policyManage/riskpolicylist/policyFlow/list'
                  },
                  //策略流列表
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/list',
                    name: 'list',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList',
                  },
                  //策略测试模板
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/test',
                    name: 'test',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp',
                  },
                  //新增测试模板
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/test/add',
                    name: 'add',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/AddTestTemp/testTemp',
                    hideInMenu:true,
                  },
                  //策略流编辑>策略流
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/edit',
                    name: 'policyFlowEdit',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/PolicyFlowEdit',
                  },
                  //策略流编辑>设置规则
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/edit/setRule',
                    name: 'setRule',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/PolicyFlowEdit/Rule',
                    hideInMenu:true,
                  },
                  //策略流编辑>复杂规则
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/edit/complex',
                    name: 'complex',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/PolicyFlowEdit/ComplexRule',
                    hideInMenu:true,
                  },
                  //策略流编辑>评分卡
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/edit/scoreModel',
                    name: 'scoreModel',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/PolicyFlowEdit/ScoreModel',
                    hideInMenu:true,
                  },
                  //策略流编辑>决策模型
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/edit/decModel',
                    name: 'decModel',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/PolicyFlowEdit/DecisModel',
                    hideInMenu:true,
                  },
                  //策略流编辑>设置变量
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/edit/setVar',
                    name: 'setVar',
                    component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/PolicyFlowEdit/SetVar',
                    hideInMenu:true,
                  },
                  //策略流编辑>三方数据查询
                  {
                    path: '/policyManage/riskpolicylist/policyFlow/edit/threeSide',
                    name: 'threeSide',
                  component: './PolicyManage/RiskPolicyList/PolicyFlowList/PolicyTestTemp/PolicyFlowEdit/ThreeSideQuery',
                    hideInMenu:true,
                  },
                ]
              },
            ]
          }
        ]
      },
      //黑名单管理
      {
        name:'nameManage',
        icon:'highlight',
        path:'/nameManage',
        routes:[
          //本地灰名单库
          {
            name:'greyName',
            icon: 'highlight',
            path: '/nameManage/greyName/list',
            component:'./NameManage/GreyNameList'
          },
          //本地黑名单库
          {
            name:'blackName',
            icon: 'highlight',
            path: '/nameManage/blackName/list',
            component:'./NameManage/BlackNameList'
          },
        ]
      },
      //风控报告
      {
        name:'riskReport',
        icon: 'highlight',
        path: '/riskReport',
        routes:[
          {
            path:'/riskReport/reportList',
            redirect:'/riskReport/reportList/list',
          },
          //风控报告列表
          {
            path:'/riskReport/reportList/list',
            name:'reportList',
            component:'./RiskReport/ReportList'
          },
          //风控列表>三方数据查询
          {
            path:'/riskReport/reportList/list/queryData',
            name:'queryData',
            component:'./RiskReport/ReportList/QueryData',
            hideInMenu:true
          },
          //风控列表>查看
          {
            path:'/riskReport/reportList/list/check',
            name:'check',
            component:'./RiskReport/ReportList/RiskReport',
            hideInMenu:true
          },
          //风控报告模板
          {
            path:'/riskReport/reportList/mould',
            name:'mould',
            component:'./RiskReport/ReportTemp'
          },
          {
            //风控报告模板>新增/编辑
            path:'/riskReport/reportList/mould/edit',
            name:'edit',
            component:'./RiskReport/ReportTemp/TempEdit',
            hideInMenu:true
          },
          {
            //风控报告模板>报告预览
            path:'/riskReport/reportList/mould/preview',
            name:'preview',
            component:'./RiskReport/ReportTemp/TempView',
            hideInMenu:true
          },
        ]
      },
      //系统设置
      {
        name:'systemSet',
        icon: 'highlight',
        path: '/system',
        routes:[
          {
            //角色管理
            path:'/system/role',
            name:'roleManage',
            component:'./SystemSet/RoleManage'
          },
          {
            //账号管理
            path:'/system/user',
            name:'accountManage',
            component:'./SystemSet/AccountManage'
          },
          //策略权限
          {
            path:'/systemSet/accountManage/policyPower',
            name:'policyPower',
            component:'./SystemSet/AccountManage/PolicyPower',
            hideInMenu:true
          },
          //接口配置
          {
            path:'/system/interface',
            name:'urlDeploy',
            component:'./SystemSet/UrlDeploy'
          },
          //商户秘钥
          {
            path:'/system/secretkey',
            name:'secretKey',
            component:'./SystemSet/SecretKey'
          }
        ]
      },
      {
        component: '404',
      },
    ],
  },
];
