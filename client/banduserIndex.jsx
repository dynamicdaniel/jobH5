import React from 'react';
import ReactDOM from 'react-dom';
import BandUser from './page/banduser/bandUser';

export default class View extends React.Component {
    static getPartial(props) {
      const { ctx, shopId , userId , openId,unionId} = props;
      let userInfo = {
        shopId: shopId,
        userId: userId,
        openId : openId,
        unionId: unionId, 
      };
      return {
        html: <BandUser userInfo={userInfo} />,
      };
    }
  
    render() {
      const { html, helper, shopId , userId  , openId,unionId } = this.props;
  
      let userInfo = {
        shopId: shopId,
        userId: userId,
        openId: openId,
        unionId:unionId,
      };
  
      return (
        <html>
          <head>
            <title>绑定员工</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
            <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
            <link href={helper.asset('banduserIndex.css')} rel="stylesheet" type="text/css" />
          </head>
          <body>
            <div id="banduser" dangerouslySetInnerHTML={{ __html: html }} />
            <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
            <script src={helper.asset('manifest.js')} />
            <script src={helper.asset('banduserIndex.js')} />
          </body>
        </html>
      );
    }
  }
  
  if (__CLIENT__) {
    const userInfo = window.$$data;
    ReactDOM.hydrate(<BandUser userInfo={userInfo} />, document.getElementById('banduser'));
  }