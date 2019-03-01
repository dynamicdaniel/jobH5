/**
 *  记次卡
 *  列表
 */

import React from 'react'
import { UserContext } from '../../userContext';
import './numberCard.css';
import { ListView, PullToRefresh } from 'antd-mobile';
import { getNumCardList } from '../../actions/numcard';
import { getNumCardWithUser } from '../../actions/numcard';
import { Link } from 'react-router-dom'
import {getJsConfig, hideMenuItems} from '../../actions/wx';
import Bk from '../../components/Bk/Bk'
import Flex from '../../components/flex/flex'


const pageSize = 6;
class NumberCard1 extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.openid = props.userInfo.openid
        this.cardId = props.userInfo.cardId
        this.token = props.userInfo.token
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state = {
            show:'hidden',
            bodyHeight:'auto',
            isLoading: true,
            dataSource,
            refreshing: false
        };

        this.list = {
            totalNum:0,
            curNum:0,
            page:1,
            data:[]
        }  
    }
    componentDidMount(){
        const height = document.documentElement.clientHeight+'px'
        this.setState({
            bodyHeight:height,
            show:'visible'
        },()=>{

            let params = {
                token: this.token,
                cardId: this.cardId,
                page: this.list.page,
                size:pageSize,
            }
            console.log('次卡参数：',params)
            getNumCardWithUser(params).then(res => {
                console.log('结果')
                console.log('getNumCardWithUser:',res)
                this.list.totalNum = res.count
                this.list.data = [...this.list.data,...res.list]
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.list.data),
                })
            }).catch(msg => {
                console.log(msg)
            });
            
        })
    }
    onEndReached = () => {

        if(this.list.curNum < this.list.totalNum){
            let params = {
                token: this.token,
                cardId: this.cardId,
                page: this.list.page + 1,
                size:pageSize,
            }
            getNumCardWithUser(params).then(res => {
                this.list.page += 1
                this.list.curNum += pageSize
                this.list.data = [...this.list.data,...res.list]
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.list.data),
                })
            }).catch(msg => {
                console.log(msg)
            })
        }  
    }
    render() {
        return (
            <Bk height={this.state.bodyHeight} visibility={this.state.show} bgColor='#f1f1f1'>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(item)=>{
                        return (
                            <Bk height='130px' 
                                display='flex' 
                                justifyContent='center'
                                alignItems='center'
                                >
                                <div style={{width:'92%', height:'92%'}} 
                                    onClick={()=>{
                                    window.location.assign('/numCardDetail/' + item.id + '?openid=' + this.openid + '&card_id=' + this.cardId)}}
                                >
                                      <div style={{height:'70%',background:'#ef7460', backgroundImage:`url(${item.backgroundPicUrl})`,backgroundSize:'100% 100%',backgroundPosition:'center center',borderTopLeftRadius:'8px',borderTopRightRadius:'8px'}}>
                                        <Flex height='68%' borderTopLeftRadius='8px' borderTopRightRadius='8px' color='white'>
                                            <Flex width='50%' borderTopLeftRadius='8px'>
                                                <Flex width='40%' display='flex' justifyContent='center' alignItems='center' borderTopLeftRadius='8px'  >
                                                    <Flex width='45px' height='45px' borderRadius='50%' background='white' >
                                                        <img src={item.logo} width='100%' height='100%' style={{borderRadius:'50%'}}/>
                                                    </Flex>
                                                </Flex>
                                                <Flex width='60%' display='flex' justifyContent='flex-start' alignItems='center' fontSize='1.2em' >
                                                <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.title}</span>
                                                </Flex>
                                            </Flex>
                                            <Flex width='50%' borderTopRightRadius='8px'>
                                                <Flex width='92%' height='60%' display='flex' justifyContent='flex-end' alignItems='flex-end' marginBottom='4px' fontSize='1.2em'>
                                                    <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.subTitle}</span>
                                                </Flex>
                                                <Flex width='92%' height='40%' display='flex' justifyContent='flex-end' alignItems='center' fontSize='1.3em'>
                                                    {item.leftTimes}
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                        <Flex height="32%" display='flex' alignItems='center' color='white'>
                                            {
                                                item.dateType=='range'?
                                                    <span>&#8195;有效期: {item.dateBegin} 至 {item.dateEnd}</span>
                                                :<span>&#8195;自购买: {item.duration}天内有效</span>
                                            }
                                        </Flex>
                                    </div>
                                    <div style={{height:'30%', display:'flex', justifyContent:'center',alignItems:'center',background:'white',color:'#555',fontSize:'1.1em',
                                        borderBottomLeftRadius:'8px' , borderBottomRightRadius:'8px'
                                    }}>
                                    详情查看
                                    </div>
                                
                     
                                </div>
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
            </Bk>
        )
    }
}

const NumberCardConsumer = ({ match }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <NumberCard1
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default NumberCardConsumer