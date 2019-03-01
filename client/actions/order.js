import fetchUtil from "../utils/fetchUtil";
import clientConfig from '../clientConfig';

const preurl = clientConfig.preurl
/**
 * 创建优惠折扣
 */
export const changeDiscountInfo = (token, price, couponIds, cardId,shopId,storeId,deviceNo ,  payType) => {
    let params = {
        token: token,
        price: price,
        cardId: cardId,
        payType: payType
    }

    if (couponIds && couponIds.length > 0){
        params.couponIds = couponIds
    }

    if (shopId != undefined){
        params.shopId = shopId
    }

    if (storeId){
        params.storeId = storeId
    }

    if (deviceNo){
        params.deviceNo = deviceNo
    }

    console.log(params);

    return fetchUtil.commonRequest(preurl + '/api/m/order/createDiscount', params);
}

/**
 * 创建充值订单
 * 获取充值trade
 */
export const createChargeOrder = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/createChargeOrder', params,1)
}

/**
 * 创建开卡付费订单
 * 获取充值trade
 */
export const createOpenCardOrder = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/createOpenCardOrder', params)
}

/**
 * 创建计次卡订单
 * 获取充值trade
 */
export const createCardOrder = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/createCardOrder', params)
}

/**
 * 创建演示用的订单
 */
export const createTempOrder = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/createDemoOrder', params)
}

/*
创建订单结束后 获取交易trade
token:
shopId:店铺id
storeId：门店id
orderType：订单类型：1：普通订单2：直接支付3：积分兑换4：会员卡充值
payType：1：微信支付，2:支付宝支付，3：其他支付  
discountInfoRedisKey：折扣id，与originalAmount 只需要一个值
deviceId: 设备id
operateUser：操作人员
originalAmount：原价，没有折扣的时候
*/
export const createOrder = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/createOrder', params);
}

/*
创建订单结束后 获取交易trade
shopId:店铺id
storeId：门店id
orderType：订单类型：1：普通订单2：直接支付3：积分兑换4：会员卡充值
payType：1：微信支付，2:支付宝支付，3：其他支付  
discountInfoRedisKey：折扣id，与originalAmount 只需要一个值
deviceId: 设备id
operateUser：操作人员
originalAmount：原价，没有折扣的时候
*/
export const createNoUserOrder = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/nouserorder/createOrder', params);
}


/*
去支付
token：必传
openId：可不传
payType:1：微信，2：支付宝
tradeId：创建订单返回的
*/
export const gotoPay = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/pay', params);
}


export const getPayBeforeInfo = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/activity/paybefroeActivity' , params);
}


export const getPayAfterInfo = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/activity/payafterActivity' , params);
}

//下单流程，
//1.点击支付先调用changeDiscountInfo 创建优惠折扣，返回折扣discountInfoRedisKey，
//如果直接支付，没有会员，不需要创建。下订单直接使用originalAmount值

//2.下订单，createOrder 返回交易信息，如果是储蓄卡支付，直接显示相关数据内容再走支付

//3.通过tradeId，调用gotoPay ，生成支付数据，去支付

//生成支付码
export const generateAuthCode = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/generateAuthCode' , params);
}
//支付码轮询
export const getTradeByAuthCode = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/getTradeByAuthCode' , params);
}
//设置支付类型
export const setPayType = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/order/setPayType' , params);
}