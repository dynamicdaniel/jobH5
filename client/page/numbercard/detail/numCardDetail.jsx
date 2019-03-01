/**
 * 记次卡详情
 */
import React from 'react';
import { UserContext } from '../../../userContext';
import './numCardDetail.css';
import { getNumCardDetail, useNumCard } from '../../../actions/numcard';
import { Modal, InputItem } from 'antd-mobile';
import { getStores } from '../../../actions/home';
import StoreList from '../../home/storeList';
import DeviceList from '../../home/deviceList';
import { Link } from 'react-router-dom';
import {getJsConfig, hideMenuItems} from '../../../actions/wx';

class NumCardDetail extends React.Component {

    constructor(props) {
        super(props)
        this.cardDetail = props.userInfo.commonInfo.cardDetail;
        this.shopId = props.userInfo.shopId;
        this.token = props.userInfo.token;
        this.id = props.id;
        this.state = {
            numCardDetail: {},
            showUseDialog: false,
            useNum: 1,//使用次数
            stores: [],
            currentStore: {},
            storeVisible: false,
            payKey: ''
        };

        getJsConfig(this.shopId).then(data => hideMenuItems());
    }

    componentDidMount() {
        let params = { id: this.id, token: this.token }
        console.log(params)
        getNumCardDetail(params).then(res => {
            this.setState({
                numCardDetail: res
            })
        }).catch(msg => {

        })

        getStores(this.shopId).then(data => {
            if (data.length > 0) {
                this.setState({
                    stores: data,
                    currentStore: data[0]
                });
            }
        }).catch(msg => {

        })
    }


    lower = () => {
        let cur = this.state.useNum;
        if (cur == 1) {
            return
        } else {
            cur--;
            this.setState({ useNum: cur })
        }
    }


    add = () => {
        let cur = this.state.useNum;
        if (cur == 5) {
            return
        } else {
            cur++;
            this.setState({ useNum: cur })
        }
    }

    useCard = () => {
        let params = {
            timeCardId: this.id,
            num: this.state.useNum,
            payKey: this.state.payKey,
            storeId: this.state.currentStore.storeId,
            token: this.token,
            deviceNo: this.state.currentStore.deviceNo
        }
        console.log(params)
        useNumCard(params).then(res => {
            let num = this.state.numCardDetail.leftTimes
            let temp = this.state.numCardDetail;
            temp.leftTimes = num - this.state.useNum;
            this.setState({showUseDialog:false , numCardDetail:temp})
        }).catch(msg => {
            console.log(msg)
        })
    }


    changePwd = (txt) => {
        this.setState({
            payKey: txt
        })
    }

    renderUseDialog = () => {
        let storeName = "";
        if (this.state.currentStore != undefined) {
            storeName = this.state.currentStore.deviceName
        }
        return (<Modal
            style={{ width: '90%', height: '300px'}}
            visible={this.state.showUseDialog}
            transparent
            maskClosable={true}
            onClose={() => this.setState({ showUseDialog: false })}>
            <div className='usedialog'>
                <div className='useitem'>
                    <div className='useitemKey'>消费次数</div>
                    <div className='useitemValue'>
                        <div className='itemleft' onClick={() => this.lower()}>-</div>
                        <div className='itemcenter'>
                            {this.state.useNum}
                        </div>
                        <div className='itemright' onClick={() => this.add()}>+</div>
                    </div>
                </div>
                <div className='useitem'>
                    <div className='useitemKey'>所在门店</div>
                    <div className='useitemValue' onClick={() => this.setState({ storeVisible: true })}>
                        <span>{storeName}</span>
                        <img src={require('../../../images/icon_down.png')} className='useritemlogo' />
                    </div>
                </div>

                <div className='useitem'>
                    <div className='useitemKey'>门店密码</div>
                    <div className='useitemValue'>
                    <InputItem type="password"
                        textAlign='center'
                        style={{width:'120px' , height:'40px'}}
                        placeholder="****" maxLength='4' onChange={txt => this.changePwd(txt)}></InputItem>
                </div>
                </div>
                <div className='usebtn' onClick={() => this.useCard()}>确认使用</div>

            </div>
        </Modal>)
    }
    showUseDialog = () => {
        this.setState({ showUseDialog: true })
    }

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }

    renderStoreList = () => {
        return (<DeviceList
            chooseStoreAction={(item) => this.setState({ currentStore: item, storeVisible: false })}
            chooseStore={this.state.currentStore}
            onClose={() => this.onClose('storeVisible')}
            visible={this.state.storeVisible}
            clicked={true}
            data={this.state.stores} />)
    }

    renderBtns = () => {
        let leftTimes = this.state.numCardDetail.leftTimes || 0;
        if (parseInt(leftTimes) == 0) {
            return <Link to={'/buynumcard/' + this.state.numCardDetail.id + '/' + this.state.numCardDetail.unit + `?openid=${this.props.userInfo.openid}&card_id=${this.props.userInfo.cardId}`}
                className='linkbtn'
            >
                <div className='nbc_btn'>立即购买</div>
            </Link>
        } else {
            return <div className='nbc_btn' onClick={() => this.showUseDialog()}>立即使用</div>
        }
    }

    render() {

        let dateStr = '';
        let dateInfo = this.state.numCardDetail;
        if (dateInfo.dateType) {
            if (dateInfo.dateType == 'range') {
                dateStr = '有效期:' + dateInfo.dateBegin + '至' + dateInfo.dateEnd
            } else if (dateInfo.dateType == "regular") {
                dateStr = '购买后' + dateInfo.duration + '天内有效'
            }
        }

        let leftTimes = this.state.numCardDetail.leftTimes || 0;

        return <div className='allview2'>
            <div className='cardTop'>
                <div className='shop'>
                    <img src={this.state.numCardDetail.logo} className='shoplogo' />
                    <div className='shopname'>{this.cardDetail.brand_name}</div>
                </div>

                <div className='nbc_card'>
                    <div className='nbc_cardname'>{this.state.numCardDetail.title}</div>
                    <div className='nbc_times'>剩余:<span>{leftTimes}</span>次</div>
                </div>

                {this.renderBtns()}
                <hr className='nbc_xx' />
                <div className='nbc_center'>
                    <div className='nbc_center_item'>
                        <div className='nbc_item_key'>使用说明</div>
                        <div className='nbc_item_value'>{this.state.numCardDetail.description}</div>
                    </div>
                    <div className='nbc_between'></div>
                    <div className='nbc_center_item'>
                        <div className='nbc_item_key'>使用时间</div>
                        <div className='nbc_item_value'>{dateStr}</div>
                    </div>
                </div>
                <hr className='nbc_xx' />


                {
                    parseInt(leftTimes) != 0 ? <Link to={'/buynumcard/' + this.state.numCardDetail.id + '/' + this.state.numCardDetail.unit + `?openid=${this.props.userInfo.openid}&card_id=${this.props.userInfo.cardId}`} className='linkbtn'>
                        <div className='nbc_btn2'>增加次数</div>
                    </Link> : undefined

                }


                <div className='nbc_bottom'>
                    <Link to={'/userecord/' + this.state.numCardDetail.id + `?openid=${this.props.userInfo.openid}&card_id=${this.props.userInfo.cardId}`} className='nbc_bottom_item'>
                        <div >使用记录</div>
                    </Link>
                    <Link to={'/buyrecord/' + this.state.numCardDetail.id + `?openid=${this.props.userInfo.openid}&card_id=${this.props.userInfo.cardId}`} className='nbc_bottom_item'>
                        <div >充次记录</div>
                    </Link>
                </div>
            </div>

            {this.renderUseDialog()}
            {this.renderStoreList()}
        </div>
    }
}


const NumberCardDetailConsumer = ({ match }) => {
    return <UserContext.Consumer>
        {user => {
            return (
                <NumCardDetail
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
}

export default NumberCardDetailConsumer
