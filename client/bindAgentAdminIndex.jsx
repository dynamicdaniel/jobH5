import React from 'react';
import ReactDOM from 'react-dom';
import BindAgentAdmin from './page/banduser/bindAgentAdmin';

export default class View extends React.Component {
    static getPartial(props) {
        const { ctx, agentId, agentAdminId, openid, mainopenid } = props;
        let userInfo = {
            agentId, agentAdminId, openid, mainopenid
        };
        return {
            html: <BindAgentAdmin userInfo={userInfo} />,
        };
    }

    render() {
        const { html, helper, agentId, agentAdminId, openid, mainopenid } = this.props;
        let userInfo = {
            agentId, agentAdminId, openid, mainopenid
        };

        return (
            <html>
                <head>
                    <title>绑定代理商管理员</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
                    <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
                    <link href={helper.asset('bindAgentAdminIndex.css')} rel="stylesheet" type="text/css" />
                </head>
                <body>
                    <div id="bindAgentAdmin" dangerouslySetInnerHTML={{ __html: html }} />
                    <script dangerouslySetInnerHTML={{ __html: `window.$$data=${JSON.stringify(userInfo)}` }} />
                    <script src={helper.asset('manifest.js')} />
                    <script src={helper.asset('bindAgentAdminIndex.js')} />
                </body>
            </html>
        );
    }
}

if (__CLIENT__) {
    const userInfo = window.$$data;
    ReactDOM.hydrate(<BindAgentAdmin userInfo={userInfo} />, document.getElementById('bindAgentAdmin'));
}