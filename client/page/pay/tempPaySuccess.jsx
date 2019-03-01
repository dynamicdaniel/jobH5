import React from 'react';

import { getCardShopDetail } from '../../actions/card';
import { UserContext } from '../../userContext';
import { Flex, Modal, Toast } from 'antd-mobile';
import '../cardshop/cardShopDetail.css';
import { demoSend } from '../../actions/card';

const alert = Modal.alert;

class TempPaySuccess extends React.Component {

    constructor(props) {
        super(props)
        console.log(props.userInfo)
        this.cardDetail = props.userInfo.commonInfo.cardDetail;
        this.cardId = props.userInfo.cardId
        this.shopId = props.userInfo.commonInfo.shopId;

        this.state = {
            bonusDetail: {},
            showGetDialog: false,
            payInfo: {}
        }
        this.getCardId = 0
    }

    componentDidMount() {

    }

    demoSend = () => {
        let openid = this.props.userInfo.openid;
        Toast.loading('加载中...')
        demoSend(openid).then((rs) => {
            Toast.hide();
            Toast.info("领取成功")
        }).catch(msg => {
            // Toast.info(msg)
        })
    }

    render() {

        return <div className='allview222'>
            <div className='scview1'>
                <img src='https://ybimage.yishouyun.net/tempbanner1.png' style={{width:'100%'}} />
                <img src='https://ybimage.yishouyun.net/temp5.png' style={{width:'100%'}}/>
            </div>
            <div className='bottomViewCenter' >
                <img onClick={() => {
                    this.demoSend()
                }} src='https://ybimage.yishouyun.net/tempbutton.png' style={{heithg:'25px'}}/>
            </div>
        </div>

    }
}



const TempPaySuccessConsumer = ({ match }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <TempPaySuccess
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default TempPaySuccessConsumer
