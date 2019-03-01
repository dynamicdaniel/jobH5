const Controller = require('../core/base_controller');
module.exports = (app) => {

    class ChannelController extends Controller {
        async index() {
            const {
                ctx,
                app
            } = this;
            let q = ctx.query;

            let configCode = q.configCode
            let shopId = q.shopId
            let openid = q.openid

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
                  let wxconfig = await ctx.service.shop.getShopConfig(q.shopId);
                  await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
            }
            let token = await ctx.service.user.getToken(shopId, openid);
            await this.ctx.render('channelIndex', {
                  openid : openid,
                  token : token,
                  shopId : shopId,
                  configCode : configCode
            });
        }
    }
    return ChannelController;
}