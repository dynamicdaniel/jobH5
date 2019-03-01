import React from 'react';
import Bk from '../../../components/Bk/Bk'
import moment from 'moment'
import {chongzhiEntityCard} from '../../../actions/numcard'
import { Toast } from 'antd-mobile';

class EntityCard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {};
    }

    componentDidMount() {}
    render() {

        return (
            <Bk>
                <Bk 
                    bgColor="#333" 
                    opacity="0.8" 
                    position='absolute'
                /> 
                <Bk position='absolute'
                    display="flex"
                    justifyContent="center" 
                    alignItems='center' 
                    zIndex='2'
                >
                  <Bk width='90%' height='38%'>
                        <Bk height="85%" img={this.props.entityCardDetail.background} marginTop={-45}  borderRadius="6px" color='white'>
                              <Bk height='20%' fontSize='1.3em' display='flex' alignItems='center' justifyContent='center'>充值卡</Bk>
                              <Bk height='20%' fontSize='1.3em' display='flex' alignItems='center'>
                                    &#8195;&#8194;<span>卡名：{this.props.entityCardDetail.name}</span>
                              </Bk>
                              <Bk height='20%' fontSize='1.3em' display='flex' alignItems='center'>
                                    &#8195;&#8194;<span>卡号：{this.props.entityCardDetail.cardCode}</span>
                              </Bk>
                              <Bk height='20%' fontSize='1.3em' display='flex' alignItems='center'>
                                    &#8195;&#8194;
                                    <span>余额：{parseFloat(this.props.entityCardDetail.leftAmount/100)}元</span>
                              </Bk>
                              <Bk height='20%' fontSize='1em' display='flex' alignItems='center' justifyContent='flex-end'>
                              
                                    <span>{moment(this.props.entityCardDetail.createAt).format("YYYY-MM-DD")}</span>
                                    &#8195;&#8194;
                              </Bk>
                        </Bk>
                        <Bk height='15%' display='flex' justifyContent='center' marginTop='5px'>
                              <Bk onClick={()=>{this.props.close()}}
                                  width='30%' marginRight='20px' display='flex' justifyContent='center' alignItems='center' bgColor='#f1f1f1' color='#aaa' fontSize='1.2em'>取消</Bk>
                              <Bk onClick={(e)=>{
                        
                                    e.target.style.pointerEvents = 'none';
                                    if(this.props.entityCardDetail.leftAmount > 0){
                                          let params = {
                                                consumeCode : this.props.entityCardDetail.consumeCode,
                                                openId : this.props.openId
                                          };
                                          const that = this;
                                          console.log('充值卡充值参数:', params);
                                          chongzhiEntityCard(params).then(res=>{
                                                console.log('充值结果:', res);
                                                Toast.info('充值成功', 2, () => {
                           
                                                      that.props.callback();
                                                });
                                          }).catch(e => {
                                                console.log(e);
                                          });
                                    }else{
                                          Toast.info('余额不足',2)
                                    }
                                    
                              }}
                              width='30%' display='flex' justifyContent='center' alignItems='center' bgColor='#02b8ff' color='white' fontSize='1.2em'>充值</Bk>
                        </Bk>
                  </Bk>
                    
                </Bk>
                
            </Bk>
            
        )
    }
}
// const disableEvent = {
//       pointerEvents : 'none'
// }
// const enableEvent = {
//       pointerEvents : 'auto'
// }
export default EntityCard
