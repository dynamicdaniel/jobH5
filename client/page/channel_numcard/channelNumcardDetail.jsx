/**
 * 记次卡详情
 */
import React from 'react';
import { getNumCardDetail, useNumCard, giveCard ,getBundingdevice,getPunchingList} from '../../actions/numcard';
import { Modal, InputItem ,Toast} from 'antd-mobile';
import {getJsConfig ,hideMenuItems } from '../../actions/wx';
import { createCardOrder, gotoPay } from '../../actions/order';
import { getChannelDetail } from '../../actions/channel'
import Bk from '../../components/Bk/Bk'
import RightnowUse from './component/rightNowUse'
import GiveCard from './component/giveCard'
import Introduce from './component/introduce'
import Activecard from './component/activeCard'
import Getcard from './component/getcard'
import SharePage from './component/sharePage';

export default class NumCardDetail1 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show:false,
            deviceHei : 'auto',
            title : '',
            slideIndex:0,
            rightnowUse:false,
            share:false,
            giveCard:false,
            introduce:false,
            numCardDetail: {},
            depositItem: [],
            depositItemSelect:{},
            selectItem:{},
            chongzhiItem:{},
            payInfo:[],
            showUseDialog: false,
            useNum: 1,//使用次数
            stores: [],
            currentStore: {},
            storeVisible: false,
            payKey: '',
            itemParamHeight : 'auto'
        };
        this.configCode = props.info.configCode || ''
        this.shopId = props.info.shopId
        this.openid = props.info.openid || ''
        this.cardId = props.info.cardId || ''
        this.timecardId = props.info.timecardId || ''
        this.token = props.info.token || ''

        this.shopDevice = {}
        this.cardDetail = '';
        this.goodsId = 0
        this.isGift = 0
        this.payStatus = 0

        
    }

    componentDidMount() {

        console.log('numcardDetail props:',this.props)
        getChannelDetail({configCode : this.configCode || undefined}).then(res=>{
            console.log('getChannelDetail',res)
            this.shopDevice.id = res.id
           // this.shopDevice.shopId = res.shopId
            this.shopDevice.storeId = res.storeId
            this.shopDevice.storeName = res.storeName
            this.shopDevice.deviceNo = res.deviceNo
            this.shopDevice.deviceName = res.deviceName
            getJsConfig(this.shopId).then(data=>{
                hideMenuItems();
            })
        })
        getPunchingList({timeCardId: this.timecardId }).then(res => {
            console.log('规格详情：',res)
            if(res.length == 0){
                this.setState({itemParamHeight : '101px'})
            }else if(res.length > 0 && res.length < 3 ){
                this.setState({itemParamHeight : '101px'})
            }else if(res.length > 3){
                this.setState({itemParamHeight : '201px'})
            }
            let tmArr = []
            let tmArr1 = []
            res.map((item)=>{
                tmArr = [...tmArr,{
                    id:item.id,
                    times:item.time,
                    realPrice:parseFloat(item.realPrice).toFixed(2),
                    status:false,
                }]
                let itemParams = {}

                if(item.rewardScore != undefined)
                    itemParams.rewardScore = `赠送积分${item.rewardScore}分`
                if(item.purchaseLimit != undefined)
                    itemParams.purchaseLimit = `每人限购${item.purchaseLimit}次`
                if(item.description != '' && item.description != undefined )
                    itemParams.description = `${item.description}`

                tmArr1 = [...tmArr1,itemParams]
            })
            this.setState({
                depositItem: tmArr,
                depositItemSelect : tmArr1
            },()=>{
               // console.log('参数规格',this.state.depositItem)
            })
        }).catch(msg => {
            console.log(msg)
        })
        
        let params = { id: this.timecardId, token: this.token }
        getNumCardDetail(params).then(res => {
            console.log('次卡详情',res)
            this.setState({
                numCardDetail: res,
                title : res.title
            },()=>{
                this.isGift = res.isGift
            })
        }).catch(msg => {
            console.log(msg)
        })
        this.setState({
            deviceHei : `${document.documentElement.clientHeight}px`
        },()=>{

            this.setState({show:true})
        })
    }
    createOpenCardOrderAction = () => {

        let params = {
            payType: 1,//微信支付
            cardId: this.cardId,
            token: this.token,
            shopId: this.shopId,
            goodsId: this.goodsId,
            storeId: this.shopDevice.storeId,
            deviceNo: this.shopDevice.deviceNo,
            goodsType: 2,
            profitShareConfigId : this.shopDevice.id
        }
        console.log('createOpenCardOrderActionp',params);
        Toast.loading('加载中...')
        let that = this;
        createCardOrder(params).then((rs) => {
            Toast.hide();
            let data = rs;
            console.log(data);
            this.setState({ payInfo: data })
            this.toPayAction()
        }).catch(msg => {
            this.payStatus = 0
            Toast.hide();
        })
    }
    toPayAction = () => {
        let params = {
            token: this.token,
            openId: this.openid,
            tradeId: this.state.payInfo.id,
            shopId: this.shopId,
        }
        console.log('toPayAction:',params)
        gotoPay(params).then(res => {
            console.log(res)
            let resultUrl = '/payresult?orderNo=' + res.orderNo
            if (res.type == "XLP") {
                let payload = res.payload;
                let xlUrl = `https://showmoney.cn/scanpay/unified?data=${payload}`;
                window.location.assign(xlUrl)
            } else if (res.type == "WXP") {
                this.WxPay(res)
            } else {
                window.location.assign(resultUrl)
            }
        }).catch(msg => {
            this.payStatus = 0
        })
    }
    WxPay = (res) => {

        let data = res.payload;
        let resultUrl = '/payresult?orderNo=' + res.orderNo
        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": data.appId,     //公众号名称，由商户传入
                "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": data.nonceStr, //随机串
                "package": data.package,
                "signType": 'MD5',         //微信签名方式：
                "paySign": data.sign //微信签名
            },
            function (res) {
                this.payStatus = 0
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.assign(resultUrl + '&status=success')
                } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                    //支付取消
                    window.location.assign(resultUrl + '&status=fail')
                } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
                    //支付失败
                    window.location.assign(resultUrl + '&status=fail')
                }
             }
        );
    }
    render() {

        return (
            <Bk height={this.state.deviceHei} display="flex" justifyContent="center" bgColor="#f1f1f1" overflowY='auto'>
            {
                this.state.rightnowUse?
                <Bk position='absolute' zIndex='1'>
                    <RightnowUse 
                    userInfo={{
                        shopId : this.shopId,
                        cardId : this.cardId,
                        timecardId : this.timecardId,
                        token : this.token,
                        title : this.state.numCardDetail.title,
                        logo : this.state.numCardDetail.logo,
                    }}
                    close={()=>{
                        this.setState({rightnowUse:false})
                        let params = { id: this.timecardId, token: this.token }
                        getNumCardDetail(params).then(res => {
                            console.log('次卡详情',res)
                            this.setState({
                                numCardDetail: res
                            },()=>{
                                this.isGift = res.isGift
                            })
                        }).catch(msg => {
                            console.log(msg)
                        })
                    }}/>
                </Bk>:null
            }
            {
                this.state.share?
                <Bk position='absolute' zIndex='1'>
                    <SharePage 
                    close={()=>{this.setState({share:false})}}/>
                </Bk>:null
            }
            {
                 this.state.giveCard?
                 <Bk position='absolute' zIndex='1'>
                     <GiveCard
                        info = {{
                            timecardId : this.timecardId,
                            shopId : this.shopId,
                            cardId : this.cardId,
                            token : this.token,
                        }}
                        cardInfo = {this.state.numCardDetail}
                        close={()=>{this.setState({giveCard:false})}}
                        sure={()=>{this.setState({
                            giveCard:false})}}
                     />
                 </Bk>:null
            }
            {
                this.state.introduce?
                <Bk position='absolute' zIndex='1'>
                    <Introduce
                       cardInfo={this.state.numCardDetail}
                       close={()=>{this.setState({introduce:false})}}
                    />
                </Bk>:null
            }
            {
                this.state.activecard?
                <Bk position='absolute' zIndex='1'>
                    <Activecard 
                       close={()=>{this.setState({activecard:false})}}
                    />
                </Bk>:null
            } 
            {
                this.state.getcard?
                <Bk position='absolute' zIndex='1'>
                    <Getcard 
                       close={()=>{this.setState({getcard:false})}}
                    />
                </Bk>:null
            }
            {
                this.state.show?
                    <Bk width="94%">
                        <Bk height="260px" 
                            marginTop="2%" 
                            borderRadius="7px"
                            img="https://ybimage.atogether.com/ebayh5/img/cikakuan1.png" >
                            <Bk height="28%" display='flex' justifyContent="flex-end" alignItems='center'>
                                <div style={{
                                    width:"64px",
                                    height:"25px",
                                    display:'flex',
                                    justifyContent:'center',
                                    alignItems:'center',
                                    borderTopLeftRadius:"50px",
                                    borderBottomLeftRadius:"50px",
                                    fontSize:'1.1em',
                                    background:"#333",
                                    opacity:'0.8',
                                    color:'white',
                                }}
                                    onClick={()=>{
                                        if(this.isGift == 1){
                                            this.setState({
                                                giveCard:true
                                            })
                                        }else{
                                            Toast.info('此卡不能转赠',2.5)
                                        }
                                        
                                    }}>
                                转 赠
                                </div>
                            </Bk>
                            <Bk height="72%" color="#1b1b1b">
                                <Bk height="32%" display="flex" marginTop="-9%" justifyContent="center" >
                                    <Bk width="60px" height="60px"  borderRadius="50%" img={`${this.state.numCardDetail.logo}`}/>
                                </Bk>
                                <Bk height="21%" display="flex" justifyContent="center" alignItems='center' >
                                    <Bk width="auto" height="auto" fontSize='1.1em'>{this.state.numCardDetail.title}次卡</Bk>
                                </Bk>
                                <Bk height="20%" display="flex" justifyContent="center" alignItems="flex-start">
                                    <Bk width="auto" height="auto" >
                                        <span>剩余：<font style={{fontSize:'1.6em'}}>{this.state.numCardDetail.leftTimes}</font> 次</span>
                                    </Bk>
                                </Bk>
                                <Bk height="17%" display="flex" justifyContent="center" alignItems="center" position='relative' >
                                    <Bk width="110px" 
                                        display="flex" 
                                        justifyContent="center" 
                                        alignItems='center'
                                        color='white'
                                        bgColor="#ef7460"
                                        borderRadius='50px'
                                        onClick={()=>{
                                            this.setState({rightnowUse:true})
                                        }}> 
                                        立即使用
                                    </Bk>  
                                </Bk>
                                <Bk height="25%" display="flex">
                                    <Bk display="flex" justifyContent="center" alignItems="center" color="#ffb580" fontSize="1.1em"
                                        onClick={()=>{

                                            window.location.assign(`/payRecord/${this.timecardId}?openid=${this.openid}&card_id=${this.cardId}`)
    
                                        }}
                                        >
                                        使用记录
                                    </Bk>
                                    <Bk display="flex" justifyContent="center" alignItems="center" color="#ffb580" fontSize="1.1em"
                                        onClick={()=>{
                                            this.setState({introduce:true})
                                        }}>
                                        查看详情
                                    </Bk>
                                </Bk> 
                            </Bk>
                        </Bk>
                        <Bk height="300px" >
                            <Bk height="50px" whiteSpace="Wrap" textOverflow='ellipsis' display="flex" justifyContent='space-between' alignItems="center" color="#535353" fontSize="1.08em">
                                <span style={{width:'80%',whiteSpace:"noWrap",textOverflow:'ellipsis',overflowX:'hidden'}}>
                                    门店：{this.shopDevice.storeName}-{this.shopDevice.deviceName}
                                </span>
                                
                            </Bk>
                            <Bk height={`${this.state.itemParamHeight}`} overflowY="auto" >
                            {
                                this.state.depositItem.map((item,index)=>(
                                    <Bk key={index}
                                        width="31%" 
                                        height="92px"
                                        marginRight="6px"
                                        marginTop="6px"
                                        >
                                        <Bk key={index}
                                            img={item.status?'https://ybimage.atogether.com/ebayh5/img/xuanzhong1.png':'https://ybimage.atogether.com/ebayh5/img/weixuanzhong.png'}
                                            onClick={()=>{

                                                let tmArr = this.state.depositItem
                                                if(tmArr[index].status == false){

                                                    for(let i = 0; i < tmArr.length; i ++)
                                                        tmArr[i].status = false
                                                    tmArr[index].status = true
                                                }    
                                                  else
                                                    tmArr[index].status = !tmArr[index].status

                                                if(tmArr[index].status == true){
                                                    this.goodsId = tmArr[index].id
                                                    this.setState({
                                                        payMoney:tmArr[index].price,
                                                        selectItem:this.state.depositItemSelect[index],
                                                        chongzhiItem:tmArr[index]
                                                    })
                                                }else{
                                                    this.goodsId = 0;
                                                    this.setState({
                                                        chongzhiItem:{},
                                                        payMoney:0,
                                                        selectItem:{}
                                                    })
                                                }
                                                this.setState({
                                                    depositItem:tmArr
                                                })
                                            }}
                                        >
                                            <Bk width="80%" display='flex' alignItems='center'>
                                                <Bk height="90%" color='#1b1b1b'>
                                                    <Bk height="50%" marginBottom="4px" display="flex" justifyContent="center" alignItems='flex-end' fontSize="1.4em">{item.times}
                                                        {this.state.numCardDetail ? this.state.numCardDetail.unit || "" : ""}</Bk>
                                                    <Bk height="50%" marginTop="4px" display="flex" justifyContent="center" alignItems='flex-start'>¥ {item.realPrice/100}</Bk>
                                                </Bk>
                                            </Bk>
                                            <Bk width="20%" marginTop='6px' display='flex' justifyContent="flex-start"  alignItems='flex-start' >
                                            {
                                                item.status?<Bk width="16px" height="16px" img="https://ybimage.atogether.com/ebayh5/img/gou.png"/>:null
                                            }  
                                            </Bk>
                                        </Bk>
                                    </Bk>     
                                ))
                            }
                            </Bk>
                            <Bk height="auto" display="flex" justifyContent="center" alignItems="center" marginTop="25px">
                            {
                                this.state.depositItem.length == 0? null :
                                <Bk width="82%"
                                    height="3em"
                                    display="flex"
                                    justifyContent="center"
                                    alignItems='center'
                                    img="https://ybimage.atogether.com/ebayh5/img/chongzhi.png"
                                    onClick={()=>{
                                        if (this.goodsId) {
                                            if(this.payStatus == 0){
                                                this.payStatus = 1
                                                this.createOpenCardOrderAction();
                                            }
                                            
                                        } else {
                                            Toast.info("您还未选择充次规格");
                                        }
                                    }}>
                                    <span style={{fontSize:"1.4em",color:"white"}}>增 加 次 数</span>
                                </Bk>
                            }
                            </Bk>
                            {
                                Object.keys(this.state.selectItem).length == 0?null:
                                <Bk marginTop="35px" marginBottom="35px" height="auto">
                                    {
                                        Object.keys(this.state.selectItem).length == 0? null :
                                        <Bk height="18px">
                                            <Bk width="3px" bgColor="#ef7460"/>
                                            <Bk width="auto" display="flex" alignItems='center' color="#434343" fontSize="1.2em">&#8194;充值说明</Bk>
                                        </Bk>
                                    }
                                    <Bk height="20px" marginTop="6px">
                                        {
                                            Object.keys(this.state.selectItem).map((key,index)=>{
                                                return(
                                                    <Bk key={index} height='auto'>
                                                    {
                                                        this.state.selectItem[key]==undefined?null:
                                                        <Bk key={index} display="flex" alignItems='center' color="#434343" fontSize="1em" marginTop='4px'>
                                                        {`${index+1}. ${this.state.selectItem[key]}`}
                                                        </Bk>
                                                    }
                                                    </Bk>
                                                )
                                            })
                                        }  
                                    </Bk>
                                </Bk>
                            }
                            
                        </Bk>
                    </Bk>
                    :null
            }
                
            </Bk>
        )
    }
}