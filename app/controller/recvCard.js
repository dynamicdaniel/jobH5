
const Controller = require('../core/base_controller');
module.exports = (app) => {
    class RecvCardController extends Controller {
        async index() {
            const {
                ctx,
            } = this;
            let q = ctx.query
            let id = q.id
            let openid = q.openid
            let redisKey = q.redisKey
            let cardid = q.cardId

            // if (cardid != undefined) {
            //     console.log('参数',cardid,openid)
            //     let userinfo =  await ctx.service.user.getMemberCardUserInfo(cardid, openid)
            //     console.log('userinfo',userinfo)
            // }
            
            if (q.openid) {
                await this.ctx.render('recvCardIndex', {
                    id : id,
                    openid: openid,
                    cardid : cardid,
                    redisKey : redisKey

                });
            } 
              
        }
    }

    return RecvCardController;
};