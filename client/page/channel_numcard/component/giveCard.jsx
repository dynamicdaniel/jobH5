import React from 'react';
import ReactDOM from 'react-dom'
import Bk from '../../../components/Bk/Bk'
import { giveCard,sendGiveCardInfo } from '../../../actions/numcard';
import {getJsConfig} from '../../../actions/wx'
import SharePage from './sharePage'
import {Toast} from 'antd-mobile';
import config from "../../../utils/config";

let giveTimes = 0
class GiveCard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            show:false,
            deviceHei:'auto',
            paytype:false,
            payTimes:0,
            share:false,

        };
        this.timecardId = props.info.timecardId
        this.shopId = props.info.shopId
        this.cardId = props.info.cardId
        this.token = props.info.token
        this.cardInfo = props.cardInfo
        this.logo = props.cardInfo.logo
    }

    componentDidMount() {
       console.log(this.props)
    }

    
    render() {

        return (
            <Bk >
                <Bk 
                    bgColor="#333" 
                    opacity="0.8" 
                    position='absolute'
                /> 
               
                <Bk position='absolute'
                    display="flex"
                    justifyContent="center" 
                    alignItems='center' 
                    zIndex='1'
                >
                    {
                        this.state.share?<SharePage/>:
                        <div style={{width:'94%', height:"270px",marginTop:-60, background:'white', borderRadius:"6px"}}>

                            <Bk boxSizing='border-box' height="80%" display='flex' justifyContent='center'>
                                <Bk width="92%">
                                    <Bk height="25%" display='flex' alignItems='center' fontSize='1.2em'>
                                        赠送一张计次卡
                                    </Bk>
                                    <Bk height="45%"  display='flex' alignItems='center'>
                                        <Bk width='35%'  >
                                            <Bk width='95px' height='95px' img={this.cardInfo.logo}/>
                                        </Bk>
                                        <Bk width='auto' width='65%' display='flex' alignItems='center' flexWrap='wrap' marginLeft='25px'>
                                            <Bk height='auto' color='#00b7ee' fontSize='1.2em'>{this.state.payTimes}{this.cardInfo.unit}{this.cardInfo.title}次卡</Bk>
                                            <div style={{width:'130px', height:'35px',borderRadius:'6px',border:'1px solid #dddddd',color:'#aaa',boxSizing:'border-box'}}>
                                                
                                                <Bk width='27%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='2.3em' borderRight='1px solid #dddddd'
                                                    onClick={()=>{
                                                        if(giveTimes > 0)
                                                        this.setState(prev=>({payTimes:--prev.payTimes}),()=>{giveTimes=this.state.payTimes})
                                                    }}>-</Bk>
                                                <Bk width='46%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='1.5em' color="#666">
                                                {this.state.payTimes}
                                                </Bk>
                                                <Bk width='27%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='1.5em' borderLeft='1px solid #dddddd'
                                                    onClick={()=>{
                                                        if(giveTimes < this.cardInfo.leftTimes)
                                                            this.setState(prev=>({payTimes:++prev.payTimes}),()=>{giveTimes=this.state.payTimes})
                                                    }}>
                                                    +
                                                </Bk>
                                            </div>
                                        </Bk>
                                        
                                    </Bk>
                                    <Bk height="30%" display='flex' alignItems='center'>
                                    {
                                        this.state.share?
                                        <div style={{wordBreak:'break-all'}}>
                                            <Bk height='auto'>长按复制该链接分享</Bk>
                                            <Bk height='25px' display='flex' alignItems='center' bgColor='#FFC0CB' color='white'>{config.httpType}://{config.testPrefix}m.{config.DOMAIN_NAME}/recvCard?{radisKey}</Bk>
                                        
                                        </div>
                                        :
                                        <div style={{width:"100%", height:"35px", border:'1px solid #dddddd', borderRadius:'6px', color:"#aaa",fontSize:'0.9em'}}>
                                            <input
                                                ref='message'
                                                type="type"
                                                placeholder='给朋友留言'
                                                style={{
                                                    width:'100%',
                                                    height:'100%',
                                                    border:0,
                                                    margin:0,
                                                    padding:0,
                                                    borderRadius:5,
                                                    fontSize:'0.9em'
                                                }}/>
                                        </div>
                                    }
                                
                                    </Bk>
                                </Bk>
                            </Bk>
        
                            <Bk boxSizing='border-box' height="20%" display='flex'  borderTop='1px solid #f1f1f1' fontSize='1.2em'>
                                <Bk display='flex' justifyContent='center' alignItems='center' borderRight='1px solid #f1f1f1'
                                    onClick={()=>{this.props.close()}}
                                >取消</Bk>
                                <Bk display='flex' justifyContent='center' alignItems='center'
                                    onClick={()=>{

                                        if(giveTimes > 0){
                                            let params = {
                                                timeCardId:this.timecardId,
                                                card_id:this.cardId,
                                                transferUserId:this.token,
                                                num:giveTimes,
                                                //message:ReactDOM.findDOMNode(this.refs.message).value
                                            }
                                            console.log(params)
                                            giveCard(params).then((res)=>{
                                                console.log(res)
                                               
                                                let redisKey = res;
                                                getJsConfig(this.shopId)
                                                window.wx.ready(()=> {   //需在用户可能点击分享按钮前就先调用
                                                    window.wx.onMenuShareAppMessage({ 
                                                        title: '次卡分享', // 分享标题
                                                        desc: ReactDOM.findDOMNode(this.refs.message).value, // 分享描述
                                                        link: `${config.httpType}://${config.testPrefix}m.${config.DOMAIN_NAME}/recvCard?id=` + this.timecardId + '&cardId=' + this.cardId + '&redisKey=' + redisKey, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                                        imgUrl: this.logo, // 分享图标
                                                        success: () =>{
                                                        // 设置成功
                                                        setTimeout(()=>{
                                                            this.props.close()
                                                        },3000)
                                                        
                                                        } 
                                                    })
                                                })
                                                window.wx.ready(()=> { 
                                                    window.wx.onMenuShareTimeline({ 
                                                        title: '次卡分享', // 分享标题
                                                        desc: ReactDOM.findDOMNode(this.refs.message).value, // 分享描述
                                                        link: `${config.httpType}://${config.testPrefix}m.${config.DOMAIN_NAME}/recvCard?id=` + this.timecardId + '&cardId=' + this.cardId + '&redisKey=' + redisKey, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                                        imgUrl: this.logo, // 分享图标
                                                        success: () =>{
                                                        // 设置成功
                                                        setTimeout(()=>{
                                                            this.props.close()
                                                        },3000)   
                                                        }
                                                    })
                                                })      
                                                
                                                this.setState({
                                                    share:true
                                                })
                                            })
                                        }else{
                                            Toast.fail('请选择数量',2)
                                        }    
                                    }}
                                >确认</Bk>
                            </Bk>
                        </div>
                    }
                </Bk>
                
            </Bk>
            
        )
    }
}

export default GiveCard