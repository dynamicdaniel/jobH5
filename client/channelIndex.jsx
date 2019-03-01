import React from 'react';
import ReactDOM from 'react-dom';
import Channel from './page/channel/channel';

export default class View extends React.Component {
  static getPartial(props) {
    const { configCode,openid ,shopId ,token } = props;
    let info = {
      configCode : configCode,
      openid : openid,
      token : token,
      shopId : shopId
    }
    return {
      html: <Channel info={info} />,
    };
  }

  render() {
    const { html, helper, configCode,openid,shopId,token} = this.props;

    let info = {
      configCode : configCode,
      openid : openid,
      token : token,
      shopId : shopId
    }
    console.log('info:',info)
    return (
      <html>
        <head>
          <title>储值</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
          <link href={helper.asset('channelIndex.css')} rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="channel" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(info)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('channelIndex.js')} />
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {
  const info = window.$$data;

  ReactDOM.hydrate(<Channel info={info} />, document.getElementById('channel'));
  // ReactDOM.hydrate(<Vips userInfo={userInfo} />, document.getElementById('balance'));
}
