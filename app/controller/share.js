const Controller = require("../core/base_controller");

module.exports = app => {
    console.log("shareController==app:", app);
    class ShareController extends Controller {
        async index() {
            const { ctx, app } = this;
            console.log("shareController-this_app==", app);
            let q = ctx.query;
            let shopId = 0;
            let cardDetail = {};
            console.log("shareRequest===", ctx.request);
            let url = ctx.request.originalUrl;
            console.log("originalURL===", url);
            let redirect = encodeURIComponent(url);

            let cardId = "";

            if (q.card_id) {
                let res = await ctx.service.memberCard.getDetail(q.card_id);
                shopId = res.shopId;
                cardDetail = res;
                cardId = q.card_id;
            } else {
                // 根据id 取 card_id
                if (q.id) {
                    let res = await ctx.service.share.getShareData(q.id);
                    cardId = res.card_id;
                    let res2 = await ctx.service.memberCard.getDetail(cardId);
                    shopId = res2.shopId;
                    cardDetail = res2;
                }
            }

            if (q.id) {
                if (q.openid) {
                    await this.ctx.render("shareIndex", {
                        cardId: cardId,
                        openId: q.openid,
                        shareId: q.id,
                        shopId: shopId,
                        cardDetail: cardDetail
                    });
                } else {
                    // 取openId
                    if (cardId != undefined) {
                        let wxconfig = await ctx.service.shop.getShopConfigByCardId(
                            cardId
                        );
                        if (wxconfig != undefined) {
                            let url = `${app.config.app.wxprex}?appId=${
                                wxconfig.appId
                            }&appSecret=${
                                wxconfig.appSecret
                            }&redirect=${redirect}`;
                            await ctx.redirect(
                                `${app.config.app.wxprex}?appId=${
                                    wxconfig.appId
                                }&appSecret=${
                                    wxconfig.appSecret
                                }&redirect=${redirect}`
                            );
                            return;
                        }
                    }
                }
            } else {
                // 获取 shareId
                let openId = q.openid;
                if (q.openid) {
                    let res = await ctx.service.share.getShareId(
                        cardId,
                        openId
                    );
                    // console.log('shareId')
                    // console.log(res)
                    await this.ctx.render("shareIndex", {
                        cardId: cardId,
                        openId: q.openid,
                        shareId: res,
                        shopId: shopId,
                        cardDetail: cardDetail
                    });
                } else {
                    // 取openId
                    if (cardId != undefined) {
                        let wxconfig = await ctx.service.shop.getShopConfigByCardId(
                            cardId
                        );
                        if (wxconfig != undefined) {
                            await ctx.redirect(
                                `${app.config.app.wxprex}?appId=${
                                    wxconfig.appId
                                }&appSecret=${
                                    wxconfig.appSecret
                                }&redirect=${redirect}`
                            );
                            return;
                        }
                    }
                }
            }
        }
    }
    return ShareController;
};
