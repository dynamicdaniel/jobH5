const Controller = require('../core/base_controller');
module.exports = (app) => {
    class HomeController extends Controller {
        async index() {
            // render view template in `app/views`
            const {
                ctx,
                app
            } = this;
            let q = ctx.query;

            //  判断什么系统访问页面
            let userAgent = ctx.request.headers['user-agent'];
            let is_weixin = false;
            if (userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
                is_weixin = true;
            }

            console.log("是否是微信",is_weixin);

            if (is_weixin) {
                await this.gotoWeixin(q, app, ctx);
            } else {
                await this.gotoAli(q, app, ctx);
            }
        }

        async gotoWeixin(q, app, ctx) {
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

                if (q.card_id != undefined) {
                    let wxconfig = await ctx.service.shop.getShopConfigByCardId(q.card_id);
                    if (wxconfig != undefined) {
                        await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
                        return;
                    }
                }

                if (q.deviceNo != undefined) {
                    let wxconfig = await ctx.service.shop.getShopConfigByDeviceNo(q.deviceNo);
                    if (wxconfig != undefined) {
                        await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
                        return;
                    }
                }

                if (q.shopId != undefined) {
                    let wxconfig = await ctx.service.shop.getShopConfig(q.shopId);
                    if (wxconfig != undefined) {
                        await ctx.redirect(`${app.config.app.wxprex}?appId=${wxconfig.appId}&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
                    }
                }
            } else {
                let shopId = q.shopId;
                let userinfo = {};
                let storeId;
                let storeName;
                let cardId;
                let payConfig = undefined; // 支付配置
                let isActivate = false;
                if (q.deviceNo != undefined) {
     
                    userinfo = await ctx.service.user.getMemberCardUserInfoWithDeviceNo(q.deviceNo, q.openid);

                    if (userinfo != undefined) {
                        shopId = userinfo.shopId;
                        storeId = userinfo.storeId;
                        storeName = userinfo.storeName;
                        cardId = userinfo.cardId;
                        payConfig = userinfo.payConfig;
                        userinfo = userinfo.userinfo;
                        // isActivate = !!userinfo.memberInfo.membership_number;
                    }
                } else {
                    if (q.card_id != undefined) {
                        userinfo = await ctx.service.user.getMemberCardUserInfo(q.card_id, q.openid);
                        shopId = userinfo ? userinfo.shopId : shopId;
                        cardId = q.card_id;
                    }
                }

                let token = await ctx.service.user.getToken(shopId, q.openid);
                let title = "";
                if (shopId != undefined) {
                    let shopDetail = await ctx.service.shop.getShopDetail(shopId);
                    if (shopDetail != undefined) {
                        title = shopDetail.shopName;
                    }
                }
                
                await this.ctx.render('index', {
                    deviceNo: q.deviceNo,
                    openId: q.openid,
                    shopId: shopId,
                    storeId: storeId,
                    storeName: storeName,
                    cardId: cardId,
                    token: token,
                    title: title,
                    commoninfo: userinfo,
                    payConfig: payConfig,
                    isWeixin: 1,
                });
            }
        }

        async gotoAli(q, app, ctx) {
            let shopId = q.shopId;
            let storeId;
            let storeName;
            let cardId;

            if (q.aliUserId == undefined) {
                let orderPrex = ctx.app.config.app.orderApi;
                let aliisv = await ctx.service.shop.getAliIsv(shopId, q.deviceNo);
                if (aliisv != undefined) {
                    let appid = aliisv.appId;
                    shopId = aliisv.redisKey;
                    this.ctx.logger.info(aliisv)
                    let redirect = encodeURIComponent(`${orderPrex}/o_trade/notify/alipayAuth?shopId=${shopId}&storeId=${q.storeId}&deviceNo=${q.deviceNo}`);
                    let aliAuthUrl = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appid}&scope=auth_base&redirect_uri=${redirect}`;
                    await ctx.redirect(aliAuthUrl);
                }
            } else {
                if (q.deviceNo != undefined) {
                    let device = await this.ctx.service.device.getDetailWithNo(q.deviceNo);
                    if (device != undefined) {
                        shopId = device.shopId;
                        storeId = device.storeId;
                        storeName = device.storeName;
                        cardId = device.cardId;
                    }
                } else {
                    if (q.card_id != undefined) {
                        // userinfo = await ctx.service.user.getMemberCardUserInfo(q.card_id,q.openid);
                        // shopId = userinfo.shopId;
                        // cardId = q.card_id;
                    }
                }

                let title = "";
                if (shopId != undefined) {
                    let shopDetail = await ctx.service.shop.getShopDetail(shopId);
                    if (shopDetail != undefined) {
                        title = shopDetail.shopName;
                    }
                }

                await ctx.render('index', {
                    deviceNo: q.deviceNo,
                    shopId: shopId,
                    storeId: storeId,
                    storeName: storeName,
                    cardId: cardId,
                    openId: q.aliUserId,
                    title: title,
                    isWeixin: 0,
                });
            }
        }
    }

    return HomeController;
};