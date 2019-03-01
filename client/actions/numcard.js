import fetchUtil from "../utils/fetchUtil";
import clientConfig from '../clientConfig';
const preurl = clientConfig.preurl;

export const getNumCardList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/getNumCardListWithUser', params);//旧版的获取计次列表
}

export const getNumCardWithUser = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/getNumCardWithUser', params);//新版的获取计次列表
}

export const getNumCardDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/detail' , params);
}

export const getPunchingList = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/getPunchingList' , params);
}

export const getRecordList = (params) =>{
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/getNumCardRecord' , params)
}

export const useNumCard = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/useNumCard' , params)
}

export const giveCard = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/createNumCardSend',params)
}

export const isActive = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/isActivate',params)
}

export const getNumCard = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/sendNumCard',params)
}

export const giveCardDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/getNumCardSendDetail',params)
}

export const getBundingdevice = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/device/allListByCardId',params)
}

export const useSaoma = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/setUseRedis', params)
}

export const getScanUseNumCardStatus = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/getScanUseNumCardStatus', params)
}

export const giveCardRecord = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/numCardSendRecord', params)
}

export const getEntityDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/entityCard/detail', params)
}

export const chongzhiEntityCard = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/entityCard/transfer', params)
}

export const createCustomChongzhi = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/createCustomChargeOrder', params)
}

export const getTimeCardRecord = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/numcard/record/recharge', params)
    
}