/**
 * 分享页面
 */
import React from "react";
import "./share.css";
import { getCardExtStr } from "../../actions/card";
import {
    Flex,
    WhiteSpace,
    Modal,
    Icon,
    Grid,
    NoticeBar,
    NavBar,
    Button,
    Toast
} from "antd-mobile";
import {
    getStoresByShopId,
    getShareInfo,
    getUserLever
} from "../../actions/home";
import WxCardView from "../compontent/wxcardview/wxcardview";
import { getMemberCardDetail } from "../../actions/card";
import {
    shareCard,
    shareCardToTimeline,
    getJsConfig,
    setShareMethods,
    ready,
    shareCArdOld,
    shareCardToTimelineOld,
    addCard,
    checkJSAPIAction,
    hideMenuItems
} from "../../actions/wx";
import { createQRCode } from "../../actions/card";
import {
    getShareData,
    viewSharePage,
    isUserActivity
} from "../../actions/share";
import imgUtil from "../../utils/imgUtil";
import config from "../../utils/config";

class Share extends React.Component {
    constructor(props) {
        super(props);
        this.shareId = props.userInfo.shareId;
        this.shopId = props.userInfo.shopId;
        this.cardId = props.userInfo.cardId;
        this.openId = props.userInfo.openId;
        this.cardDetail = props.userInfo.cardDetail;
        this.memberInfo = {};
        this.state = {
            shareDetail: {
                rewardScore: "",
                rewardMoney: "",
                cardArrayTitle: [],
                cardArrayTimes: [],
                instruction: ""
            },
            stores: [],
            memberCard: {},
            PicTxtList: [],
            hideShareImg: true,
            shareData: {},
            isUserActivity: false
        };

        getJsConfig(this.shopId).then(data => {
            hideMenuItems();
        });
    }

    componentDidMount() {
        // 设置浏览数
        viewSharePage(this.shareId, this.openId)
            .then(res => {})
            .catch(msg => {});

        // 获取商户后台分享设置中的数据
        getShareInfo({ cardId: this.cardId })
            .then(res => {
                console.log("分享数据：", res);
                let obj = {};
                if (
                    Object.keys(res).length > 0 &&
                    res.title &&
                    res.description &&
                    res.logo
                ) {
                    // 商户后台分享设置设置了标题，描述，logo才能进行分享
                    this.canShare = true;
                    obj.rewardScore = res.rewardScore;
                    obj.rewardMoney = res.rewardMoney / 100;
                    obj.cardArrayTitle = JSON.parse(
                        res.timeCardJson
                    ).sendTimeCardTitles.split(",");
                    obj.cardArrayTimes = JSON.parse(
                        res.timeCardJson
                    ).sendTimeCardNums.split(",");
                    obj.instruction = res.instruction;
                    obj.status = JSON.parse(res.timeCardJson).status;
                    this.setState({ shareDetail: obj });
                    this.shareToWxAction(res);
                } else {
                    this.canShare = false;
                }
            })
            .catch(msg => {
                console.log(msg);
            });

        // 获取该次分享行为的数据
        getShareData(this.shareId)
            .then(res => {
                // console.log(res)
                this.setState({ shareData: res });
            })
            .catch(msg => {
                console.log(msg);
            });

        getStoresByShopId(this.shopId)
            .then(data => {
                // console.log(data);
                if (data.list.length > 0) {
                    this.setState({
                        stores: data.list
                    });
                }
            })
            .catch(msg => {
                console.log(msg);
            });

        getMemberCardDetail({ cardId: this.cardId, shopId: this.shopId })
            .then(res => {
                this.setState({
                    memberCard: res,
                    PicTxtList: res.member_card.advanced_info.text_image_list
                });
            })
            .catch(msg => {
                console.log(msg);
            });

        isUserActivity(this.cardId, this.openId)
            .then(res => {
                console.log("isUserActivity:", res);
                this.setState({ isUserActivity: res });
            })
            .catch(msg => {});
    }

    // 设置分享的消息体
    shareToWxAction = res => {
        let title = res.title || "分享会员卡";
        let desc = res.description || "";
        let link = `${config.httpType}://${config.testPrefix}m.${
            config.DOMAIN_NAME
        }/share?id=${this.shareId}`;
        let imgUrl = res.logo;

        getJsConfig(this.shopId).then(data => {
            setShareMethods(title, desc, link, imgUrl);
        });
    };

    // 渲染顶部卡片
    renderCardView = () => {
        return (
            <WxCardView
                cardDetail={this.cardDetail}
                memberInfo={this.memberInfo}
            />
        );
    };

    // 渲染图文信息
    renderPicTxtView = () => {
        return (
            <div className="pictxtStyle">
                {this.state.PicTxtList.map((item, index) => {
                    return (
                        <div className="pictxtitem" key={index}>
                            <img
                                src={imgUtil.getWxImgUrl(item.image_url)}
                                className="shareImgStyle"
                            />
                            <div className="shareTxtStyle">{item.text}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // 渲染门店列表
    renderStores = () => {
        return (
            <div className="storeLstStyle">
                {this.state.stores.map(item => {
                    return (
                        <div key={item.id} className="storeItemStyle">
                            <div className="storeInfoStyle">
                                <div className="storeNameStyle">
                                    {item.storeName}
                                </div>
                                <div className="storeAddressStyle">
                                    {item.address}
                                </div>
                            </div>
                            <img
                                src={require("../../images/icon_location.png")}
                                className="storeLocationLogo"
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    // 显示分享提示
    showShareInfo = () => {
        if (this.canShare) {
            this.setState({ hideShareImg: false });
        } else {
            Toast.info("您还无法分享，请联系商家进行分享设置", 2, null, false);
        }
    };

    // 渲染分享提示页面
    renderShareImg = () => {
        return (
            <div hidden={this.state.hideShareImg}>
                <img
                    src={`https://ybimage.yishouyun.net/h5/bg_share.png`}
                    className="shareimg"
                />
            </div>
        );
    };

    // 跳转到分享二维码页面
    toSharePage = () => {
        let sharePage =
            "/sharepage/" +
            this.shareId +
            "?openid=" +
            this.openId +
            "&card_id=" +
            this.cardId;
        if (this.state.isUserActivity) {
            window.location.assign(sharePage);
        } else {
            Toast.info("您还无法分享二维码", 2, null, false);
        }
    };

    // 跳转到分享记录页面
    toShareRecord = () => {
        let recordUrl =
            "/sharerecord/" +
            this.shareId +
            "?openid=" +
            this.openId +
            "&card_id=" +
            this.cardId;
        window.location.assign(recordUrl);
    };

    /**
     * 领取会员卡
     */
    getCardAction = () => {
        let outStr = {
            type: "h5_ewm",
            id: this.state.shareData.openId
        };

        let params = {
            shopId: this.shopId,
            paramsJson: JSON.stringify({
                openid: this.openId,
                card_id: this.cardId,
                outer_str: outStr
            })
        };
        // console.log(params)
        getCardExtStr(params).then(res => {
            console.log(res);
            res.outer_str = JSON.stringify(outStr);
            console.log(res);
            let lst = [];
            lst.push({ cardId: this.cardId, cardExt: JSON.stringify(res) });
            getJsConfig(this.shopId)
                .then(data => {
                    addCard(
                        lst,
                        res => {
                            // console.log(res);
                        },
                        error => {
                            // console.log(error);
                        }
                    );
                })
                .catch(msg => {
                    console.log(msg);
                });
        });
    };
    render() {
        let dateInfo = JSON.parse(this.cardDetail.date_info || "");
        let dateStr = "";
        if (dateInfo) {
            if (dateInfo.type == "DATE_TYPE_PERMANENT") {
                dateStr = "永久有效";
            } else if (dateInfo.type == "DATE_TYPE_FIX_TERM") {
                dateStr =
                    "领取后" +
                    (dateInfo.fixed_begin_term == 0
                        ? "当天"
                        : dateInfo.fixed_begin_term) +
                    "天生效,有效期" +
                    dateInfo.fixed_term +
                    "天";
            } else if (dateInfo.type == "DATE_TYPE_FIX_TIME_RANGE") {
                dateStr =
                    dateInfo.begin_timestamp + "至" + dateInfo.end_timestamp;
            }
        }

        let prerogative = undefined;
        if (this.state.memberCard.member_card) {
            prerogative = this.state.memberCard.member_card.prerogative;
        }
        let contactPhone = "";
        if (this.state.memberCard.member_card) {
            contactPhone = this.state.memberCard.member_card.base_info
                .service_phone;
        }

        const notice = this.cardDetail.notice;
        let instruction = this.state.shareDetail.instruction || "";

        return (
            <div className="allview11">
                {this.renderCardView()}
                <div className="shareBtnStyle">
                    {this.state.isUserActivity ? (
                        <div
                            className="shareBtn"
                            onClick={() => this.showShareInfo()}
                        >
                            立即分享
                        </div>
                    ) : (
                        <div
                            className="shareBtn"
                            onClick={() => this.getCardAction()}
                        >
                            立即领取
                        </div>
                    )}
                </div>
                <div className="shareTipsStyle">
                    <div className="title" onClick={() => this.toSharePage()}>
                        <div>我的分享二维码</div>
                    </div>
                    <div onClick={() => this.toShareRecord()} className="title">
                        <div>我的分享记录</div>
                    </div>
                </div>
                <div className="lable">分享说明</div>
                <div className="shareinfo">
                    {this.state.shareDetail.rewardScore > 0 ? (
                        <div>
                            <span>
                                赠送{this.state.shareDetail.rewardScore}积分
                            </span>
                            <br />
                        </div>
                    ) : null}
                    {this.state.shareDetail.rewardMoney > 0 ? (
                        <div>
                            <span>
                                赠送储值{this.state.shareDetail.rewardMoney}元
                            </span>
                            <br />
                        </div>
                    ) : null}
                    {
                        <div>
                            {this.state.shareDetail.status > 0 ? (
                                <span>
                                    赠送
                                    {this.state.shareDetail.cardArrayTitle.map(
                                        (item, index) => {
                                            return `${item}${
                                                this.state.shareDetail
                                                    .cardArrayTimes[index]
                                            }次;`;
                                        }
                                    )}
                                    <br />
                                </span>
                            ) : null}
                        </div>
                    }
                    <span>{this.state.shareDetail.instruction}</span>
                </div>
                <div className="lable">会员卡详情</div>
                <div className="detailStyle">
                    {prerogative ? (
                        <div className="detailItemStyle">
                            <div className="detailKey">特殊说明</div>
                            <div className="detailValue">{prerogative}</div>
                        </div>
                    ) : null}
                    <div className="detailItemStyle">
                        <div className="detailKey">有效日期</div>
                        <div className="detailValue">{dateStr}</div>
                    </div>
                    {contactPhone ? (
                        <div className="detailItemStyle">
                            <div className="detailKey">电话</div>
                            <div className="detailValue">{contactPhone}</div>
                        </div>
                    ) : null}
                    <div className="detailItemStyle">
                        <div className="detailKey">使用须知</div>
                        <div className="detailValue">{notice}</div>
                    </div>
                </div>
                <div className="lable">图文介绍</div>
                {this.renderPicTxtView()}
                <div className="lable">适用门店</div>
                {this.renderStores()}
                {this.renderShareImg()}
            </div>
        );
    }
}

export default Share;
