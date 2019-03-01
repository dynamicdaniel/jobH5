import React, { Component } from 'react';
import { Flex, WhiteSpace, Button, Icon, Modal, WingBlank, Toast,Picker } from 'antd-mobile';
import { UserContext } from '../../userContext';
import './pay.css';
import DeviceList from '../home/deviceList';
import { getDeviceList , getStores, getUserLever, getUserCoupons } from '../../actions/home';
import { changeDiscountInfo, createOrder, gotoPay,createNoUserOrder ,  getPayBeforeInfo } from '../../actions/order';
import { getJsConfig , getLocation, hideMenuItems } from '../../actions/wx';
import CustomKeyBoard from 'client/components/CustomKeyBoard';
import Bk from '../../components/Bk/Bk'
const payTypes = [{
    index: 1,
    title: '微信支付',
}, {
    index: 2,
    title: '储值卡支付'
}];
class Pay extends Component {

    constructor(props) {
        super(props);
        console.log('props', props);
        this.state = {
            show : 'hidden',
            stores: [],                 // 门店选择器列表
            currentStore: undefined,    // 选择支付的门店
            inputPrice: '',             // 输入的支付金额
            showStoreDialog: false,     // 显示门店选择器
            showPayDialog: false,       // 显示支付方式选择器
            showPayType: false,         // 是否显示更换支付方式的链接
            payType: 1,                 // 传入的支付方式类型
            showCouponDialog: false,    // 是否显示优惠券弹框
            currentPay: { title: '储值卡支付', index: 2 },      // 当前的支付方式对象
            userLever: {},              // 当前会员的等级
            userCoupons: [],            // 用户拥有的优惠券列表
            discountInfo: {},           // 请求获取的折扣信息
            chooseCoupon: {},           // 选择的优惠券
            showChooseStore: false,     // 是否显示更换门店的链接
            payInfo: {},                // 请求获取的支付信息
            showCardPayDialog: false,   // 显示储值卡支付时用以显示支付信息的弹框
            showPayBeforeInfo:false,     // 显示支付前活动的弹框

            isShowCharge : false,
            isShowChargeDiscount : false,
            isShowDiscount : false,
            isShowGrow : false,
            isShowScore : false,

            pickerValue : [0],
            pickerData:[{label: '无',value: 0,}],
            payTypes: [{
                index: 1,
                title: '微信支付',
            }, {
                index: 2,
                title: '储值卡支付'
            }]

        }
        // 获取门店列表时传的参数
        this.latitude = 0;
        this.longitude = 0;
        // getJsConfig(props.userInfo.shopId).then(res => {
        //     hideMenuItems();
        // });
        
    }

    // 调用微信接口获取当前经纬度
    getWxLocation = (shopId , callback ) => {
        let self = this;
        getJsConfig(shopId).then(res => {
            getLocation((res) => {
                self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                callback();
            }, () => {
                console.log('cancel');
            }, ()=> {
                console.log('fail');
            });
        });
    }

    componentDidMount() {
        let openid = this.props.userInfo.openid;
        let shopId = this.props.userInfo.shopId;
        let token = this.props.userInfo.token;

        // 获取支付人的用户信息
        this.getUserInfo(token, shopId);
    
        // 设置支付的门店信息
        if (this.props.userInfo.storeId != undefined) {
            console.log('进入链接')
            this.setState({
                show : 'visible'
            })
            // 如果链接中指定了deviceNo，则只能在该设备所属门店消费，不显示更换设备的链接
            this.setState({
                currentStore: {
                    storeId: this.props.userInfo.storeId,
                    storeName: this.props.userInfo.storeName,
                    showChooseStore: false,
                    deviceNo: this.props.userInfo.deviceNo
                }
            })
        } else {
            // 如果链接中有card_id，说明支付是从会员卡中发起，显示门店选择器，其中显示所有绑定了该会员卡的设备
            if (this.props.userInfo.cardId) {
                setTimeout(() => {
                    this.getDeviceList("charge");
                }, 100);
            }else{
                alert('无法发起支付');
            }
            // this.getWxLocation(shopId, () => {
                
            // });
        }

        
    }

    getDeviceList = (type) => {
        let params = {
            card_id: this.props.userInfo.cardId,
            type: type
            // lat: this.latitude,
            // lng: this.longitude
        }
        // console.log(params);
        getDeviceList(params).then((data) => {
            console.log("设备列表", data);
            let tmArr = []
            let tmArr1 = []
            if(data.length > 0){
                data.map((item,index)=>{
                    if(item.isDelete == 0){

                        tmArr = [...tmArr,{
                            label:(
                                <Bk height='80%' display='flex' flexWrap='wrap' padding='0px'>
                                    
                                    <Bk height='auto' fontSize='1.1em'>{item.deviceName}</Bk>
                                    <Bk height='auto' fontSize='0.9em' color='#555'>{item.storeName}</Bk>
                                </Bk>
                                ),
                            storeId:item.storeId,
                            deviceNo:item.deviceNo,
                            storeName:item.storeName+'('+item.deviceName + ')',
                            deviceName:item.deviceName,
                            value:index
                        }]
                        tmArr1 = [...tmArr1, item]
                        this.setState({
                            pickerData: tmArr,
                            stores: tmArr1,
                            currentStore : tmArr1[0],
                            
                        },()=>{
                            this.setState({
                                show:'visible'
                            })
                        });
                    }
                })
                if(tmArr.length > 0){
                    console.log('tmArr.length > 0')
                    this.setState({
                        showChooseStore: true
                    })
                }
                
            }else{
                if(type !== "wx"){
                    // 如果储值卡对应设备列表为空，则切换支付方式为微信
                    this.getDeviceList("wx");
                    this.setState({
                        showPayDialog: false,
                        payType: 1,
                        currentPay: {
                            title: "微信支付",
                            index: 1
                        },
                        payTypes: [
                            {
                                title: "微信支付",
                                index: 1
                            }
                        ]
                    });
                }else{
                    alert('该会员卡还未绑定任何设备');
                }
            }
            
            // data.map(item => {
            //     if (item.isDelete == 0)
            //         tmArr = [...tmArr, item]
            // });
            // if (tmArr.length > 0) {

            //     this.setState({
            //         showChooseStore: true,
            //         stores: tmArr,
            //         currentStore: tmArr[0]
            //     });
            // } else {
                
            // }
        });
    }

    getUserInfo = (token, shopId) => {
        const { userInfo } = this.props;
        // 如果传了deviceNo，则能获取到payConfig
        let payConfig = this.props.userInfo.payConfig || undefined;
        if(payConfig){
            this.scanPay = true;
        }
        // console.log(payConfig);
        if (this.props.userInfo.cardId) {
            // 如果支付从会员卡发起，请求获取用户的等级
            // 如果用户的会员信息中has_active不为true，则只显示微信支付
            
            if (userInfo && userInfo.commonInfo && userInfo.commonInfo.memberInfo && userInfo.commonInfo.memberInfo.has_active) {
                
                const tmConfig = this.props.userInfo.payConfig || {};
                if(Object.keys(tmConfig).length > 0 ){
                    this.setState({
                        isShowCharge : tmConfig.enableCharge? true : false,
                        isShowChargeDiscount : tmConfig.enableChargeDiscount? true : false,
                        isShowDiscount : tmConfig.enableDiscount? true : false,
                        isShowGrow : tmConfig.enableGrow? true : false,
                        isShwoScore : tmConfig.enableScore? true : false
                    }) 
                }
                console.log('配置信息:',tmConfig)
                getUserLever(token, this.props.userInfo.cardId).then((data) => {
                    
                    if (data.id) {
                        // 如果用户有等级
                        if (payConfig) {
                            // 如果有支付配置，只有在链接里传了deviceNo才有
                            if (payConfig.enableCharge && payConfig.enableCharge == 1) {
                                // 如果配置开启了储值消费,设置用户的等级，显示更换支付方式的链接，支付方式为储值卡支付
                                // console.log('支持储值卡支付');
                                // 支持储值卡支付
                                this.setState({ userLever: data, showPayType: true, payType: 3 });
                            } else {
                                // 如果没有开通储值功能，不显示更换支付方式的链接,默认使用微信支付
                                this.setState({ userLever: data, showPayType: false, payType: 1 });
                                // this.setState({
                                //     showPayDialog: false,
                                //     currentPay: {
                                //         title: "微信支付",
                                //         index: 1
                                //     },
                                //     payTypes: [
                                //         {
                                //             title: "微信支付",
                                //             index: 1
                                //         }
                                //     ]
                                // });
                            }
                        } else {
                            // 如果没有支付配置，显示更换支付方式的链接，设置支付方式为储值卡支付
                            console.log('2 设置payType3');
                            this.setState({ userLever: data, showPayType: true, payType: 3 });
                        }
                    } else {
                        // 如果没有用户等级，默认等级为空，不显示更换支付方式的链接，设置支付方式为微信支付
                        this.setState({ userLever: {}, showPayType: false, payType: 1 });
                    }
                });
            } else {
                this.setState({ userLever: {}, showPayType: false, payType: 1 });
            }
        } else {
            // console.log('cardId undefind');
            // 如果不是从会员卡发起的支付,等级设置为空，不显示更换支付方式的链接，设置支付方式为微信，
            // 比如不是某张会员卡的会员扫描了该会员卡绑定的设备的二维码
            this.setState({ userLever: {}, showPayType: false, payType: 1 });
        }

        
        // 如果用户的会员信息中has_active不为true，则只显示微信支付
        if (userInfo && userInfo.commonInfo && userInfo.commonInfo.memberInfo && userInfo.commonInfo.memberInfo.has_active) {
        } else {
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
                    va = '0.';
                } else {
                    va += value + '';
                }
            }
        } else if (value == -1) {
            //删除
            if (va.length > 0) {
                va = va.substring(0, va.length - 1);
            }
        } else {
            if (va.indexOf('.') > -1) {
                if (va.length - va.indexOf('.') > 2) {
                    return;
                }
            }
            va += value + '';
        }
        this.setState({
            inputPrice: va
        });
    }

    //开始支付流程
    startPayAction = () => {
        // console.log('支付方式', this.state.payType);
        let price = parseFloat(this.state.inputPrice);
        //如果存在 cardId 先获取折扣
        if (this.props.userInfo.cardId) {
            let cardId = this.props.userInfo.cardId;
            console.log("#######################获取折扣信息#################");
            changeDiscountInfo(
                this.props.userInfo.token, parseInt(price * 100), '', cardId,
                this.props.userInfo.shopId,
                this.state.currentStore.storeId,
                this.state.currentStore.deviceNo,
                this.state.payType
            ).then((data) => {
                console.log('折扣信息', data);
                if (data.success) {
                    this.setState({ discountInfo: data.data },()=>{
                        console.log('支付前优惠:',this.state.discountInfo)
                    });
                    
                    if (this.state.payType == 1 && data.data.activityId) {
                        this.setState({showPayBeforeInfo:true});
                    }else{
                        this.createOrderInfo();
                    }
                }
            })
        } else {
            this.createOrderInfo();
        }
    }

    //创建订单信息
    createOrderInfo = () => {
        let price = parseFloat(this.state.inputPrice)
        let token = this.props.userInfo.token;
        let shopId = this.props.userInfo.shopId;
        let discountInfo = this.state.discountInfo;
        let params = {
            token: token,
            shopId: shopId,
            orderType: 2,
            payType: this.state.payType
        }

        let isWeixin = this.props.userInfo.isWeixin;

        if (isWeixin == 0){
            params.payType = 2;
        }

        if (this.props.userInfo.cardId) {
            let cardId = this.props.userInfo.cardId;
            params.cardId = cardId;
        }

        if ( this.state.currentStore.deviceNo) {
            let deviceNo = this.state.currentStore.deviceNo;
            params.deviceNo = deviceNo;
        }

        if (this.state.currentStore.storeId){
            params.storeId = this.state.currentStore.storeId ;
        }

        if (this.state.currentStore.storeId == undefined) {
            Toast.info("请选择门店")
            return;
        }

        if (discountInfo.redisKey != undefined) {
            params.discountInfoRedisKey = discountInfo.redisKey
        } else {
            params.originalAmount = parseInt(price * 100)
        }
        if (token != undefined && token != ""){
            Toast.loading('加载中...');
            console.log("#######################创建微信订单#################");
            createOrder(params).then((rs) => {
                console.log('创建微信订单结果', rs);
                Toast.hide();
                this.setState({ payInfo: rs });
                //根据支付方式
                if (this.state.payType == 3) {
                    this.setState({ showCardPayDialog: true });
                    return;
                } else {
                    this.toPayAction(1);
                }
            }).catch(msg => {
                Toast.hide();
            });
        }else{
            Toast.loading('加载中...');
            console.log("#########创建无需用户的订单#########");
            let newParams = Object.assign({},params,{payType:2});
            createNoUserOrder(newParams).then((rs) => {
                console.log('创建无需用户订单的结果', rs);
                Toast.hide();
                this.setState({ payInfo: rs });
                //根据支付方式
                if (this.state.payType == 3) {
                    this.setState({ showCardPayDialog: true });
                    return;
                } else {
                    this.toPayAction(1);
                }
            }).catch(msg => {
                Toast.hide();
            });
        }
    }

    toPayAction = (payType) => {
        let params = {
            token: this.props.userInfo.token,
            openId: this.props.userInfo.openid,
            shopId: this.props.userInfo.shopId,
            tradeId: this.state.payInfo.id
        }
        console.log("#########获取发起支付所需信息#########");
        gotoPay(params).then(res => {
            console.log('发起支付结果', res);
            let resultUrl = '/payresult?orderNo=' + res.orderNo;
            if (res.type == "KLP"){
                if (res && res.payload && res.payload.indexOf("alipay") !== -1) {
                    window.location.assign(res.payload);
                } else if (res && res.payload) {
                    this.WxPay2(res);
                }
            }else if (res.type == "XLP") {
                let payload = res.payload;
                let xlUrl = `https://showmoney.cn/scanpay/unified?data=${payload}`;
                window.location.assign(xlUrl);
            } else if (res.type == "WXP") {
                this.WxPay(res);
            } else if (res.type == "ALI") {
                this.aliPay(res);
            } else if (res.type == "CARD_REMAIN") {
                window.location.replace(resultUrl);
            }
        }).catch(msg => {
        });
    }


    aliPay = (res) => {
        let resultUrl = '/payresult?orderNo=' + res.orderNo
        window.AlipayJSBridge.call("tradePay", {
            tradeNO: res.payload
        }, function (data) {
            console.log('阿里支付结果', JSON.stringify(data));
            if ("9000" == data.resultCode) {
                window.location.replace(resultUrl + '&status=success')
            }
        });
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
                console.log('微信支付结果', res);
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.replace(resultUrl + '&status=success');
                } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                    //支付取消
                    window.location.replace(resultUrl + '&status=fail');
                } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
                    //支付失败
                    window.location.replace(resultUrl + '&status=fail');
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

    pay = () => {
        let price = parseFloat(this.state.inputPrice)
        console.log(price)
        if (price > 0) {
            this.startPayAction()
        }
    }

    // 是否显示展示储值卡支付时支付信息的弹框
    onShowCardPayDialog = () => { 
        this.setState({ showCardPayDialog: true });
    };

    onCloseCardPayDialog = () => { 
        this.setState({ showCardPayDialog: false });
    };

    // 是否显示更换门店选择器
    onShowStoreDialog = () => {
        this.setState({ showStoreDialog: true })
    };

    onCloseStore = () => { 
        this.setState({ showStoreDialog: false });
    };

    // 是否显示更换支付方式选择器
    onShowPayDialog = () => {
        this.setState({ showPayDialog: true })
    };

    onClosePay = () => {
        this.setState({ showPayDialog: false }) 
    };

    // 改变门店
    changeStore = (store) => { 
        this.setState({ currentStore: store, showStoreDialog: false }) 
    };

    // 改变支付方式
    changePay = (item, i) => {
        let ptype = 1;//微信支付
        if (i == 0) {
            ptype = 1;
        } else {
            ptype = 3;
        }
        this.setState({
            currentPay: item,
            showPayDialog: false,
            payType: ptype
        });
        if(!this.scanPay){
            this.getDeviceList(ptype === 1 ? "wx" : "charge");
        }
    };

    // 关闭支付前活动提示弹窗
    onClosePayBeforeInfo = () => {
        this.setState({ onClosePayBeforeInfo: false });
    }

    // 优惠券相关
    onCloseCoupon = () => {
         this.setState({ showCouponDialog: false });
    };

    changeCoupon = (item) => {
        this.setState({ chooseCoupon: item, showCouponDialog: false });
    };

    // 支付方式构建
    renderPayType = () => {
        // TODO 判断供选择的所有支付方式
        let renderPayTypes = [];

        return (
            <Modal
                popup
                visible={this.state.showPayDialog}
                onClose={this.onClosePay}
                animationType="slide-up"
            >
                <div className='listview'>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                        flexDirection: 'row',
                        height: '50px',
                        backgroundColor: "#EEEEEE"
                    }}>选择支付方式</div>
                    {this.state.payTypes.map((item, i) => {
                        let check = this.state.currentPay.title == item.title;
                        return (
                            <Flex key={`paytype${i}`} onClick={() => this.changePay(item, i)}>
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
                        );
                    })}
                </div>
            </Modal>
        );
    }

    //优惠券构建
    renderCoupon = () => {
        return (
            <Modal
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
                                {item.name}
                            </div>
                        </div>
                    })}
                    <div className='foot' onClick={() => this.onCloseCoupon()}>关闭</div>
                </div>
            </Modal>
        );
    }

    //门店构建
    renderStoreLst = () => {
        return (
            <div/>
            // <DeviceList
            //     chooseStoreAction={(item) => this.setState({ currentStore: item, showStoreDialog: false })}
            //     chooseStore={this.state.currentStore}
            //     onClose={() => this.onCloseStore}
            //     visible={this.state.showStoreDialog}
            //     data={this.state.stores}
            //     clicked={this.state.clicked} 
            // />
        );
    }

    renderCardPay = () => {
        let storeName = ''
        if (this.state.currentStore != undefined) {
            
            storeName = this.state.currentStore.storeName;
            if (this.state.currentStore.deviceName){
                console.log('')
                storeName += `(${this.state.currentStore.deviceName})`;
            }
        }

        let memberDiscount = 0;
        if (this.state.discountInfo){
            memberDiscount = this.state.discountInfo.memberDiscount;
        }
        let userLeverView = null;
        if (this.state.userLever.name) {
            userLeverView  =  (
                <div className='payitemview'>
                    <div>{this.state.userLever.name}</div>
                    <div>{'-' + parseFloat(memberDiscount / 100).toFixed(2) + '元'}</div>
                </div>
            );
        }

        return(
            <Modal
                visible={this.state.showCardPayDialog}
                onClose={this.onCloseCardPayDialog}
                title="请确认会员支付信息"
                transparent
                style={{ width: '80%', borderRadius: '5px' }}
                footer={[{ text: '确认支付', onPress: () => this.toPayAction(1) }, { text: "取消", onPress: () => this.onCloseCardPayDialog()}]}
                maskClosable={true}>
                <div className='payitemview'>
                    <div>消费门店</div>
                    <div>{storeName}</div>
                </div>
                {userLeverView}
                <div className='payitemview'>
                    <div>应付金额</div>
                    <div>{parseFloat(this.state.payInfo.totalAmount / 100).toFixed(2) + '元'}</div>
                </div>
            </Modal>
        );
    }

    /**
     * 显示折扣信息
     */
    renderPayBeforeInfo = () => {
        return (
            <Modal
                visible={this.state.showPayBeforeInfo}
                onClose={this.onClosePayBeforeInfo}
                transparent
                footer={[{ text: '知道了', onPress: () => { this.setState({ showPayBeforeInfo: false }); this.createOrderInfo() } }]}
                maskClosable={true}>
                <div className='payitemview'>
                    <div>活动优惠</div>
                    <div>{parseFloat(this.state.discountInfo.activityDiscount / 100).toFixed(2) + '元'}</div>
                </div>
            </Modal>
        );
    }

    render = () => {
        const {userInfo} = this.props;
        let userLeverString = "";

        if(this.state.isShowGrow == true){
            if(this.state.userLever.name != undefined)
                userLeverString += `您是${this.state.userLever.name}`
        }
        if(this.state.isShowDiscount == true){
            if (this.state.userLever.discount == 100) {
                userLeverString += ` 暂时无法享受折扣`
            } else {
                userLeverString += ` 可享受${(this.state.userLever.discount || 0) / 10}折`
            }
        }
        // if (this.state.userLever.name != undefined) {
        //     userLeverString = `您是${this.state.userLever.name}`
        //     if (this.state.userLever.discount == 100) {
        //         userLeverString += ` , 暂时无法享受折扣`
        //     } else {
        //         userLeverString += ` , 可享受${this.state.userLever.discount / 10}折`
        //     }
        // }
        if (userInfo && userInfo.commonInfo && userInfo.commonInfo.memberInfo && userInfo.commonInfo.memberInfo.has_active){

        }else{
            userLeverString = '';
        }
        console.log('userLeverString:',userLeverString)

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

        if (this.state.showChooseStore){
            if (this.state.currentStore != undefined) {
                storeName = this.state.currentStore.storeName  +'(' + this.state.currentStore.deviceName +')'
            }
        }else{
            if (this.state.currentStore != undefined) {
                storeName = this.state.currentStore.storeName
            }
        }
        let showPayTypeString = "微信支付";
        if (this.state.payType == 1) {
            showPayTypeString = "微信支付";
        } else if (this.state.payType == 3) {
            showPayTypeString = "储值卡支付";
        }

        let tmpShowPayType = true;
        // 如果用户的会员信息中has_active不为true，则只显示微信支付
        if (userInfo && userInfo.commonInfo && userInfo.commonInfo.memberInfo && userInfo.commonInfo.memberInfo.has_active) {
            tmpShowPayType = true;
        } else {
            tmpShowPayType = false;
        }

        return (
            <div className='home-container' style={{visibility:`${this.state.show}`}}>
                {/* 选择门店 */}
                <div className="shop_container">
                    <img src='https://ybimage.yishouyun.net/h5/img/payicon.png' className='shoplogo' />
                    <div style={{width:'65%',fontSize:'1.1em'}}>{storeName}</div>
                    {   
                        this.state.showChooseStore?
                        <Picker
                                title='门店设备'
                                cols={1}
                                //data={season}
                               // cascade={false}
                                data={this.state.pickerData}
                                value={this.state.pickerValue}
                                itemStyle={{
                                    height:'75px',
                                    display:'flex',
                                    justifyContent:'center',
                                    alignItems:'center',
                                    whiteSpace:"Wrap",
                                    textOverflow:'ellipsis'}} 
                                indicatorStyle={{height:'75px',background:'#f6f6f6',position:'absolute',zIndex:1}}
                                onChange={(v) => {
                                    this.setState({ 
                                        pickerValue: v,
                                        currentStore : this.state.stores[v[0]]
                                    })    
                                }}
                                onOk={(v)=>{
                                    this.setState({ 
                                        pickerValue: v ,
                                        currentStore : this.state.stores[v[0]]
                                    })
                                }}
                            >
                            <span style={{width:'20%',color:'#f07661'}}>切换&#8195;</span>
                        </Picker>: null
                    }
                    
                    {/* {
                        this.state.showChooseStore ? 
                        <a
                            onClick={() => this.setState({ showStoreDialog: true })}
                            href='#' className='changshop'>更换
                        </a>
                            : null
                    } */}
                </div>

                {/* 输入金额 */}
                <div className='price_container'>
                    <div className='pricelable'>金额</div>
                    {/* <div className='rmb'>¥</div> */}
                    <div className='input'>{this.state.inputPrice !== "" ? "¥ " : ""}{this.state.inputPrice}</div>
                </div>

                {/* 等级与折扣信息 */}
                {
    
                    <div className='userleve'>
                        <div>{userLeverString}</div>
                    </div>
                }
                

                {/* 选择支付方式 */}
                {
                    this.state.showPayType && tmpShowPayType ? 
                        <div className='paytype'>
                            <div className='payname'>{'使用' + showPayTypeString}</div>
                            <div className='changepay' onClick={() => this.onShowPayDialog()}>更换</div>
                        </div> : null
                }

                {/* 键盘 */}
                <CustomKeyBoard
                    onNumInput={(value) => this.inputValue(value)}
                    onConfirm={() => this.pay()}
                />

                {/* 更换门店时的门店选择器 */}
                {this.renderStoreLst()}

                {/* 更换支付方式时的支付方式选择器 */}
                {this.renderPayType()}

                {/* 更换优惠券弹框 */}
                {this.renderCoupon()}

                {/* 储值卡支付时确认支付信息弹框 */}
                {this.renderCardPay()}

                {/* 支付前活动 */}
                {this.renderPayBeforeInfo()}
            </div>
        )
    }
}




const PayConsumer = ({ }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <Pay
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default PayConsumer
