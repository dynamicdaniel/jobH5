import fetchUtil from "../utils/fetchUtil";
import clientConfig from '../clientConfig';
const preurl = clientConfig.preurl;


export const getChannelDetail = (params) => {
    return fetchUtil.commonRequest(preurl + '/api/m/sepAccQrcode/detail', params);//获取通道详情
}