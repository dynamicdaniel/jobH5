const Service = require('egg').Service;
const sign = require('../utils/sign')

class BaseService extends Service {
    async get(url){
        const result = await this.app.curl(url, {
            dataType: 'json',
        });
        return result.data;;
    }    

    async post(url,params){

        let token = params.token;
        let header = {};
    
         if (token != undefined){
             header = {"Authorization":"Bearer "+token,}
         }
         
         const result = await this.ctx.curl(this.app.config.app.httpprex + url, {
             // 自动解析 JSON response
             dataType: 'json',
             method: 'POST',
             data: sign.api(params),
             headers: header,
             // 30 秒超时
             timeout: 30000,
         });
    
         let rs = result.data;
         
         return rs;
     }
}

module.exports = BaseService;