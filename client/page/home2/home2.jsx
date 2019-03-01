import React, { Component, Fragment } from 'react';
import { Flex, WhiteSpace, Button, Icon, Modal, List, InputItem, WingBlank, Toast } from 'antd-mobile';
import { UserContext } from '../../userContext';
import './home2.css';
import StoreList from '../home/storeList'
import DeviceList from '../home/deviceList'
import { getStores, getUserLever, getUserCoupons } from '../../actions/home'
import { changeDiscountInfo, createChargeOrder, createOrder, gotoPay } from '../../actions/order';


const payTypes = [{
    index: 1,
    title: '微信支付',
}, {
    index: 2,
    title: '储值卡支付'
}]

class Home2 extends Component {

    constructor(props) {
        super(props)
        console.log(props.userInfo)
        this.state = {
            stores: [],
            currentStore: {},
            inputPrice: '',
            showStoreDialog: false,//显示门店选择对话框
            showPayDialog: false,//支付方式对话框
            showPayType: false,
            payType: 1,
            showCouponDialog: false,//选择优惠券
            currentPay: { title: '储值卡支付', index: 2 },
            userLever: {}, //会员等级
            userCoupons: [],//优惠券
            discountInfo: {},
            chooseCoupon: {},//当前优惠券
            showChooseStore: false,//
            payInfo: {}, //支付信息
            showCardPayDialog: false,
        }
    }

    componentDidMount() {
        let openid = this.props.userInfo.openid;
        let shopId = this.props.userInfo.shopId;
        let token = this.props.userInfo.token;


        if (this.props.userInfo.storeId != undefined) {
            this.setState({
                currentStore: {
                    id: this.props.userInfo.storeId,
                    storeName: this.props.userInfo.storeName,
                    showChooseStore: false,
                }
            })
        } else {
            getStores(shopId).then((data) => {
                console.log(data);
                if (data.length > 0) {
                    this.setState({
                        showChooseStore: true,
                        stores: data,
                        currentStore: data[0]
                    });
                }
            })
        }
        this.getUserInfo(token, shopId);
    }

    getUserInfo = (token, shopId) => {
        if (this.props.userInfo.cardId && this.props.userInfo.cardId.length > 0) {
            getUserLever(token, this.props.userInfo.cardId).then((data) => {
                this.setState({ userLever: data, showPayType: true, payType: 3 });
            })
        } else {
            console.log('cardId undefind')
            this.setState({ userLever: {}, showPayType: false, payType: 1 });
        }
    }

    // 输入金额校验
    inputValue = (value) => {
        let va = this.state.inputPrice;

        if (value == '.') {
            if (va.indexOf('.') > -1) {
                //已经有了 .
                return;
            } else {
                if (va.length == 0) {
                    //第一个 .
                    va = '0.'
                } else {
                    va += value + ''
                }
            }
        } else if (value == -1) {
            //删除
            if (va.length > 0) {
                va = va.substring(0, va.length - 1)
            }
        } else {
            if (va.indexOf('.') > -1) {
                if (va.length - va.indexOf('.') > 2) {
                    return;
                }
            }
            va += value + ''
        }
        this.setState({
            inputPrice: va
        })
    }

    //开始支付流程
    startPayAction = () => {
        console.log("#######################创建订单信息#################");
        let price = parseFloat(this.state.inputPrice)
        //如果存在 cardId 先获取折扣
        if (this.props.userInfo.cardId && this.props.userInfo.cardId.length > 0) {
            let cardId = this.props.userInfo.cardId;
            changeDiscountInfo(this.props.userInfo.token, parseInt(price * 100), '', cardId).then((data) => {
                console.log('changeDiscountInfo')
                if (data.success) {
                    this.setState({ discountInfo: data.data });
                    this.createOrderInfo()
                }
            })
        } else {
            this.createOrderInfo()
        }
    }

    //创建订单信息
    createOrderInfo = () => {
        console.log("#######################createOrderInfo#################");
        let price = parseFloat(this.state.inputPrice)
        let token = this.props.userInfo.token;
        let shopId = this.props.userInfo.shopId;
        let discountInfo = this.state.discountInfo;
        let params = {
            token: token,
            shopId: shopId,
            orderType: 2,
            payType: this.state.payType
            // storeId: this.state.currentStore.storeId,
            // deviceNo: this.state.currentStore.deviceNo
        }

        if (this.props.userInfo.cardId && this.props.userInfo.cardId.length > 0) {
            let cardId = this.props.userInfo.cardId;
            params.cardId = cardId;
        }

        if (this.props.userInfo.deviceNo && this.props.userInfo.deviceNo.length > 0) {
            let deviceNo = this.props.userInfo.deviceNo;
            params.deviceNo = deviceNo;
        }

        if (this.state.currentStore.id == undefined) {
            Toast.info("请选择门店")
            return;
        } else {
            params.storeId = this.state.currentStore.id
        }

        if (discountInfo.redisKey != undefined) {
            params.discountInfoRedisKey = discountInfo.redisKey
        } else {
            params.originalAmount = parseInt(price * 100)
        }


        Toast.loading('加载中...')
        createOrder(params).then((rs) => {
            Toast.hide();
            this.setState({ payInfo: rs })
            //根据支付方式
            if (this.state.payType == 3) {
                this.setState({ showCardPayDialog: true })
                return;
            } else {
                this.toPayAction(1)
            }
        }).catch(msg => {
            Toast.hide();
        })
    }

    toPayAction = (payType) => {
        let params = {
            token: this.props.userInfo.token,
            openId: this.props.userInfo.openid,
            shopId: this.props.userInfo.shopId,
            tradeId: this.state.payInfo.id
        }
        gotoPay(params).then(res => {
            console.log(res)
            let resultUrl = '/payresult?orderNo=' + res.orderNo
            if (res.type == "XLP") {
                let payload = res.payload;
                let xlUrl = `https://showmoney.cn/scanpay/unified?data=${payload}`;
                window.location.assign(xlUrl)
            } else if (res.type == "WXP") {
                this.WxPay(res)
            } else {
                window.location.assign(resultUrl)
            }
        }).catch(msg => {
        })
    }


    WxPay = (res) => {
        let data = res.payload
        let resultUrl = '/payresult?orderNo=' + res.orderNo

        let params = {
            "appId": data.appId,     //公众号名称，由商户传入
            "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": data.nonceStr, //随机串
            "package": data.package,
            "signType": 'MD5',         //微信签名方式：
            "paySign": data.sign //微信签名
        }
        console.log(params);

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

    pay = () => {
        let price = parseFloat(this.state.inputPrice)
        console.log(price)
        if (price > 0) {
            this.startPayAction()
        }
    }

    onShowCardPayDialog = () => { this.setState({ showCardPayDialog: true }) }
    onCloseCardPayDialog = () => { this.setState({ showCardPayDialog: false }) }
    onCloseStore = () => { this.setState({ showStoreDialog: false }) }
    onClosePay = () => { this.setState({ showPayDialog: false }) }
    onShowStoreDialog = () => { this.setState({ showStoreDialog: true }) }
    onShowPayDialog = () => { this.setState({ showPayDialog: true }) }
    changeStore = (store) => { this.setState({ currentStore: store, showStoreDialog: false }) }
    changePay = (item, i) => {
        let ptype = 1;//微信支付
        if (i == 0) {
            ptype = 1;
        } else {
            ptype = 3;
        }
        this.setState({ currentPay: item, showPayDialog: false, payType: ptype })
    }
    onCloseCoupon = () => { this.setState({ showCouponDialog: false }) }
    changeCoupon = (item) => { this.setState({ chooseCoupon: item, showCouponDialog: false }) }

    // 支付方式构建
    renderPayType = () => {
        return (<Modal
            popup
            visible={this.state.showPayDialog}
            onClose={this.onClosePay}
            animationType="slide-up">
            <div className='listview'>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: "center",
                    flexDirection: 'row',
                    height: '50px',
                    backgroundColor: "#eee"
                }}>选择支付方式</div>
                {payTypes.map((item, i) => {
                    let check = this.state.currentPay.title == item.title
                    return <Flex key={`paytype${i}`} onClick={() => this.changePay(item, i)}>
                        <div style={{
                            padding: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "center",
                            flexDirection: 'row',
                        }}>
                            <div style={{ width: '30px' }}>
                                {check ?
                                    <Icon type="check" size='sm' />
                                    : null
                                }
                            </div>
                            <div style={{
                                paddingTop: '5px',
                                paddingBottom: '5px'
                            }}>
                                <div style={{ color: 'black', fontSize: '15px' }}>{item.title}</div>
                            </div>
                        </div>
                        </Flex>
                })}
            </div>
        </Modal>)
    }
    //优惠券构建
    renderCoupon = () => {
        return (<Modal
            popup
            visible={this.state.showCouponDialog}
            onClose={this.onCloseCoupon}
            animationType="slide-up">
            <div className='listview'>
                <div className='head'>请选择优惠券</div>
                {this.state.userCoupons.map(item => {
                    return <div className='listitem' onClick={() => this.changeCoupon(item)}>
                        <div className='icon'>
                            <Icon type="check-circle" hidden={item.id != this.state.chooseCoupon.id} />
                        </div>
                        <div className='subitem'>
                            <text className='storename'>{item.name}</text>
                        </div>
                    </div>
                })}
                <div className='foot' onClick={() => this.onCloseCoupon()}>关闭</div>
            </div>
        </Modal>)
    }
    //门店构建
    renderStoreLst = () => {
        return (<DeviceList
            chooseStoreAction={(item) => this.setState({ currentStore: item, showStoreDialog: false })}
            chooseStore={this.state.currentStore}
            onClose={() => this.onCloseStore}
            visible={this.state.showStoreDialog}
            data={this.state.stores}
            clicked={this.state.clicked} />)
    }

    renderCardPay = () => {
        return (<Modal
            visible={this.state.showCardPayDialog}
            onClose={this.onCloseCardPayDialog}
            style={{ width: '90%', height: '300px', borderRadius: '5px' }}
            maskClosable={true}>
            <Flex direction='column'>
                {/* <img src={this.props.userInfo} style={{ width: '90px', height: '90px' }} /> */}
                <p style={{ transform: 'translateY(-20px)', color: 'black' }}>请确认付款信息</p>
                {
                    [
                        { e1: '付 款 给', e2: this.state.currentStore.storeName || '' },
                        { e1: '应付金额', e2: '¥' + parseFloat(this.state.payInfo.amount / 100).toFixed(2) },
                    ].map(
                        (item, index) => {
                            return (
                                <Flex.Item key={index} style={{ fontSize: '17px', width: '360px' }}>
                                    <WingBlank>
                                        <Flex >
                                            <div style={{ color: 'rgb(25,25,25)' }} >
                                                {item.e1}
                                            </div>
                                            <WingBlank><span style={{ color: 'gray', marginLeft: '10px' }}>{item.e2}</span></WingBlank>
                                        </Flex>
                                    </WingBlank>
                                </Flex.Item>
                            )
                        }
                    )
                }
            </Flex>
            <WhiteSpace size='lg' />
            <div style={{ width: '330px', height: '1px', backgroundColor: 'rgb(237,237,237)', margin: '0 auto' }} />
            <Flex direction='column'>
                <WhiteSpace size='sm' />
                <p style={{ color: 'black', fontSize: '18px' }}>实际支付金额</p>
                <p style={{ color: 'black', fontSize: '36px', marginTop: '-10px' }}>{'¥' + parseFloat(this.state.payInfo.totalAmount / 100).toFixed(2)}</p>
                <Flex.Item style={{ marginTop: '20px' }}>
                    <Button type='primary' style={{ backgroundColor: 'rgb(26,173,25)', width: '280px' }} onClick={() => this.toPayAction(1)}>立即支付</Button>
                </Flex.Item>
            </Flex>
        </Modal>)
    }

    render = () => {
        let userLeverString = "";
        if (this.state.userLever.name != undefined) {
            userLeverString = `您是${this.state.userLever.name}`
            if (this.state.userLever.discount == 100) {
                userLeverString += ` , 暂时无法享受折扣`
            } else {
                userLeverString += ` , 可享受${this.state.userLever.discount / 10}折`
            }
        }

        //优惠券
        let couponShowString = "";
        if (this.state.userCoupons.length > 0) {
            couponShowString = `您有${this.state.userCoupons.length}张优惠券`
            if (this.state.chooseCoupon.name != undefined) {
                couponShowString = `已选（${this.state.chooseCoupon.name}）`
            }
        } else {
            couponShowString = `暂无优惠券可用`
        }

        let storeName = "";
        if (this.state.currentStore != undefined) {
            storeName = this.state.currentStore.storeName +'(' + this.state.currentStore.deviceName +')'
        }

        let showPayTypeString = "微信支付";
        if (this.state.payType == 1) {
            showPayTypeString = "微信支付";
        } else if (this.state.payType == 3) {
            showPayTypeString = "储值卡支付";
        }

        return <div className='home-container'>
                <div className="shop_container">
                    <img src='http://ybimage.yishouyun.net/h5/icon_shop_logo.png' className='shoplogo' />
                    <text className='shopname'>{storeName}</text>
                    {
                        this.state.showChooseStore ? <a
                            onClick={() => this.setState({ showStoreDialog: true })}
                            href='#' className='changshop'>更换</a>
                            : null
                    }
               </div>
                <div className='price_container'>
                    <text className='pricelable'>金额</text>
                    <text className='input'>{this.state.inputPrice}</text>
                    <text className='rmb'>¥</text>
                </div>
                <div className='userleve'>
                    <text>{userLeverString}</text>
                </div>
                {
                    this.state.showPayType ? <div className='paytype'>
                        <text className='payname'>{'使用' + showPayTypeString}</text>
                        <text className='changepay' onClick={() => this.onShowPayDialog()}>更换</text>
                    </div> : null
                }

                <table className='table' cellspacing="0" cellpadding="0">
                    <tr className='toptr'>
                        <td className="paynum" onClick={() => this.inputValue(1)}>1</td>
                        <td className="paynum" onClick={() => this.inputValue(2)}>2</td>
                        <td className="paynum" onClick={() => this.inputValue(3)}>3</td>
                        <td className="paynum" onClick={() => this.inputValue(-1)}>
                            <div className="keybord-return">
                                <img src={require('../../images/keybord-return.png')}
                                    className='keybord-img' />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="paynum" onClick={() => this.inputValue(4)}>4</td>
                        <td className="paynum" onClick={() => this.inputValue(5)}>5</td>
                        <td className="paynum" onClick={() => this.inputValue(6)}>6</td>
                        <td rowspan="3" className="pay" onClick={() => this.pay()}>
                            <p>确认</p>
                            <p>支付</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="paynum" onClick={() => this.inputValue(7)}>7</td>
                        <td className="paynum" onClick={() => this.inputValue(8)}>8</td>
                        <td className="paynum" onClick={() => this.inputValue(9)}>9</td>
                    </tr>
                    <tr>
                        <td id="pay-zero" colspan="2" className="payzero" onClick={() => this.inputValue(0)}>0</td>
                        <td id="pay-float" className='paypoint' onClick={() => this.inputValue('.')}>.</td>
                    </tr>
                </table>
                {this.renderStoreLst()}
                {this.renderPayType()}
                {this.renderCoupon()}
                {this.renderCardPay()}
            </div>
    }
}




const HomeConsumer = ({ }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <Home2
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default HomeConsumer
