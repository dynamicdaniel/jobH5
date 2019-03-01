import React from 'react';
import './authAli.css';

class AuthAliView extends React.Component{

    constructor(props){
        super(props);
    }


    closePage = () =>{
        // window.WeixinJSBridge.call('closeWindow')
        window.AlipayJSBridge.call("closeWebview");
        document.addEventListener('AlipayJSBridgeReady', function () {
            window.AlipayJSBridge.call("closeWebview");
        });
    }

    render(){
        let statusView = <div className='payview'>
            <img src="http://ybimage.yishouyun.net/h5/icon_head_success.png" className='headsuccess' />
            <div className='payresult'>
                <div className='paysuccess_price'>授权成功！</div>
            </div>
        </div>
        return <div className="result-example">
            {statusView}
            <div className='authBtn' onClick={()=> this.closePage()}>关闭</div>
        </div>
    }
}

export default AuthAliView;
