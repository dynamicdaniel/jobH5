import React from "react";

import "./wxcardview.css";

import imgUtil from "../../../utils/imgUtil";

const colorMap = {
    Color010: "#63B359",
    Color020: "#2C9F67",
    Color030: "#509FC9",
    Color040: "#5885CF",
    Color050: "#9062C0",
    Color060: "#D09A45",
    Color070: "#E4B138",
    Color080: "#EE903C",
    Color081: "#F08500",
    Color082: "#A9D92D",
    Color090: "#DD6549",
    Color100: "#CC463D",
    Color101: "#CF3E36",
    Color102: "#5E6671"
};
export default class WxCardView extends React.Component {
    constructor(props) {
        super(props);
        this.cardDetail = props.cardDetail;
        this.memberInfo = props.memberInfo;
    }

    render() {
        let color = this.cardDetail.color;
        let backimg = imgUtil.getWxImgUrl(this.cardDetail.background_pic_url);
        let logoUrl = imgUtil.getWxImgUrl(this.cardDetail.logo_url);
        let number = this.memberInfo.membership_number || "888888888888";
        number = number.replace(/\s/g, "").replace(/(.{4})/g, "$1 ");

        return (
            <div className="padview">
                <div
                    className="cardViewStyle"
                    style={{
                        backgroundImage: `url(${backimg})`,
                        backgroundColor: `#${colorMap[color]}`
                    }}
                >
                    <div className="cardInfoStyle">
                        <img className="cardLogoStyle" src={logoUrl} />
                        <div className="shopInfoStyle">
                            <div className="shopname">
                                {this.cardDetail.brand_name}
                            </div>
                            <div className="cardname">
                                {this.cardDetail.title}
                            </div>
                        </div>
                    </div>
                    <div className="cardNoStyle">{number}</div>
                </div>
            </div>
        );
    }
}
