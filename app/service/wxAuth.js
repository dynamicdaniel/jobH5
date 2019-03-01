const Service = require('../core/base_service');

class UserService extends Service {

    async getOAuthUrl(appId,redirect) {
        let url = '/api/wechat/getOAuthUrl'
        let params = {
            appId:appId,
            redirect:redirect,
            state:'',
            scope: 'snsapi_base'
        }
        let result = await this.post(url, params);

        let oauthUrl = "";
        if (result.success) {
            oauthUrl = result.data
        }

        return oauthUrl
    }

    async getMainOAuthUrl(appId,redirect,state,scope) {
        let url = '/api/wechat/getOAuthUrl'
        let params = {
            appId:appId,
            redirect:redirect,
            state:state,
            scope:scope
        }
        let result = await this.post(url, params);

        let oauthUrl = "";
        if (result.success) {
            oauthUrl = result.data
        }

        return oauthUrl
    }

    async getOAuthAccessToken(appId,code) {
        let url = '/api/wechat/getOAuthAccessToken'
        let params = {
            appId:appId,
            code:code,
        }
        let result = await this.post(url, params);
        return result
    }


    async getJsConfig(shopInfo,apilist,url) {
        let apiurl = '/api/wechat/getJsConfig'
        let params = {
            appId:shopInfo.appId,
            apilist:apilist,
            url:url
        }
        let result = await this.post(apiurl, params);

        // 微信公众号用
        // const api = new WechatAPI(wxconfig.appId, wxconfig.appSecret);
      
        // let apilist = data.apilist;

        // let jsApiList = apilist.split(';')

        // var param = {
        //     debug: false,
        //     jsApiList:jsApiList,
        //     url: url
        // };
        // let result = await api.getJsConfig(param);

        return result
    }
    

}

module.exports = UserService;