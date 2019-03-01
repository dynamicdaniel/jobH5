const Controller = require('../core/base_controller');

module.exports = (app) => {
    class AuthAliController extends Controller {
        async index() {
            await this.ctx.render('authAliIndex', {});
        }
    }
    return AuthAliController;
}