import request from '@/utils/request';
const _baseApi = '/merchant-admin'

export async function queryList(params) {
    return request(`${_baseApi}/system/role/list`, {
      method: 'POST',
      body: params
    });
  }