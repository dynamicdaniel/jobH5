import React from 'react'
import Bk from '../../../components/Bk/Bk'
import { getCardShop } from '../../../actions/card'
import { createCardOrder, gotoPay } from '../../../actions/order';
import moment from 'moment'
import {Toast ,ListView, PullToRefresh} from 'antd-mobile'

export default class KaShop extends React.Component{
      constructor(props){
            super(props)
            const dataSource = new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            });
            this.state = {
                  list : [],
                  dataSource,
                  payInfo : {},
                  show : 'hidden',
                  refreshing : false,
                  isLoading : false

            }
            this.openId = props.info.openId
            this.cardId = props.info.cardId
            this.shopId = props.info.shopId
            this.token = props.info.token
            this.list = {totalNum:0,curNum:0,page:1,data:[]}
      }

      componentDidMount(){
            this.getCardShop()     
      }
      getCardShop = () => {
        let params = {
            page: this.list.page,
            size: 10,
            shopId: this.shopId,
            status: 1
      }
      console.log('getCardShop:',params)
      getCardShop(params).then(res => {
          console.log('积分商城：',res)
          let kaquan = []
          res.map(item=>{
                if(item.card_type != 'MEMBER_CARD'){
                      let cardObj = item
                      let dateInfo = JSON.parse(item.date_info)
                      let dateStr = ''
                      // 使用时间的类型 
                      // DATE_TYPE_FIX_TIME_RANGE 表示固定日期区间，
                      // DATE_TYPE_FIX_TERM表示固定时长（自领取后按天算），
                      // DATE_TYPE_PERMANENT 表示永久有效（会员卡类型专用）。
                      if (dateInfo.type == 'DATE_TYPE_PERMANENT') {
                          dateStr = '永久有效'
                      } else if (dateInfo.type == 'DATE_TYPE_FIX_TERM') {
                          dateStr = '领取后' + (dateInfo.fixed_begin_term == 0 ? '当天生效,' : dateInfo.fixed_begin_term + '天生效,') + '有效期' + dateInfo.fixed_term + '天'
                      } else if (dateInfo.type == 'DATE_TYPE_FIX_TIME_RANGE') {
                          dateStr = moment.unix(dateInfo.begin_timestamp).format('YYYY-MM-DD') + ' 至 ' + moment.unix(dateInfo.end_timestamp).format('YYYY-MM-DD')
                      }
                      cardObj.dateString = dateStr
                      kaquan.push(cardObj)
                } 
            })
            this.list.data = [...this.list.data,...kaquan]
            this.setState({
                list : kaquan,
                show : 'visible',
                dataSource: this.state.dataSource.cloneWithRows(this.list.data),
            })

        }).catch(msg => {
            console.log(msg)
        })
      }
      createOpenCardOrderAction = (item) => {
    
            let params = {
                payType: 1,//微信支付
                cardId: this.cardId,
                token: this.token,
                shopId: this.shopId,
                goodsId: item.id,
                goodsType: 1,
            }
            console.log(params);
            Toast.loading('加载中...')
            let that = this;
            createCardOrder(params).then((rs) => {
                Toast.hide();
                this.setState({ payInfo: rs })
                this.toPayAction()
            }).catch(msg => {
                console.log('createCardOrder ========= error')
                console.log(msg)
                Toast.hide();
            })
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
                if (res.type == "KLP") {
                    if (res && res.payload && res.payload.indexOf("alipay") !== -1) {
                        window.location.assign(res.payload);
                    } else if (res && res.payload) {
                        this.WxPay2(res);
                    }
                }else if (res.type == "XLP") {
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
            console.log('开始微信支付')
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
            console.log(params)
            window.WeixinJSBridge.invoke(
                'getBrandWCPayRequest', params,
                function (res) {
                    console.log(res)
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
    
        WxPay2 = (res) => {
            // alert(JSON.stringify(res));
            let data = res.payload;
            data = JSON.parse(data);
            let resultUrl = '/payresult?orderNo=' + res.orderNo;
    
            let params = {
                "appId": data.appId,     //公众号名称，由商户传入
                "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": data.nonceStr, //随机串
                "package": data.package,
                "signType": data.signType,         //微信签名方式：
                "paySign": data.paySign //微信签名
            }
            console.log(params);
            // alert(JSON.stringify(params));
    
            window.WeixinJSBridge.invoke(
                'getBrandWCPayRequest', params,
                function (res) {
                    console.log("微信支付结果", res);
                    // alert('微信支付结果', JSON.stringify(res));
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        window.location.assign(resultUrl + '&status=success');
                    } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                        //支付取消
                        window.location.assign(resultUrl + '&status=fail');
                    } else if (res.err_msg == 'get_brand_wcpay_request:fail') {
                        //支付失败
                        window.location.assign(resultUrl + '&status=fail');
                    }
                }
            );
      }
      onEndReached = () => {
            this.list.page ++
            this.getCardShop()
      }
      render(){
            return (
                  <Bk height='100%' overflowY='auto' bgColor='#eeeeee'>
                  {
                        this.list.data.length == 0? 
                        <Bk display='flex' flexWrap='wrap'   justifyContent='center' alignItems='center' visibility={this.state.show}>
                              <Bk width='auto' height='120px'  display='flex' flexWrap='wrap' justifyContent='center' marginTop='-60px'>

                                    <Bk  width='80px' height='80px' img='https://ybimage.atogether.com/ebayh5/img/wujilu.png'/>
                                    <Bk  height='auto' marginTop='15px' align='center' color='#555'>暂无卡券</Bk>
                              </Bk>
                        </Bk>
                        :
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={(item)=>{
                                return(
                                    <Bk  className='h_center' height='108px' marginTop='5px' marginBottom='5px' >
                                        <Bk className='v_center' width='94%' img='https://ybimage.yishouyun.net/h5/img/cashop.png' borderRadius='8px'>
                                            <Bk height='80%'>
                                                <Bk width='85.5%'>
                                                        <Bk className='hv_center' width='30%' color='#ef7460'>
                                                        {
                                                            <span><font style={{fontSize:'1.6em'}}>¥</font><font style={{fontSize:'2.5em'}}>{parseFloat(item.price/100).toFixed(2)}</font></span>
                                                        }
                                                        </Bk>
                                                        <Bk width='1px' img='https://ybimage.yishouyun.net/h5/img/huisefenge.png'/>
                                                        
                                                        <Bk className='hv_center' width='69%' color='#555'>
                                                            <div style={{width:'94%'}}>
                                                                    <div className='h_center' style={{width:'100%',fontSize:'1.4em',overflowX:'hidden'}}>{item.goodsName}</div><br/>
                                                                    <div className='h_center' style={{fontSize:'1em',color:'rgba(0,5,55,0.7)'}}>{item.dateString}</div>
                                                            </div>
                                                        </Bk>
                                                </Bk>
                                                <div className='hv_center' style={{width:'14.5%', height: '100%',color:'#ef7460'}}
                                                            onClick = {()=>{
                                                                window.wx.miniProgram.getEnv(res=>{
                                                                    if(res.miniprogram == true){
                                                                        const url = `pay?type=4&token=${this.token}&shopId=${this.shopId}&cardId=${this.cardId}&goodsId=${item.id}`
                                                                        window.wx.miniProgram.navigateTo({
                                                                            url: url
                                                                        })
                                                                    }else{
                                                                        this.createOpenCardOrderAction(item)
                                                                    }
                                                                })  
                                                }}>
                                                    <div>
                                                            <div>立即</div>
                                                            <div>购买</div>
                                                    </div>
                                                            
                                                </div>
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
                                refreshing={this.state.refreshing}
                                damping={50}
                                onRefresh={()=>{
                                    this.setState({
                                        refreshing:false,
                                        isLoading:false
                                    })
                                }}
                                direction={'up'} 
                                onRefresh={()=>{}}
                            />} 
                        />
                  }
                  </Bk>
            )
      }
}