const Controller = require('../core/base_controller');


module.exports = (app) => {

    class BalancePageController extends Controller {
        async index() {
            const {
                ctx,
                app
            } = this;
            let q = ctx.query;

            let shopId = q.shopId;
            let userinfo = {}
            if (q.card_id != undefined){
                userinfo = await ctx.service.user.getMemberCardUserInfo(q.card_id,q.openid);
                shopId = userinfo.shopId;
                console.log('userinfo:',userinfo)
            }

            let token = await ctx.service.user.getToken(shopId,q.openid)

            await this.ctx.render('balancepageIndex', {
                openid: q.openid,
                cardId: q.card_id,
                shopId: shopId,
                commoninfo: userinfo,
                token: token
            });
        }
    }
    return BalancePageController;
}