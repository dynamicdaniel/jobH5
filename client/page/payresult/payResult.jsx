import React from 'react'
import { Result, Icon, Toast, Modal } from 'antd-mobile';
import './payResult.css';
import { getAllOrderInfo } from '../../actions/payResult'
import moment from 'moment'
import imgUtil from '../../utils/imgUtil';
import mathUtil from '../../utils/mathUtil';
import SendCardListDialog from './components/SendCardListDialog';
// import {getJsConfig, hideMenuItems} from '../../actions/wx';
import { getJsConfig, openCard, addCard } from '../../actions/wx';
import { getCardExtStr } from '../../actions/card'

export default class PayResult extends React.Component {

    constructor(props) {
        super(props)
        console.log("props", props);
        this.orderNo = props.userInfo.orderNo;
        this.state = {
            paySuccess: -1,
            orderDetail: {},
            adList: [],
            showCardInfo: false,
            cardInfo: [],
            queryOutOrder: {},
            user: {},
            closeStatus:false
        }


    }

    componentDidMount() {
        console.log("获取详情", this.orderNo);
        Toast.loading('正在获取订单数据...', 1, () => {
            getAllOrderInfo({ orderNo: this.orderNo }).then(res => {
                console.log("订单详情", res);
                this.cardId = res.user ? res.user.card_id : "";
                this.openId = res.user ? res.user.openId : "";
                Toast.hide()
                let paySuccess = false
                // if (res.order && (res.order.thirdState === "SUCCESS" || res.order.orderStatus > 1)){
                //     paySuccess = true;
                // }else{
                //     paySuccess = false;
                // }
                if (res.order.orderStatus == 1) {
                    if (res.queryOutOrder) {
                        if (res.queryOutOrder.trade_state && res.queryOutOrder.trade_state.toLowerCase() == 'success') {
                            paySuccess = true
                        } else {
                            paySuccess = false
                        }
                    } else {
                        paySuccess = false
                    }
                } else if (res.order.orderStatus > 1) {
                    paySuccess = true
                } else {
                    paySuccess = false
                }
                this.setState({ orderDetail: res.order, adList: res.adv, cardInfo: res.afterActivityList, queryOutOrder: res.queryOutOrder, paySuccess: paySuccess, user: res.user })

                if (paySuccess) {
                    if (res.afterActivityList && res.afterActivityList.length > 0){
                        setTimeout(()=>{
                            this.setState({showCardInfo:true});
                        },1)
                    }
                }

            }).catch(msg => {
                console.log("订单错误", msg)
            })
        });
    }

    catAd = (url) => {
        window.location = url
    }

    renderAdView = () => {
        if (  this.state.adList && this.state.adList.length > 0) {
            let adimg = this.state.adList[0].picture;
            let url = this.state.adList[0].url;
            return (
                <div className='adv-node'>
                    <div className='advstyle' onClick={() => this.catAd(url)}
                         style={{ backgroundImage: `url(${adimg})` }}/>
                    <span>广告</span>
                </div>
            )
        } else {
            return null
        }
    }

    renderCardView = (item, cardInfo) => {
        let logoUrl = imgUtil.getWxImgUrl(item.logo_url);
        return (
            <div className='carditemview' onClick={() => this.onOpenCard(cardInfo)}>
                <img src={logoUrl} className='cardLogo'/>
                <div>{item.title}  ×{item.num}</div>
            </div>
        );
    }

    onOpenCard = (cardInfo) => {
        console.log("点击的卡券", cardInfo);
        this.addCardAction(cardInfo);
    }

    addCardAction = (record) => {
        console.log(record);
        let openId = this.openId;
        let shopId = record[0].shopId;
        // let cardJsons = record.map((item) => ({
        //     openid: openId, 
        //     card_id: item.get_card_id, 
        //     outer_str: item.id
        // }));
        // let params = {
        //     shopId: shopId,
        //     paramsJson: JSON.stringify(cardJsons)
        // }
        // console.log(params);
        // getCardExtStr(params).then(res => {
        //     console.log(res);
        //     let lst = record.map(item => ({
        //         cardId: item.get_card_id, 
        //         cardExt: JSON.stringify(res)
        //     }));
        //     getJsConfig(shopId).then(data => {
        //         addCard(lst, (res) => {
        //             console.log(res);
        //         }, (error) => {
        //             console.log(error);
        //         })
        //     }).catch(msg => {
        //         console.log(msg)
        //     });
        // })

        Promise.all(record.map(item => new Promise((resolve, reject) => {
            let cardJsons = {
                openid: openId,
                card_id: item.get_card_id,
                outer_str: item.id
            };
            let params = {
                shopId: shopId,
                paramsJson: JSON.stringify(cardJsons)
            };
            getCardExtStr(params).then(res => {
                console.log(res);
                resolve({
                    cardId: item.get_card_id,
                    cardExt: JSON.stringify(res)
                });
            })
        }))).then(data => {
            console.log("增加卡券", data);
            getJsConfig(shopId).then(data1 => {
                addCard(data, (res) => {
                    console.log(res);
                    this.setState({ showCardInfo: false });
                    window.WeixinJSBridge.call('closeWindow');
                }, (error) => {
                    console.log(error);
                })
            }).catch(msg => {
                console.log(msg)
            });
        }).catch(error => {
            console.log(error.message, error.stack);
        });
    }

    // renderDialog = () => {
    //     console.log('show')
    //     return <div  hidden={!this.state.showCardInfo}>
    //         <div className='carddialog'></div>
    //     </div>
    // }

    onClosePayBeforeInfo = () =>{
        this.setState({showCardInfo:false});
    };

    onSendCardListGoBtnClick = () => {
        window.location.assign(`/topbar?card_id=${this.cardId}&openid=${this.openId}&index=1`);
    };

    renderCardLst = () => {
        // console.log(this.state);
        if (this.state.paySuccess) {
            if (this.state.cardInfo && this.state.cardInfo.length > 0) {
                console.log('showcard');
                let cardList = this.state.cardInfo;
                console.log(cardList);
                let newList = cardList.map((item, index) => {
                    let otherInfo = item.otherInfo ? JSON.parse(item.otherInfo) : {};
                    let cardType = item.card_type;
                    let leftSideTitle = '';
                    let leftSideContent = '';
                    switch(cardType){
                        case 'DISCOUNT':
                            leftSideTitle = `${otherInfo.discount}折`;
                            leftSideContent = '打折优惠'
                            break;
                        case 'CASH':
                            leftSideTitle = `¥ ${mathUtil.getYuanInTable(otherInfo.reduce_cost)}`;
                            leftSideContent = `满${mathUtil.getYuanInTable(otherInfo.least_cost)}可用`
                            break;
                        case 'GIFT':
                            leftSideTitle = otherInfo.gift || '';
                            leftSideContent = `代金券优惠`
                            break;
                        case 'GROUPON':
                            leftSideTitle = otherInfo.deal_detail || '';
                            leftSideContent = `团购券优惠`
                            break;
                        case 'GENERAL_COUPON':
                            leftSideTitle = otherInfo.default_detail || '';
                            leftSideContent = `优惠券优惠`
                            break;
                        default:
                            break;
                    }

                    return {
                        index: index,
                        get: false,
                        quan_leftSide_title: leftSideTitle,
                        quan_leftSide_content: leftSideContent,
                        quan_rightSide_content: item.title,
                        quan_rightSide_extra: this.transformDateInfo(item.date_info),
                    }
                })
                // 所有卡券的列表
                const cardInfo = this.state.cardInfo;
                let cardList1 = [];
                let cardIdMap = {};
                cardInfo.forEach(item => {
                    if(!cardIdMap.hasOwnProperty(item.get_card_id)){
                        cardIdMap[item.get_card_id] = cardList1.length;
                        cardList1.push(Object.assign(item, {num: 1}));
                    }else{
                        cardList1[cardIdMap[item.get_card_id]].num += 1; 
                    }
                });

                return (
                        // <div>
                        //     <SendCardListDialog
                        //         data={newList}
                        //         title={"恭喜您"}
                        //         content={"获得以下卡券"}
                        //         onGoBtnClick={() => this.onSendCardListGoBtnClick()}
                        //     />
                        // </div>
                    <Modal
                        visible={this.state.showCardInfo}
                        onClose={this.onClosePayBeforeInfo}
                        transparent
                        maskClosable
                        title="赠送的卡券"
                        closable={true}>
                        {cardList1.map(item => {
                            return this.renderCardView(item, cardInfo)
                        })}
                    </Modal>
                )
            } else {
                return null;
            }
        } else {
            return null
        }
    }

    transformDateInfo = (value) => {
        let result = '';
        let dateInfo = JSON.parse(value);
        if (dateInfo.type === 'DATE_TYPE_FIX_TERM'){
            result = `领取后${dateInfo.fixed_begin_term ? dateInfo.fixed_begin_term : '当'}天生效,有效期${dateInfo.fixed_term}天`
        } else if (dateInfo.type === 'DATE_TYPE_FIX_TIME_RANGE'){
            result = `有效期为${moment(dateInfo.begin_timestamp, 'X').format('YYYY-MM-DD HH:mm')}至${moment(dateInfo.end_timestamp, 'X').format('YYYY-MM-DD HH:mm')}`;
        }
        return result;
    };

    renderSuccessView = () => {
        let payTypeStr = ''
        if (this.state.orderDetail.payType == 1){
            payTypeStr = '微信支付'
        } else if(this.state.orderDetail.payType == 3){
            payTypeStr = '储值卡支付'
        } else if (this.state.orderDetail.payType == 2){
            payTypeStr = '支付宝支付'
        } else{
            payTypeStr = ''
        }
        let originalAmountStr = parseFloat(this.state.orderDetail.originalAmount / 100).toFixed(2) + '元'
        let realAmountStr = parseFloat(this.state.orderDetail.realAmount / 100).toFixed(2) + '元'
        let yu_e = ''
        if (this.state.user && this.state.user.money) {
            yu_e = parseFloat(this.state.user.money / 100).toFixed(2); + '元'
        }

        if (this.state.orderDetail.orderNo){
            return <div className='orderInfoStyle'>
            {/* <div className='orderInfoItem'>
            <div className='orderInfoKey'>商户门店</div>
            <div className='orderInfoValue'>{this.state.orderDetail.storeName}</div>
        </div> */}
            <div className='orderInfoItem'>
                <div className='orderInfoKey'>订单编号</div>
                <div className='orderInfoValue'>{this.state.orderDetail.orderNo}</div>
            </div>
            {/* <div className='orderInfoItem'>
            <div className='orderInfoKey'>支付方式</div>
            <div className='orderInfoValue'>{payTypeStr}</div>
        </div> */}
            {/* <div className='orderInfoItem'>
            <div className='orderInfoKey'>支付时间</div>
            <div className='orderInfoValue'>{payTime}</div>
        </div> */}
            {/* <div className='orderInfoItem'>
                <div className='orderInfoKey'>应付金额</div>
                <div className='orderInfoValue'>{originalAmountStr}</div>
            </div> */}
            {
                payTypeStr ?<div className='orderInfoItem'>
                <div className='orderInfoKey'>支付方式</div>
                <div className='orderInfoValue'>{payTypeStr}</div>
            </div> : null
            }
            {
                this.state.orderDetail.deviceName ? <div className='orderInfoItem'>
                    <div className='orderInfoKey'>门店设备</div>
                    <div className='orderInfoValue'>{this.state.orderDetail.deviceName}</div>
                </div> : null
            }
            <div className='orderInfoItem'>
                <div className='orderInfoKey'>实付金额</div>
                <div className='orderInfoValue'>{realAmountStr || ''}</div>
            </div>

            {
                    this.state.user && this.state.user.money ? <div className='orderInfoItem'>
                    <div className='orderInfoKey'>会员卡余额</div>
                    <div className='orderInfoValue'>{yu_e}</div>
                </div> : null
            }
        </div>

        }else{
            return null;
        }


    }

    render = () => {
        let payTypeStr = ''
        if (this.state.orderDetail.payType == 1) {
            payTypeStr = '微信支付'
        } else if (this.state.orderDetail.payType == 2) {
            payTypeStr = '支付宝支付'
        } else if (this.state.orderDetail.payType == 3) {
            payTypeStr = '储蓄卡支付'
        }


        let creatTime = moment(this.state.orderDetail.createAt)
        let payTime = creatTime.format('YYYY-MM-DD HH:mm:ss')

        let discountinfoView = []
        if (this.state.orderDetail.discountinfo) {
            discountinfoView.push(<div className='orderInfoItem'>
                <div className='orderInfoKey'>优惠金额</div>
                <div className='orderInfoValue'>{parseFloat(this.state.orderDetail.discountinfo.discountAmount / 100).toFixed(2) + '元'}</div>
            </div>)

            discountinfoView.push(<div className='orderInfoItem'>
                <div className='orderInfoKey'>优惠券</div>
                <div className='orderInfoValue'>{this.state.orderDetail.discountinfo.couponName}</div>
            </div>)

            //,会员折扣memberDiscount
            discountinfoView.push(<div className='orderInfoItem'>
                <div className='orderInfoKey'>会员折扣</div>
                <div className='orderInfoValue'>{parseFloat(this.state.orderDetail.discountinfo.memberDiscount / 100).toFixed(2) + '元'}</div>
            </div>)

            //     "couponAmount": 5000,优惠券抵扣金额
            discountinfoView.push(<div className='orderInfoItem'>
                <div className='orderInfoKey'>优惠券折扣</div>
                <div className='orderInfoValue'>{parseFloat(this.state.orderDetail.discountinfo.couponAmount / 100).toFixed(2) + '元'}</div>
            </div>)
        }

        let realAmount = ''
        if (this.state.orderDetail.realAmount){
            realAmount = parseFloat(this.state.orderDetail.realAmount / 100).toFixed(2)
        }


        let statusView = null;

        if (this.state.paySuccess === true) {
            statusView = <div className='payview'>
                <img src="http://ybimage.yishouyun.net/h5/icon_head_success.png" className='headsuccess' />
                <div className='payresult'>
                    <div className='payresult_status'>支付成功</div>
                    <div className='paysuccess_price'>{realAmount}</div>
                    <div className='paysuccess_tip'>谢谢老板打赏！期待您的再次光临~</div>
                </div>
            </div>
        } else if (this.state.paySuccess === false){
            statusView = <div className='payview'>
                <img src="http://ybimage.yishouyun.net/h5/icon_head_fail.png" className='headsuccess' />
                <div className='payresult'>
                    <div className='paysuccess_status_fail'>支付失败</div>
                    <div className='paysuccess_tip'>呜呜呜老板~支付失败啦！我是无辜的~</div>
                </div>
            </div>
        }else{
            statusView = <div className='payview'>
                <div className='headsuccess' />
                <div className='payresult'>
                    <div className='paysuccess_status_fail'></div>
                    <div className='paysuccess_tip'></div>
                </div>
            </div>
        }

        return <div className="result-example" style={{overflowY: 'hidden',}}>
            {statusView}
            {
                this.state.paySuccess ? this.renderSuccessView() : null
            }
            {
                this.renderAdView()
            }
            {this.renderCardLst()}
        </div>
    }
}
