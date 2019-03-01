import fetchUtil from "../utils/fetchUtil";

import clientConfig from '../clientConfig';
const preurl = clientConfig.preurl

/**
 * 更新用户信息
 * cardId
 * openId
 */
export const updateUserMemberRelation = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/user/updateUserMemberRelation', params)
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
 * 获取开卡信息
 */
export const getCardCost = (cardId) => {
    return fetchUtil.commonRequest(preurl + '/api/m/card/getCardCost', {cardId:cardId})
}