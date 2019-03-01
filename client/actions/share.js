/**
 * H5前端接口
 * share
 */
import fetchUtil from "../utils/fetchUtil";
import clientConfig from '../clientConfig';
const preurl = clientConfig.preurl

export const getShareData = (id) => {
    let params = {id:id}
    return fetchUtil.commonRequest(preurl + '/api/m/shareLink/detail', params);
}

export const viewSharePage = (id , openId) => {
    let method = '/api/m/shareLink/view'
    let params = {id:id , openId: openId}
    return fetchUtil.commonRequest(preurl + method , params);
}

export const getShareNum = (id) => {
    let method = '/api/m/shareLink/getNums'
    let params = {id:id}
    return fetchUtil.commonRequest(preurl + method , params);
}

export const getActivityUserLst = (cardId , outId , page ,size) => {
    let params = {
        cardId : cardId , 
        outId: outId ,
        page : page ,
        size: size
    }
    let method = '/api/m/shareLink/activateUsers'
    return fetchUtil.commonRequest(preurl + method , params);

}

/**
 * 是否已激活
 */
export const isUserActivity = async(cardId , openId) => {
    let method = '/api/m/user/isUserActivate'
    let params = {
        cardId: cardId,
        openId : openId
    }
    console.log('查询是否激活参数：',params)
    return fetchUtil.commonRequest(preurl + method , params);
}