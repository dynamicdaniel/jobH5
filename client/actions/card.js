import fetchUtil from "../utils/fetchUtil";
import clientConfig from '../clientConfig';
import { ETIME } from "constants";
const preurl = clientConfig.preurl;


/**
 * shopId
 * openId
 *
 * @param {获取可使用优惠券} params
 */
export const getUseCardList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getUserCardList', params);
}

/**
 * 获取免费券接口
 * @param {*} params
 */
export const getFreeCardList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getWxFreeCardList', params);
}

/**
 * 未领取的优惠券
 * @param {} params
 */
export const getNoReceiveCardList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getNoReceiveList', params);
}

/**
 * 获取不同状态的卡券列表
 * status
 * 0未领取，1已领取，2已核销
 */
export const getCardListByState = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getDBCardList' , params);
}

// 积分商城
export const getBonusShop = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getBonusShop' , params)
}

// 卡券商城
export const getCardShop = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getCardShop' , params);
}

// 卡券详情
export const getCardShopDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getCardShopDetailById' , params)
}

//积分商品详情
export const getBonusDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getBoundsDetailById', params)
}

/**
 *  兑换
 */
export const duihuanCard = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/DBCardExchage' , params)
}

/**
 *  领取免费的券
 */
export const getFreeCard = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/DBCardGet' , params)
}

/**
 *  领取演示用的券
 */
export const demoSend = (openId) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/demoSend' , {openId:openId})
}

/**
 * 领取 核销
 */
export const updateCard = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/DBCardUpdate' , params)
}


export const createQRCode = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/createQRCode' , params)
}

/**
 *  获取会员卡详情 从微信
 * @param {*} params
 */
export const getMemberCardDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getMemberCardDetail' , params);
}


/**
 *  获取ticket
 */
export const getCardTicket = (params) => {
    let url = '/api/m/card/getCardTicket'
    return fetchUtil.commonRequest(preurl + url , params);
}


export const getCardExtStr = (params) => {
    let url = '/api/m/card/getCardExt'
    return fetchUtil.commonRequest(preurl + url , params);
}

/**
 * 获取会员卡用户信息
 */
export const getMemberCardUserInfo = (params) => {
    let url = '/api/m/user/membercard/getInfoByOpenId';
    return fetchUtil.commonRequest(preurl + url, params);
};
//获取积分明细
export const getSoreList = (params) => {
    let url = '/api/mini/score/record';
    return fetchUtil.commonRequest(preurl + url, params);
};

