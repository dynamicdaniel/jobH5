import React from 'react'
import Bk from '../../../components/Bk/Bk'
import '../topbars.css'
import {Grid, Toast ,ListView, PullToRefresh} from 'antd-mobile'
import { getJsConfig, addCard, hideMenuItems } from '../../../actions/wx';
import { getBonusDetail , getCardExtStr ,getBonusShop} from '../../../actions/card';

export default class ScoreShop extends React.Component{
      constructor(props){
            super(props)
            const dataSource = new ListView.DataSource({
                  rowHasChanged : (row1, row2) => row1 !== row2,
              })
            this.state = {
                  list : [],
                  bonusDetail: {},
                  show : 'hidden',
                  dataSource,
            }
            this.cardId = props.info.cardId
            this.openId = props.info.openId
            this.shopId = props.info.shopId
            this.list = {totalNum:0,curNum:0,page:1,data:[]}
      }
      componentDidMount(){
            this.getScoreShopList()
      }
      getScoreShopList = () => {
            let params = {
                  page: this.list.page,
                  size: 10,
                  cardId: this.cardId,
                  status: 1,
            }
            console.log(params)
            getBonusShop(params).then(res => {
                  console.log('getBonusShop:',res)
                  this.list.data = [...this.list.data,...res]
                  this.setState({
                        //list : res,
                        bonusDetail : res,
                        show : 'visible',
                        dataSource: this.state.dataSource.cloneWithRows(this.list.data),
                  })
            }).catch(msg => {
                  console.log(msg)
            })
      }
      addCardAction = (item) => {
            
            let params = {
                shopId: this.shopId,
                paramsJson: JSON.stringify({ openid: this.openId, card_id: item.select_card_id })
            }
            console.log(params)
            getCardExtStr(params).then(res => {
                console.log(res)
                let lst = []
                lst.push({ cardId: item.select_card_id, cardExt: JSON.stringify(res) })
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
      onEndReached = () => {
            console.log('onEndReached')
            this.list.page ++
            this.getScoreShopList()
      }
      render(){
            return (
                  <Bk bgColor='#f1f1f1'>
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
                                          <Bk className='hv_center' width='50%' height='210px' bgColor='#f1f1f1' marginTop='5px'>
                                                <Bk width='92%' height='96%' borderRadius='7px' boxShadow='0px 2px 6px 0px #ccc' bgColor='white'>
                                                      <Bk className='hv_center' height='55%' borderRadius='7px'>
                                                            <Bk width='100px' height='100px' borderRadius='7px' img={`${item.mainPic}`}/>
                                                      </Bk>
                                                      <Bk className='hv_center' height='25%' >
                                                            <Bk width='84%' height='90%'>
                                                                  <Bk height='50%' fontSize='1.1em' align='left'>{item.goodsName}</Bk>
                                                                  <Bk height='50%' fontSize='1.35em' color='#ef7460' align='left'>{item.score}<span style={{fontSize:'0.7em',color:'#cccccc'}}>&#8194;积分</span></Bk>
                                                            </Bk>
                                                      </Bk>
                                                      <Bk className='h_end v_center' height='20%' borderRadius='7px' >
                                                            <Bk className='hv_center' width='50%' height='30px' marginRight='7px' bgColor='#ef7460' borderRadius='50px' color='white'
                                                            onClick={()=>{
                                                                  let params = { id: item.id }
                                                                  getBonusDetail(params).then(res => {
                                                                        let detailUrl = '/bonusdetail/' + item.id + '?card_id='+this.cardId + '&openid=' + this.openId
                                                                        window.location.assign(detailUrl)
                                                                  }).catch(msg => {
                                                                        console.log(msg)
                                                                  });
                                                            }}>立即兑换</Bk>
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