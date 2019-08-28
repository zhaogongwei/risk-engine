import request from '@/utils/request';
const _baseApi = '/merchant-admin'
//查询风控标签列表信息
export async function queryRiskLabelList(params) {
  return request(`${_baseApi}/strategy/label/selectLabelPage`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//新增风控标签
export async function addRiskLabel(params) {
  return request(`${_baseApi}/strategy/label/insertLabel`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//编辑风控标签
export async function editRiskLabel(params) {
  return request(`${_baseApi}/strategy/label/updateLabel`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//删除风控标签
export async function delRiskLabel(params) {
  return request(`${_baseApi}/strategy/label/delete/${params.labelId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//校验标签名称
export async function checkLabelName(params) {
  return request(`${_baseApi}/strategy/label/checkLabelName`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//查询标签信息
export async function queryLabelInfo(params) {
  return request(`${_baseApi}/strategy/label/${params.labelId}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}