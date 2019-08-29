import request from '@/utils/request';
import exportExcel from '@/utils/exportExcel';
const _baseApi = '/merchant-admin'


//角色管理
//初始化数据
export async function initData(params){
  return request(`${_baseApi}/system/user/init`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

// 检查用户名唯一性
export async function checkUserName(params) {
  return request(`${_baseApi}/system/user/uniquenessCheck`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//账号添加
export async function addAccount(params) {
  return request(`${_baseApi}/system/user/add`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//查询账号列表
export async function queryList(params) {
  return request(`${_baseApi}/system/user/list`, {
    method: 'POST',
    body: params
  });
}

//账号修改编辑
export async function editAccount(params) {
  return request(`${_baseApi}/system/user/view`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//账号更新
export async function updateAccount(params) {
  return request(`${_baseApi}/system/user/update`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//密码更新
export async function updatePsw(params) {
  return request(`${_baseApi}/system/user/updatePassword`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//导出列表
export async function exportFile(params) {
  return exportExcel(`${_baseApi}/system/user/export`, {
    method: 'POST',
    body: params
  });
}

//账号删除
export async function delAccount(params){
  return request(`${_baseApi}/system/user/delete`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
