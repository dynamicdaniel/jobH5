/**
 * 充次列表
 */

import React from 'react';
import { UserContext } from '../../../userContext';
import { Grid, Button, Modal, Icon, Toast } from 'antd-mobile';
import { getStores } from '../../../actions/home';
import { createCardOrder, gotoPay } from '../../../actions/order';
import { getPunchingList } from '../../../actions/numcard';
import './buyNumCard.css';
import WxCardView from '../../compontent/wxcardview/wxcardview';
import DeviceList from '../../home/deviceList';
import {getJsConfig, hideMenuItems} from '../../../actions/wx';

class BuyNumCard extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.token = props.userInfo.token;
        this.shopId = props.userInfo.commonInfo.shopId;
        this.cardId = props.userInfo.cardId;
        this.memberInfo = props.userInfo.commonInfo.memberInfo;
        this.unit = props.unit;
        this.cardDetail = props.userInfo.commonInfo.cardDetail;
        this.timeCardId = props.id;
        this.state = {
            currentStore: {},
            datas: [],
            stores: [],
            chooseItem: {},//选择的充值面额
            btnEnable: true,
            storeVisible: false,
            payInfo: {}
        };
        getJsConfig(this.shopId).then(data => hideMenuItems());
    }

    componentDidMount() {
        let params = { timeCardId: this.timeCardId }
        let that = this;
        getPunchingList(params).then(res => {
            console.log('充次面额')
            console.log(res)
            that.setState({
                datas: res
            })
        }).catch(msg => {
            console.log(msg)
        })


        getStores(this.shopId).then((data) => {
            if (data.length > 0) {
                this.setState({ stores: data, currentStore: data[0] });
            }
        });
    }

    chooseItemAction = (item) => { this.setState({ chooseItem: item, btnEnable: false }) }
    onCloseStore = () => { this.setState({ showStoreDialog: false }) }
    onShowStoreDialog = () => { this.setState({ showStoreDialog: true }) }
    changeStore = (store) => { this.setState({ currentStore: store, showStoreDialog: false }) }


    _renderItem = (dataItem) => {

        let jfview = undefined
        if (dataItem.rewardScore > 0) {
            jfview = <div className='jf'>积</div>
        }

        let realPrice = 0;
        realPrice = parseFloat(dataItem.realPrice / 100).toFixed(2)


        let subview = <div className='item'>
            <div className='amount'>{dataItem.time + this.unit}</div>
            <div className='price'>{realPrice + '元'}</div>
            <div className='tags'>
                {jfview}
            </div></div>;

        if (this.state.chooseItem.id == dataItem.id) {
            return <div className='item-select' key={dataItem.id}>{subview}</div>
        } else {
            return <div className='item-nor' key={dataItem.id} onClick={() => this.chooseItemAction(dataItem)}>{subview}</div>
        }
    }

    createOpenCardOrderAction = () => {
        let token = this.props.userInfo.token;

        let params = {
            payType: 1,//微信支付
            cardId: this.cardId,
            token: token,
            shopId: this.shopId,
            goodsId: this.state.chooseItem.id,
            storeId: this.state.currentStore.storeId,
            deviceNo: this.state.currentStore.deviceNo,
            goodsType: 2
        }
        console.log(params);
        Toast.loading('加载中...')
        let that = this;
        createCardOrder(params).then((rs) => {
            Toast.hide();
            let data = rs;
            console.log(data);
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
            tradeId: this.state.payInfo.id,
            shopId: this.props.userInfo.shopId,
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

        let data = res.payload;
        let resultUrl = '/payresult?orderNo=' + res.orderNo

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

    render = () => {

        let tipinfoview;
        console.log(this.state.chooseItem);
        let lst = this.state.chooseItem.rewardList || [];
        if (lst.length > 0) {
            tipinfoview = <div>
                <div className='tipinfo'>  提示: </div>
                <div className='sale'>{'售价:' + this.state.chooseItem.price + '元'}</div>
                <div className='othinfo'>
                    {this.state.chooseItem.rewardList.map(item => {
                        return <div>{'赠送:' + item.title + ' ' + item.num + '张'}</div>
                    })}
                </div>
            </div>
        }


        return <div className='all'>


 <WxCardView cardDetail={this.cardDetail} memberInfo={this.memberInfo} />

            <div className='incard-store'>
                <div className='lab'>充值门店:</div>
                <div className='store'>{this.state.currentStore.deviceName}</div>
                <div className='change' onClick={() => this.onShowStoreDialog()}>更换</div>
            </div>

            <Grid
                data={this.state.datas}
                columnNum={3}
                hasLine={false}
                square={false}
                itemStyle={{ backgroundColor: '#ebebeb' }}
                renderItem={this._renderItem}
            />

            <Button
                disabled={this.state.btnEnable}
                onClick={() => this.createOpenCardOrderAction()}
                className='buybtn'>立即购买</Button>


            {tipinfoview}

{this.renderStoreLst()}


        </div>
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

    onCloseStore = () => { this.setState({ storeVisible: false }) }
    onShowStoreDialog = () => { this.setState({ storeVisible: true }) }
}


const BuyNumCardConsumer = ({ match }) => {
    return <UserContext.Consumer>
        {user => {
            return (
                <BuyNumCard
                    unit={match.params.unit}
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
}


export default BuyNumCardConsumer
