import React, { Component, Fragment } from 'react';
import { Flex, WhiteSpace, Button, Icon, Modal, List, InputItem, WingBlank, Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import './home.css';

import StoreList from './storeList'
import ChooseCoupon from './chooseCoupon'

import { getStores, userLogin, getUserLever, getUserCoupons } from '../../actions/home'
import { changeDiscountInfo, createChargeOrder, createOrder, gotoPay } from '../../actions/order';


import { UserContext } from '../../userContext';

import {getJsConfig,getNetworkType} from '../../actions/wx'

let moneyKeyboardWrapProps;

moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
};


function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

const payTypes = [{
    index: 1,
    title: '微信支付',
}, {
    index: 2,
    title: '储值卡支付'
}]

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLever: {},
            userCoupons: [],
            chooseCoupon: {},
            stores: [],
            currentStore: {},
            price: '',
            discountInfo: '',//优惠折扣
            judge: true,
            storeVisible: false,
            showChooseStore:false,
            modal1: false,
            couponVisible: false,
            disabled: true,
            clicked: true,
            showPayDialog: false,
            showPayType: false,
            payType: 1,
            currentPay: { title: '储值卡支付', index: 2 },
            showCardPayDialog: false, //储值卡支付对话框
            payInfo: {}, //支付信息
        }
        this.inputChange = this.inputChange.bind(this);
        this.changeCheckbox = this.changeCheckbox.bind(this);
    }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }

    onShowCardPayDialog = () => {
        this.setState({ showCardPayDialog: true })
    }
    onCloseCardPayDialog = () => {
        this.setState({ showCardPayDialog: false })
    }

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }

    componentDidMount() {

        let openid = this.props.userInfo.openid;
        let shopId = this.props.userInfo.shopId;

        getJsConfig(shopId).then((data) => {
            getNetworkType((res) => {
                console.log(res);
            },(error) => {
                console.log(error);
            })
        })

        if (this.props.userInfo.storeId != undefined){
            this.setState({currentStore:{
                id:this.props.userInfo.storeId,
                storeName:this.props.userInfo.storeName,
                showChooseStore:false,
            }})
        }else{
            getStores(shopId).then((data) => {
                console.log(data);
                if (data.list.length > 0) {
                    this.setState({
                            showChooseStore:true,
                            stores: data.list,
                            currentStore: data.list[0]
                        });
                }
            })
        }

        this.getUserInfo(this.props.userInfo.token, shopId);

    }


    changeDiscountInfo = () => {
        let coupondid;
        if (this.props.userInfo.cardId && this.props.userInfo.cardId.length > 0) {
            let cardId = this.props.userInfo.cardId;
            changeDiscountInfo(this.props.userInfo.token, parseInt(parseFloat(this.state.price) * 100), cardId).then((data) => {
                if (data.success) {
                    this.setState({ discountInfo: data.data });
                }
            })
        }
    }

    getUserInfo = (token, shopId) => {
        if (this.props.userInfo.cardId && this.props.userInfo.cardId.length > 0) {
            getUserLever(token, this.props.userInfo.cardId).then((data) => {
                this.setState({ userLever: data, showPayType: true, payType:3 });
            })
        } else {
            this.setState({ userLever: {}, showPayType: false, payType:1 });
        }
    }

    //开始支付流程
    startPayAction = () => {
        console.log("#######################创建订单信息#################");
        //如果存在 cardId 先获取折扣
        if (this.props.userInfo.cardId && this.props.userInfo.cardId.length > 0) {
            let cardId = this.props.userInfo.cardId;
            changeDiscountInfo(this.props.userInfo.token, parseInt(parseFloat(this.state.price) * 100), '', cardId).then((data) => {
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

        let token = this.props.userInfo.token;
        let shopId = this.props.userInfo.shopId;
        let discountInfo = this.state.discountInfo;
        let params = {
            token: token,
            shopId: shopId,
            orderType: 2,
            payType: this.state.payType
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
            params.originalAmount = parseInt(parseFloat(this.state.price) * 100)
        }


        Toast.loading('加载中...')
        let that = this;
        createOrder(params).then((rs) => {
            Toast.hide();
            let data = rs;
            this.setState({ payInfo: data })
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
            let resultUrl = '/payResult?shopId=' + this.props.userInfo.shopId + '&openid='
            + this.props.userInfo.openid

            if (res.data.type == "XLP"){
                let payload = res.data.payload;
                let xlUrl = `https://showmoney.cn/scanpay/unified?data=${payload}`;
                window.location.assign(xlUrl)
            }else if (res.data.type == "WXP"){
                this.WxPay(res.data.payload)
            }else{
                window.location.assign(resultUrl)
            }
        }).catch(msg => {
        })
    }


    WxPay = (data) => {
        // let czRecordUrl = '/recordrecharge?shopId=' + this.props.userInfo.commonInfo.shopId +
        //  '&openid=' + this.props.userInfo.openId

        let resultUrl = '/payresult?shopId=' + this.props.userInfo.shopId + '&openid='
            + this.props.userInfo.openid


        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": data.appId,     //公众号名称，由商户传入
                "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": data.nonceStr, //随机串
                "package": data.package,
                "signType": 'MD5',         //微信签名方式：
                "paySign": data.sign //微信签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.assign(resultUrl)
                }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            }
        );
    }

    onShowPayDialog = () => { this.setState({ showPayDialog: true }) }
    onClosePay = () => { this.setState({ showPayDialog: false }) }
    changePay = (item, i) => {
        let ptype = 1;//微信支付
        if (i == 0) {
            ptype = 1;
        } else {
            ptype = 3;
        }
        this.setState({ currentPay: item, showPayDialog: false, payType: ptype })
    }

    render() {

        let storeName = "";
        if (this.state.currentStore != undefined) {
            storeName = this.state.currentStore.storeName
        }

        let userLeverString = "";

        if (this.state.userLever.name != undefined) {
            userLeverString = `您是${this.state.userLever.name}`

            if (this.state.userLever.discount == 100) {
                userLeverString += ` , 暂时无法享受折扣`
            } else {
                userLeverString += ` , 可享受${this.state.userLever.discount / 10}折`
            }
        }

        let couponShowString = "";

        if (this.state.userCoupons.length > 0) {
            couponShowString = `您有${this.state.userCoupons.length}张优惠券`
            if (this.state.chooseCoupon.name != undefined) {
                couponShowString = `已选（${this.state.chooseCoupon.name}）`
            }
        } else {
            couponShowString = `暂无优惠券可用`
        }

        let showPayTypeString  = "微信支付";
        if (this.state.payType == 1){
            showPayTypeString  = "微信支付";
        }else if (this.state.payType == 3){
            showPayTypeString  = "储值卡支付";
        }

        return (
            <div className='alldiv'>

                <div className='storelable'>
                    <p>付款给<span style={{ marginLeft: '14px' }}>{storeName}</span>&nbsp;
                    {
                        this.state.showChooseStore? <a
                        onClick={() => this.setState({ storeVisible: true })}
                        href='#' style={{ textDecoration: 'underline', color: 'red' }}>更换</a>
                        :null
                    }
                   </p>
                </div>

                <div className='mainbox'>

                    <img src={require('../../images/logo组.png')} className='mainbox-logo' />

                    <div className='pricebox'>
                        <span style={{ fontSize: '18px', color: '#0f0f0f' }}>消费总额</span>
                        <span style={{ marginLeft: '20px', fontSize: '18px' }}>¥</span>
                        <input placeholder='询问店员后输入'
                            style={{
                                height: '30px',
                                lineHeight: '30px',
                                marginLeft: '12px',
                                fontSize: '25px',
                                width: '120px',
                                borderWidth: '0px',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                            type='number' onChange={this.inputChange} ref={(input) => { this.input = input }} value={this.state.price} />
                    </div>

                    <div className='line'></div>


                    <p style={{ color: 'rgb(153,153,153)', fontSize: '13px' }}>{userLeverString}</p>
                    {this.state.showPayType ?
                        <div className='paytype'>
                            <span className='label'>{'使用' + showPayTypeString}</span>
                            <div onClick={() => this.onShowPayDialog()}
                                style={{ textDecoration: 'underline', color: 'red' }}>更换</div>
                        </div> : null
                    }

                    <Button onClick={() => this.startPayAction()} type='primary' style={{ width: '300px', backgroundColor: 'rgb(26,173,25)' }} disabled={this.state.disabled}>立即付款</Button>

                    <Modal
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
                                    </div></Flex>
                            })}
                        </div>
                    </Modal>
                </div>

                <Modal
                    visible={this.state.showCardPayDialog}
                    onClose={this.onCloseCardPayDialog}
                    style={{ width: '95%', height: '500px' }}
                    maskClosable={true}>
                    <Flex direction='column'>
                        <img src={require('../../images/logo组.png')} style={{ width: '90px', height: '90px' }} />
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
                        <Flex.Item style={{ marginTop: '-20px' }}>
                            <Button type='primary' style={{ backgroundColor: 'rgb(26,173,25)', width: '330px' }} onClick={() => this.toPayAction(1)}>立即支付</Button>
                        </Flex.Item>
                    </Flex>
                </Modal>


                <StoreList
                    chooseStoreAction={(item) => this.setState({ currentStore: item, storeVisible: false })}
                    chooseStore={this.state.currentStore}
                    onClose={() => this.onClose('storeVisible')}
                    visible={this.state.storeVisible}
                    data={this.state.stores}
                    clicked={this.state.clicked} />
            </div>
        )
    }

    inputChange = (e) => {
        // var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        // if (exp.test(e.target.value)) {
        //     this.setState({
        //         price: e.target.value,
        //         disabled: false
        //     })
        // }
        if ((e.target.value).length != 0) {
            this.setState({
                price: e.target.value,
                disabled: false
            })
        }
        else {
            this.setState({
                price: e.target.value,
                disabled: true
            })
        }
    }

    changeCheckbox = (e) => {
        const newDatas = [...this.state.datas];
        for (var i = 0; i < newDatas.length; i++) {
            newDatas[i].text = 'checkbox';
            newDatas[i].text2 = 'checkbox2';
        }
        var x = newDatas[e.target.id].text;
        newDatas[e.target.id].text = newDatas[e.target.id].text2;
        newDatas[e.target.id].text2 = x;
        this.setState({
            clicked: !this.state.clicked,
            datas: newDatas
        })
    }
    judge() {
        for (var j = 0; j < this.state.datas.length; j++) {
            if (this.state.datas[j].text == 'checkbox2') {
                return (<span>{this.state.datas[j].img}</span>)
            }
        }
    }

}

const HomeConsumer = ({ }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <Home
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default HomeConsumer
