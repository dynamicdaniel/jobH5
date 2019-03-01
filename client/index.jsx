import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

export default class View extends React.Component {
  static getPartial(props) {
    const { ctx, openId, shopId, cardId, token, deviceNo, storeId, storeName, commoninfo , payConfig,isWeixin } = props;
    return {
      html: <App userInfo={{
        openid: openId,
        shopId: shopId,
        cardId: cardId,
        deviceNo: deviceNo,
        storeId: storeId,
        storeName: storeName,
        token: token,
        commonInfo: commoninfo,
        payConfig: payConfig,
          isWeixin:isWeixin,
      }} location={ctx.req.url} context={{}} />,
    };
  }

    render() {
    const { html, helper, openId, shopId, storeId, storeName, deviceNo, title, cardId, token, commoninfo, payConfig,isWeixin } = this.props;

    let userInfo = {
      openid: openId,
      shopId: shopId,
      cardId: cardId,
      token: token,
      deviceNo: deviceNo,
      storeId: storeId,
      storeName: storeName,
      commonInfo: commoninfo,
      payConfig: payConfig,
      isWeixin:isWeixin
    }; 

    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
          {/* <script src ='https://cdn.jsdelivr.net/npm/jsbarcode@3.8.0/dist/JsBarcode.all.min.js'></script>
          <script src="https://res2.wx.qq.com/open/js/jweixin-1.4.0.js"></script> */}
          <link href={helper.asset('index.css')} rel="stylesheet" type="text/css" />
          <title>{title}</title>
        </head>
        <body>
          <div id="container" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('index.js')} />
          {/* <script src="http://lmmh5.hk1.tunnelfrp.cc/build/manifest.js" />
          <script src="http://lmmh5.hk1.tunnelfrp.cc/build/index.js" /> */}
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {
  const userInfo = window.$$data;
  // class AppWrapper extends React.Component{
  //
  //     componentDidMount = () => {
  //         if ('addEventListener' in document) {
  //             document.addEventListener('DOMContentLoaded', function() {
  //                 FastClick.attach(document.body);
  //             }, false);
  //         }
  //     };
  //
  //     render = () => {
  //         return <App userInfo={this.props.userInfo} />;
  //     }
  //
  // }
  ReactDOM.hydrate(<App userInfo={userInfo} />, document.getElementById('container'));
}

