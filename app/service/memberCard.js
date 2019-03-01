const Service = require("../core/base_service");

class MemberCardService extends Service {
    async getDetail(cardId) {
        let url = "/api/m/card/detail";
        let rs = await this.post(url, {
            cardId: cardId
        });
        console.log("getMemberCardService_detail====", rs);

        if (rs.success) {
            return rs.data;
        }
        return undefined;
    }
}

module.exports = MemberCardService;
