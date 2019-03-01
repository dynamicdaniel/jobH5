/**
 * http://192.168.1.83:7001/activityuser?
 * openid=oXLwq0wpz1D5B5OrKwYGv6NbUn2c&shopId=4
 * &
 * card_id=pXLwq01MOiQJrF5DAC15x9gJFzvk
 * &
 * encrypt_code=YGtX9wQrRoygiLkC6JaPPxJbIpSZ9x%2FH82XVE3YvL7o
 * &
 * activate_ticket=fDZv9eMQAFfrNr3XBoqhbzAeREU%2BP6r5td9YGECogaS5LxI5XtdluFrbyDPsw0GvNmmEYacx4udz%2BetgZ2gDEaWCqepRDAtcB3JpkUFTZtc%3D
 */
const Controller = require('../core/base_controller');

module.exports = (app) => {

    class ActivityUserController extends Controller {
        async index() {
            const {
                ctx,
                app
            } = this;
            let q = ctx.query;
            let params = {
                cardId: q.card_id,
                activate_ticket: q.activate_ticket
            }

            let url = '/api/m/card/getActivateTempInfo';
            console.log("getActivateTempInfo", url, JSON.stringify(params), "");
            let data = await this.post(url, params);
            console.log("getActivateTempInfoResult", "", JSON.stringify(data), "");
            let info = {}
            if (data.success) {
                info = data.data.data.info
            }

            console.log("getMemberCardUserInfo", q.card_id, "", q.openid);
            let userinfo = await ctx.service.user.getMemberCardUserInfo(q.card_id, q.openid);
            console.log("getMemberCardUserInfoResult", "", "", JSON.stringify(userinfo));
            let shopId = userinfo.shopId;
            console.log("getToken", shopId, "", q.openid);
            let token = await ctx.service.user.getToken(shopId, q.openid)
            console.log("getTokenResult", token, "", "");
            let outId = ''
            if (q.outId && q.outId.length > 0) {
                outId = q.outId
            }

            await this.ctx.render('userIndex', {
                openid: q.openid,
                token: token,
                shopId: shopId,
                card_id: q.card_id,
                encrypt_code: q.encrypt_code,
                activate_ticket: q.activate_ticket,
                commoninfo: info,
                outId: outId
            });
        }
    }

    return ActivityUserController;
}