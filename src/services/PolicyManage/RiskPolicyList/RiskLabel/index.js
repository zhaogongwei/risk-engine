import request from '@/utils/request';
const _baseApi = '/aems'
//查询风控标签列表信息
export async function queryRiskLabelList(params) {
  return request(`${_baseApi}/admin/asset/list`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//新增风控标签
export async function addRiskLabel(params) {
  return request(`${_baseApi}/admin/asset/detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//编辑风控标签
export async function editRiskLabel(params) {
  return request(`${_baseApi}/admin/asset/risk_detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//删除风控标签
export async function delRiskLabel(params) {
  return request(`${_baseApi}/admin/asset/risk_detail`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}