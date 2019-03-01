const Service = require("../core/base_service");

class ShareService extends Service {
    //获取分享id
    async getShareId(cardId, openId) {
        let url = "/api/m/shareLink/getId";
        let returnData = await this.post(url, {
            cardId: cardId,
            openId: openId
        });
        console.log("shareService_shareId===", returnData);
        if (returnData.success) {
            let detail = returnData.data;
            return detail;
        } else {
            return undefined;
        }
    }

    async getShareData(shareId) {
        let url = "/api/m/shareLink/detail";
        let returnData = await this.post(url, {
            id: shareId
        });
        console.log("shareService_shareData===", returnData);
        if (returnData.success) {
            let detail = returnData.data;
            return detail;
        } else {
            return undefined;
        }
    }
}

module.exports = ShareService;
