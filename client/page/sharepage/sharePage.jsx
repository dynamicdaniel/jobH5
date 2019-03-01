import React from 'react';
import './sharePage.css';
import { UserContext } from '../../userContext';
import WxCardView from '../compontent/wxcardview/wxcardview';
import {createQRCode} from '../../actions/card';
import {getJsConfig, hideMenuItems} from '../../actions/wx';

const colorMap = {
    "Color010": "#63B359",
    "Color020": "#2C9F67",
    "Color030": "#509FC9",
    "Color040": "#5885CF",
    "Color050": "#9062C0",
    "Color060": "#D09A45",
    "Color070": "#E4B138",
    "Color080": "#EE903C",
    "Color081": "#F08500",
    "Color082": "#A9D92D",
    "Color090": "#DD6549",
    "Color100": "#CC463D",
    "Color101": "#CF3E36",
    "Color102": "#5E6671",
    "63B359": "#63B359",
    "2C9F67": "#2C9F67",
    "509FC9": "#509FC9",
    "5885CF": "#5885CF",
    "9062C0": "#9062C0",
    "D09A45": "#D09A45",
    "E4B138": "#E4B138",
    "EE903C": "#EE903C",
    "F08500": "#F08500",
    "A9D92D": "#A9D92D",
    "DD6549": "#DD6549",
    "CC463D": "#CC463D",
    "CF3E36": "#CF3E36",
    "5E6671": "#5E6671",
}
class SharePage extends React.Component{

    constructor(props){
        super(props);
        let commonInfo = props.userInfo.commonInfo;
        console.log(props);
        this.token = props.userInfo.token;
        this.shareId= props.id;
        this.cardId = props.userInfo.cardId;
        this.cardDetail = commonInfo ? commonInfo.cardDetail || {} : {};
        console.log(this.cardDetail);
        this.memberInfo = commonInfo ? commonInfo.memberInfo || {} : {};
        this.userCardBaseInfo = commonInfo ? commonInfo.userCardBaseInfo || {} : {};
        this.state = {
            qrCodeImgUrl :''
        };

        getJsConfig(props.userInfo.shopId).then(data => hideMenuItems());
    }

    componentDidMount(){
        let params = {
            shopId:this.props.userInfo.shopId,
            outId:this.shareId,
            openId: this.props.userInfo.openid,
            cardId:this.cardId
        }
        // console.log(params)
        createQRCode(params).then(res => {
            this.setState({
                qrCodeImgUrl:res.show_qrcode_url
            })
        }).catch(msg => {
        })
    }

    renderCardView = () => {
        return (<WxCardView cardDetail={this.cardDetail} memberInfo={this.memberInfo} />)
    }


    renderQrView = () => {
        return <div className='qrview'>
            <img src={this.state.qrCodeImgUrl} className='qrlogo' />
        </div>
    }

    render() {
        return <div className='allview223' style={{backgroundColor:`#${colorMap[this.cardDetail.color]||'black'}`}}>
            <div className='cardview2'>
            {this.renderCardView()}
            <hr className='nbc_xx' />
            {this.renderQrView()}
            </div>
        </div>
    }
}

const SharePageConsumer = ({ match }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <SharePage
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default SharePageConsumer
