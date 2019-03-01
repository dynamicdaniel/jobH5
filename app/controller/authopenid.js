const Controller = require('../core/base_controller');

module.exports = (app) => {

    class AuthController extends Controller {

        async getBaseInfo(){

            const {ctx,app} = this;
            const q = ctx.query;

            let openId = q.openid || undefined
            let shopId = q.shopId || undefined
            console.log('openId:',openId)
            console.log('shopId:',shopId)
            if (q.openid == undefined || q.openid == "") {

                  let url = ctx.request.originalUrl;
                  let host = ctx.request.host;
                  let redirectUrl = '';
                  if (app.config.app.isHttps) {
                      redirectUrl = `https://${host}${url}`;
                  } else {
                      redirectUrl = `http://${host}${url}`;
                  }
                  console.log('redirectUrl:',redirectUrl)
                  let redirect = encodeURIComponent(redirectUrl);
                  let wxconfig = await ctx.service.shop.getShopConfig(q.shopId);
                  console.log('wxconfig:',wxconfig)
                  await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
            }
            
            return {
                  openId : q.openid,
            }
        }
        async index() {

            const baseInfo = await this.getBaseInfo();
            console.log('baseInfo:',baseInfo)
            await this.ctx.render('authOpen', {'baseInfo':baseInfo});
        }
    }
    return AuthController;
}