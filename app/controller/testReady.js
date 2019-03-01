const Controller = require('../core/base_controller');

module.exports = (app) => {

    class TestReadyController extends Controller {

        
        async index() {
            this.success('start success 星期二 12:49');
        }
     
    }
    return TestReadyController;
}