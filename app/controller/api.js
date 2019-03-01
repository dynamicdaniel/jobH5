'use strict';

const Controller = require('../core/base_controller');
var WechatAPI = require('co-wechat-api');

class ApiController extends Controller {
    async index() {
        const {ctx,app} = this;
        let data = ctx.request.body;
        let params = data.params;

        let token = params.token;
        let header = {};

        if (token != undefined){
        header = {"Authorization":"Bearer "+token,}
        }

        const result = await ctx.curl(data.url, {
        // 自动解析 JSON response
        dataType: 'json',
        method: 'POST',
        data:params,
        headers: header,
        // 3 秒超时
        timeout: 10000,
        });
        let rs = result.data;

        if (rs.success){
            this.success(rs.data);
        }else{
            this.error(rs.msg);
        }

    }

  async getJsConfig(){
      const {ctx,app} = this;
      var url =  ctx.request.get('Referer');
      //console.log('getJsConfig url:',url)
      let data = ctx.request.body;
     // console.log('getJsConfig data:',data)
      let wxconfig = await ctx.service.shop.getShopConfig(data.shopId);
    //  console.log('getShopConfig wxconfig:',wxconfig)
      let result  = await ctx.service.wxAuth.getJsConfig(wxconfig,data.apilist,url);
     // console.log('getJsConfig result:',result)
      if (result.success){
        this.success(result.data);
      }else{
          this.error("参数错误");
      }
  }
}

module.exports = ApiController;
