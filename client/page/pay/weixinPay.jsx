import React, { Component } from 'react';
import Qrcode from 'qrcode.react';
import "./weixinPay.css";

class WeixinPay extends Component {
    constructor(props){
        super(props);
        console.log("weixin pay", props);
        this.state = {
            payUrl: props.userInfo.payUrl,
            qrcodeImage: null
        };
    }

    componentDidMount = () => {
        // let canvas = document.getElementById("qrcode");
        // console.log(canvas);
        // let image = new Image();
        // image.src = canvas.outerHTML.toDataURL("image/png");
        // console.log(image);
        // this.setState({
        //     qrcodeImage: image
        // });
    };

    render() {
        return (
            <div className="root">
                <Qrcode className="qrcode" value={this.state.payUrl} id="qrcode"/>
                {/* {this.state.qrcodeImage} */}
            </div>
        );
    }
}

export default WeixinPay;
