import React from 'react';
import ReactDOM from 'react-dom';
import PayResult from './page/payresult/payResult';

export default class View extends React.Component {
  static getPartial(props) {
    const { ctx, orderNo, status } = props;
    let userInfo = {
      orderNo: orderNo,
      status: status
    };
    return {
      html: <PayResult userInfo={userInfo} />,
    };
  }

  render() {
    const { html, helper, orderNo, status } = this.props;

    let userInfo = {
      orderNo: orderNo,
      status: status
    };

    return (
      <html>
        <head>
          <title>支付完成</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
          <link href={helper.asset('payResultIndex.css')} rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="payresult" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('payResultIndex.js')} />
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {
  const userInfo = window.$$data;
  ReactDOM.hydrate(<PayResult userInfo={userInfo} />, document.getElementById('payresult'));
}