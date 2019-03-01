const Controller = require('../core/base_controller');


module.exports = (app) => {
    class BandUserController extends Controller {
        async index() {
            const {
                ctx,
                app
            } = this;
            let q = ctx.query;
            let userId = q.id;
            let shopId = q.shopId;
            let openid = q.openid;
            let mainopenid = q.mainopenid;

            // let url = ctx.request.originalUrl;
            // let redirect = encodeURIComponent(url)

            // let shopId = 0;
            // let userId = 0;
            // if (id.indexOf('_') > -1) {
            //     let ids = id.split('_')
            //     shopId = ids[0]
            //     userId = ids[1]
                if (q.openid) {
                    await this.ctx.render('banduserIndex', {
                        shopId: shopId,
                        openId: openid,
                        userId: userId,
                        unionId:mainopenid,
                    });
                } 
                // else {
                //     if (shopId != undefined) {
                //         let wxconfig = await ctx.service.shop.getShopConfig(shopId);
                //         if (wxconfig != undefined) {
                //             await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`)
                //         }
                //     }
                // }
            // }
        }

        async bindAgentAdmin() {
            const { ctx, app } = this;
            let q = ctx.query;
            let agentAdminId = q.agentAdminId;
            let agentId = q.agentId;
            let openid = q.openid;
            let mainopenid = q.mainopenid;

            if (q.openid) {
                await this.ctx.render('bindAgentAdminIndex', {
                    agentAdminId,
                    agentId,
                    openid,
                    mainopenid
                });
            }
        }
    }

    return BandUserController;
};