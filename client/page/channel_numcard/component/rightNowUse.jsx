import React from 'react';
import ReactDOM from 'react-dom'
import Bk from '../../../components/Bk/Bk'
import { getStores } from '../../../actions/home';
import { useNumCard , useSaoma ,getScanUseNumCardStatus, getBundingdevice} from '../../../actions/numcard';
import Qrcode from 'qrcode.react'
import {Toast} from 'antd-mobile'
import {getJsConfig,hideMenuItems} from '../../../actions/wx';

let interval = null
class RightnowUse extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            paytype:false,
            useTimes:0,
            storeList:[],
            storeIndex:0,
            payKey:'',
        };
        this.shopId = props.userInfo.shopId
        this.cardId = props.userInfo.cardId
        this.timecardId = props.userInfo.timecardId
        this.title = props.userInfo.title
        this.token = props.userInfo.token
        this.logo =  props.userInfo.logo
        this.redisKey = null
        
    }
    componentDidMount(){
       
        console.log(this.props)
        getBundingdevice({ card_id: this.cardId , type: "wx"}).then(data => {
            console.log('门店设备：', data)
            if (data.length > 0) {
                let tmArr = []
                data.map((item, index) => {

                    tmArr.push({
                        label: (
                            <Bk key={index} height='80%' display='flex' flexWrap='wrap' padding='0px'>

                                <Bk height='auto' fontSize='1.1em'>{item.deviceName}</Bk>
                                <Bk height='auto' fontSize='0.9em' color='#555'>{item.storeName}</Bk>
                            </Bk>
                        ),
                        storeId: item.storeId,
                        deviceNo: item.deviceNo,
                        shopName: item.storeName + ' - ' + item.deviceName,
                        value: index
                    })
                })
                this.setState({
                    storeList: tmArr,
                }, () => {
                    //  console.log(this.state.pickerData)
                });
            }
        }).catch(msg => {

        })
        // getStores(this.shopId).then(data => {
        //     console.log('门店设备：',data)
        //     if (data.length > 0) {
        //         let tmArr = []
        //         data.map((item,index)=>{
                    
        //             tmArr.push({
        //                 label:(
        //                 <Bk height='80%' display='flex' flexWrap='wrap' padding='0px'>
        //                     <Bk height='auto' fontSize='1.1em'>{item.deviceName}</Bk>
        //                     <Bk height='auto' fontSize='0.9em' color='#555'>{item.storeName}</Bk>
        //                 </Bk>
        //                 ),
        //                 storeId:item.storeId,
        //                 deviceNo:item.deviceNo,
        //                 shopName:item.storeName+'-'+item.deviceName,
        //             })
        //         })
        //         this.setState({
        //             storeList: tmArr,
        //         },()=>{
        //             console.log(this.state.storeList)
        //         });
        //     }
        // }).catch(msg => {

        // })

        let params = {
            cardId:this.cardId,
            timeCardId:this.timecardId,
            token:this.token
        }
        useSaoma(params).then(res=>{
            console.log(res)
            this.redisKey = res
        })

    }
    useCard = () => {

        let params = {
            timeCardId: this.timecardId,
            num: parseInt(this.state.useTimes),
            payKey: parseInt(this.state.payKey),
            storeId: this.state.storeList[this.state.storeIndex].storeId,
            token: this.token,
            deviceNo: this.state.storeList[this.state.storeIndex].deviceNo,
        }
        console.log(params)
        useNumCard(params).then(res => {
            Toast.info('支付成功',2.5,()=>{
                this.props.close();
            })
            
        }).catch(msg => {
            console.log(msg)
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
                <Bk position='absolute'
                    display="flex" 
                    justifyContent="center" 
                    alignItems='center' 
                    zIndex='1'
                >
                    <Bk width='92%' height="360px">
                        <Bk width='17%'>
                            <Bk height="25%" 
                                display="flex" 
                                flexWrap='wrap' 
                                justifyContent='center' 
                                alignContent='center' 
                                bgColor={!this.state.paytype?'white':'#ef7460'}
                                onClick={()=>{
                                    clearInterval(interval)
                                    this.setState({paytype:false})
                                }}
                                >
                                <Bk width="16px" height='19px' 
                                    img={`https://ybimage.atogether.com/${!this.state.paytype?"mima.png":"mimadianji.png"}`}
                                />
                                <Bk height='auto' marginTop="8px" align='center' fontSize='0.92em' 
                                    color={!this.state.paytype?'#ef7460':'white'}>
                                    密码付
                                </Bk>
                            </Bk>
                            <Bk height="25%" 
                                display="flex" 
                                flexWrap='wrap' 
                                justifyContent='center' 
                                alignContent='center' 
                                marginTop="7px" 
                                bgColor={this.state.paytype?'white':'#ef7460'}
                                onClick={()=>{
                                    this.setState({paytype:true},()=>{
                                        interval = setInterval(()=>{
                                            getScanUseNumCardStatus({redisKey:this.redisKey}).then(res=>{
                                                console.log(res)
                                                if(res.status == 'fail'){
                                                    clearInterval(interval)
                                                    Toast.info(res.message,2)
                                                }else if(res.status == 'success'){
                                                    clearInterval(interval)
                                                    Toast.info('核销成功',2)
                                                }
                                            })
                                        },2000)
                                    })
                                }}
                                >
                                <Bk width="16px" height='16px' 
                                    img={`https://ybimage.atogether.com/${this.state.paytype?"saomadianji.png":"saoma.png"}`}
                                />
                                <Bk height='auto' marginTop="8px" align='center' fontSize='0.92em' 
                                    color={this.state.paytype?'#ef7460':'white'}>
                                    扫码付
                                </Bk>
                            </Bk>
                        </Bk>
                        <Bk width='83%' bgColor="white">
                            <Bk height="10%" display='flex' justifyContent='flex-end' alignItems='center'>
                                <Bk width="20px" height="20px" marginRight="8px"  color='blue' img="https://ybimage.atogether.com/ebayh5/img/redclose.png"
                                    onClick={()=>{
                                        clearInterval(interval)
                                        this.props.close()
                                    }}
                                />
                            </Bk>
                            <Bk height="90%">
                            {
                                this.state.paytype==true?
                                <Bk>
                                    <Bk height="50%">
                                        <Bk height='70%' display='flex' justifyContent='center' alignItems='flex-start'>
                                            <Bk width="90px" height="90px" img={this.logo} />
                                            
                                        </Bk>
                                        <Bk height='30%' align='center' color='#ef7460' fontSize='1.2em'>兑换{this.title}</Bk>
                                        {/* <Bk width='50%' display='flex' alignItems='flex-start'>
                                            <Bk height='70%' display='flex' flexWrap='wrap' alignItems='flex-start'>
                                                <Bk height='auto' marginTop='20px' fontSize='1.1em' color='#555'>消费次数：&#8194;</Bk>
                                                <div style={{width:"100px", height:"30px", border:'1px solid #dddddd', borderRadius:'6px', color:"#aaa"}}>
                                                    
                                                    <Bk width='25%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='2.3em' borderRight='1px solid #dddddd'
                                                        onClick={()=>{
                                                            if(this.state.useTimes > 0)
                                                            this.setState(prev=>({useTimes:--prev.useTimes}))
                                                        }}>-</Bk>
                                                    <Bk ref='useTimes' width='50%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='1.5em'>
                                                    {this.state.useTimes}
                                                    </Bk>
                                                    <Bk width='25%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='1.5em' borderLeft='1px solid #dddddd'
                                                        onClick={()=>{this.setState(prev=>({useTimes:++prev.useTimes}))}}
                                                    >+</Bk>
                                                </div>
                                            </Bk>
                                        </Bk> */}
                                    </Bk>
                                    <Bk height="40%" display='flex' justifyContent='center' alignItems='flex-start'>
                                        <Qrcode size={120} value={this.redisKey}/>
                                    </Bk>
                                </Bk>
                                :
                                <Bk>
                                    <Bk height="22%" display='flex' alignItems='center' >
                                        <Bk height="80%" display='flex' justifyContent='center' alignItems='center'>
                                            <span>消费次数：&#8194;</span>
                                            <div style={{width:"130px", height:"72%", border:'1px solid #dddddd', borderRadius:'6px', color:"#aaa"}}>
                                                <Bk width='25%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='2.3em' borderRight='1px solid #dddddd'
                                                    onClick={()=>{
                                                        if(this.state.useTimes > 0)
                                                        this.setState(prev=>({useTimes:--prev.useTimes}))
                                                    }}>-</Bk>
                                                <Bk ref='useTimes' width='50%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='1.5em'>
                                                {this.state.useTimes}
                                                </Bk>
                                                <Bk width='25%' boxSizing='border-box' display='flex' justifyContent='center' alignItems='center' fontSize='1.5em' borderLeft='1px solid #dddddd'
                                                    onClick={()=>{this.setState(prev=>({useTimes:++prev.useTimes}))}}
                                                >+</Bk>
                                            </div>
                                        </Bk>
                                        
                                    </Bk>
                                    <Bk height="22%" display='flex' alignItems='center'>
                                        <Bk height="80%" display='flex' justifyContent='center' alignItems='center'>
                                            <span>所在门店：&#8194;</span>
                                            <div style={{width:"130px", height:"72%", border:'1px solid #dddddd', borderRadius:'6px',color:"#aaa"}}>
                                               <select ref='select' style={{
                                                        width:'100%',
                                                        height:'100%',
                                                        border:0,
                                                        margin:0,
                                                        padding:0,
                                                        borderRadius:5,
                                                        color:"#aaa",
                                                        fontSize:'1.1em'
                                                        }}>
                                                        {
                                                            this.state.storeList.map((item,index)=>{
                                                                console.log(item)
                                                                return(
                                                                    <option key={index} value={index}>
                                                                        {item.shopName}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                               </select>
                                            </div>
                                        </Bk>
                                    </Bk>
                                    <Bk height="22%" display='flex' alignItems='center'>
                                        <Bk height="80%" display='flex' justifyContent='center' alignItems='center'>
                                            <span>门店密码：&#8194;</span>
                                            <div style={{width:"130px", height:"72%", border:'1px solid #dddddd', borderRadius:'6px', color:"#aaa"}}>
                                                <input
                                                    ref='password'
                                                    type="password"
                                                    style={{
                                                        width:'100%',
                                                        height:'100%',
                                                        border:0,
                                                        margin:0,
                                                        padding:0,
                                                        borderRadius:5,
                                                        fontSize:'1.5em'
                                                    }}/>
                                            </div>
                                        </Bk>
                                    </Bk>
                                    <Bk height="34%" display='flex' justifyContent='center' alignItems='center'>
                                        <Bk width="66%" 
                                            height="40px" 
                                            img="https://ybimage.atogether.com/ebayh5/img/lijishiyong.png"
                                            display='flex'
                                            justifyContent='center'
                                            alignItems='center'
                                            color='white'
                                            fontSize='1em'
                                            onClick={()=>{
                                               const useTimes = ReactDOM.findDOMNode(this.refs.useTimes).textContent
                                               const storeIndex = ReactDOM.findDOMNode(this.refs.select).value
                                               const password = ReactDOM.findDOMNode(this.refs.password).value
                                               if(password != ''){
                                                    this.setState({
                                                        useTimes : useTimes,
                                                        storeIndex : storeIndex,
                                                        payKey : password
                                                    },()=>{
                                                        if(this.state.useTimes > 0)
                                                            this.useCard()
                                                        else Toast.info('请选择数量',2)
                                                    })
                                               }else Toast.info('请输入密码',2)
                                            }}
                                            >
                                            立 即 使 用
                                        </Bk>
                                    </Bk>
                                </Bk>
                            }
                            </Bk>
                        </Bk>
                    </Bk>
                </Bk>
                
            </Bk>
            
        )
    }
}
// const RightnowUseConsumer = ({ match }) => {
//     return <UserContext.Consumer>
//         {user => {
//             return (
//                 <RightnowUse
//                     id={match.params.id}
//                     userInfo={user.userInfo}
//                 />
//             )
//         }}
//     </UserContext.Consumer>
// }

//export default RightnowUseConsumer
export default RightnowUse
