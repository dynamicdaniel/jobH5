import React from 'react'
import { UserContext } from '../../../userContext';
import './orderDetail.css';
import { getAllOrderInfo } from '../../../actions/payResult'
import moment from 'moment'
import { Result, Icon, Toast, Modal } from 'antd-mobile';
import {getJsConfig, hideMenuItems} from '../../../actions/wx';


class OrderDetail extends React.Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.orderNo = props.id;
        this.state = {
            paySuccess: true,
            orderDetail: {},
            adList: [],
            showCardInfo: false,
            cardInfo: [],
            queryOutOrder: {},
            user: {}
        }
        getJsConfig(props.userInfo.shopId).then(data => {
            hideMenuItems();
        });
    }

    componentDidMount() {
        Toast.loading('正在获取订单数据...', 1, () => {
            getAllOrderInfo({ orderNo: this.orderNo }).then(res => {
                console.log(res)
                Toast.hide()
                let paySuccess = false
                if (res.order.orderStatus == 1) {
                    if (res.queryOutOrder) {
                        if (res.queryOutOrder.trade_state.toLowerCase() == 'success') {
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
                
            }).catch(msg => {
                console.log(msg)
            })
        });
    }


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
        let creatTime = moment(this.state.orderDetail.createAt)
        let payTime = creatTime.format('YYYY-MM-DD HH:mm:ss')
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
            <div className='orderInfoItem'>
            <div className='orderInfoKey'>支付时间</div>
            <div className='orderInfoValue'>{payTime}</div>
        </div>
            <div className='orderInfoItem'>
                <div className='orderInfoKey'>应付金额</div>
                <div className='orderInfoValue'>{originalAmountStr}</div>
            </div>
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
                this.state.user.money ? <div className='orderInfoItem'>
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

        return <div className="result-example">
            {
                this.renderSuccessView() 
            }
        </div>
    }
}


const NumberCardDetailConsumer = ({ match }) => {
    return <UserContext.Consumer>
        {user => {
            return (
                <OrderDetail
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
}

export default NumberCardDetailConsumer