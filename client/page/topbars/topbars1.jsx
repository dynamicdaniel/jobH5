import React from 'react';
import { Tabs ,Badge ,ListView,PullToRefresh} from 'antd-mobile'
import './topbars.css';
import Bk from '../../components/Bk/Bk'
import {getJsConfig, hideMenuItems} from '../../actions/wx';
import FreeKa  from './component/freeka'
import KaShop from './component/kashop'
import NoReceive from './component/noreceive'
import ScoreShop from './component/scoreshop'
import UseKa from './component/useka'

const card_type = {
      'GROUPON' : '团购券',
      'CASH' : '代金券',
      'DISCOUNT' : '折扣券',
      'GIFT' : '兑换券',
      'GENERAL_COUPON' : '优惠券'
}

class Topbars extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state = {
            bodyHeight : 'auto',
            show : 'hidden',
            tabIndex : 0,
            switch_show : 'hidden',
            dataSource,
            useNum : 0,
            noReceiveNum : 0,
            freeKa : 0
        }
      this.openId = props.info.openId
      this.token = props.info.token;
      this.shopId = props.info.shopId;
      this.cardId = props.info.cardId;
      this.tabIndex =  props.info.tabIndex || 0
        
      this.info = {
            openId : this.openId,
            token : this.token,
            shopId : this.shopId,
            cardId : this.cardId,
            // memberInfo : this.memberInfo
      }
      this.cardList = [];
      this.wxCardList = [];
        
      this.list = [
            {totalNum:0,curNum:0,page:1,data:[]},
            {totalNum:0,curNum:0,page:1,data:[]},
            {totalNum:0,curNum:0,page:1,data:[]},
            {totalNum:0,curNum:0,page:1,data:[]},
            {totalNum:0,curNum:0,page:1,data:[]},
      ]
   
      getJsConfig(this.shopId).then(data => {
            hideMenuItems();
      });
    }
      componentDidMount(){
            
            const height = document.documentElement.clientHeight
            this.setState({
                  bodyHeight : height,
                  show : 'visible'
            },()=>{
                  this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.list[this.state.tabIndex].data),
                  })   
            })
      }
     
    render = () => {
        return (
            <Bk height={`${this.state.bodyHeight}px`} visibility={this.state.show} bgColor='#eeeeee'>
                  <Tabs 
                        tabs={[
                              { title: <Badge text={this.state.useNum}>可使用</Badge> },
                              { title: <Badge text={this.state.noReceiveNum}>未领取</Badge> },
                              { title: <Badge text={this.state.freeKa}>免费券</Badge>},
                              { title: '卡券商城'},
                              { title: '积分商城'}
                          ]}
                        swipeable={false}
                        initialPage={this.tabIndex}
                        tabBarActiveTextColor='#ef7460'
                        tabBarInactiveTextColor='#999'
                        tabBarTextStyle={{fontSize:'1.15em'}}
                        tabBarUnderlineStyle={{border:'2px solid #ef7460'}}
                        onChange={(tab, index) => {
                              console.log(index)
                              this.setState({tabIndex : index}) 
                        }}
                        onTabClick={(tab, index) => {
                              console.log(index)
                              this.setState({tabIndex : index})
                        }}>
                        <Bk height='100%'>
                        {
                                this.state.tabIndex == 0 ? <UseKa getNum = {(num)=>{
                                      this.setState({useNum : num})
                                    }} info = {this.info}/> :
                                this.state.tabIndex == 1 ? <NoReceive getNum = {(num)=>{
                                    this.setState({noReceiveNum : num})
                                  }} info = {this.info}/> :

                                this.state.tabIndex == 2 ? <FreeKa getNum = {(num)=>{
                                    this.setState({freeKa : num})
                                  }} info = {this.info}/> :

                                this.state.tabIndex == 3 ? <KaShop  info = {this.info}/> :
                                this.state.tabIndex == 4 ? <ScoreShop info = {this.info} /> : null
                        }
                        </Bk>
                  </Tabs>
            </Bk>
            
        );
    }
}


export default Topbars