/**
 * 积分商城
 */


import React from 'react';
import { getBonusShop } from '../../actions/card'
import { ListView, PullToRefresh } from 'antd-mobile';
import './bonusShop.css'
import imgUtil from '../../utils/imgUtil';
const NUM_ROWS = 10;
let pageIndex = 1;
let hasMore = false;
export default class BonusShopList extends React.Component {

    constructor(props) {
        super(props);
        console.log(props.userInfo)
        this.openId = props.userInfo.openId
        this.cardId = props.userInfo.cardId;
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
            cardId: this.cardId,
            status: 1,
        }

        console.log(params)


        getBonusShop(params).then(res => {
            console.log(res)
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
        console.log('hasMore')
        console.log(hasMore)
        if (hasMore) {
            pageIndex++;
            this.getData()
        }
    }

    catDetail = (record) => {
        console.log(record)
        let detailUrl = '/bonusdetail/' + record.id + '?card_id='+this.cardId + '&openid=' + this.openId
        window.location.assign(detailUrl)
    }
    
    _renderRow = (rowData, sectionID, rowID) => {
        let mainPic = imgUtil.getWxImgUrl(rowData.mainPic)
        return <div className='item1' onClick={()=>this.catDetail(rowData)}>
            <div className='itemView1'>
                <img className='logo1' src={mainPic} />
                <div className='info1'>
                    <div className='goods'>{rowData.goodsName}</div>
                    <div className='score'>{rowData.score + '积分'}</div>
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
                onEndReachedThreshold={10}
                pullToRefresh={<PullToRefresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />}
            />)
    }
}