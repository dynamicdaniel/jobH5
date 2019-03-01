import React from 'react';
import ReactDOM from 'react-dom';
//花开嫣然
// import BalanceView from './page/vips/vips';
//普通商户
import BalancePage from './page/BalancePage/BalancePage';

export default class View extends React.Component {
  static getPartial(props) {
    const { ctx, openid, commoninfo, token ,cardId ,shopId} = props;
    let userInfo = {
      openId: openid,
      shopId:shopId,
      cardId: cardId,
      commonInfo: commoninfo,
      token: token,
      cardId,cardId
    };
    return {
      html: <BalancePage userInfo={userInfo} />,
    };
  }

  render() {
    const { html, helper, openid, cardId, commoninfo, token ,shopId} = this.props;

    let userInfo = {
      openId:openid,
      shopId:shopId,
      cardId:cardId,
      commonInfo: commoninfo,
      token: token,
    };
    return (
      <html>
        <head>
          <title>尊享会员卡</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
          <link href={helper.asset('balancepageIndex.css')} rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="balancepage" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('balancepageIndex.js')} />
          {/* <script src="http://192.168.2.148:7001/build/manifest.js" />
        <script src="http://192.168.2.148:7001/build/index.js" />  */}
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {
  const userInfo = window.$$data;
  ReactDOM.hydrate(<BalancePage userInfo={userInfo} />, document.getElementById('balancepage'))
}
