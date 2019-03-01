import React from 'react';
import ReactDOM from 'react-dom';
import AuthAli from './page/authali/authAli';

export default class View extends React.Component {
  static getPartial(props) {
    const { ctx } = props;
    return {
      html: <AuthAli  />,
    };
  }

  render() {
    const { html, helper } = this.props;

    let userInfo = {};

    return (
      <html>
        <head>
          <title>支付宝授权</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
          <link href={helper.asset('authAliIndex.css')} rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="authali" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('authAliIndex.js')} />
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {
  const userInfo = window.$$data;
  ReactDOM.hydrate(<AuthAli />, document.getElementById('authali'));
}