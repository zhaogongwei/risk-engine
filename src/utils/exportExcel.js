import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { getAuthority, setAuthority } from './authority';
import { cookie } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options,params) {
  //   有操作请求的时候就重新存储一下cookie
  if (getAuthority()) setAuthority(getAuthority())
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        Cookies: getAuthority(),
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        Cookies: getAuthority(),
        ...newOptions.headers,
      };
    }
  }else{
    let dataStr = ''; //数据拼接字符串
    params&&Object.keys(params).forEach(key => {
      dataStr += key + '=' +params[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
    newOptions.headers = {
      Cookies: getAuthority(),
      ...newOptions.headers
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(async (response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      const r = await response.blob();
      const blob = new Blob([r], {type: "application/vnd.ms-excel"});
      if (r.size < 100) {
        let reader = new FileReader();
        reader.onload = e => {
          const data = JSON.parse(e.target.result);
          // 验证登录是否失效
          if (data.status && data.status === 999) {
            message.error('登录失效，请重新登录！')
            //   登陆失效以后清除所有用户信息
            cookie().delete("hyjf-admin-id")
            window.localStorage.removeItem("permission")
            window.localStorage.removeItem("userInfo")
            //   登陆失效以后记录失效之前的路径    以便登陆成功以后定位失效页面
            if (location.pathname !== '/user/login') {
              localStorage.setItem('last-visit-url', location.pathname)
            }
            router.push('/user/login');
            return;
          } else if (data.status) {
            message.error(data.statusDesc)
          }
        };
        reader.readAsText(blob)
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = decodeURIComponent(response.headers.get("content-disposition").split("=")[1]);
      document.body.appendChild(a);
      a.click();
      return;
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
      }
    });
}
