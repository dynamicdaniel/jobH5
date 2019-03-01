const Service = require('../core/base_service');

class TradeService extends Service {

    async gotoPay(tradeId,openid){
        let url = '/api/m/order/pay'
        let rs = await this.post(url, {
            tradeId: tradeId,
            openId:openid,
        });

        if (rs.success){
            return rs.data;
        }else{
            return rs.message;
        }
    }

}

module.exports = TradeService;

