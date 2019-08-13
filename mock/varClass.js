export default {
	'POST /engine/varClass/addClass': (req, res) => {
	    res.send({
	      status: 'ok',
	      data:[
	      {
	        id:1,
	        number:1,
	        name:'反欺诈',
	        classDes:'王大大的分类',
	        secList:[
	          {
	            id:1,
	            number: 1,
	            name: '注册',
	            classDes:'王大大的分类',
	          },
	          {
	            id:2,
	            number: 2,
	            name: '登录',
	            classDes:'王大大的分类',
	          },
	          {
	            id:3,
	            number: 3,
	            name: '借款',
	            classDes:'王大大的分类',
	          },
	        ]
	      },
	      {
	        id:2,
	        number:2,
	        name:'信审模块',
	        classDes:'王大大的分类',
	        secList:[
	          {
	            id:1,
	            number: 1,
	            name: '评分规则',
	            classDes:'王大大的分类',
	          },
	          {
	            id:2,
	            number: 2,
	            name: '借款人信息',
	            classDes:'王大大的分类',
	          },
	          {
	            id:3,
	            number: 3,
	            name: '自动拒绝规则',
	            classDes:'王大大的分类',
	          },
	        ]
      	}]
	  })
	},
	'POST /engine/varClass/list': (req, res) => {
	    res.send({
	      status: 'ok',
	      data:[
	      {
	        id:1,
	        number:1,
	        name:'反欺诈',
	        classDes:'王大大的分类',
	        secList:[
	          {
	            id:1,
	            number: 1,
	            name: '注册',
	            classDes:'王大大的分类',
	          },
	          {
	            id:2,
	            number: 2,
	            name: '登录',
	            classDes:'王大大的分类',
	          },
	          {
	            id:3,
	            number: 3,
	            name: '借款',
	            classDes:'王大大的分类',
	          },
	        ]
	      }]
	  })
	},
	'POST /engine/varClass/selectLevel1': (req, res) => {
		res.send({
	      status: 'ok',
	      data:[
	      {
	        id:1,
	        number:1,
	        name:'反欺诈',
	      },
	      {
	        id:2,
	        number:2,
	        name:'信审模块',
	      }
	      ]
	  })
	},
	'POST /engine/varClass/getSelectLevel2': (req, res) => {
		res.send({
	      status: 'ok',
	      data:[
	      	{
	            id:1,
	            number: 1,
	            name: '注册',
	            classDes:'王大大的分类',
	          },
	          {
	            id:2,
	            number: 2,
	            name: '登录',
	            classDes:'王大大的分类',
	          },
	          {
	            id:3,
	            number: 3,
	            name: '借款',
	            classDes:'王大大的分类',
	          },
	      ]
	  })
	},
	'POST /engine/varClass/deleteClass': (req, res) =>{
		res.send({
	      status: 'ok',
	      data:[
	      	
	      ]
	  })
	}
}