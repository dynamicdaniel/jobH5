import React from 'react'
import './balance.css';
import { Link } from 'react-router-dom';
import imgUtil from '../../utils/imgUtil';
import mathUtil from '../../utils/mathUtil';
import { getMemberCardUserInfo } from '../../actions/card';
import {getJsConfig, hideMenuItems} from '../../actions/wx';

class Balance extends React.Component {

    constructor(props) {
        super(props)
        //  this.token = props.userInfo.token;
        //  this.shopId = props.userInfo.commonInfo.shopId;
        //  this.cardId = props.userInfo.cardId;
        //  this.memberInfo = props.userInfo.commonInfo.memberInfo;
        //  this.cardDetail = props.userInfo.commonInfo.cardDetail;
        //  this.userCardBaseInfo = props.userInfo.commonInfo.userCardBaseInfo;
        this.state = {
            // userLever: {},
            shopId: 0,
            cardId: props.userInfo.cardId,
            openId: props.userInfo.openId,
            userCardBaseInfo: {},
        }

        getJsConfig(props.userInfo.commonInfo.shopId).then(data => {
            hideMenuItems();
        });
    }

    componentDidMount() {
        this.getMemberCardInfo();
    }

    componentWillReceiveProps = (nextProps) => {
      this.setState({
          cardId: nextProps.userInfo.cardId,
          openId: nextProps.userInfo.openId
      });
      this.getMemberCardInfo();
    }

    getMemberCardInfo = () => {
        let cardId = this.state.cardId;
        let openId = this.state.openId;
        let params = {cardId, openId};
        getMemberCardUserInfo(params).then(data => {
            console.log(data);
            if(data && data.userCardBaseInfo){
                this.setState({
                    userCardBaseInfo: data.userCardBaseInfo,
                    shopId: data.shopId
                });
            }
        }).catch(error => {
            console.log(error);
        });
    };

    toInCard = () => {
        let czUrl = '/incard?openid=' + this.state.openId + '&card_id=' + this.state.cardId + '&shopId=' + this.state.shopId
        window.location.assign(czUrl);
    };

    onChargeListClick = () => {
        let czRecordUrl = `/recordrecharge?shopId=${this.state.shopId}&openid=${this.state.openId}&card_id=${this.state.cardId}`;
        // let czRecordUrl = '/recordrecharge?shopId=' + this.state.shopId + '&openid=' + this.state.openId + '';
        window.location.assign(czRecordUrl);
    };

    onConsumeListClick = () => {
        // let xfUrl = '/recordpay?shopId=' + this.state.shopId + '&openid=' + this.state.openId;
        let xfUrl = `/recordpay?shopId=${this.state.shopId}&openid=${this.state.openId}&card_id=${this.state.cardId}`;
        window.location.assign(xfUrl);
    };

    render = () => {

        // let logo = imgUtil.getWxImgUrl(this.cardDetail.logo_url);
        // let backImgUrl = imgUtil.getWxImgUrl(this.cardDetail.background_pic_url)

        return (
            <div>
                <div className='topnew'>
                    <div className='moneyinfo'>
                        <div className='dev1'>当前余额(元)</div>
                        <div className='dev2'>{mathUtil.getYuanInTable(this.state.userCardBaseInfo.money)}</div>
                    </div>
                    <div className='incard' onClick={() => this.toInCard()}>
                        <div>立即充值</div>
                        <img src='http://ybimage.yishouyun.net/h5/icon_right_white.png' className='icon' />
                    </div>
                </div>

                <div className='itembar' onClick={() => this.onChargeListClick()}>
                    <div>充值记录</div>
                    <img src='http://ybimage.yishouyun.net/h5/icon_right_999.png' className='icon' />
                </div>

                <div className='itembar' onClick={() => this.onConsumeListClick()}>
                    <div>消费记录</div>
                    <img src='http://ybimage.yishouyun.net/h5/icon_right_999.png' className='icon' />
                </div>
            </div>
        );
    }
}


export default Balance;
