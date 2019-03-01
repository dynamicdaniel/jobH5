const Controller = require('../core/base_controller');

module.exports = (app) => {

    class QrpayController extends Controller {

        async getBaseInfo(){

            const {ctx,app} = this;
            const q = ctx.query;

            let cardId = q.card_id || undefined
            let openId = q.openid || undefined
            let shopId = q.shopId || undefined
            let token =  q.token || undefined

            if (openId == undefined || openId == "") {

                  let url = ctx.request.originalUrl;
                  let host = ctx.request.host;
                  let redirectUrl = '';
                  if (app.config.app.isHttps) {
                      redirectUrl = `https://${host}${url}`;
                  } else {
                      redirectUrl = `http://${host}${url}`;
                  }
                  let redirect = encodeURIComponent(redirectUrl);
                  let wxconfig = await ctx.service.shop.getShopConfigByCardId(cardId);
                  await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
            }
            if(shopId == undefined || shopId == ''){

                let userinfo = await ctx.service.user.getMemberCardUserInfo(cardId, openId);
                console.log('userinfo:',userinfo)
                shopId = userinfo ? userinfo.shopId : shopId;
            }
            if(token == undefined || token == ''){
                token = await ctx.service.user.getToken(shopId,openId);
                console.log('getToken:',token)
            }
            
            return {
                  openId : openId,
                  token : token,
                  shopId : shopId,
                  cardId : cardId,
            }
        }
        async index() {

            const baseInfo = await this.getBaseInfo();
            console.log('qrpay.js baseinfo:',baseInfo)
            
            await this.ctx.render('qrpayIndex', {'baseInfo':baseInfo});
        }
    }
    return QrpayController;
}