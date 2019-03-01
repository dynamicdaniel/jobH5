/**
 * 卡券商城
 */

import React from 'react';
import { getCardShop } from '../../actions/card'
import { ListView, PullToRefresh } from 'antd-mobile';
import '../bonus/bonusShop.css'
import imgUtil from '../../utils/imgUtil'
const NUM_ROWS = 10;
let pageIndex = 1;
let hasMore = false;
export default class CardShopList extends React.Component{

    constructor(props) {
        super(props);
        this.openId = props.userInfo.openId
        this.cardId = props.userInfo.cardId;
        this.shopId = props.userInfo.shopId
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            isLoading: true,
            dataSource,
            refreshing: false
        };
        this._data = [];
    }

    getData = () => {
        let params = {
            page: pageIndex,
            size: NUM_ROWS,
            shopId: this.shopId,
            status: 1
        }
        getCardShop(params).then(res => {
            console.log('积分商城：',res)
            if (res.length < NUM_ROWS) {
                hasMore = false
            } else {
                hasMore = true
            }

            if (pageIndex == 1) {
                this._data = res
            } else {
                this._data = this._data.concat(res);
            }

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this._data),
                isLoading: false,
                refreshing: false
            })
        }).catch(msg => {
            console.log(msg)
        })
    }

    componentDidMount() {
        pageIndex = 1;
        this.getData()
    }

    onRefresh = () => {
        this.setState({ refreshing: true, isLoading: true });
        pageIndex = 1
        this.getData()
    }


    onEndReached = () => {
        if (hasMore) {
            pageIndex++;
            this.getData()
        }
    }

    catDetail = (record) => {
        let detailUrl = '/cardshopdetail/' + record.id + '?card_id='+this.cardId + '&openid=' + this.openId
        window.location.assign(detailUrl)
    }
    
    _renderRow = (rowData, sectionID, rowID) => {
        let mainpic = imgUtil.getWxImgUrl(rowData.mainPic);
        let priceStr =  '¥' + parseFloat(rowData.price / 100).toFixed(2) ;
        return <div className='item1' onClick={()=>this.catDetail(rowData)}>
            <div className='itemView1'>
                <img className='logo1' src={mainpic} />
                <div className='info1'>
                    <div className='goods'>{rowData.goodsName}</div>
                    <div className='score'>{priceStr}</div>
                </div>
            </div>
        </div>
    }

    render = () => {
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 1,
                }}
            />
        );

        return (
            <ListView
                style={{ flex: 1 }}
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
                    {this.state.isLoading ? '正在加载' : '暂无记录'}
                </div>)}
                renderRow={this._renderRow}
                renderSeparator={separator}
                className="am-list"
                pageSize={4}
                useBodyScroll
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={60}
                pullToRefresh={<PullToRefresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />}
            />)
    }
}