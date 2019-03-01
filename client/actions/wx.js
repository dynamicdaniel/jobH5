import fetchUtil from "../utils/fetchUtil";
import { resolve } from "path";

export const getJsConfig = shopId => {
    const data = {
        apilist:
            "scanQRCode;ready;updateTimelineShareData;updateAppMessageShareData;openLocation;getLocation;getNetworkType;openCard;addCard;onMenuShareAppMessage;onMenuShareTimeline;hideMenuItems",
        shopId: shopId
    };
    return fetchUtil
        .post("/mapi/getJsConfig", data)
        .then(
            rs => {
                // console.log('/mapi/getJsConfig:',rs)
                if (rs.success) {
                    rs.data.debug = true;
                    rs.data.jsApiList = [
                        "scanQRCode",
                        "ready",
                        "updateTimelineShareData",
                        "updateAppMessageShareData",
                        "openLocation",
                        "getLocation",
                        "getNetworkType",
                        "openCard",
                        "addCard",
                        "onMenuShareAppMessage",
                        "onMenuShareTimeline",
                        "hideMenuItems"
                    ];
                    window.wx.config(rs.data);
                } else {
                }
            },
            e => {}
        )
        .catch(e => {
            console.log(e);
        });
};

export const getNetworkType = (success, fail) => {
    window.wx.getNetworkType({
        success: function(res) {
            success(res);
        },
        fail: function(error) {
            fail(error);
        }
    });
};

export const openCard = (lst, success, fail) => {
    window.wx.openCard(
        {
            cardList: lst
        },
        {
            success: function(res) {
                success(res);
            },
            fail: function(err) {
                fail(err);
            }
        }
    );
};

export const getLocation = (callback, cancle, fail) => {
    window.wx.getLocation({
        type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
            callback(res);
        },
        cancel: function(res) {
            cancle();
        },
        fail: function() {
            fail();
        }
    });
};

/**
 * 
 * wx.addCard({
cardList: [{
cardId: '',
cardExt: ''
}], // 需要添加的卡券列表
success: function (res) {
var cardList = res.cardList; // 添加的卡券列表信息
}
});
 * "{"code": "", "openid": "", "timestamp": "1418301401", "signature":"f6628bf94d8e56d56bfa6598e798d5bad54892e5"}"
 */
export const addCard = (lst, success, fail) => {
    window.wx.addCard({
        cardList: lst,
        success: function(res) {
            success("addCard:", res);
        },
        fail: function(err) {
            fail(err);
        }
    });
};

export const shareCard = (title, desc, link, imgUrl, success, fail) => {
    window.wx.updateAppMessageShareData(
        {
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl // 分享图标
        },
        {
            success: function(res) {
                success(res);
            },
            fail: function(err) {
                fail(err);
            }
        }
    );
};

export const shareCArdOld = (title, desc, link, imgUrl, callback) => {
    window.wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: "link", // 分享类型,music、video或link，不填默认为link
        dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
            // 用户点击了分享后执行的回调函数
            console.log("success");
            callback("success");
        }
    });
};

export const ready = (callback, fail) => {
    window.wx.ready(function() {
        callback();
    });

    window.wx.error(function(err) {
        fail(err);
    });
};

export const shareCardToTimeline = (title, link, imgUrl, callback) => {
    window.wx.updateTimelineShareData(
        {
            title: title, // 分享标题
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl // 分享图标
        },
        function(res) {
            //这里是回调函数
            callback(res);
        }
    );
    // });
};

export const shareCardToTimelineOld = (title, link, imgUrl, callback) => {
    window.wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function() {
            // 用户点击了分享后执行的回调函数
            callback("");
        }
    });
};

export const checkJSAPIAction = (methods, callback) => {
    console.log(methods);
    // window.wx.checkJsApi({
    //     jsApiList: ['updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    //     success: function(res) {
    //         console.log('checkJSAPi')
    //         callback(res)
    //     // 以键值对的形式返回，可用的api值true，不可用为false
    //     // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    //     }
    // });

    window.wx.checkJsApi({
        jsApiList: ["chooseImage"], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
            console.log(res);
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    });
};

export const setShareMethods = (title, desc, link, imgUrl, success, fail) => {
    window.wx.ready(function() {
        console.log("readyfind");
        window.wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            type: "link", // 分享类型,music、video或link，不填默认为link
            dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
            success: function(res) {
                // 用户点击了分享后执行的回调函数
                console.log("success");
                console.log("onMenuShareAppMessage:", res);
                // callback('success')
            },
            complete: res => {
                console.log("onMenuShareAppMessage:", res);
            }
        });

        window.wx.onMenuShareTimeline({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function() {
                // 用户点击了分享后执行的回调函数
                // callback('')
            }
        });
    });
};

// 隐藏微信浏览器右上角设置选项
export const hideMenuItems = () => {
    window.wx.ready(function() {
        window.wx.hideMenuItems({
            menuList: [
                "menuItem:editTag",
                "menuItem:delete",
                "menuItem:copyUrl",
                "menuItem:originPage",
                "menuItem:readMode",
                "menuItem:openWithQQBrowser",
                "menuItem:openWithSafari",
                "menuItem:share:email",
                "menuItem:share:brand",
                "menuItem:share:qq",
                "menuItem:share:QZone"
            ]
        });
    });
};
export const scanCode = async () => {
    return new Promise(function(resolve, reject) {
        window.wx.ready(function() {
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function(res) {
                    //console.log('扫码成功')
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    resolve(result);
                }
            });
        });
    });
};
