import React, { Component } from 'react';
import Bk from '../../components/Bk/Bk'
import './qrpay.css'
import Qrcode from 'qrcode.react'
import { ActionSheet,Toast} from 'antd-mobile';
import JsBarcode from 'jsbarcode';
import './pay.css';
import{ 
      gotoPay,
      setPayType,
      generateAuthCode,
      getTradeByAuthCode} from '../../actions/order';
import { getJsConfig , hideMenuItems } from '../../actions/wx';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;

if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
export default class QrPay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show:'hidden',
            bodyHeight:'auto',
            clicked: 'none',
            payType : '余额',
            authCode : '',
            showCode : false,
            invalidCode : false
        }
        this.payTypeToNum = 0
        this.token = props.info.token
        this.openId = props.info.openId
        this.cardId = props.info.cardId
        this.shopId = props.info.shopId
        this.authCode = ''
        this.interVal = ''
        this.timeout = ''
        this.tradeId = ''
        this.paytype = 3
        getJsConfig(this.shopId).then(res => {
            hideMenuItems();
        });
    }
    componentDidMount(){

      const height = document.documentElement.clientHeight+'px'
      this.setState({
          bodyHeight:height,
          show:'visible'
      },()=>{

            this.freshCode() 
      })
    }
    freshCode = () => {
      let params = {
            openId : this.openId,
            cardId : this.cardId
      }
      generateAuthCode(params).then(res=>{
            console.log('generateAuthCode:',res)
            this.authCode = res
            this.setState({authCode : this.authCode})
            JsBarcode(this.barcode, this.authCode, {
                  displayValue: false,
                  width: 2,
                  height: '70%',
                  margin: 0,
            });
            let params1 = {
                  authCode : this.authCode,
                  payType : this.paytype
            }
            setPayType(params1).then(res=>{
                  console.log('设置支付方式：',res)
                  let params2 = {
                        authCode : this.authCode
                  }
                  this.interVal = setInterval(() => {
                        getTradeByAuthCode(params2).then(res=>{
                              console.log('getTradeByAuthCode:',res)
                              if(res.status == -1){
                                    clearInterval(this.interVal)
                                    this.setState({
                                          invalidCode : true
                                    })
                                    // setInterval(()=>{
                                    //       Toast.info('支付码失效',500)
                                    // },2000)
                              }else{
                                    if(res.status == 1){
                                          if(res.tradeId != undefined  && res.tradeId > 0){
                                                clearInterval(this.interVal)
                                                this.tradeId = res.tradeId
                                                this.toPayAction()
                                          }
                                    }else if(res.status == 2){
                                          console.log('支付完成')
                                    }
                              }
                              
                        }).catch(e=>{
                              console.log(e)
                        })
                  }, 1000);
            })
      })
    }
    showActionSheet = () => {
      const BUTTONS = ['余额', '微信','取消'];
      ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        //destructiveButtonIndex: BUTTONS.length - 2,
        title: '支付方式',
        //message: '支付方式',
        maskClosable: true,
        'data-seed': 'logId',
        wrapProps,
      },
      (buttonIndex) => {
            console.log('buttonIndex:',buttonIndex)
            let tmPayType = ''
            if(buttonIndex != 2){
                  if(buttonIndex == 0){
                        tmPayType = '余额'
                        this.paytype = 3
                  }else if(buttonIndex == 1){
                        tmPayType = '微信'
                        this.paytype = 1
                  }
                  this.setState({payType : tmPayType})
                  this.payTypeToNum = buttonIndex
                  let params = {
                        authCode : this.authCode,
                        payType : this.paytype
                  }
                  console.log('支付方式参数:',params)
                  setPayType(params).then(res=>{
                        console.log('设置支付方式：',res)
                  })
            }
      });
    }
    toPayAction = () => {
            let params = {
                  token: this.token,
                  openId: this.openId,
                  tradeId: this.tradeId,
                  shopId: this.shopId,
            }
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
    render(){
          return(
            <Bk height={this.state.bodyHeight} visibility={this.state.show}>
                  {
                        this.state.showCode == true?
                        <Bk height='100%' position='absolute' zIndex='1' onClick={()=>{
                              this.setState({
                                    showCode : false
                              })
                        }}>
                              <Bk height='100%' bgColor='black' opacity='0.6' position='absolute'/>
                              <Bk className='hv_center' height='100%' position='absolute' zIndex='2'>
                                    <Bk className='hv_center' width='92%' height='200px' marginTop='-20%' bgColor='white' fontSize='3em' borderRadius='9px'>
                                          {this.state.authCode}
                                    </Bk>
                              </Bk>
                              
                        </Bk>: null
                  }
                  
                  <Bk className='h_center' bgColor='#ef7460' >
                  {
                        this.state.invalidCode == true?
                        <Bk height='100%' position='absolute' zIndex='1' onClick={()=>{
                              this.setState({
                                    invalidCode : false
                              })
                        }}>
                              <Bk height='100%' bgColor='white' opacity='0.5' position='absolute'/>
                              <Bk className='hv_center' height='100%' position='absolute' zIndex='2'>
                                    <Bk className='hv_center' width='92%' height='70%' marginTop='-20%' bgColor='white' fontSize='1.2em' borderRadius='9px' opacity='0.9'
                                          onClick={()=>{
                                                this.setState({
                                                      invalidCode : false
                                                },()=>{
                                                      this.freshCode()
                                                })
                                          }}
                                    >
                                          付款码已失效，请点击刷新
                                    </Bk> 
                              </Bk>
                              
                        </Bk>: null
                  }
                        <Bk  className='h_center' width='92%' height='70%' flexWrap='wrap' bgColor='white' marginTop='20px' borderRadius='6px'>
                              <Bk className='v_center' height='10%' bgColor='#f6f6f6' border0='6px' border1='6px' >
                                    <Bk width='23px' height='18px' marginLeft='10px' img='https://ybimage.yishouyun.net/h5/img/zhifugou1.png'/>
                                    <Bk className='v_center' width='auto' color='#ef7460'>&#8194;向商家付款</Bk>         
                              </Bk>
                              <Bk width='88%' height='90%' position='relative'>
                                    
                                    <Bk className='hv_center' height='10%' color='#aaa' marginTop='5%'>
                                          点击可查看付款码序列号
                                    </Bk>
                                    <Bk className='h_center v_start' height='23%' onClick={()=>{
                                          this.setState({
                                                showCode : true
                                          })
                                    }}>
                                          <svg
                                                ref={(val) => {
                                                      this.barcode = val;
                                                }}
                                          />  
                                    </Bk>
                                    <Bk className='h_center v_start' height='37%'>
                                          <Qrcode size={135} value={this.state.authCode} onClick={()=>{
                                                this.setState({
                                                      showCode : true
                                                })
                                          }}/>
                                    </Bk>
                                    <Bk className='hv_center' height='5%' >
                                          <Bk height='1px' bgColor='#f1f1f1' />
                                    </Bk>
                                    <Bk height='20%'>
                                          <Bk className='hv_center' height='25px' marginTop='5px'>
                                                <Bk width='70%' fontSize='1.3em' >
                                                      <Bk className='v_center' width='70%'>{this.state.payType}</Bk>
                                                      <Bk className='h_end v_center' width='30%' color='#aaa'
                                                      onClick={()=>{
                                                            this.showActionSheet()
                                                      }}>更改</Bk>
                                                </Bk>                      
                                          </Bk>
                                           <Bk className='hv_center' height='20px' color='#aaa' fontSize='1em'>
                                                
                                                <Bk className='v_center' width='70%'>优先使用此支付方式付款</Bk>
                                          </Bk>
                                    </Bk>
                              </Bk>
                        </Bk>
                  </Bk>
            </Bk>
          )
    }
}
