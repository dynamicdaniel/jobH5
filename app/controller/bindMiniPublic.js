const Controller = require('../core/base_controller');

module.exports = (app) => {

    class bindMiniPublic extends Controller {

        async getBaseInfo(){

            const {ctx,app} = this;
            const q = ctx.query;

            let miniOpenId = q.miniOpenId || undefined
            let shopId = q.shopId || undefined
            let openid = q.openid || undefined
            let token = q.token || undefined
            
            if (openid == undefined || openid == "") {

                  let url = ctx.request.originalUrl;
                  let host = ctx.request.host;
                  let redirectUrl = '';
                  if (app.config.app.isHttps) {
                      redirectUrl = `https://${host}${url}`;
                  } else {
                      redirectUrl = `http://${host}${url}`;
                  }
                  let redirect = encodeURIComponent(redirectUrl);
                  let wxconfig = await ctx.service.shop.getShopConfig(shopId);
                  await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
            }
            if(token == undefined || token == ''){
                token = await ctx.service.user.getToken(shopId,openid);
                console.log('getToken:',token)
            }
            return {
                  shopId : shopId,
                  miniOpenId : miniOpenId,
            }
        }
        async index() {

            const baseInfo = await this.getBaseInfo();
           // await this.ctx.render('numcardIndex', {'baseInfo':baseInfo});
        }
     
    }
    return bindMiniPublic;
}