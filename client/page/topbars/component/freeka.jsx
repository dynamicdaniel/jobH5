import React from 'react'
import Bk from '../../../components/Bk/Bk'
import { getFreeCardList , getCardExtStr} from '../../../actions/card'
import { getJsConfig, addCard } from '../../../actions/wx';
import moment from 'moment'

const listItembgImg = {
      'DISCOUNT' : {
            img : 'https://ybimage.yishouyun.net/h5/img/DISCOUNT.png',
            color : '#fe8515'
      },
      'GIFT' : {
            img : 'https://ybimage.yishouyun.net/h5/img/GIFT.png',
            color : '#1c66fb'
      },
      'CASH' : {
            img : 'https://ybimage.yishouyun.net/h5/img/CASH.png',
            color : '#fc3620'
      },
      'GROUPON' : {
            img : 'https://ybimage.yishouyun.net/h5/img/GROUPON.png',
            color : '#6e9f0e'
      },
      'GENERAL_COUPON' : {
            img : 'https://ybimage.yishouyun.net/h5/img/GENERAL_COUPON.png',
            color : '#be206a'
      }
}
export default class FreeKa extends React.Component{
      constructor(props){
            super(props)
            this.state = {
                  list : [],
                  show : 'hidden'
            }
            this.shopId = props.info.shopId,
            this.openId = props.info.openId
      }
      componentDidMount(){
            this.getCardList()
      }
      getCardList = () => {
            let params = {
                  shopId : this.shopId,
                  openId : this.openId
            }
            console.log('getFreeCardList params:',params)

            getFreeCardList(params).then(res => {
                  console.log('getFreeCardList:',res)
                  const tmArr = res.list.filter(item => item.card_type !== 'MEMBER_CARD');
                  let kaquan = []
                  tmArr.map(item=>{
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
                              if(item.otherInfo != undefined && item.otherInfo != ''){
                                    let otherJson = JSON.parse(item.otherInfo)
                                    let tmStr = ''
                                    switch(item.card_type){
                                          case 'GIFT' : 
                                                tmStr = '兑';
                                          break;
                                          case 'CASH' : 
                                                tmStr = parseFloat(otherJson.reduce_cost/100);
                                          break;
                                          case 'GROUPON' : 
                                                tmStr = '团';
                                          break;
                                          case 'DISCOUNT' : 
                                                tmStr = (100-otherJson.discount)/10;
                                          break;
                                          case 'GENERAL_COUPON' : 
                                                tmStr = '惠';
                                          break;
                                    }
                                    cardObj.head = tmStr
                              }
                              cardObj.dateString = dateStr
                              
                              kaquan.push(cardObj)
                        }
                  })
                  this.props.getNum(kaquan.length)
                  this.setState({
                        list : kaquan,
                        show : 'visible'
                  })
            }).catch(msg => {
                  console.log(msg)
            });
      }
      addCardAction = (record) => {
            console.log(record)
            let params = {
                shopId: this.shopId,
                paramsJson: JSON.stringify({ openid: this.openId, card_id: record.card_id, outer_str: record.id })
            }
            console.log('getCardExtStr params:',params)
            getCardExtStr(params).then(res => {
                console.log('getCardExtStr:',res)
                let lst = []
                lst.push({ cardId: record.card_id, cardExt: JSON.stringify(res) })
                getJsConfig(this.shopId).then(data => {
                  console.log('getJsConfig:', data)
                    addCard(lst, (res) => {
                        console.log('getJsConfig addCard:',res);
                        //alert(JSON.stringify(res))
                        this.getCardList()
                    }, (error) => {
                        console.log('addCard error:',error);
                    })
                }).catch(msg => {
                    console.log(msg)
                });
            })
      }
      render(){
            return (
                  <Bk height='100%' overflowY='auto'>
                  {
                        this.state.list.length == 0? 
                        <Bk display='flex' flexWrap='wrap'   justifyContent='center' alignItems='center' visibility={this.state.show}>
                              <Bk width='auto' height='120px'  display='flex' flexWrap='wrap' justifyContent='center' marginTop='-60px'>

                                    <Bk  width='80px' height='80px' img='https://ybimage.atogether.com/ebayh5/img/wujilu.png'/>
                                    <Bk  height='auto' marginTop='15px' align='center' color='#555'>暂无卡券</Bk>
                              </Bk>
                        </Bk>
                        :
                        this.state.list.map((item,index)=>{
                              return (
                                    <Bk key={index} className='h_center' height='108px' marginTop='5px' marginBottom='5px' >
                                          <Bk className='v_center' width='94%' img={`${listItembgImg[item.card_type].img}`} borderRadius='8px'>
                                                <Bk height='80%'>
                                                      <Bk width='85.5%'>
                                                            <Bk className='hv_center' width='30%' color='white'>
                                                            {
                                                                  item.card_type == 'GIFT' ? 
                                                                  <span style={{fontSize:'2.4em'}}>{item.head}</span> :
                                                                  item.card_type == 'DISCOUNT' ? 
                                                                        <span><font style={{fontSize:'2.6em'}}>{item.head}</font><font style={{fontSize:'1.6em'}}>折</font></span> :
                                                                  item.card_type == 'CASH' ? 
                                                                        <span><font style={{fontSize:'1.6em'}}>¥</font><font style={{fontSize:'2.5em'}}>{item.head}</font></span> :
                                                                  item.card_type == 'GROUPON' ? 
                                                                        <span style={{fontSize:'2.4em'}}>{item.head}</span> :
                                                                  item.card_type == 'GENERAL_COUPON' ? 
                                                                        <span style={{fontSize:'2.5em'}}>{item.head}</span> : null
                                                            }
                                                            </Bk>
                                                            <Bk width='1px' img='https://ybimage.yishouyun.net/h5/img/fenge.png'/>
                                                             
                                                            <Bk className='hv_center' width='69%' color='white'>
                                                                  <div style={{width:'94%'}}>
                                                                        <div className='h_center' style={{width:'100%',fontSize:'1.4em',overflowX:'hidden'}}>{item.title}</div><br/>
                                                                        <div className='h_center' style={{fontSize:'1em',color:'rgba(255,255,255,0.7)'}}>{item.dateString}</div>
                                                                  </div>
                                                            </Bk>
                                                      </Bk>
                                                      <div className='hv_center' style={{width:'14.5%', height: '100%',color:`${listItembgImg[item.card_type].color}`}}
                                                            onClick = {()=>{
                                                                  this.addCardAction(item)
                                                            }}
                                                      >
                                                            <div>
                                                                  <div>立即</div>
                                                                  <div>领取</div>
                                                            </div>
                                                            
                                                      </div> 
                                                      {/* <Bk className='hv_center' width='14.5%' color={`${listItembgImg[item.card_type].color}`}
                                                            onClick={()=>{
                                                                  this.addCardAction(item)
                                                            }}>
                                                            <div>
                                                                  <div>立即</div>
                                                                  <div>领取</div>
                                                            </div>
                                                            
                                                      </Bk> */}
                                                </Bk>
                                          </Bk>
                         
                                    </Bk>
                              )
                        })
                  }
                  </Bk>
            )
      }
}