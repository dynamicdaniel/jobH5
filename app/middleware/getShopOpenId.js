module.exports = options => {
    return async function getShopOpenId(ctx, next) {
        let app = ctx.app;
        let q = ctx.query;

        if (q.openid == undefined) {
            console.log("获取openid");
            let url = ctx.request.originalUrl;
            let host = ctx.request.host;
            let redirectUrl = "";
            if (ctx.app.config.app.isHttps) {
                redirectUrl = `https://${host}${url}`;
            } else {
                redirectUrl = `http://${host}${url}`;
            }
            let redirect = encodeURIComponent(redirectUrl);
            let agentId = q.agentId;
            let shopId = q.shopId;
            let deviceNo = q.deviceNo;
            let cardId = q.cardId;
            if (deviceNo != undefined) {
                let wxconfig = await ctx.service.shop.getShopConfigByDeviceNo(
                    deviceNo
                );
                if (wxconfig != undefined) {
                    await ctx.redirect(
                        `${app.config.app.wxprex}?appId=${
                            wxconfig.appId
                        }&appSecret=${wxconfig.appSecret}&redirect=${redirect}`
                    );
                }
            }

            if (cardId != undefined) {
                let wxconfig = await ctx.service.shop.getShopConfigByCardId(
                    cardId
                );
                if (wxconfig != undefined) {
                    console.log(`${app.config.app.wxprex}?appId=${
                        wxconfig.appId
                        }&appSecret=${wxconfig.appSecret}&redirect=${redirect}`);
                    await ctx.redirect(
                        `${app.config.app.wxprex}?appId=${
                            wxconfig.appId
                        }&appSecret=${wxconfig.appSecret}&redirect=${redirect}`
                    );
                }
            }

            if (shopId != undefined) {
                let wxconfig = await ctx.service.shop.getShopConfig(shopId);
                if (wxconfig != undefined) {
                    await ctx.redirect(
                        `${app.config.app.wxprex}?appId=${
                            wxconfig.appId
                        }&appSecret=${wxconfig.appSecret}&redirect=${redirect}`
                    );
                }
            }

            //如果参数中有agentId,获取代理商相关的参数，并且获取该微信号在对应公众号下的openId
            if (agentId != undefined) {
                let agentConfig = await ctx.service.shop.getAgentConfigById(
                    agentId
                );
                if (agentConfig != undefined) {
                    await ctx.redirect(
                        `${app.config.app.wxprex}?appId=${
                            agentConfig.wxAppId
                        }&appSecret=&redirect=${redirect}`
                    );
                }
            }
        } else {
            console.log("获取到了openid");
            await next();
        }
    };
};
