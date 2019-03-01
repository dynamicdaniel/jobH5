import React from "react";
import ReactDOM from "react-dom";
import ShareUpdate from "./page/share/shareUpdate";

export default class View extends React.Component {
    static getPartial(props) {
        const { ctx, cardId, shareId, openId, shopId, cardDetail } = props;
        let userInfo = {
            cardId: cardId,
            shareId: shareId,
            openId: openId,
            shopId: shopId,
            cardDetail: cardDetail
        };
        return {
            html: <ShareUpdate userInfo={userInfo} />
        };
    }

    render() {
        const {
            html,
            helper,
            cardId,
            shareId,
            openId,
            shopId,
            cardDetail
        } = this.props;

        let userInfo = {
            cardId: cardId,
            shareId: shareId,
            openId: openId,
            shopId: shopId,
            cardDetail: cardDetail
        };

        return (
            <html>
                <head>
                    <title>分享</title>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
                    />
                    <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js" />
                    <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js" />
                    {/* //res.wx.qq.com/open/js/jweixin-1.0.0.js */}
                    <link
                        href={helper.asset("shareIndex.css")}
                        rel="stylesheet"
                        type="text/css"
                    />
                </head>
                <body>
                    <div
                        id="share"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `window.$$data=${JSON.stringify(userInfo)}`
                        }}
                    />
                    <script src={helper.asset("manifest.js")} />
                    <script src={helper.asset("shareIndex.js")} />
                </body>
            </html>
        );
    }
}

if (__CLIENT__) {
    const userInfo = window.$$data;
    ReactDOM.hydrate(
        <ShareUpdate userInfo={userInfo} />,
        document.getElementById("share")
    );
}
