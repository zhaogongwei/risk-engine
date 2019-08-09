import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

// 在一个数组中寻找指定元素的方法，主要用于搜索权限
export function findInArr(arr, item) {
  if (!arr || !arr.length) return null
  const res = arr.find(findItem => (findItem === item))
  return res
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}
// 为表格数据增加序号key
export function addListKey(arr = [], current = 1, pageSize = 20) {
  if (Array.isArray(arr)) {
    arr.map((item, index) => item['key'] = index + 1 + (current - 1) * pageSize)
  }
  return arr
}

export function addListKeydouble(arr = [], name = '',current = 1, pageSize = 10) {
  if (Array.isArray(arr)) {
    arr.map((item, index) => {
    	item['key'] = index + 1 + (current - 1) * pageSize
    	if(name != '' && Array.isArray(item[name])){
    		 item[name].map((item2, index2) => item2['key'] = index2 + 1 )
    	}
    })
  }
  return arr
}

// 获取url中queryString方法
export function getQueryString(name, searchUrl) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = searchUrl.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

//深度拷贝
export function deepCopy (obj){
  // 只拷贝对象
  if (typeof obj !== 'object') return;
  // 根据obj的类型判断是新建一个数组还是一个对象
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}
/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });
//   cookie
export function cookie() {
  const cookie = {
    set:function(key,val, maxAge=1200){//设置cookie方法
      // let date=new Date(); //获取当前时间
      // let expiresDays=time;  //将date设置为n天以后的时间
      // date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
      document.cookie=`${key}=${val};path=/;max-age=${maxAge}`;  //设置cookie
    },
    get:function(key){//获取cookie方法
      /*获取cookie参数*/
      let getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
      let arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
      let tips;  //声明变量tips
      for(let i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
        let arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
        if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
          tips=arr[1];   //将cookie的值赋给变量tips
          break;   //终止for循环遍历
        }
      }
      return tips
    },
    delete:function(key, maxAge){ //删除cookie方法
      let date = new Date(); //获取当前时间
      date.setTime(date.getTime()-10000); //将date设置为过去的时间
      document.cookie = `${key}=v; path=/; expires =${date.toGMTString()};max-age=${maxAge}`//设置cookie
    }
  }
  return cookie
}

//   统计密码评分标准
export function score(s){
  let num=0
  if(s.length<10){
    num+=5
  }else if(s.length>=10&&s.length<=12){
    num+=10
  }else{
    num+=25
  }
  if(s.match(/[A-Za-z]/g)==null){
    num+=0
  }else if(s.match(/[A-Z]/g)==null){
    num+=10
  }else if(s.match(/[a-z]/g)==null){
    num+=10
  }else if(/[A-Z]/.test(s)&&/[a-z]/.test(s)){
    num+=20
  }
  if(s.match(/\d/g)==null){
    num+=0
  }else if(s.match(/\d/g).length==1){
    num+=10
  }else if(s.match(/\d/g).length>1){
    num+=20
  }
  if(s.match(/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/g)==null){
    num+=0
  }else if(s.match(/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/g).length==1){
    num+=10
  }else if(s.match(/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/g).length>1){
    num+=25
  }
  if(/\d/.test(s)&&/[a-z]/.test(s)&&/[A-Z]/.test(s)&&/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/.test(s)){
    num+=5
  }else if(/\d/.test(s)&&/[a-zA-Z]/.test(s)&&/[\`\~\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\|\[\]\\\;\'\:\"\,\.\/\<\>\?]/.test(s)){
    num+=3
  }else if(/\d/.test(s)&&/[a-zA-Z]/.test(s)){
    num+=2
  }
  return num
}