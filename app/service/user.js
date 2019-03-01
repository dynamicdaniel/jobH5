const Service = require('../core/base_service');

class UserService extends Service {

    async getToken(shopId,openId) {
        let loginUrl = '/api/m/user/login'
        let token = ''
        let loginInfo = await this.post(loginUrl, {
          shopId: shopId,
          openId: openId
        });

        if (loginInfo.success) {
            token = loginInfo.data
        }

        return token
    }


    //获取会员卡用户信息
    async getMemberCardUserInfo(cardId,openId) {
        if (cardId == undefined || cardId == ""){
            return {};
        }
        let params = {
            cardId: cardId,
            openId: openId
        }
        let url = '/api/m/user/membercard/getInfoByOpenId'
        let userinfo = await this.post(url, params);

        let info = {}
        if (userinfo.success) {
          info = userinfo.data
        }
        return info
    }

    //获取会员卡用户信息
    async getMemberCardUserInfoWithDeviceNo(deviceNo,openId) {

        let device = await this.ctx.service.device.getDetailWithNo(deviceNo);

        if (device != undefined){
          let shopId = device.shopId;
          let storeId = device.storeId;
          let storeName = device.storeName;
          let cardId = device.card_id;
          let payConfig = device.payConfig;

          let userinfo = await this.getMemberCardUserInfo(cardId,openId);
          return {
              userinfo:userinfo,
              shopId:shopId,
              storeId:storeId,
              storeName:storeName,
              cardId:cardId,
              payConfig:payConfig
          }
        }

        return undefined;
    }


}

module.exports = UserService;