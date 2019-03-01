import React from 'react';

import { getCardShopDetail } from '../../actions/card';
import { UserContext } from '../../userContext';
import { Flex, Modal, Toast } from 'antd-mobile';
import '../cardshop/cardShopDetail.css';
import { createTempOrder, gotoPay } from '../../actions/order';

const alert = Modal.alert;

class TempPay extends React.Component {

    constructor(props) {
        super(props)
        console.log(props.userInfo)
        this.cardDetail = props.userInfo.commonInfo.cardDetail;
        this.cardId = props.userInfo.cardId
        this.shopId = props.userInfo.commonInfo.shopId;

        this.state = {
            bonusDetail: {},
            showGetDialog: false,
            payInfo: {}
        }
        this.getCardId = 0
    }

    componentDidMount() {

    }


    createOrder = () => {
        let token = this.props.userInfo.token;

        let params = {
            payType: 1,//微信支付
            token: token,
            shopId: this.props.userInfo.shopId,
        }

        if (this.props.userInfo.cardId) {
            let cardId = this.props.userInfo.cardId;
            params.cardId = cardId;
        }

        if (this.props.userInfo.deviceNo) {
            let deviceNo = this.props.userInfo.deviceNo;
            params.deviceNo = deviceNo;
        }

        if (this.props.userInfo.storeId){
            params.storeId = this.props.userInfo.storeId ;
        }

        console.log(params);
        Toast.loading('加载中...')
        let that = this;
        createTempOrder(params).then((rs) => {
            Toast.hide();
            this.setState({ payInfo: rs })
            this.toPayAction()
        }).catch(msg => {
            console.log('createCardOrder ========= error')
            console.log(msg)
            Toast.hide();
        })
    }

    toPayAction = () => {
        let params = {
            token: this.props.userInfo.token,
            openId: this.props.userInfo.openid,
            tradeId: this.state.payInfo.id,
            shopId: this.props.userInfo.shopId,
        }

        let deviceNo = this.props.userInfo.deviceNo;
        let openId = this.props.userInfo.openid;
        gotoPay(params).then(res => {
            console.log(res)
            let resultUrl = `/temppaySuccess?deviceNo=${deviceNo}&orderNo=` + res.orderNo+'&openId='+openId
            if (res.type == "XLP") {
                let payload = res.payload;
                let xlUrl = `https://showmoney.cn/scanpay/unified?data=${payload}`;
                window.location.assign(xlUrl)
            } else if (res.type == "WXP") {
                this.WxPay(res)
            } else {
                window.location.assign(resultUrl + '&status=fail' )
            }
        }).catch(msg => {
            console.log(msg)
        })
    }


    WxPay = (res) => {
        console.log('开始微信支付')
        let deviceNo = this.props.userInfo.deviceNo;
        let openId = this.props.userInfo.openid;
        // let resultUrl = '/payresult?orderNo=' + res.orderNo
        let resultUrl = `/temppaySuccess?deviceNo=${deviceNo}&orderNo=` + res.orderNo+'&openId='+openId
        let data = res.payload
        let params = {
            "appId": data.appId,     //公众号名称，由商户传入
            "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": data.nonceStr, //随机串
            "package": data.package,
            "signType": 'MD5',         //微信签名方式：
            "paySign": data.sign //微信签名
        }
        console.log(params)
        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', params,
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.assign(resultUrl + '&status=success')
                } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                    //支付取消
                    window.location.assign(resultUrl + '&status=fail')
                } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
                    //支付失败
                    window.location.assign(resultUrl + '&status=fail')
                }
            }
        );
    }



    render() {

        return <div className='allview222'>
            <div className='scview1'>
                <img src='https://ybimage.yishouyun.net/temp1.png' style={{width:'100%'}} />
                <img src='https://ybimage.yishouyun.net/temp2.png' style={{width:'100%'}}/>
                <img src='https://ybimage.yishouyun.net/temp3.png' style={{width:'100%'}}/>
            </div>
            <div className='bottomView'>
                <div className='points'>{12 + '元'}</div>
                <div className='btnview' onClick={() =>
                    this.createOrder()
                }>购买</div>
            </div>
        </div>

    }
}



const TempPayConsumer = ({ match }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <TempPay
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default TempPayConsumer
