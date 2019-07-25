export default {
  'POST /risk-engine/menu_data/':{
    data:[
      //变量管理
      {
        title:'变量管理',
        icon:'icon-bianliangguanli',
        url:'/varManage',
        children:[
          //变量分类
          {
            url: '/varManage/varclass',
            title: '变量分类',
          },
          //变量列表
          {
            url: '/varManage/varlist',
            title: '变量列表',
          },
        ]
      },
      //策略管理
      {
        title:'策略管理',
        icon:'icon-celueguanli',
        url:'/policyManage',
        children:[
          //风控策略列表
          {
            title: '风控策略列表',
            url:'/policyManage/riskpolicylist',
            children:[
              {
                url: '/policyManage/riskpolicylist',
                redirect:'/policyManage/riskpolicylist/list'
              },
              //风控策略列表
              {
                url: '/policyManage/riskpolicylist/list',
                title: '风控策略列表',
              },
              //风控标签
              {
                url: '/policyManage/riskpolicylist/risklabel',
                title: '风控标签',
              },
              //策略流列表
              {
                url: '/policyManage/riskpolicylist/policyFlow',
                title: '策略流列表',
                children:[
                  {
                    url: '/policyManage/riskpolicylist/policyFlow',
                    redirect:'/policyManage/riskpolicylist/policyFlow/list'
                  },
                  //策略流列表
                  {
                    url: '/policyManage/riskpolicylist/policyFlow/list',
                    title: '策略流列表',
                  },
                  //策略测试模板
                  {
                    url: '/policyManage/riskpolicylist/policyFlow/test',
                    title: '策略测试模板',
                  },
                  //策略流编辑>策略流
                  {
                    url: '/policyManage/riskpolicylist/policyFlow/edit',
                    title: '策略流编辑',
                  },
                ]
              },
            ]
          }
        ]
      },
      //本地灰名单库
      {
        title:'本地灰名单库',
        icon: 'icon-huimingdan',
        url: '/greyName/list',
      },
      //本地黑名单库
      {
        title:'本地黑名单库',
        icon: 'icon-heimingdan',
        url: '/blackName/list',
      },
      //风控报告
      {
        title:'风控报告',
        icon: 'icon-fengkongbaogao',
        url: '/riskReport',
        children:[
          {
            url:'/riskReport/reportList',
            redirect:'/riskReport/reportList/list',
          },
          //风控报告列表
          {
            url:'/riskReport/reportList/list',
            title:'风控报告列表',
          },
          //风控报告模板
          {
            url:'/riskReport/reportList/mould',
            title:'风控报告模板',
          },
        ]
      },
      //系统设置
      {
        title:'系统设置',
        icon: 'icon-xitongshezhi',
        url: '/systemSet',
        children:[
          {
            //角色管理
            url:'/systemSet/roleManage',
            title:'角色管理',
          },
          {
            //账号管理
            url:'/systemSet/accountManage',
            title:'账号管理',
          },
          //接口配置
          {
            url:'systemSet/urlDeploy',
            title:'接口配置',
          }
        ]
      },
    ]
  }
}