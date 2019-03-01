import React from 'react';
import Bk from '../../../../components/Bk/Bk'
import GetCard from './getcard'
import ActiveCard from './activeCard'
import {Toast} from 'antd-mobile'
import {getNumCard,giveCardDetail} from '../../../../actions/numcard'
import {getMemberCardUserInfo} from '../../../../actions/card'

class RecvCard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            show:false,
            getCard:0,
            activeURL:'',
            timesCardNum:0,
            timesCardName:'',
            timesCardUint:'',
        };
        // getJsConfig(props.userInfo.shopId).then(data => {
        //     hideMenuItems();
        // });
        this.id = props.hrefParams.id
        this.redisKey=props.hrefParams.redisKey
        this.openId=props.hrefParams.openid
        this.cardId=props.hrefParams.cardid
        this.shopId = 0
    }
    componentDidMount(){
        console.log(this.id)
        getMemberCardUserInfo({
            openId:this.openId,
            cardId:this.cardId
        }).then(res=>{
            console.log('getMemberCardUserInfo',res)
            this.shopId = res.shopId
            let params= {
                redisKey:this.redisKey,
                openId:this.openId,
                cardId:this.cardId,
            }
            console.log(params);
            giveCardDetail(params).then(res=>{
                console.log(res);
                if(res.isActivate == false){
                    // alert('未激活');
                    this.setState({
                        activeURL:res.url,
                        getCard:1
                    });
                }
                else {
                    if (!res.mTimeCountCard && !res.Cache){
                        Toast.info(res.message, 2, ()=>{
                            window.WeixinJSBridge.call('closeWindow');
                        });
                    }else{
                        const info = res.mTimeCountCard
                        const cache = res.Cache
                        this.setState({
                            timesCardNum:cache.num,
                            timesCardName:info.title,
                            timesCardUnit:info.unit,
                            getCard:2
                        });
                    }
                }
            }).catch(e=>{
                console.log(e)
            })
        }).catch(e=>{
            console.log(e)
        })
        
    }
    render() {

        return (
            <Bk>
                <Bk 
                    bgColor="#333" 
                    opacity="0.8" 
                    position='absolute'
                />
                {
                    this.state.getCard == 1?<ActiveCard 
                    activeURL={this.state.activeURL}
                    close={()=>{this.setState({getCard:3})}}/>:
                    this.state.getCard == 2?<GetCard 
                    timesCardNum = {this.state.timesCardNum}
                    timesCardName = {this.state.timesCardName}
                    timesCardUnit = {this.state.timesCardUnit}
                    getCard={()=>{
                        this.setState({
                            getCard:3
                        },()=>{
                            let params = {
                                redisKey:this.redisKey,
                                openId:this.openId,
                                shopId:this.shopId
                            }
                            console.log(params)
                            getNumCard(params).then(res=>{

                                Toast.success('领取成功',2,()=>{
                                    window.location.assign('/numcarddetail/'+ this.id + '?' + 'openid=' +  this.openId + '&card_id=' + this.cardId)
                                })
                                
                            })
                            
                        })
                    }}
                    close={()=>{
                        
                        this.setState({
                            getCard:3
                        })
                    }}/>:null
                }
                
            </Bk>
            
        )
    }
}
export default RecvCard
