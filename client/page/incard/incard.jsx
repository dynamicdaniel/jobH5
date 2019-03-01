/**
 * 充值
 */

import React from 'react';
import { UserContext } from '../../userContext';
import './incard.css'
import { Grid, Button, Modal, Icon, Toast } from 'antd-mobile';
import { getStores, getChargeAmountLst, getDeviceList } from '../../actions/home'
import { changeDiscountInfo, createChargeOrder, createOrder, gotoPay } from '../../actions/order';
import StoreList from '../home/storeList'
import DeviceList from '../home/deviceList'
import imgUtil from '../../utils/imgUtil'
import WxCardView from '../compontent/wxcardview/wxcardview'
import mathUtil from "../../utils/mathUtil";
import {getJsConfig, hideMenuItems} from '../../actions/wx';


class InCard extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.token = props.userInfo.token;
        this.shopId = props.userInfo.commonInfo.shopId;
        this.cardId = props.userInfo.cardId;
        this.memberInfo = props.userInfo.commonInfo.memberInfo;
        this.cardDetail = props.userInfo.commonInfo.cardDetail;
        this.state = {
            currentStore: {},
            datas: [],
            stores: [],
            chooseItem: {},//选择的充值面额
            btnEnable: true,
            storeVisible: false,
            payInfo: {}
        }

        getJsConfig(this.shopId).then(data => {
            hideMenuItems();
        });
    }

    componentDidMount() {
        let params = { shopId: this.shopId, cardId: this.cardId }
        let that = this;
        getChargeAmountLst(params).then(res => {
            console.log(res);
            that.setState({
                datas: res
            })
        }).catch(msg => {
            console.log(msg)
        })


        getDeviceList({
            card_id: this.cardId
        }).then((data) => {
            console.log(data);
            if (data.length > 0) {
                this.setState({ stores: data, currentStore: data[0] });
            }
        });
    }

    chooseItemAction = (item) => { this.setState({ chooseItem: item, btnEnable: false }) }
    onCloseStore = () => { this.setState({ storeVisible: false }) }
    onShowStoreDialog = () => { this.setState({ storeVisible: true }) }
    changeStore = (store) => { this.setState({ currentStore: store, storeVisible: false }) }

    _renderItem = (dataItem) => {
        let zsview = undefined
        if (dataItem.rewardCardList.length > 0) {
            zsview = <div className='zs'>赠</div>
        }
        let jfview = undefined
        if (dataItem.rewardScore > 0) {
            jfview = <div className='jf'>积</div>
        }

        let price = parseFloat(dataItem.price / 100).toFixed(2)
        let amountPrice = parseFloat(dataItem.amount / 100).toFixed(2)

        let subview = <div className='item'>
            <div className='amount'>{amountPrice + '元'}</div>
            <div className='price'>{'¥  ' + price + '元'}</div>
            <div className='tags'>
                {zsview} {jfview}
            </div>
        </div>;

        if (this.state.chooseItem.id == dataItem.id) {
            return <div className='incard_item-select'>{subview}</div>
        } else {
            return <div className='incard_item-nor' onClick={() => this.chooseItemAction(dataItem)}>{subview}</div>
        }
    }

    createOrderInfo = () => {
        let token = this.props.userInfo.token;
        let shopId = this.props.userInfo.shopId;
        let params = {
            token: token,
            shopId: shopId,
            storeId: this.state.currentStore.storeId,
            deviceNo: this.state.currentStore.deviceNo,
            amountId: this.state.chooseItem.id
        }
        console.log(params)
        Toast.loading('加载中...')
        //开始创建订单
        createChargeOrder(params).then(rs => {
            Toast.hide();
            console.log('charegeInfo');
            console.log(rs);
            this.setState({ payInfo: rs })
            this.toPayAction()
        }).catch(err => {
            console.log(err)
        });
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

    //门店构建
    renderStoreLst = () => {
        return (<DeviceList
            chooseStoreAction={(item) => this.setState({ currentStore: item, storeVisible: false })}
            chooseStore={this.state.currentStore}
            onClose={() => this.onCloseStore}
            visible={this.state.storeVisible}
            data={this.state.stores}
            clicked={false} />)
    }

    render = () => {
        let tipinfoview;
        let lst = this.state.chooseItem.rewardCardList || [];
        tipinfoview = (
            <div>
                <div className='tipinfo'>  提示: </div>
                <div className='sale'>{'售价:' + mathUtil.getYuanInTable(this.state.chooseItem.price) + '元'}</div>
                {
                    this.state.chooseItem.limitNum ? 
                            <div className='reward-score'>{'每人限购数量' + this.state.chooseItem.limitNum + '次'}</div>:
                            ""
                }
                {
                    this.state.chooseItem.rewardScore ? 
                            <div className='reward-score'>{'赠送积分:' + this.state.chooseItem.rewardScore}</div>:
                            ""
                }
                <div className='othinfo'>
                    {lst.map(item => {
                        return <div>{'赠送:' + item.title + ' ' + item.num + '张'}</div>
                    })}
                </div>
            </div>
        );
        // if (lst.length > 0) {
            
        // }

        let picUrl = imgUtil.getWxImgUrl(this.cardDetail.background_pic_url)
        let logoUrl = imgUtil.getWxImgUrl(this.cardDetail.logo_url)

        return <div className='incard_all'>
            <WxCardView cardDetail={this.cardDetail} memberInfo={this.memberInfo} />

            <div className='incard-store'>
                <div className='incardlab'>充值门店:</div>
                <div className='incardstore'>{this.state.currentStore.storeName}</div>
                <div className='change' onClick={() => this.onShowStoreDialog()}>更换</div>
            </div>

            <Grid
                itemStyle={{backgroundColor:'#ebebeb' , padding:'0px' , margin:'0px'}}
                data={this.state.datas}
                columnNum={3}
                hasLine={false}
                square={false}
                renderItem={this._renderItem}
            />

            <Button
                disabled={this.state.btnEnable}
                onClick={() => this.createOrderInfo()}
                className='incard_buybtn'>立即购买</Button>

            {tipinfoview}

            {this.renderStoreLst()}
        </div>
    }
}

const PointsConsumer = ({ }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <InCard
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default PointsConsumer
