const Controller = require('../core/base_controller');

module.exports = (app) => {

    class TestSvcController extends Controller {

        
        async index() {
            const {ctx} = this
            let baseInfo = {
                'test' : 'test'
            }
            console.log('testsvc:',baseInfo)
            await this.ctx.render('tabsIndex', {'baseInfo':baseInfo});
            await this.ctx.render('testsvcIndex',{'baseInfo':baseInfo})
        }
     
    }
    return TestSvcController;
}