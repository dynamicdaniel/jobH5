import React from 'react';

import { getBonusDetail , getCardExtStr} from '../../actions/card';
import { UserContext } from '../../userContext';
import CardInfoView from '../compontent/cardinfo/cardinfoView'
import { Flex, Modal, Toast } from 'antd-mobile';
import './bonusDetail.css';
import { duihuanCard, updateCard } from '../../actions/card';
import { getJsConfig, addCard, hideMenuItems } from '../../actions/wx';
const alert = Modal.alert;
import imgUtil from '../../utils/imgUtil';

class BonusDetail extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.userInfo);
        this.cardDetail = props.userInfo.commonInfo.cardDetail;
        this.shopId = props.userInfo.shopId;
        this.openId = props.userInfo.openId;
        this.state = {
            bonusDetail: {},
            showGetDialog: false
        };
        this.getCardId = 0;

        getJsConfig(this.shopId).then(data => hideMenuItems());
    }

    componentDidMount() {
        
        let params = { id: this.props.id }
        console.log('bonusDetail')
        getBonusDetail(params).then(res => {
            console.log(res)
            this.setState({
                bonusDetail: res
            })
        }).catch(msg => {
            console.log(msg)
        });
    }

    //立即领取
    getCardDialog = () => {
        this.setState({ showGetDialog: true })
    }

    addCardAction = () => {
        //页面关掉
        this.setState({ showGetDialog: false })
        
        let params = {
            shopId: this.shopId,
            paramsJson: JSON.stringify({ openid: this.openId, card_id: this.state.bonusDetail.select_card_id })
        }
        console.log(params)
        getCardExtStr(params).then(res => {
            console.log(res)
            let lst = []
            lst.push({ cardId: this.state.bonusDetail.select_card_id, cardExt: JSON.stringify(res) })
            getJsConfig(this.shopId).then(data => {
                addCard(lst, (res) => {
                    console.log(res);
                }, (error) => {
                    console.log(error);
                })
            }).catch(msg => {
                console.log(msg)
            });
        })
    }

    //领取对话框
    renderGetCardDialog = () => {
        let bgColor = this.cardDetail.color;
        let logourl =  imgUtil.getWxImgUrl(this.cardDetail.logo_url);
        return <Modal
            visible={this.state.showGetDialog}
            transparent
            maskClosable={true}
            onClose={() => this.setState({ showGetDialog: false })}
            title="卡券"
            footer={[{ text: '立即领取', onPress: () => this.addCardAction()}]}
        >
            <div className='getcarddialog' style={{ backgroundColor: `#${bgColor}` }}>
                <img src={logourl} className='getcardlogo' />
                <div>{this.state.bonusDetail.goodsName}</div>
            </div>
        </Modal>
    }

    /**
     * 兑换
     */
    duihuanAction = () => {
        let params = {
            cardId: this.state.bonusDetail.card_id,
            goodsId: this.state.bonusDetail.id,
            token: this.props.userInfo.token
        }
        console.log(params)
        Toast.loading('兑换中...', 0, () => {
            console.log('Load complete !!!');
        });

        duihuanCard(params).then(res => {
            
            Toast.hide();
            this.getCardId = res.id
            this.getCardDialog()
        }).catch(msg => {
            console.log(msg)
        })
    }

    render() {

        let goodsPics = []
        let imgStr = this.state.bonusDetail.pics || ''

        if (imgStr.length > 0) {
            if (imgStr.indexOf(',') > -1) {
                goodsPics = imgStr.split(',')
            } else {
                goodsPics.push(imgStr)
            }
        }


        return <div className='allview'>
            <div className='scview_bound'>
                <div className='cardview'>
                    <CardInfoView cardDetail={this.cardDetail} goodsDetail={this.state.bonusDetail} />
                </div>
                <div className='lable'>详情图片</div>
                <div className='detailimg'>
                    {
                        goodsPics.map((item, index) => {
                            return <img src={item} key={index} />
                        })
                    }
                </div>
                <div className='lable'>优惠详情</div>
                <div className='detail'>{this.state.bonusDetail.detail}</div>
                <div className='lable'>使用须知</div>
                <div className='detail'>{this.state.bonusDetail.instruction}</div>
            </div>
            <div className='bottomView'>
                <div className='points'>{this.state.bonusDetail.score + '积分'}</div>
                <div className='btnview' onClick={() =>
                    alert('温馨提醒', '确定花费' + this.state.bonusDetail.score + '积分，兑换' + this.state.bonusDetail.goodsName, [
                        { text: '取消', onPress: () => console.log('cancel') },
                        { text: '确定', onPress: () => this.duihuanAction() },
                    ])
                }>兑换</div>
            </div>

            {this.renderGetCardDialog()}

        </div>

    }
}



const PointsConsumer = ({ match }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <BonusDetail
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default PointsConsumer