import React from 'react';
import ReactDOM from 'react-dom';
//花开嫣然
// import BalanceView from './page/vips/vips';
//普通商户
import BalanceView from './page/balance/balance';

export default class View extends React.Component {
  static getPartial(props) {
    const { ctx, openid, card_id, commoninfo, token,shopId } = props;
    let userInfo = {
      openId: openid,
      shopId:shopId,
      cardId: card_id,
      token: token,
      commonInfo:commoninfo
    };
    return {
      html: <BalanceView userInfo={userInfo} />,
    };
  }

  render() {
    const { html, helper, openid, card_id, token,commoninfo ,shopId} = this.props;

    let userInfo = {
      openId: openid,
      shopId:shopId,
      cardId: card_id,
      token: token,
      commonInfo:commoninfo
    };

    return (
      <html>
        <head>
          <title>尊享会员卡</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
          <link href={helper.asset('balanceIndex.css')} rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="balance" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('balanceIndex.js')} />
          {/* <script src="http://192.168.2.148:7001/build/manifest.js" />
        <script src="http://192.168.2.148:7001/build/index.js" />  */}
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {
  const userInfo = window.$$data;
  ReactDOM.hydrate(<BalanceView userInfo={userInfo} />, document.getElementById('balance'));
  // ReactDOM.hydrate(<Vips userInfo={userInfo} />, document.getElementById('balance'));
}
