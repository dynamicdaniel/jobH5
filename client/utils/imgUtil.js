import config from "./config";
const imgUtil = {};
// http://mmbiz.qpic.cn/mmbiz_jpg/BTTAjWsCTBaoiaGQurZ5NianIHV4ibDUO9dgtia5G4ontXlz7ibdUsjMjFDBib4nQ4pSvNgRXj8ickUq9IpicpqZrMnt7A/0?wx_fmt=jpeg
// //m.yishouyun.net/mmbiz_jpg/BTTAjWsCTBaoiaGQurZ5NianIHV4ibDUO9dgtia5G4ontXlz7ibdUsjMjFDBib4nQ4pSvNgRXj8ickUq9IpicpqZrMnt7A/0?wx_fmt=jpeg
imgUtil.getWxImgUrl = url => {
    if (url) {
        if (url.indexOf("mmbiz.qpic.cn") > -1) {
            let logo = "";
            if (url.indexOf("https") !== -1) {
                logo = url.replace(
                    "https://mmbiz.qpic.cn",
                    `//m.${config.DOMAIN_NAME}`
                );
            } else if (url.indexOf("http") !== -1) {
                logo = url.replace(
                    "http://mmbiz.qpic.cn",
                    `//m.${config.DOMAIN_NAME}`
                );
            }
            return logo;
        } else {
            return url;
        }
    } else {
        return "";
    }
};

export default imgUtil;
