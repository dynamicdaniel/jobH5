const Service = require('../core/base_service');

class DeviceService extends Service {

    async getDetailWithNo(deviceNo){
        let url = '/api/m/device/detailWithNo'
        let rs = await this.post(url, {
            deviceNo: deviceNo,
        });

        if (rs.success){
            return rs.data;
        }
        return undefined;
    }

}

module.exports = DeviceService;

