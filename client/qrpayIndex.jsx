import React from 'react';
import ReactDOM from 'react-dom';
import Qrpay from './page/pay/qrpay'


export default class View extends React.Component {

  static getPartial(props) {

    const { baseInfo } = props;

    return {
      html: <Qrpay info={baseInfo} />
    };
  }
  
  render() {
    const { html, helper, baseInfo} = this.props;
    return (
      <html>
        <head>
          <title>付款码</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
          <link href={helper.asset('qrpayIndex.css')} rel="stylesheet" type="text/css" />

        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(baseInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('qrpayIndex.js')} />

        </body>
      </html>
    );
  }
}

if (__CLIENT__) {

      const baseInfo = window.$$data;
      console.log('qrpayIndex:',baseInfo)
      ReactDOM.hydrate(<Qrpay info={baseInfo}/>, document.getElementById('root')) 
}
