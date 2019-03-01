import React from 'react'
import './scoreshop.css'
import { ListView, PullToRefresh,Toast } from 'antd-mobile';
// import {getJsConfig, hideMenuItems} from '../../actions/wx';
import { getBonusShop,getBonusDetail,getSoreList} from '../../actions/card'
import Bk from '../../components/Bk/Bk'
import moment from 'moment'
const pageSize = 6;
const NoCard = () => 
    <Bk display='flex' flexWrap='wrap'   justifyContent='center' alignItems='center'>
        <Bk width='auto' height='120px'  display='flex' flexWrap='wrap' justifyContent='center' marginTop='-60px'>

            <Bk  width='80px' height='80px' img='https://ybimage.atogether.com/ebayh5/img/wujilu.png'/>
            <Bk  height='auto' marginTop='15px' align='center' color='#555'>暂无卡券</Bk>
        </Bk>
    </Bk>
const NoData = () => 
    <Bk display='flex' flexWrap='wrap'   justifyContent='center' alignItems='center'>
        <Bk width='auto' height='120px'  display='flex' flexWrap='wrap' justifyContent='center' marginTop='-60px'>
            <Bk  height='auto' marginTop='15px' align='center' color='#555'>暂无数据</Bk>
        </Bk>
    </Bk>

const type = {
    'charge' : '充值',
    'reward_levelup' : '升级奖励',
    'reward_share' : '推荐开卡奖励',
    'pay' : '消费',
    'exchange' : '积分商品兑换',
    'man_operate' : '手动操作',
    'charge_refd' : '手动储值退款',
    'numCard' : '购买计次卡',
    'init' : '初始积分',
    'refd' : '退款',
    'SystemSend' : '赠送'
}
export default class ScoreShop extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged : (row1, row2) => row1 !== row2,
        })
        // const dataSource2 = new ListView.DataSource({
        //     rowHasChanged : (row1, row2) => row1 !== row2,
        // })
        this.state = {
            show : 'hidden',
            bodyHeight : 'auto',
            switch_itemName : '兑换商城',
            tabName : '积分明细',
            dataSource
        };
        this.switch_status = 0
        this.list = [
            {page : 1,data : [], curCount : 0,totalCount : 0},
            {page : 1,data : [], curCount : 0,totalCount : 0},
        ]
        this.openId = props.info.openid
        this.cardId = props.info.cardId
        this.userId = props.info.userId
    }
    componentDidMount(){

        console.log('this.props:',this.props)
        this.getScoreListDetail()
        this.getCardShop()

        const height = document.documentElement.clientHeight+'px'
        this.setState({
            bodyHeight : height,
            show : 'visible',
            refreshing  :  false,   
            isLoading  :  false,
            
        })
    }
    getScoreListDetail = () => {
        //console.log('props:',this.props)
        let params = {
            userId : this.userId,
            card_id : this.cardId,
            page : this.list[0].page,
            size : 10
        }
        getSoreList(params).then(res=>{
            if(res.length > 0){
                res.map(item=>{
                    this.list[0].data = [...this.list[0].data,{
                        type : type[item.type],
                        createAt : moment(item.createAt).format('YYYY-MM-DD HH:MM'),
                        score : item.score,
                        curScore : item.curScore
                    }]
                })
                if(this.switch_status == 0){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.list[0].data)
                    }) 
                }
            }   
        })
        
    }
    getCardShop = () => {
        let params = {
                  page: this.list[1].page,
                  size: 10,
                  cardId: this.cardId,
                  status: 1,
            }
        console.log(params)
        getBonusShop(params).then(res => {
            if(res.length > 0){
                this.list[1].data = [...this.list[1].data,...res]
                if(this.switch_status == 1){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.list[1].data)
                    }) 
                }
            }
        }).catch(msg => {
            console.log(msg)
        })
    }
    onEndReached = () => {
        this.list[this.switch_status].page ++ 
        if(this.switch_status == 0)
            this.getScoreListDetail()
        else if(this.switch_status == 1)
            this.getCardShop()
    }
    render() {
        return (
            <Bk height={this.state.bodyHeight} visibility={this.state.show} bgColor='#f1f1f1' overflowY='hidden'>
                <Bk height='25%' img='https://ybimage.yishouyun.net/h5/image/kamian.png' color='white'>
                    <Bk height='18%'/>
                    <Bk className='hv_center' height='50%'>
                            <Bk className='hv_center' width='74%' height='auto' flexWrap='wrap'>
                                <Bk align='center' fontSize='1.2em'>我的积分</Bk>
                                <Bk align='center' fontSize='1.5em' marginTop='10px'>{(this.list[0].data[0] || {}).curScore || 0}</Bk>
                            </Bk>
                    </Bk>
                    <Bk className='h_center' height='20%'>
                            <Bk className='h_end v_center' width='74%' fontSize='1.1em'
                            onClick={()=>{
                                
                                if(this.switch_status == 0)
                                    this.switch_status = 1
                                else if(this.switch_status == 1)
                                    this.switch_status = 0

                                this.setState({
                                    dataSource: this.state.dataSource.cloneWithRows(this.list[this.switch_status].data),
                                })
                       
                                console.log('this.switch_status:',this.switch_status)
                                const switch_itemName = this.switch_status? '积分明细' : '兑换商城'
                                const tabName = this.switch_status? '兑换商城' : '积分明细'
                                this.setState({
                                    switch_itemName : switch_itemName,
                                    tabName : tabName
                                })
                            }}>
                                <span>{this.state.switch_itemName}&#8194;</span>
                                <Bk  width='12px' height='12px' img='https://ybimage.atogether.com/ebayh5/img/you.png'/>&#8195;
                            </Bk>
                    </Bk>
                </Bk>
                <Bk height='75%'>
                    <Bk className='hv_center' height='10%' marginTop='3%'>
                        <Bk className='v_center' width='90%' height='100%'>
                            <Bk width='4px' height='20px' bgColor='#ef7460'/>
                            <Bk className='v_center'>&#8194;{this.state.tabName}</Bk>
                        </Bk>
                    </Bk>
                    <Bk height='90%'>
                    {
                           this.switch_status == 0?
                            <Bk>
                            {
                                this.list[0].data.length == 0?<NoData/> :
                                <ListView
                                    dataSource={this.state.dataSource}
                                    renderRow={(item)=>{
                                        console.log('明细：',item)
                                        return(
                                            <Bk className='h_center v_center' height='60px' bgColor='white' borderBottom='1px solid #f1f1f1'>
                                                <Bk className='h_center' width='94%' height='100%'>
                                                        <Bk className='h_start v_center' width='12%'>
                                                            <Bk className='divImg' width='34px' height='34px' img='https://ybimage.yishouyun.net/h5/img/score.png'/>
                                                        </Bk>
                                                        <Bk width='60%'>
                                                            <Bk className='v_end' height='50%' fontSize='1.2em'>
                                                                    {item.type}
                                                            </Bk>
                                                            <Bk className='v_center' height='50%' color='#999' fontSize='0.9em'>
                                                                    {item.createAt}
                                                            </Bk>
                                                        </Bk>
                                                        <Bk className='v_center h_end' width='28%' color='#18bbff' fontSize='1.2em'>
                                                            {item.score >= 0 ? '+' : null}{item.score}
                                                        </Bk>
                                                </Bk>
                                            </Bk>
                                        )
                                    }}
                                    style={{
                                        width : "100%",
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
                                    />} 
                                />
                            }
                            </Bk>
                            :
                            <Bk>
                            {
                                this.list[1].data.length == 0?<NoCard/> :
                                <ListView
                                    dataSource={this.state.dataSource}
                                    renderRow={(item)=>{
                                        console.log('积分：',item)
                                        return(
                                            <Bk className='v_center' height='90px' bgColor='white' borderBottom='1px solid #f1f1f1'>
                                                <div className='hv_center' style={{width:'28%'}}>
                                                    <Bk width='65px' height='65px' borderRadius='50%' img={item.mainPic}/> 
                                                </div>
                                                <Bk width='47%' height='100%'>
                                                    <div className='v_center' style={{height:'100%'}}>
                                                            <div>
                                                                <div className='v_center' style={{height:'50%',fontSize:'1.1em',marginTop:'5px'}}>
                                                                        {item.goodsName}
                                                                </div>
                                                                <div className='v_center' style={{height:'50%', color:'#ef7460', fontSize:'1.1em',marginTop:'8px'}}>
                                                                        {item.score}积分
                                                                </div>
                                                            </div>
                                                    </div>
                                                    {/*<div class='v_start' style={{height:'36%'}}>
                                                        <div class='v_center'
                                                        style={{
                                                            width:'auto' ,
                                                            color:'#aaa' ,
                                                            paddingLeft:'6px' ,
                                                            paddingTop:'2px' ,
                                                            paddingBottom:'2px' ,
                                                            paddingRight:'6px',
                                                            fontSize:'0.75em' ,
                                                            borderRadius:'50px',
                                                            border:'1px solid #f1f1f1'
                                                        }}
                                                            >
                                                                详情说明
                                                            </div>
                                                    </div>*/}
                                                </Bk>
                                                <div className='hv_center' style={{width:'25%',color:'#18bbff'}}>
                                                    <div    className='hv_center' 
                                                            style={{
                                                                    width:'auto',
                                                                    paddingLeft:'20px',
                                                                    paddingRight:'20px',
                                                                    paddingTop:'5px',
                                                                    paddingBottom:'5px',
                                                                    borderRadius:'50px',
                                                                    background:'#ef7460',
                                                                    color:'white'
                                                                }}
                                                                onClick = {()=>{
                                                                    console.log('兑换')
                                                                    let params = { id: item.id }
                                                                    getBonusDetail(params).then(res => {
                                                                        let detailUrl = '/bonusdetail/' + item.id + '?card_id='+this.cardId + '&openid=' + this.openId
                                                                        window.location.assign(detailUrl)
                                                                    }).catch(msg => {
                                                                        console.log(msg)
                                                                    });
                                                                }}
                                                            >
                                                            兑换
                                                    </div>
                                                </div>
                                            </Bk>
                                        )
                                    }}
                                    style={{
                                        width : "100%",
                                        height : '100%'
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
                                                refreshing : false,
                                                isLoading : false
                                            })
                                        }}
                                        direction={'up'} 
                                    />} 
                                />
                            }
                            </Bk>
                            
                    }
                        
                    </Bk>
                </Bk>
            </Bk>
        )
    }
}