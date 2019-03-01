const Controller = require('../core/base_controller');


module.exports = (app) => {

    class PayResultController extends Controller {
        async index() {
            const {
                ctx,
                app
            } = this;
            let q = ctx.query;
     

            let status = 'success'
            if (q.errorDetail) {
                if (q.errorDetail == '成功') {
                    status = 'success'
                } else {
                    status = 'fail'
                }
            } else {
                status = q.status;
            }


            await this.ctx.render('payResultIndex', {
                orderNo: q.orderNo,
                status: status
            });
        }
    }
    return PayResultController;
}