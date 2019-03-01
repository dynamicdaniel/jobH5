import React from 'react';
import ReactDOM from 'react-dom';
import WeixinPay from './page/pay/weixinPay';

export default class View extends React.Component {
    static getPartial(props) {
        const { ctx, payUrl } = props;
        let userInfo = {
            payUrl: payUrl
        };
        return {
            html: <WeixinPay userInfo={userInfo} />,
        };
    }

    render() {
        const { html, helper, payUrl } = this.props;

        let userInfo = {
            payUrl: payUrl
        };

        return (
            <html>
                <head>
                    <title>微信支付</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
                    <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
                    <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
                    <link href={helper.asset('weixinPayIndex.css')} rel="stylesheet" type="text/css" />
                </head>
                <body>
                    <div id="payresult" dangerouslySetInnerHTML={{ __html: html }} />
                    <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
                    <script src={helper.asset('manifest.js')} />
                    <script src={helper.asset('weixinPayIndex.js')} />
                </body>
            </html>
        );
    }
}

if (__CLIENT__) {
    const userInfo = window.$$data;
    ReactDOM.hydrate(<WeixinPay userInfo={userInfo} />, document.getElementById('payresult'));
}