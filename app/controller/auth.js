'use strict';

const Controller = require('../core/base_controller');
var OAuth = require('co-wechat-oauth');
// var client = new OAuth('wxe271fc6e4cef04a4', '15b1d92f7299a82655d11db4b76338ee');
//测试用

class AuthController extends Controller {
  async index() {
    const {ctx,app} = this;
    let query = ctx.query;
    let code = query.code;

    let appId = query.appId;
    let appSecret = query.appSecret;

    let redirect = query.redirect;
    redirect =  encodeURIComponent(redirect)

    let client = new OAuth(appId, appSecret);

    if (code == undefined){
   
        let newredirect =  decodeURIComponent(redirect);
        let frontUrlArray = newredirect.split("?");
        let newUrl = "";
        newUrl = `${frontUrlArray[0]}?appId=${appId}&appSecret=${appSecret}`;
        if (frontUrlArray.length > 1){
            newUrl = `${frontUrlArray[0]}?${frontUrlArray[1]}&appId=${appId}&appSecret=${appSecret}`;
        }

        console.log("新的url");
        console.log(newUrl);

        const url = client.getAuthorizeURL(`${app.config.app.wxprex}?redirect=` + newUrl, '', 'snsapi_base');
        await ctx.redirect(url);
    }else{
        try {
            var token = await client.getAccessToken(code);
            var accessToken = token.data.access_token;
            var openid = token.data.openid;

            let newredirect =  decodeURIComponent(redirect);
            console.log("最新的url");
            console.log(newredirect);

            let frontUrlArray = newredirect.split("?");
            let newUrl = "";
            newUrl = `${frontUrlArray[0]}?openid=${openid}`;
            if (frontUrlArray.length > 1){
                newUrl = `${frontUrlArray[0]}?${frontUrlArray[1]}&openid=${openid}`;
            }

            console.log(newUrl);

            await ctx.redirect(newUrl);
        } catch (error) {
            const url = client.getAuthorizeURL(`${app.config.app.wxprex}`, '', 'snsapi_base');
            await ctx.redirect(url);
        }
    }
  }
}

module.exports = AuthController;
