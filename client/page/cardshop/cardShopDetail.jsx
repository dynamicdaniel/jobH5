import React from 'react';

import { getCardShopDetail } from '../../actions/card';
import { UserContext } from '../../userContext';
import CardInfoView from '../compontent/cardinfo/cardinfoView'
import { Flex, Modal, Toast } from 'antd-mobile';
import './cardShopDetail.css';
import { createCardOrder, gotoPay } from '../../actions/order';
import {getJsConfig, hideMenuItems} from '../../actions/wx';

const alert = Modal.alert;

class BonusDetail extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.userInfo);
        this.cardDetail = props.userInfo.commonInfo.cardDetail;
        this.cardId = props.userInfo.cardId;
        this.shopId = props.userInfo.commonInfo.shopId;

        this.state = {
            bonusDetail: {},
            showGetDialog: false,
            payInfo: {}
        };
        this.getCardId = 0;

        getJsConfig(this.shopId).then(data => hideMenuItems());
    }

    componentDidMount() {
        let params = { id: this.props.id }
        console.log('bonusDetail')
        getCardShopDetail(params).then(res => {
            console.log(res)
            this.setState({
                bonusDetail: res
            })
        }).catch(msg => {
            console.log(msg)
        });
    }


    createOpenCardOrderAction = () => {
        let token = this.props.userInfo.token;

        let params = {
            payType: 1,//微信支付
            cardId: this.cardId,
            token: token,
            shopId: this.shopId,
            goodsId: this.props.id,
            goodsType: 1,
        }
        // console.log(params);
        Toast.loading('加载中...')
        let that = this;
        createCardOrder(params).then((rs) => {
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

        console.log(params);
        gotoPay(params).then(res => {
            console.log(res)
            let resultUrl = '/payresult?orderNo=' + res.orderNo
            if (res.type == "KLP") {
                if (res && res.payload && res.payload.indexOf("alipay") !== -1) {
                    window.location.assign(res.payload);
                } else if (res && res.payload) {
                    this.WxPay2(res);
                }
            }else if (res.type == "XLP") {
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
        let resultUrl = '/payresult?orderNo=' + res.orderNo
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
                console.log(res)
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

    WxPay2 = (res) => {
        // alert(JSON.stringify(res));
        let data = res.payload;
        data = JSON.parse(data);
        let resultUrl = '/payresult?orderNo=' + res.orderNo;

        let params = {
            "appId": data.appId,     //公众号名称，由商户传入
            "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": data.nonceStr, //随机串
            "package": data.package,
            "signType": data.signType,         //微信签名方式：
            "paySign": data.paySign //微信签名
        }
        console.log(params);
        // alert(JSON.stringify(params));

        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', params,
            function (res) {
                console.log("微信支付结果", res);
                // alert('微信支付结果', JSON.stringify(res));
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.assign(resultUrl + '&status=success');
                } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                    //支付取消
                    window.location.assign(resultUrl + '&status=fail');
                } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
                    //支付失败
                    window.location.assign(resultUrl + '&status=fail');
                }
            }
        );
    }

    render() {
        let goodsPics = []
        let imgStr = this.state.bonusDetail.pics || ''

        if (imgStr.length > 0) {
            if (imgStr.indexOf(',') > -1) {
                goodsPics = imgStr.split(',')
            } else {
                goodsPics.push(imgStr)
            }
        }

        let price = parseFloat(this.state.bonusDetail.price / 100).toFixed(2)


        return <div className='allview222'>
            <div className='scview1'>
                <div className='cardview'>
                    <CardInfoView cardDetail={this.cardDetail} goodsDetail={this.state.bonusDetail} />
                </div>
                <div className='lable'>详情图片</div>
                <div className='detailimg'>
                    {
                        goodsPics.map((item, index) => {
                            return <img src={item} key={index} />
                        })
                    }
                </div>
                <div className='lable'>优惠详情</div>
                <div className='detail'>{this.state.bonusDetail.detail}</div>
                <div className='lable'>使用须知</div>
                <div className='detail'>{this.state.bonusDetail.instruction}</div>
            </div>
            <div className='bottomView'>
                <div className='points'>{price + '元'}</div>
                <div className='btnview' onClick={() =>
                    alert('温馨提醒', '确定花费' + price + '元购买' + this.state.bonusDetail.goodsName, [
                        { text: '取消', onPress: () => console.log('cancel') },
                        { text: '确定', onPress: () => this.createOpenCardOrderAction() },
                    ])
                }>购买</div>
            </div>
        </div>

    }
}



const PointsConsumer = ({ match }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <BonusDetail
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default PointsConsumer
