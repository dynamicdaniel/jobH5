import React from 'react';
import ReactDOM from 'react-dom';
import Activityuser from './page/user/activityuser';

export default class View extends React.Component {
  static getPartial(props) {
    const { ctx, activate_ticket, shopId,token,card_id, openid, commoninfo ,outId } = props;
    let userInfo = {
      outId:outId,
      openid: openid,
      token:token,
      card_id: card_id,
      shopId:shopId,
      activate_ticket: activate_ticket,
      commoninfo: commoninfo
    };
    return {
      html: <Activityuser userInfo={userInfo} />,
    };
  }

  render() {
    const { html, helper,shopId, token,activate_ticket, card_id, openid, commoninfo , outId } = this.props;

    let userInfo = {
      openid: openid,
      outId:outId,
      token:token,
      shopId:shopId,
      card_id: card_id,
      activate_ticket: activate_ticket,
      commoninfo: commoninfo
    };


    return (
      <html>
        <head>
          <title>激活会员卡</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
          <link href={helper.asset('userIndex.css')} rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="usercontainer" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('userIndex.js')} />
          {/* <script src="http://192.168.2.148:7001/build/manifest.js" /> 
        <script src="http://192.168.2.148:7001/build/index.js" />  */}
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {
  const userInfo = window.$$data;
  ReactDOM.hydrate(<Activityuser userInfo={userInfo} />, document.getElementById('usercontainer'));
}