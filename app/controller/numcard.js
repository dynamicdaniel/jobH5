const Controller = require('../core/base_controller');

module.exports = (app) => {

    class NumCardController extends Controller {

        async getBaseInfo(){

            const {ctx,app} = this;
            const q = ctx.query;

            let token = q.token || undefined
            let cardId = q.card_id || undefined
            let openid = q.openid || undefined
            let shopId = q.shopId || undefined
            
            if (q.openid == undefined || q.openid == "") {

                  let url = ctx.request.originalUrl;
                  let host = ctx.request.host;
                  let redirectUrl = '';
                  if (app.config.app.isHttps) {
                      redirectUrl = `https://${host}${url}`;
                  } else {
                      redirectUrl = `http://${host}${url}`;
                  }
                  let redirect = encodeURIComponent(redirectUrl);
                  let wxconfig = await ctx.service.shop.getShopConfigByCardId(q.card_id);
                  await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
            }

            if (q.card_id != undefined) {
                let userinfo = await ctx.service.user.getMemberCardUserInfo(q.card_id, q.openid);
                shopId = userinfo ? userinfo.shopId : shopId;
              //  cardId = q.cardId;
            }
            if(token == undefined || token == ''){
                token = await ctx.service.user.getToken(shopId,openid);
                console.log('getToken:',token)
            }
            return {
                  openid : openid,
                  token : token,
                  shopId : shopId,
                  cardId : cardId,
            }
        }
        async index() {

            const baseInfo = await this.getBaseInfo();
            baseInfo.configCode = q.configCode
         
            await this.ctx.render('numcardIndex', {'baseInfo':baseInfo});
        }
        async channelNumcardDetail() {

            const {ctx,app} = this;
            const q = ctx.query;

            const res = await this.getBaseInfo();
            const baseInfo = {
                ...res,
                timecardId : q.timecardId || undefined,
                
            }
            //console.log('baseInfo:',baseInfo)
            await this.ctx.render('numcardIndex', {'baseInfo':baseInfo});

        }
        async scoreshop(){
            const {ctx,app} = this;
            const q = ctx.query;
            const baseInfo = await this.getBaseInfo()
            baseInfo.userId = q.userId
            await this.ctx.render('scoreIndex',{'baseInfo':baseInfo})
        }
     
    }
    return NumCardController;
}