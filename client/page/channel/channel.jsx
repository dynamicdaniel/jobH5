import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import constant from '../../utils/constantUtil';
import './channel.css';
import {  getBundingdevice ,getEntityDetail, createCustomChongzhi} from '../../actions/numcard'
import {  getChargeAmountLst, getPayRecordData, getChargeList } from '../../actions/home'
import {  createChargeOrder, gotoPay } from '../../actions/order';
import { getMemberCardUserInfo } from '../../actions/card';
import {getJsConfig, hideMenuItems, scanCode} from '../../actions/wx'
import {getChannelDetail} from '../../actions/channel'
import Bk from '../../components/Bk/Bk'
import {Picker,Grid,Tabs,ListView,PullToRefresh,Toast} from 'antd-mobile'
import moment from 'moment'
import Introduce from './component/introduce'
import EntityCard from './component/entityCard'

const NUM_ROWS = 15
const strArr = [{prex:'赠送积分',end:'分'},{prex:'每人限购',end:'次'}]
class Channel extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state = {
            show:'hidden',
            balanceAmount: parseFloat(0).toFixed(2),
            bodyHeight:'auto',
            listviewHeight:'auto',
            detail:false,
            depositItem:[],
            depositItemSelect:{},
            selectItem:{},
            chongzhiItem:{},
            payInfo:{},
            payMoney:'',
            tabIndex:0,
            dataSource,
            errStatus:false,
            entityCardShow : false,
            EntityCardCode : '',
            entityCardDetail : {},
            inputStyle : 'inputnoSelect',
            inputMoney : '',
            itemParamHeight : 'auto'

        };
        this.openId = this.props.info.openid
        this.token = props.info.token
        this.configCode = this.props.info.configCode
        this.shopId = this.props.info.shopId
        this.id = ''
        this.cardId = ''
        this.storeId = ''
        this.storeName = ''
        this.deviceName = ''
        this.deviceNo = ''
        this.list = [
            {totalNum:0,curNum:0,page:1,data:[]},
            {totalNum:0,curNum:0,page:1,data:[]},
        ]
        this.payStatus = 0
        getJsConfig(this.shopId).then(data => {hideMenuItems()})
    }

    componentDidMount(){
      console.log(this.props)
        getChannelDetail({configCode : this.configCode}).then(res=>{
           // console.log('getChannelDetail',res)
            this.id = res.id
            this.shopId = res.shopId
            this.cardId = res.card_id
            this.storeId = res.storeId
            this.storeName = res.storeName
            this.deviceNo = res.deviceNo
            this.deviceName = res.deviceName

            const height = document.documentElement.clientHeight
            this.setState({
                bodyHeight:height,
                show:'visible'
            },()=>{
                let cardId = this.cardId;
                let openId = this.openId;
                let params = {cardId, openId};
               // console.log('membercard 参数：',params)
                getMemberCardUserInfo(params).then(data => {
                    console.log('getMemberCardUserInfo',data);
                    this.setState({
                        balanceAmount:parseFloat(data.userCardBaseInfo.money/100).toFixed(2)
                    })
                }).catch(error => {
                    console.log(error);
                })
    
                let params2 = { shopId: this.shopId, cardId: this.cardId }
                getChargeAmountLst(params2).then(res => {
                 //   console.log('获取规格',res);
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
                            amount:item.amount/100,
                            price:parseFloat(item.price/100).toFixed(2),
                            status:false
                        }]
                    let itemParams = {}

                    if(item.rewardScore != undefined)
                        itemParams.rewardScore = item.rewardScore
                    if(item.limitNum != undefined)
                        itemParams.limitNum = item.limitNum
                    if(item.rewardCardList.length != 0)
                        itemParams.rewardCardList = item.rewardCardList
                    if(item.rewardTimeCardList.length != 0)
                        itemParams.rewardTimeCardList = item.rewardTimeCardList

                    tmArr1 = [...tmArr1,itemParams]
                    //     tmArr1 = [...tmArr1,{
                    //         rewardScore:item.rewardScore,
                    //         limitNum:item.limitNum,
                    //         rewardCardList:item.rewardCardList,
                    //         rewardTimeCardList: item.rewardTimeCardList
                    //     }]
                     })
                    this.setState({
                        depositItem: tmArr,
                        depositItemSelect : tmArr1
                    })
                }).catch(msg => {
                    // console.log(msg)
                })
            })
        })
    }
    initRecord = () => {

        let chargeListParam = {
            token: this.token,
            cardId: this.cardId,
            page: 1,
            size: NUM_ROWS,
            bigType: 1
            // type: "charge_H5,charge_cash,init,reward_levelup,reward_share,entityTransfer"
        } 

        getChargeList(chargeListParam).then(res => {
           //console.log('充值记录',res);
            if(res.list.length > 0){
                let tmArr1 = []
                res.list.map(item=>{

                    tmArr1 = [...tmArr1,{
                        content: item.content,
                        time:moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                        money:parseFloat(item.amount/100).toFixed(2)
                    }]
                })
                this.list[0].totalNum = res.count
                this.list[0].data = tmArr1
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.list[0].data),
                })   
            }
            let params_init_2 = {
                token: this.token,
                cardId: this.cardId,
                page: 1,
                size: NUM_ROWS,
                bigType: 2
                // page: 1,
                // size: NUM_ROWS,
                // orderStatus: 4,         // 订单状态：已完成
                // payType: 3,             // 支付方式：余额
                // token: this.token,
                // card_id: this.cardId
            }
            console.log(params_init_2);
    
            getChargeList(params_init_2).then(res1 => {
               // console.log('消费记录：',res1);
                if(res1.list.length > 0){
                    let tmArr2 = []
                    res1.list.map(item=>{
                        tmArr2 = [...tmArr2,{
                            shopName:item.content,
                            time:moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                            money:parseFloat(item.amount/100).toFixed(2)
                        }]
                    })
                    this.list[1].totalNum = res1.count
                    this.list[1].data = tmArr2
                }
            }).catch(msg => {
                console.log(msg)
            })
        }).catch(msg => {
            console.log(msg)
        })
        
    }
    onEndReached = () => {

        let params = {}
        let select = this.state.tabIndex
        if(this.list[select].curNum < this.list[select].totalNum){
            if(select == 0){

                let chargeListParam = {
                    token: this.token,
                    cardId: this.cardId,
                    page: this.list[select].page + 1,
                    size: NUM_ROWS,
                    bigType: 1
                    // type: "charge_H5,charge_cash,init,reward_levelup,reward_share,entityTransfer"
                };
                getChargeList(chargeListParam).then(res => {
                   // console.log('更新的充值记录', res);
                    if (res.list.length > 0) {
                        let tmArr1 = []
                        res.list.map(item => {
                            tmArr1 = [...tmArr1, {
                                content: item.content,
                                time: moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                                money: parseFloat(item.amount / 100).toFixed(2)
                            }]
                        })
                        this.list[select].page += 1
                        this.list[select].totalNum = res.count
                        this.list[select].data = [...this.list[select].data,...tmArr1];
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.list[select].data),
                        });
                    }
                }).catch(msg => {
                    console.log(msg)
                })
            }else if(select == 1){
                params = {
                    token: this.token,
                    cardId: this.cardId,
                    page: this.list[select].page + 1,
                    size: NUM_ROWS,
                    bigType: 2
                    // page: this.list[select].page + 1,
                    // size: NUM_ROWS,
                    // orderStatus: 4,         // 订单状态：已完成
                    // payType: 3,             // 支付方式：余额
                    // token: this.token,
                    // card_id: this.cardId
                };
                getChargeList(params).then(res => {
                   // console.log('更新的消费记录：', res)
                    if (res.list.length > 0) {
                        let tmArr3 = []
                        res.list.map((item, index) => {
                            tmArr3 = [...tmArr3, {
                                shopName: item.content,
                                time: moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                                money: parseFloat(item.amount / 100).toFixed(2)
                            }]
                        });
                        this.list[select].page += 1
                        this.list[select].curNum += NUM_ROWS
                        this.list[select].data = [...this.list[select].data, ...tmArr3]
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.list[select].data),
                        })
                    }
                }).catch(msg => {
                    console.log(msg)
                })
            }
        }
    }
    createOrderInfo = () => {
        let params = {
            token: this.token,
            shopId: this.shopId,
            storeId: this.storeId,
            deviceNo: this.deviceNo,
            amountId: this.state.chongzhiItem.id,
            profitShareConfigId : this.id,
            payType : 1,
        }
        console.log(params)
         //Toast.loading('加载中...')
        // //开始创建订单
        createChargeOrder(params).then(rs => {
            
            Toast.hide();
            console.log('charegeInfo');
            console.log(rs);
            this.setState({ payInfo: rs })
            this.toPayAction()
        }).catch(err => {
            console.log('抓取错误',err)
            if(err.success == false){
                this.payStatus = 0
                this.setState({
                    errStatus:true
                })
            }
        });
    }

    toPayAction = () => {

        let params = {
            token: this.token,
            openId: this.openId,
            tradeId: this.state.payInfo.id,
            shopId: this.shopId,
        }

        console.log(params);
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
                window.location.assign(resultUrl + '&status=fail' )
            }
        }).catch(msg => {
            console.log(msg)
        })
    }

    WxPay = (res) => {
        let resultUrl = '/payresult?orderNo=' + res.orderNo
        let data = res.payload
        let params = {
            "appId": data.appId,     //公众号名称，由商户传入
            "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": data.nonceStr, //随机串
            "package": data.package,
            "signType": 'MD5',         //微信签名方式：
            "paySign": data.sign //微信签名
        }
        window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', params,
            function (res) {
                console.log(res)
                this.payStatus = 0
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    window.location.assign(resultUrl + '&status=success')
                    let params = {
                        page: 1,
                        size: NUM_ROWS,
                        orderStatus: 4,
                        orderType: 4,
                        token: this.token,
                        card_id: this.cardId
                    }
                    getPayRecordData(params).then(res => {
                        console.log('充值',res)
                        if(res.list.length > 0){
                            let tmArr1 = []
                            res.list.map((item,index)=>{
                                tmArr1 = [...tmArr1,{
                                    time:moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                                    money:item.realAmount/100
                                }]
                            })
                            this.list[0].data = [...tmArr1]
       
                            this.setState({
                                dataSource: this.state.dataSource.cloneWithRows(this.list[0].data),
                            })   
                        }
                    }).catch(msg => {
                        console.log(msg)
                    })

                } else if(res.err_msg == 'get_brand_wcpay_request:cancel'){
                    //支付取消          
                   window.location.assign(resultUrl + '&status=fail')
                } else if(res.err_msg == 'get_brand_wcpay_request:fail') {
                    //支付失败
                   window.location.assign(resultUrl + '&status=fail')
                }
            }
        )
    }
    render() {
        return (
            <Bk height={`${this.state.bodyHeight}px`} overflowY='auto' visibility={this.state.show} bgColor='#f2f2f2'>
                {
                    this.state.errStatus?
                    <Bk position='absolute' zIndex='1'>
                        <Introduce close={()=>{this.setState({errStatus:false})}}/>
                    </Bk>:null
                }
                {
                    this.state.entityCardShow?
                    <Bk position='absolute' zIndex='99'>
                        <EntityCard openId={this.openId} entityCardDetail = {this.state.entityCardDetail} 
                        callback = {()=>{
                            this.setState({entityCardShow:false})
                            let params = {
                                cardId : this.cardId, 
                                openId : this.openId
                            };
                            console.log(params)
                            getMemberCardUserInfo(params).then(data => {
                                this.setState({
                                    balanceAmount:parseFloat(data.userCardBaseInfo.money/100).toFixed(2)
                                })
                            }).catch(error => {
                                console.log(error);
                            })
                        }}
                        close={()=>{this.setState({entityCardShow:false})}}/>
                    </Bk>:null
                }
                <Bk height='28%'
                    img={constant.IMAGE_PREFIX + 'kamian.png'}>
                    <Bk height='20%'/>
                    <Bk height='40%' color='white'>
                         <Bk height='50%' display='flex' justifyContent='center' alignItems='flex-end' fontSize='1.2em' >
                            可用余额
                        </Bk>
                        <Bk height='50%' display='flex' justifyContent='center' alignItems='center' fontSize='2.1em' marginTop='6px' > 
                            ¥ {this.state.balanceAmount}
                        </Bk>
                    </Bk>
                    <Bk height='35%' display='flex' justifyContent='center'>
                        <Bk width='73.45%'>
 
                            <Bk width='100%' display='flex' justifyContent='flex-end' alignItems='center' color='white'
                    
                                    onClick={()=>{
                                        this.setState(prev=>({detail:!prev.detail,tabIndex:0}),()=>{
                                            if(this.state.detail==true){
                                                this.initRecord();
                                            }
                                            else{
                                                this.setState({tabIndex:0})
                                            }
                                        })
                                    }}>
                                    <Bk width='auto' height='auto' fontSize='1.1em'>
                                    {this.state.detail?'会员充值':'余额明细'}
                                    </Bk>
                                    <Bk width='12px' height='12px' marginLeft='9px' marginRight='5px' img='https://ybimage.atogether.com/ebayh5/img/you.png'/>
                            
                            </Bk>
                        </Bk>
                        
                    </Bk>
                </Bk>
                {
                    this.state.detail?
                    <Bk height='72%'>
                         <Tabs 
                            tabs={[
                                { title: '充值记录'},
                                { title: '消费记录'},
                            ]}
                            initialPage={0}
                            tabBarActiveTextColor='#000'
                            tabBarInactiveTextColor='#aaa'
                            tabBarTextStyle={{fontSize:'1.15em'}}
                            tabBarUnderlineStyle={{border:'2px solid #ef7460'}}
                            onChange={(tab, index) => {
                                console.log(index)
                                console.log(this.list[index].data)
                                this.setState({
                                    tabIndex:index,
                                    dataSource:this.state.dataSource.cloneWithRows(this.list[index].data)
                                })
                            }}
                            onTabClick={(tab, index) => {
                                console.log(index)
                                console.log(this.list[index].data)
                                this.setState({
                                    tabIndex:index,
                                    dataSource:this.state.dataSource.cloneWithRows(this.list[index].data)
                                }) 
                            }}>
                            <Bk bgColor='white'>
                            {
                                this.list[this.state.tabIndex].data.length > 0?
                                <ListView
                                    ref='listview'
                                    dataSource={this.state.dataSource}
                                    renderRow={(item)=>{
                                        return (
                                            <Bk height='54px' 
                                                display='flex' 
                                                justifyContent='center' 
                                                bgColor='white' 
                                                borderBottom='1px solid #f1f1f1'>
                                                <Bk width='92%'>
                                                    <Bk width='11%' display='flex' alignItems='center'>
                                                        <Bk width='36px' height='36px'  
                                                        img={constant.IMAGE_PREFIX + 'jilu.png'}/>
                                                    </Bk>
                                                    <Bk width='69%' display='flex'  alignItems='center'>
                                                        <Bk height='76%' display='flex' flexWrap='wrap' alignContent='space-around' marginLeft='12px' marginTop='4px'>
                                                            <Bk height='auto' fontSize='1.15em' color='#000'>
                                                            {this.state.tabIndex==0?item.content:item.shopName}
                                                            </Bk>
                                                            <Bk height='auto' fontSize='0.9em' color='#aaa'>{item.time}</Bk>
                                                        </Bk>
                                                    </Bk>
                                                    <Bk width='20%' display='flex'  justifyContent='flex-end' alignItems='center' fontSize='1.2em'
                                                    color={this.state.tabIndex==0?'#22ac38':'#3a9dfd'}
                                                    >
                                                        {this.state.tabIndex==0?'+' : '-'}{item.money}
                                                    </Bk>
                                                </Bk>
                                                
                                            </Bk>
                                        )
                                    }}
                                    style={{
                                        width:"100%",
                                        height:'100%'
                                    }}
                                    onEndReached={this.onEndReached}
                                    pageSize={5}
                                    initialListSize={25}
                                    pullToRefresh={
                                        <PullToRefresh
                                            onRefresh={()=>{}}
                                            damping={50}
                                            direction={'up'} 
                                        />
                                    } 
                                />
                                :
                                <Bk display='flex' flexWrap='wrap'   justifyContent='center' alignItems='center'>
                                    <Bk width='auto' height='120px'  display='flex' flexWrap='wrap' justifyContent='center' marginTop='-60px'>

                                        <Bk  width='80px' height='80px' img='https://ybimage.atogether.com/ebayh5/img/wujilu.png'/>
                                        <Bk  height='auto' marginTop='15px' align='center' color='#555'>暂时没有找到相关数据</Bk>
                                    </Bk>
                                </Bk>
                            }
                            
                            </Bk>
                        </Tabs>
                    </Bk>
                    :
                    <Bk height="auto" display='flex' justifyContent='center'>
                    <Bk width='92%' height='auto' marginTop='10px'>
                        <Bk height="50px" whiteSpace="Wrap" textOverflow='ellipsis' display="flex" justifyContent='space-between' alignItems="center" color="#535353" fontSize="1.08em">
                            <span style={{width:'80%',whiteSpace:"noWrap",textOverflow:'ellipsis',overflowX:'hidden'}}>
                                门店：{this.storeName}-{this.deviceName}
                            </span>
                            
                        </Bk>
                        {
                            Object.keys(this.state.depositItem).length > 0 ?
                            <Bk height={`${this.state.itemParamHeight}`} overflowY="auto">
                            <Grid data={this.state.depositItem}
                                columnNum={3}
                                hasLine={false}
                                activeStyle={false}
                                itemStyle={{height:100,background:'#f2f2f2'}}
                                renderItem={(item,index) => (
                                    <Bk key={index} display='flex' justifyContent='center' alignItems='center'>
                                        <Bk width='94%' height='90%' outline='1px solid #f1f1f1'
                                        img={`${constant.IMAGE_PREFIX }${item.status?'dianji.png':'weidianji.png'}`}
                                        onClick={()=>{
                                            let tmArr = this.state.depositItem
                                            this.setState({
                                                inputMoney : ''
                                            })
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
                                                this.setState({
                                                    chongzhiItem:{},
                                                    payMoney:0,
                                                    selectItem:{}
                                                })
                                            }
                                            this.setState({
                                                depositItem:tmArr,
                                            })
                                        }}>
                                            <Bk width="80%" display='flex' alignItems='center'>
                                                <Bk height="90%" color='#1b1b1b'>
                                                    <Bk height="50%" marginBottom="4px" display="flex" justifyContent="center" alignItems='flex-end' fontSize="1.4em">{item.amount}元</Bk>
                                                    <Bk height="50%" marginTop="4px" display="flex" justifyContent="center" alignItems='flex-start'>售价{item.price}元</Bk>
                                                </Bk>
                                            </Bk>
                                            <Bk width="20%" marginTop='6px' display='flex' justifyContent="flex-start"  alignItems='flex-start' >
                                            {
                                                item.status?<Bk width="16px" height="16px" img="https://ybimage.atogether.com/ebayh5/img/gou.png"/>:null
                                            }
                                            </Bk>     
                                        </Bk>
                                    </Bk>  
                                )}/>
                        </Bk> : null
                        }
                        <Bk height='auto' display='flex' justifyContent='center' borderRadius='10px'>
                            <Bk width='100%' height='3em' marginTop={10} marginBottom={10}>
                                <input className={this.state.inputStyle} value={this.state.inputMoney} type='text' placeholder='输入其他充值金额' 
                                style={{width:'100%',height:'100%',borderRadius:'6px',fontSize:'1.2em',textAlign:'center'}}
                                    onFocus={()=>{
                                        let tmArr = this.state.depositItem
                                        tmArr.map((item,index)=>{tmArr[index].status = false})
                                        this.setState({
                                            chongzhiItem:{},
                                            payMoney:'',
                                            selectItem:{}
                                        })

                                        this.setState({
                                            inputStyle : 'inputSelect',
                                        })
                                    }}
                                    onBlur = {()=>{
                                        this.setState({
                                            inputStyle : 'inputnoSelect',
                                        })
                                    }}
                                    onChange={(e)=>{
                                       this.setState({
                                            payMoney : e.target.value,
                                            inputMoney : e.target.value
                                       })
                                    }}
                                />
                            </Bk>
                        </Bk>
                        <Bk height="auto" display="flex" justifyContent="center" marginTop="25px">
                            <div style={{
                                width:'75%',
                                height:'2.8em',
                                display:'flex',
                                justifyContent:'center',
                                alignItems:'center',
                                color:'white',
                                fontSize:'1.2em',
                                background:'#ef7460',
                                borderRadius:50
                                }}
                            onClick={()=>{
                    
                                if( Object.keys(this.state.chongzhiItem).length > 0 ){
                                    if(this.payStatus == 0){
                                        this.payStatus = 1
                                        this.createOrderInfo()
                                    }
                                    
                                }else{
      
                                    let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
              
                                    if(reg.test(this.state.payMoney)){
                                        console.log('合格')

                                        let params = {
                                            token : this.token,
                                            cardId : this.cardId,
                                            shopId : this.shopId,
                                            storeId : this.storeId,
                                            deviceNo : this.deviceNo,
                                            amount : parseFloat(this.state.payMoney)*100,
                                            payType : 1,
                                            profitShareConfigId : this.id
                                        }
                                        console.log('input参数：',params)
                                        //创建订单
                                        if(this.payStatus == 0){
                                            this.payStatus = 1
                                            createCustomChongzhi(params).then(rs => {
            
                                                Toast.hide();
                                                console.log('自定义充值创建订单结果：',rs);
                                                this.setState({ payInfo: rs })
                                                this.toPayAction()
                                            }).catch(err => {
                                                console.log('抓取错误',err)
                                                if(err.success == false){
                                                    this.setState({
                                                        errStatus:true
                                                    })
                                                }
                                            });
                                        }
                                        
                                    }else{
                                        Toast.info('请输入正确金额',2)
                                        this.setState({
                                            inputMoney : '',
                                            payMoney : ''
                                        })
                                    }
                                }
                            }}>
                                支付 {this.state.payMoney==0?'':`${this.state.payMoney} 元`}
                            </div>
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
                                <Bk height="auto" marginTop="6px">
                                    {
                                        Object.keys(this.state.selectItem).map((key,index)=>{
                                            if(index < 2){
                                                return(  
                                                    <Bk key={index} display="flex" alignItems='center' color="#434343" fontSize="1em" marginTop='3px'>
                                                    {
                                                        this.state.selectItem[key]!=undefined?
                                                        ` ${index+1}. ${strArr[index].prex}${this.state.selectItem[key]}${strArr[index].end}`:null
                                                    }
                                                    </Bk>
                                                )
                                            }
                                            else if(index < 3){
                                                if (this.state.selectItem && this.state.selectItem[key] && this.state.selectItem[key].length > 0){
                                                    return ( 
                                                        <Bk key={index} height='auto' display="flex" flexWrap='wrap' alignItems='center' color="#434343" fontSize="1em" marginTop='3px'>
                                                            <span>{index + 1}. 赠送卡券:</span>
                                                            {
                                                                this.state.selectItem[key].map((item, child_index) => {
                                                                  //  console.log(item)
                                                                    return <span>{`${item.title}${item.num}张`}</span>
                                                                })
                                                            }
                                                        </Bk>
                                                    );
                                                }else{
                                                    return null;
                                                }
                                            }else{
                                                if (this.state.selectItem && this.state.selectItem[key] && this.state.selectItem[key].length > 0) {
                                                    return (
                                                        <Bk key={index} display="flex" flexWrap='wrap' alignItems='center' color="#434343" fontSize="1em" marginTop='3px'>
                                                            <span width="auto">{index + 1}. 赠送次卡:</span>
                                                            {
                                                                this.state.selectItem[key].map((item, child_index) => {
                                                                    if (item.num > 0) {
                                                                        return <span width="auto">{`${item.title}-${item.num}次`};</span>;
                                                                    }
                                                                })
                                                            }
                                                        </Bk>
                                                    );
                                                }else{
                                                    return null;
                                                }
                                            }
                                        })
                                    }
                                    
                                </Bk>
                            </Bk>
                        }
                        
                    </Bk>  
                </Bk>
                }
                
            </Bk>
        )
    }
}
export default Channel