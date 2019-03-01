const Controller = require('../core/base_controller');


module.exports = (app) => {

    class WeixinPayController extends Controller {

        async index() {
            console.log("进入到weixinpay");
            const {ctx, app} = this;
            let q = ctx.query;
            let params = {
                payUrl: q.payUrl
            }
            await this.ctx.render("weixinPayIndex", params);
        }
    }
    return WeixinPayController;
}