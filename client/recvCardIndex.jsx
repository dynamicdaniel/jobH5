import React from 'react';
import ReactDOM from 'react-dom';
import RecvCard from './page/numbercard/detail/component/recvCard';

export default class View extends React.Component {
    static getPartial(props) {
      const {openid,redisKey,cardid,id} = props;
      let hrefParams = {
        id : id,
        openid : openid,
        redisKey : redisKey,
        cardid : cardid
      };
      return {
        html: <RecvCard hrefParams={hrefParams} />,
      };
    }
  
    render() {
      const { html, helper,openid,redisKey,cardid,id} = this.props;
      let hrefParams = {
        id : id,
        openid : openid,
        redisKey : redisKey,
        cardid : cardid
      };

      return (
        <html>
          <head>
            <title>领取</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
            <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
            <link href={helper.asset('recvCardIndex.css')} rel="stylesheet" type="text/css" />
          </head>
          <body>
            <div id="recvCard" dangerouslySetInnerHTML={{ __html: html }} />
            <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(hrefParams)}` }} />
            <script src={helper.asset('manifest.js')} />
            <script src={helper.asset('recvCardIndex.js')} />
          </body>
        </html>
      );
    }
  }
  
  if (__CLIENT__) {
    const hrefParams = window.$$data;

    ReactDOM.hydrate(<RecvCard hrefParams={hrefParams} />, document.getElementById('recvCard'));
  }