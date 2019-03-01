import React from 'react';
import ReactDOM from 'react-dom'
import {PullToRefresh,ListView,Tabs} from 'antd-mobile'
import { UserContext } from '../../../userContext';
import { getRecordList ,giveCardRecord,getTimeCardRecord } from '../../../actions/numcard';
import Bk from '../../../components/Bk/Bk'
import moment from 'moment'

const PAGE_ROW = 20
const addTimes = {
    '1':'购买增次',
    '4':'领取转赠',
    '5':'开卡增次',
    '6':'储值增次',
    '7':'分享增次'
}
export default class Payrecord extends React.Component {
  
    static defaultProps={
        tabStatus:false
    }
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state = {
            show:'hidden',
            bodyHeight:'auto',
            dataSource,
            tabIndex:0,
        };
     
        this.openid = props.location.state.openid
        this.token = props.location.state.token
        this.cardId = props.location.state.cardId
        this.timeCardId = props.location.state.timecardId
        this.list = [
            {totalNum:0,curNum:0,page:1,data:[]},
            {totalNum:0,curNum:0,page:1,data:[]},
            {totalNum:0,curNum:0,page:1,data:[]},
        ]
    }
    componentDidMount(){
       
        //console.log('payrecord:',this.props)
        let params = {
            timeCardId: this.timeCardId,
            token:this.token,
            type:2,
            page:1,
            size:PAGE_ROW,
        }
        getRecordList(params).then(res => {
           // console.log("消费", res);

            this.list[0].totalNum =res.count
            this.list[0].curNum = res.list.length
            let tmArr = []
            res.list.map((item)=>{
                tmArr = [...tmArr,{
                    title:'兑换'+item.title + item.times + item.unit,
                    time:moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                    times:'-' + item.times,
                }]
            })
            this.list[0].data = [...this.list[0].data,...tmArr]
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.list[0].data)
            })
                
        }).catch(msg => {
            console.log(msg)
        })
        let params1 = {
            timeCardId: this.timeCardId,
            token: this.token,
            page:1,
            size:PAGE_ROW,
        }
        getTimeCardRecord(params1).then(res => {
            console.log("充值", res)
            this.list[1].totalNum = res.count
            this.list[1].curNum = res.list.length
            let tmArr1 = []
            res.list.map((item)=>{
                tmArr1 = [...tmArr1,{
                    title:addTimes[item.type],
                    time:moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                    times:'+' + item.times
                }]
            })
            this.list[1].data = [...this.list[1].data,...tmArr1]
        }).catch(msg => {
            console.log(msg)
        })
        let params2 = {
            cardId:this.cardId,
            timeCardId:parseInt(this.timeCardId),
            transferUserId:this.token,
            page:1,
            size:PAGE_ROW
        }
        console.log(params2)

        giveCardRecord(params2).then(res=>{
            
            console.log('转赠记录',res)
            this.list[2].totalNum = res.count
            this.list[2].curNum = res.list.length
            let tmArr1 = []
            res.list.map((item)=>{
                tmArr1 = [...tmArr1,{
                    name: item.nickName,
                    title: item.title,
                    time:moment(item.receivedAt).format("YYYY-MM-DD HH:mm"),
                    times:item.num
                }]
            })
            this.list[2].data = [...this.list[2].data,...tmArr1]

        }).catch(res=>{
            console.log('转赠记录',res)
        })

        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.refs.body).getBoundingClientRect().top
        this.setState({
            bodyHeight:hei
        },()=>{
            this.setState({
                show:'visible',
            })
        })
        
    }
    onEndReached = () => {

        if(this.state.tabIndex <2){
            if(this.list[this.state.tabIndex].curNum < this.list[this.state.tabIndex].totalNum){

                let type = this.state.tabIndex==0?2:1
                let params = {
                    id: this.timeCardId,
                    token: this.token,
                    type: type,
                    page: this.list[this.state.tabIndex].page + 1,
                    size: 20,
                }
                getRecordList(params).then(res => {
                    console.log('res',res)
                    let tmArr2 = []
                    if(this.state.tabIndex == 0){
                        res.list.map((item)=>{
    
                            tmArr2 = [...tmArr2,{
                                    title:'兑换'+item.title + item.times + item.unit,
                                    time:moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                                    times:'-' + item.times,
                            }]
                        })
                    }
                    else if(this.state.tabIndex == 1){
                        res.list.map((item)=>{
    
                            tmArr2 = [...tmArr2,{
                                title:'充值次卡',
                                time:moment(item.createAt).format("YYYY-MM-DD HH:mm"),
                                times:'+' + item.times
                            }]
                        })
                    }
                    this.list[this.state.tabIndex].page += 1
                    this.list[this.state.tabIndex].curNum += PAGE_ROW
                    this.list[this.state.tabIndex].data = [...this.list[this.state.tabIndex].data,...tmArr2]
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(this.list[this.state.tabIndex].data)
                    })
    
                }).catch(msg => {
                    console.log(msg)
                })
            }
        }else{
            let params3= {
                cardId:this.cardId,
                timeCardId:parseInt(this.timeCardId),
                transferUserId:this.token,
                page:this.list[this.state.tabIndex].page + 1,
                size:PAGE_ROW
            }
            giveCardRecord(params3).then(res=>{
            
                console.log('转赠记录',res)
                this.list[2].totalNum = res.count
                this.list[2].curNum = res.list.length
                let tmArr2 = []
                res.list.map((item)=>{
                    tmArr2 = [...tmArr2,{
                        name: item.nickName,
                        title: item.title,
                        time:moment(item.receivedAt).format("YYYY-MM-DD HH:mm"),
                        times:item.num
                    }]
                })
                this.list[2].page += 1
                this.list[2].curNum += PAGE_ROW
                this.list[2].data = [...this.list[2].data,...tmArr2]
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.list[2].data)
                })
    
            }).catch(res=>{
                console.log('转赠记录',res)
            })
        }
        
    }
    render() {
        console.log('渲染')
        return (
            <Bk bgColor='white'>
                <Bk ref='body' 
                    height={`${this.state.bodyHeight}px`} 
                    visibility={this.state.show}>
                    <Tabs 
                        tabs={[
                            { title: '消费记录'},
                            { title: '充值记录'},
                            { title: '转赠记录'},
                          ]}
                        initialPage={0}
                        tabBarActiveTextColor='#000'
                        tabBarInactiveTextColor='#aaa'
                        tabBarTextStyle={{fontSize:'1.15em'}}
                        tabBarUnderlineStyle={{border:'2px solid #ef7460'}}
                        onChange={(tab, index) => {
                            this.setState({
                                tabIndex:index,
                                dataSource:this.state.dataSource.cloneWithRows(this.list[index].data)
                            })
                        }}
                        onTabClick={(tab, index) => {
                            this.setState({
                                tabIndex:index,
                                dataSource:this.state.dataSource.cloneWithRows(this.list[index].data)
                            }) 
                        }}
                        >
                        <Bk>
                        {
                            this.list[this.state.tabIndex].data.length > 0?
                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={(item)=>{
                                    return (
                                        <Bk height='54px' 
                                            display='flex' 
                                            justifyContent='center' 
                                            bgColor='white' 
                                            borderBottom='1px solid #f1f1f1'>
                                 
                                            {
                                                this.state.tabIndex < 2 ?
                                                <Bk width='92%'>
                                                    <Bk width='11%' display='flex' alignItems='center'>
                                                        <Bk width='36px' height='36px'  
                                                        img={this.state.tabIndex?'https://ybimage.atogether.com/ebayh5/img/chuzhi.png':"https://ybimage.atogether.com/ebayh5/img/cikaxiaofei.png"}/>
                                                    </Bk>
                                                    <Bk width='69%' display='flex'  alignItems='center'>
                                                        <Bk height='76%' display='flex' flexWrap='wrap' alignContent='space-around' marginLeft='12px' marginTop='4px'>
                                                            <Bk height='auto' fontSize='1.15em' color='#000'>{item.title}</Bk>
                                                            <Bk height='auto' fontSize='0.9em' color='#aaa'>{item.time}</Bk>
                                                        </Bk>
                                                    </Bk>
                                                    <Bk width='20%' display='flex'  justifyContent='flex-end' alignItems='center' fontSize='1.2em'
                                                    color={this.state.tabIndex?'#22ac38':'#3a9dfd'}>
                                                        {item.times}
                                                    </Bk>
                                                </Bk>:
                                                <Bk width='92%'>
                                                    <Bk width='11%' display='flex' alignItems='center'>
                                                        <Bk width='36px' height='36px'  
                                                        img={"https://ybimage.atogether.com/ebayh5/img/cikaxiaofei.png"}/>
                                                    </Bk>
                                                    <Bk width='39%' display='flex'  alignItems='center'>
                                                        <Bk height='76%' display='flex' flexWrap='wrap' alignContent='space-around' marginLeft='12px' marginTop='4px'>
                                                            <Bk height='auto' fontSize='1.15em' color='#000'>{item.title}</Bk>
                                                            <Bk height='auto' fontSize='0.9em' color='#aaa'>{item.time}</Bk>
                                                        </Bk>
                                                    </Bk>
                                                    <Bk width='50%' display='flex'  justifyContent='flex-end' alignItems='center'
                                                    color={this.state.tabIndex?'#22ac38':'#3a9dfd'}>
                                                        <Bk height='76%' display='flex' flexWrap='wrap' alignContent='space-around' marginLeft='12px' marginTop='4px'>
                                                            <Bk height='auto' fontSize='1.05em' color='#000'align='right'>赠送{item.name}</Bk>
                                                            <Bk height='auto' fontSize='1.1em' color='red' align='right'>{item.times} 次</Bk>
                                                        </Bk>
                                                        
                                                    </Bk>
                                                </Bk>
                                            }
                                                
                                       
                                            
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
                                    />} 
                            />
                            :
                            <Bk display='flex' flexWrap='wrap'   justifyContent='center' alignItems='center'>
                                <Bk width='auto' height='auto' marginTop='-100px' display='flex' flexWrap='wrap' justifyContent='center' >
                                    <img src='https://ybimage.atogether.com/ebayh5/img/wujilu.png' width='80px' height='80px' align="bottom"/>
                                    <Bk  height='auto' marginTop='15px' align='center' color='#555'>暂时没有找到相关数据</Bk>
                                </Bk>
                            </Bk>
                        }
                        
                        </Bk>

                    </Tabs>
                
                </Bk>
            </Bk>
        )
    }
}

// const PayRecordConsumer = ({ match }) => (
//     <UserContext.Consumer>
//         {user => {
//             return (
//                 <Payrecord
//                     id={match.params.id}
//                     userInfo={user.userInfo}
//                 />
//             )
//         }}
//     </UserContext.Consumer>
// )
// export default PayRecordConsumer
