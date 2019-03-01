import React, { Component } from 'react';
import Pay from 'client/page/pay/pay'
import Recharge from 'client/page/recharge/recharge'
import Vips from 'client/page/vips/vips'
import Home from 'client/page/home/home'
import Home2 from 'client/page/home2/home2'
import Youhui from 'client/page/youhui/youhui'
import Balance from 'client/page/balance/balance'
import Lift from 'client/page/lift/lift'
import RecordPay from 'client/page/records/payRecord'
import RecordRecharge from 'client/page/records/rechargeRecord'
import InCard from 'client/page/incard/incard'
import BonusDetail from 'client/page/bonusdetail/bonusDetail'
import CardShopDetail from 'client/page/cardshop/cardShopDetail'
import MySharePage from 'client/page/sharepage/sharePage'
import ShareRecord from 'client/page/sharerecords/shareRecord';
import NumberCard1 from 'client/page/numbercard/numberCard1'
import NumCardDetail1 from 'client/page/numbercard/detail/numCardDetail1'
import ChannelNumcardDetail from 'client/page/channel_numcard/channelNumcardDetail'
import BuyNumCard from 'client/page/numbercard/buylst/buyNumCard'
//记次卡使用记录
import UseRecord from 'client/page/numbercard/record/useRecord'
import BuyRecord from 'client/page/numbercard/record/buyRecord'
import PayRecord from 'client/page/numbercard/detail/component/payRecord'
import Sharepage from 'client/page/numbercard/detail/component/sharePage'
import OrderDetail from 'client/page/order/detail/orderDetail'
import TempPay from 'client/page/pay/tempPay';
import TemppaySuccess from 'client/page/pay/tempPaySuccess';
import BalancePage from 'client/page/BalancePage/BalancePage'
import Channel from 'client/page/channel/channel'
import MemberLevel from "../client/page/MemberLevel";


import TestPay from 'client/page/testpay/testpay';

import { BrowserRouter, StaticRouter, Route, Link } from 'react-router-dom';
const Router = __CLIENT__ ? BrowserRouter : StaticRouter;

import { UserContext } from './userContext';

class App extends Component{

    componentDidMount() {
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
            }, false);
        }
    }


    render() {
        return (
            <UserContext.Provider value={{ userInfo: this.props.userInfo }}>
                <Router {...this.props}>
                    <div>
                        <Route path='/home' component={Home} />
                        <Route path='/home2' component={Home2} />
                        {/* 支付页面 */}
                        <Route path="/pay" component={Pay} />
                        <Route path='/recharge' component={Recharge} />
                        <Route path='/vips' component={Vips} />
                        <Route path='/youhui' component={Youhui} />
                        <Route path='/lift' component={Lift} />
                        {/* 储值中心 */}
                        <Route path='/balance' component={Balance} />
                        {/* 储值消费记录 */}
                        <Route path='/recordpay' component={RecordPay} />
                        {/* 储值充值记录 */}
                        <Route path='/recordrecharge' component={RecordRecharge} />
                        {/* 储值充值 旧版充值*/}
                        <Route path='/incard' component={InCard} />
                        {/* 储值充值 新版充值*/}
                        <Route path='/BalancePage' component={BalancePage} />
                        {/* 积分商品购买页面 */}
                        <Route path='/bonusdetail/:id' component={BonusDetail} />
                        {/* 卡券商品购买页面 */}
                        <Route path='/cardshopdetail/:id' component={CardShopDetail} />
                        {/* 分享-我的分享二维码 旧版*/}
                        <Route path='/sharepage/:id' component={MySharePage}/>
                        
                        <Route path='/sharePage1' component={Sharepage}/>
                        {/* 分享-我的分享二维码 新版*/}
                        {/* <Route path='/RecvCard' component={RecvCard}/> */}
                        
                        {/* 次卡列表 */}
                        {/* <Route path='/numbercard' component={NumberCard} /> */}
                        <Route path='/numbercard' component={NumberCard1} />
                        {/* 次卡详情 */}
                        {/* <Route path='/numcarddetail/:id' component={NumCardDetail}/> */}
                        <Route path='/numcarddetail/:id' component={NumCardDetail1}/>
                        <Route path='/payRecord/:id' component={PayRecord}/>
                        {/* 购买次卡 */}
                        <Route path='/buynumcard/:id/:unit' component={BuyNumCard}/>
                        {/* 次卡使用记录 */}
                        <Route path='/userecord/:id' component={UseRecord}/>
                        {/* 次卡冲次记录 */}
                        <Route path='/buyrecord/:id' component={BuyRecord}/>
                        {/* 储值-消费记录-消费详情 */}
                        <Route path='/orderdetail/:id' component={OrderDetail}/>
                        {/* 分享记录 */}
                        <Route path='/sharerecord/:id' component={ShareRecord} />
                        {/* 渠道页面 */}
                        <Route path='/channel' component={Channel}/>
                        <Route path="/tempPay" component={TempPay} />
                        <Route path="/temppaySuccess" component={TemppaySuccess} />
                        {/* 次卡分账页面 */}
                        <Route path="/channelNumcardDetail" component={ChannelNumcardDetail} />
                        {/* 等级说明页面 */}
                        <Route path="/memberLevel" component={MemberLevel} />
                        <Route path="/testpay" component={TestPay} />
                    </div>
                </Router>
            </UserContext.Provider>
        );
    }
}

export default App;


