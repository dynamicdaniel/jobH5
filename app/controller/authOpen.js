"use strict";

const Controller = require("../core/base_controller");
var OAuth = require("co-wechat-oauth");

class AuthOpenController extends Controller {
    async index() {
        const { ctx, app } = this;
        let query = ctx.query;
        let code = query.code;
        console.log("query_authOpenController", query);
        let appId = query.appId;
        let appSecret = query.appSecret;

        let redirect = query.redirect;
        redirect = encodeURIComponent(redirect);

        if (code == undefined) {
            let newredirect = decodeURIComponent(redirect);
            let frontUrlArray = newredirect.split("?");
            let newUrl = "";
            newUrl = `${frontUrlArray[0]}?appId=${appId}`;
            if (frontUrlArray.length > 1) {
                let paramsString = frontUrlArray[1].replace(/&/g, ",");
                newUrl = `${frontUrlArray[0]}?${paramsString}&appId=${appId}`;
                // newUrl = `${frontUrlArray[0]}?${frontUrlArray[1]}&appId=${appId}`;
            }

            const url = await this.ctx.service.wxAuth.getOAuthUrl(
                appId,
                `${app.config.app.wxprex}?redirect=` + newUrl,
                "",
                "snsapi_base"
            );

            await ctx.redirect(url);
        } else {
            try {
                var result = await this.ctx.service.wxAuth.getOAuthAccessToken(
                    appId,
                    code
                );

                var accessToken = result.data.access_token;
                var openid = result.data.openid;
                // var userInfo = await client.getUser(openid);
                console.log("获取用户信息");
                // console.log(userInfo)

                // this.ctx.logger.info(userInfo)

                let newredirect = decodeURIComponent(redirect);

                let frontUrlArray = newredirect.split("?");

                let newUrl = "";
                newUrl = `${frontUrlArray[0]}?openid=${openid}`;
                if (frontUrlArray.length > 1) {
                    let paramsString = frontUrlArray[1].replace(/,/g, "&");
                    newUrl = `${
                        frontUrlArray[0]
                    }?${paramsString}&openid=${openid}`;
                    // newUrl = `${frontUrlArray[0]}?${frontUrlArray[1]}&openid=${openid}`;
                }

                await ctx.redirect(newUrl);
            } catch (error) {
                const url = client.getAuthorizeURL(
                    `${app.config.app.wxprex}`,
                    "",
                    "snsapi_base"
                );
                await ctx.redirect(url);
            }
        }
    }

    // 授权易呗官方
    async authMain() {
        const { ctx, app } = this;
        let query = ctx.query;
        let code = query.code;

        let appId = app.config.app.ybAppId;

        let redirect = query.redirect;
        redirect = encodeURIComponent(redirect);

        if (code == undefined) {
            let newredirect = decodeURIComponent(redirect);
            let frontUrlArray = newredirect.split("?");
            let newUrl = "";
            newUrl = `${frontUrlArray[0]}?appId=${appId}`;
            if (frontUrlArray.length > 1) {
                let paramsString = frontUrlArray[1].replace(/&/g, ",");
                newUrl = `${frontUrlArray[0]}?${paramsString}&appId=${appId}`;
            }

            const url = await this.ctx.service.wxAuth.getMainOAuthUrl(
                appId,
                `${app.config.app.wxAuthMain}?redirect=` + newUrl,
                "",
                "snsapi_base"
            );

            await ctx.redirect(url);
        } else {
            try {
                var result = await this.ctx.service.wxAuth.getOAuthAccessToken(
                    appId,
                    code
                );

                var accessToken = result.data.access_token;
                var openid = result.data.openid;

                let newredirect = decodeURIComponent(redirect);

                let frontUrlArray = newredirect.split("?");

                let newUrl = "";
                newUrl = `${frontUrlArray[0]}?mainopenid=${openid}`;
                if (frontUrlArray.length > 1) {
                    let paramsString = frontUrlArray[1].replace(/,/g, "&");
                    newUrl = `${
                        frontUrlArray[0]
                    }?${paramsString}&mainopenid=${openid}`;
                }

                await ctx.redirect(newUrl);
            } catch (error) {
                const url = client.getAuthorizeURL(
                    `${app.config.app.wxprex}`,
                    "",
                    "snsapi_base"
                );
                await ctx.redirect(url);
            }
        }
    }
}

module.exports = AuthOpenController;
