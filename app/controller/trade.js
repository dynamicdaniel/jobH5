const Controller = require('../core/base_controller');

module.exports = (app) => {

    class TradeController extends Controller {
        async alipay() {
            const {
                ctx,
                app
            } = this;
            let q = ctx.query;

            let payResult = await ctx.service.trade.gotoPay(q.tradeId);
            let payString = "";
            if (payResult != undefined){
                payString = payResult.payString;
            }
            
            this.ctx.body = payString;

        }
    }
    return TradeController;
}