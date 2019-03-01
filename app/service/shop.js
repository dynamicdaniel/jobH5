const Service = require("../core/base_service");

class ShopService extends Service {
    async getShopDetail(shopId) {
        let url = "/api/m/shop/detail";
        let returnData = await this.post(url, {
            id: shopId
        });

        if (returnData.success) {
            let detail = returnData.data;

            return detail;
        }
        return undefined;
    }

    async getAliIsv(shopId, deviceNo) {
        let url = "/api/m/shop/aliisv";

        let sid = shopId;
        if (sid == undefined) {
            if (deviceNo != undefined) {
                let device = await this.ctx.service.device.getDetailWithNo(
                    deviceNo
                );
                sid = device.shopId;
                this.app.logger.info(sid);
            }
        }

        let wxconfigreturn = await this.post(url, {
            shopId: sid
        });

        if (wxconfigreturn.success) {
            let aliisv = wxconfigreturn.data;

            if (aliisv.appId != undefined) {
                return aliisv;
            } else {
                return undefined;
            }
        }
        return undefined;
    }

    async getShopConfig(shopId) {
        let wxconfigurl = "/api/m/shop/wxconfig";
        let wxconfigreturn = await this.post(wxconfigurl, {
            shopId: shopId
        });

        if (wxconfigreturn.success) {
            let wxconfig = wxconfigreturn.data;

            if (wxconfig.appId != undefined) {
                return wxconfig;
            } else {
                return undefined;
            }
        }
        return undefined;
    }

    async getShopConfigByDeviceNo(deviceNo) {
        let device = await this.ctx.service.device.getDetailWithNo(deviceNo);
        let shopId = device.shopId;

        let wxconfig = await this.getShopConfig(shopId);
        if (wxconfig != undefined) {
            return wxconfig;
        }
        return undefined;
    }

    async getShopConfigByCardId(cardId) {
        let card = await this.ctx.service.memberCard.getDetail(cardId);
        if (card != undefined) {
            let shopId = card.shopId;
            let wxconfig = await this.getShopConfig(shopId);
            if (wxconfig != undefined) {
                return wxconfig;
            }
        }
        return undefined;
    }

    /**
     * 根据代理商id获取代理商相关的配置
     * @param {Int} agentId 代理商的id
     */
    async getAgentConfigById(agentId) {
        let url = "/api/agent/detail";
        let params = {
            id: agentId
        };
        let agentDetail = await this.post(url, params);
        console.log("代理商详情", url, params, agentDetail);
        if (agentDetail && agentDetail.success && agentDetail.data) {
            return agentDetail.data;
        } else {
            return {
                wxAppId: ""
            };
        }
    }
}

module.exports = ShopService;
