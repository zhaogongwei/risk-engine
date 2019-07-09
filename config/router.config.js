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
      { path: '/', redirect: '/riskManage/varclass', /*authority: ['admin', 'user']*/ },
      /*{
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },*/
      // forms
      /*{
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },*/
      // list
      /*{
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },*/
      /*{
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },*/
     /* {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },*/
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
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
      /*{
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },*/
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [
          {
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/flow/setRule',
            name: 'setrule',
            component: './Editor/GGEditor/SetRule',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
          {
            path: '/editor/koniss',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },
      //风险管理
      {
        name:'riskManage',
        icon: 'highlight',
        path: '/riskManage',
        routes:[
          //变量分类
          {
            path: '/riskManage/varclass',
            name: 'varclass',
            component: './RiskManage/VarClass',
          },
          //变量列表
          {
            path: '/riskManage/varlist',
            name: 'varlist',
            component: './RiskManage/VarList',
          },
          //变量添加、编辑
          {
            path: '/riskManage/varlist/editPage',
            name: 'varedit',
            component: './RiskManage/VarList/EditVar',
            hideInMenu:true
          },
          //风控策略列表
          {
            path: '/riskManage/riskpolicylist',
            name: 'policylist',
            routes:[
              {
                path: '/riskManage/riskpolicylist',
                redirect:'/riskManage/riskpolicylist/list'
              },
              //风控策略列表
              {
                path: '/riskManage/riskpolicylist/list',
                name: 'list',
                component: './RiskManage/RiskPolicyList',
              },
              //风控策略列表添加、编辑
              {
                path: '/riskManage/riskpolicylist/list/edit',
                name: 'edit',
                component: './RiskManage/RiskPolicyList/PolicyEdit',
                hideInMenu:true
              },
              //风控标签
              {
                path: '/riskManage/riskpolicylist/risklabel',
                name: 'risklabel',
                component: './RiskManage/RiskPolicyList/RiskLabel',
              },
              //策略流编辑
              {
                path: '/riskManage/riskpolicylist/flow/editor',
                name: 'flow',
                component: './RiskManage/RiskPolicyList/PolicyFlowEdit',
              },
              //策略流编辑>设置规则
              {
                path: '/riskManage/riskpolicylist/flow/setRule',
                name: 'setRule',
                component: './RiskManage/RiskPolicyList/PolicyFlowEdit/Rule',
                hideInMenu:true
              },
              //策略流编辑>复杂规则
              {
                path: '/riskManage/riskpolicylist/flow/complex',
                name: 'complex',
                component: './RiskManage/RiskPolicyList/PolicyFlowEdit/ComplexRule',
                hideInMenu:true
              },
              //策略流编辑>评分模型
              {
                path: '/riskManage/riskpolicylist/flow/scoreModel',
                name: 'scoreModel',
                component: './RiskManage/RiskPolicyList/PolicyFlowEdit/ScoreModel',
                hideInMenu:true
              },
              //策略流编辑>设置变量
              {
                path: '/riskManage/riskpolicylist/flow/setVar',
                name: 'setVar',
                component: './RiskManage/RiskPolicyList/PolicyFlowEdit/SetVar',
                hideInMenu:true
              },
              //策略流编辑>决策模型
              {
                path: '/riskManage/riskpolicylist/flow/decisModel',
                name: 'decisModel',
                component: './RiskManage/RiskPolicyList/PolicyFlowEdit/DecisModel',
                hideInMenu:true
              }
            ]
          },
          //风控报告模板
          {
            path: '/riskManage/riskrptem',
            name: 'riskrptem',
            routes:[
              //列表
              {
                path:'/riskManage/riskrptem',
                redirect:'/riskManage/riskrptem/list',
              },
              {
                path:'/riskManage/riskrptem/list',
                name:'list',
                component:'./RiskManage/RiskRptTem',
              },
              //新增、编辑
              {
                path:'/riskManage/riskrptem/list/edit',
                name:'edit',
                component:'./RiskManage/RiskRptTem/TempEdit',
                hideInMenu:true
              },
              //报告预览
              {
                path:'/riskManage/riskrptem/list/preview',
                name:'preview',
                component:'./RiskManage/RiskRptTem/riskReport',
                hideInMenu:true
              }
            ]
          },
        ]
      },
      {
        component: '404',
      },
    ],
  },
];
