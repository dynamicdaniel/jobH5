import React from 'react';
import { Toast } from 'antd-mobile';
import { activateMemberCardAction, getCardCost,updateUserMemberRelation } from '../../actions/activityUser';
import './activityuser.css'
import { createOpenCardOrder, gotoPay } from '../../actions/order';
import { getJsConfig, openCard } from '../../actions/wx';

class ActivityUser extends React.Component {


    componentDidMount() {
        getCardCost(this.cardId).then((data) => {
            this.setState({ config: data })
        })
    }

    render() {
        let commoninfolst = this.state.commoninfo.common_field_list || []
        let custominfolst = this.state.commoninfo.custom_field_list || []

        let config = this.state.config;
        let remark = "";
        if (config.status == 1) {
            remark = `支付${config.cost / 100}元,初始余额${config.initMoney / 100}元`
        }

        return <div>
            <div className='infotip'>请确认以下信息</div>
            <div style={styles.infolist}>
                {commoninfolst.map(item => {
                    return this.renderInfoList(item)
                })}
                {
                    custominfolst.map(item => {
                        return this.renderInfoList(item)
                    })
                }
            </div>

            {remark != "" ?
                <div>
                    <div className='infotip'>开卡备注：</div>
                    <div className='infotipvalue'>{remark}</div>
                </div> : null
            }

            <div className='activityBtn' onClick={()=>{
                if(!this.hasActivate){
                    this.hasActivate = true;
                    this.updateUserMemberAction();
                }
            }}>
            激活会员卡
            </div>

            {/* <Button type='primary'
                onClick={() => this.activityMember()}
                style={{ marginTop: '10px', marginLeft: '10px', marginRight: '10px' }}>激活会员卡</Button> */}
        </div>
    }

    updateUserMemberAction = () => {
        console.log("phone", this.phone);
        let params = {
            phone:this.phone
        }

        if (this.nickname != undefined && this.nickname != ""){
            params.nickname = this.nickname
        }

        if (this.sex != undefined && this.sex != ""){
            params.sex = this.sex
        }


        params.openId = this.openId;
        params.cardId = this.cardId;

        updateUserMemberRelation(params).then((data) => {
            console.log(data);
            this.activityMember();
        }).catch(e => {
            
        })
    }

    activityMember = () => {
        let config = this.state.config;
        　console.log(config);
        if (config.status != undefined) {

            if (config.status == 1) {
                console.log("去支付")
                this.createOpenCardOrderAction();
                return
            }

        }

        let params = { cardId: this.cardId, openId: this.openId }

        if (this.outId && this.outId.length > 0) {
            params.outId = this.outId
        }
        console.log(params)
        activateMemberCardAction(params).then(res => {
            console.log(res);
            let code = res;
            Toast.success('激活会员成功', 2);
             //打开卡券
            this.openCardAction(this.cardId , code);
            window.WeixinJSBridge.call('closeWindow');
        }).catch(msg => {
        });
    }

    openCardAction = (cardId , code) => {
        const lst = []
        lst.push({ cardId: cardId, code: code })
        getJsConfig(this.shopId).then((data) => {
            openCard(lst,(res) => {
                console.log(res);
            }, (error) => {
                console.log(error);
            })
        })
    }

    createOpenCardOrderAction = () => {
        let token = this.props.userInfo.token;
        console.log(token);
        let params = {
            payType: 1,//微信支付
            cardId: this.cardId,
            token: token,
        }
        Toast.loading('加载中...')
        let that = this;
        createOpenCardOrder(params).then((rs) => {
            Toast.hide();
            let data = rs;
            console.log('createOpenCardOrder response', data);
            this.setState({ payInfo: data })
            this.toPayAction()
        }).catch(msg => {
            Toast.hide();
        })
    }

    toPayAction = () => {
        let params = {
            token: this.props.userInfo.token,
            openId: this.props.userInfo.openid,
            shopId: this.props.userInfo.shopId,
            tradeId: this.state.payInfo.id
        }
        gotoPay(params).then(res => {
            console.log('gotoPay response', res)
            let resultUrl = '/payresult?orderNo=' + res.orderNo
            if (res.type == "KLP") {
                if (res && res.payload && res.payload.indexOf("alipay") !== -1) {
                    window.location.assign(res.payload);
                } else if (res && res.payload) {
                    this.WxPay2(res);
                }
            } else if (res.type == "XLP") {
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
        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', params,
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.assign(resultUrl + '&status=success')
                    window.WeixinJSBridge.call('closeWindow');
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


    renderInfoList = (item) => {
        let title = '';
        switch (item.name) {
            case 'USER_FORM_INFO_FLAG_MOBILE':
                title = '手机号码';
                this.phone = item.value;
                break;
            case 'USER_FORM_INFO_FLAG_SEX':
                title = '性别'
                this.sex = item.value;
                break;
            case 'USER_FORM_INFO_FLAG_NAME':
                title = '姓名'
                this.nickname = item.value;
                break;
            case 'USER_FORM_INFO_FLAG_BIRTHDAY':
                title = '生日'
                break;
            case 'USER_FORM_INFO_FLAG_IDCARD':
                title = '身份证'
                break;
            case 'USER_FORM_INFO_FLAG_EMAIL': title = '邮箱'; break;
            case 'USER_FORM_INFO_FLAG_LOCATION': title = '详细地址'; break;
            case 'USER_FORM_INFO_FLAG_EDUCATION_BACKGRO': title = '教育背景'; break;
            case 'USER_FORM_INFO_FLAG_INDUSTRY': title = '行业'; break;
            case 'USER_FORM_INFO_FLAG_INCOME': title = '收入'; break;
            case 'USER_FORM_INFO_FLAG_HABIT': title = '兴趣爱好'; break;
            case 'USER_FORM_INFO_FLAG_POST_CODE': title = ''; break;
            default:  break;
        }

        let val = ''
        if (item.value) {
            val = item.value
        } else if (item.value_list.size > 0) {
            val = item.value_list.join(',')
        }

        if (title == ''){
            return null;
        }else{
        return <div style={{ display: 'flex', flexDirection: 'row' }}>
            <p style={{ width: '100px' }}>{title}</p>
            <p style={{ flex: '1' }}>{val}</p>
        </div>
        }
    }

    constructor(props) {
        super(props)
        console.log(props.userInfo)
        this.cardId = props.userInfo.card_id;
        this.openId = props.userInfo.openid;
        this.outId = props.userInfo.outId;
        this.shopId = props.userInfo.shopId;
        this.state = {
            config: {},
            payInfo: {},
            commoninfo: props.userInfo.commoninfo || {},
        }
        this.hasActivate = false;
        this.phone = "";
        this.nickname;
        this.sex;
    }
}

const styles = {
    infolist: {
        flexDirection: 'column',
        marginBottom: '20px',
        marginLeft: '10px', marginRight: '10px',
        borderRadius: '3px', backgroundColor: 'white', padding: '10px'
    }
}

export default ActivityUser;
