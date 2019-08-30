import request from '@/utils/request';
const _baseApi = '/merchant-admin'

// 获取秘钥
export async function fetchSecert(params) {
  return request(`${_baseApi}/merchantInfo/getMerchantInfo`, {
    method: 'POST',
    body: params
  });
}

// 生成秘钥
export async function createSecret(params) {
  return request(`${_baseApi}/merchantInfo/genRSAKey`, {
    method: 'POST',
    body: params
  });
}