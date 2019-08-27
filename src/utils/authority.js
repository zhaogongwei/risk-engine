// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }
  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

//存储用户名
export function setUserName(authority) {
  return sessionStorage.setItem('risk-engine-username', authority);
}
export function getUserName() {
  return sessionStorage.getItem('risk-engine-username');
}
export function deleteUserName() {
  return sessionStorage.removeItem('risk-engine-username');
}

//存储用户ID
export function setUserId(authority) {
  return sessionStorage.setItem('A-EMS-userId', authority);
}
export function getUserId() {
  return sessionStorage.getItem('A-EMS-userId');
}
export function deleteUserId() {
  return sessionStorage.removeItem('A-EMS-userId');
}