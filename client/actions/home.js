import fetchUtil from "../utils/fetchUtil";

import clientConfig from '../clientConfig';

const preurl = clientConfig.preurl

// export const getQrCard = (id) => {
//     let token = localStorage.getItem('token');
//     let params = {
//         id:id,
//         token:token,
//     }
//     return fetchUtil.commonRequest(preurl + '/api/m/qrcard/get',params);
// }

export const getStores = (shopId) => {
    let params = {
        shopId: shopId
    }
    // return fetchUtil.commonRequest(preurl + '/api/m/store/list', params);
    return fetchUtil.commonRequest(preurl + '/api/m/device/allListByShop', params);
}

export const getDeviceList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/device/allListByCardId' , params);
}

export const getStoresByShopId = (shopId) => {
    let params = {
        shopId: shopId
    }
    return fetchUtil.commonRequest(preurl + '/api/m/store/list', params);
}

export const userLogin = (shopId, openId) => {
    let params = {
        shopId: shopId,
        openId: openId
    }

    return fetchUtil.commonRequest(preurl + '/api/m/user/login', params);
}

export const getUserLever = (token, cardId) => {
    let params = {
        token: token,
        cardId: cardId
    }
    return fetchUtil.commonRequest(preurl + '/api/m/user/info/lever', params);
}


export const getUserCoupons = (token, shopId) => {
    let params = {
        token: token,
        shopId: shopId
    }
    return fetchUtil.commonRequest(preurl + '/api/m/user/info/coupons', params);
}

/**
 * 获取激活信息
 * cardId
 * activate_ticket
 */
export const getActivityInfo = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getActivateTempInfo', params)
}

/**
 * 激活
 * cardId
 * openId
 */
export const activateMemberCardAction = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/activateMemberCard', params)
}

/**
 *   获取用户信息
 */
export const getUserInfo = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/b/membercard/userinfo', params);
}

/**
 * page
 * size 
 * userId
 */
export const getPayRecordData = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/list', params)
}

/**
 * 用户储值充值记录
 * @param {String} token 用户token
 * @param {String} cardId 会员卡id
 * @param {String} type 充值类型
 * @param {int} page 页数
 * @param {int} size 每页数据量
 */
export const getChargeList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/chargeAmount/userRecordList', params);
}

/**
 *  充值面板数据
 * shopId,cardId
 */
export const getChargeAmountLst = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/user/account/getChargeAmountList', params);
}

/**
 * shopId
 * cardId
 * token
 * @param {会员卡信息} params 
 */
export const getCardInfo = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/cardinfo', params);
}

/**
 * 
 * @param {获取积分列表} params 
 */
export const getBonusList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/user/info/bonusList', params);
}

/**
 *  分享设置
 */
export const getShareInfo = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/cardconfig/getCardShare', params);
}


export const getShopDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/shop/detail' , params);
}

export const setBandInfo = (params) => {
    console.log(params);
    return fetchUtil.commonRequest(preurl + '/api/m/shopAdmin/setBandInfo' , params);
}
export const getShopAdmin = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/shopAdmin/getShopAdminDetail' , params);
}

// 获取代理商管理员信息
export const getAgentAdminDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/getAgentAdminDetail' , params);
}

// 微信绑定代理商员工时把微信信息设置在缓存中
export const setAgentBindInfo = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/setAgentBandInfo' , params);
}