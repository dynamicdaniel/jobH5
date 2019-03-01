// const Controller = require('../core/base_controller');

// module.exports = (app) => {
//     class TopBarsController extends Controller {
//         async index() {
//             // render view template in `app/views`

//             const {
//                 ctx,
//                 app
//             } = this;
//             let q = ctx.query;

            
   
//             if (q.openid == undefined) {
//                 if (q.card_id != undefined){
//                     let wxconfig = await ctx.service.shop.getShopConfigByCardId(q.card_id);
//                     let url = ctx.request.originalUrl;
//                     let redirect = encodeURIComponent(url)
//                     if (wxconfig != undefined){
//                       await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`)
//                       return;
//                     }
//                 }

//             } else {

//                 // 登录 
//                 let shopId = q.shopId;
//                 let userinfo = {}
//                 if (q.card_id != undefined){
//                     userinfo = await ctx.service.user.getMemberCardUserInfo(q.card_id,q.openid);
//                     shopId = userinfo.shopId;
//                 }
        
//                 let token = await ctx.service.user.getToken(shopId,q.openid)
//                 const baseInfo = {
//                     openId: q.openid,
//                     shopId: shopId,
//                     cardId: q.card_id,
//                     token: token,
//                     commoninfo: userinfo,
//                     tabIndex: 1// 加入顶部栏的位置
//                 }

//                  await this.ctx.render('tabsIndex', {
//                      baseInfo: baseInfo
//                  });
//                 // await this.ctx.render('tabsIndex', {
//                 //     openId: q.openid,
//                 //     shopId: shopId,
//                 //     cardId: q.card_id,
//                 //     token: token,
//                 //     commoninfo: userinfo,
//                 //     tabIndex: q.index // 加入顶部栏的位置
//                 // });
//             }
//         }
//     }

//     return TopBarsController;
// };

const Controller = require('../core/base_controller');

module.exports = (app) => {

    class TopBarsController extends Controller {

        async getBaseInfo(){

            const {ctx,app} = this;
            const q = ctx.query;

            let token = q.token || undefined
            let cardId = q.card_id || undefined
            let openId = q.openid || undefined
            let shopId = q.shopId || undefined
            console.log('shopId:',shopId)
            if (q.openid == undefined || q.openid == "") {

                  let url = ctx.request.originalUrl;
                  let host = ctx.request.host;
                  let redirectUrl = '';
                  if (app.config.app.isHttps) {
                      redirectUrl = `https://${host}${url}`;
                  } else {
                      redirectUrl = `http://${host}${url}`;
                  }
                  let redirect = encodeURIComponent(redirectUrl);
                  let wxconfig = await ctx.service.shop.getShopConfigByCardId(q.card_id);
                  //console.log('wxconfig:',wxconfig)
                  await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
            }

            if (cardId != undefined) {
              //  console.log('params cardId:',cardId)
               // console.log('params openId:',openId)
                let userinfo = await ctx.service.user.getMemberCardUserInfo(cardId,q.openid);
               // console.log('uersinfo:',userinfo)
                shopId = userinfo ? userinfo.shopId : shopId;
            }
            if(token == undefined || token == ''){
                token = await ctx.service.user.getToken(shopId, q.openid);
                console.log('getToken:',token)
            }
            return {
                  openId : q.openid,
                  token : token,
                  shopId : shopId,
                  cardId : cardId,
                  tabIndex : q.index
            }
        }
        async index() {
       
            const baseInfo = await this.getBaseInfo();
            console.log('baseinfo:',baseInfo)
            await this.ctx.render('tabsIndex', {'baseInfo':baseInfo});
        }
     
    }
    return TopBarsController;
}