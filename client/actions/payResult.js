import fetchUtil from "../utils/fetchUtil";

import clientConfig from '../clientConfig';

const preurl = clientConfig.preurl


export const getOrderDetail = (params) => {
    let url = '/api/m/payresult/orderdetail'
    return fetchUtil.commonRequest(preurl + url, params);
}

export const getAdDetail = (params) => {
    let url = '/api/m/adv/payAfter'
    return fetchUtil.commonRequest(preurl + url , params);
}

export const getAllOrderInfo = (params) => {
    let url = "/api/m/payresult/orderdetail"
    return fetchUtil.commonRequest(preurl + url , params);
}