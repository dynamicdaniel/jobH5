import React from 'react';
import ReactDOM from 'react-dom';
import TestSvc from './page/testsvc/testsvc'; 
export default class View extends React.Component {

  static getPartial(props) {

    const { baseInfo } = props;

    return {
      html: <TestSvc info={baseInfo} />
    };
  }
  // componentDidMount() {
  //   if ('addEventListener' in document) {
  //       document.addEventListener('DOMContentLoaded', function() {
  //           FastClick.attach(document.body);
  //       }, false);
  //   }
  // }
  render() {
    const { html, helper, baseInfo} = this.props;
    return (
      <html>
        <head>
          <title>测试</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
          <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
          {/* <script src="https://res2.wx.qq.com/open/js/jweixin-1.4.0.js"></script> */}
           
          <link href={helper.asset('testsvcIndex.css')} rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: html }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(baseInfo)}` }} />
          <script src={helper.asset('manifest.js')} />
          <script src={helper.asset('testsvcIndex.js')} />
        </body>
      </html>
    );
  }
}

if (__CLIENT__) {

      const baseInfo = window.$$data;
      console.log('baseinfo:',baseInfo)
      
      ReactDOM.hydrate(<TestSvc info={baseInfo}/>, document.getElementById('root')) 
}
