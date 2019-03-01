/**
 *  记次卡
 *  列表
 */

import React from 'react'
import { UserContext } from '../../userContext';
import './numberCard.css';
import { ListView, PullToRefresh } from 'antd-mobile';
import { getNumCardList } from '../../actions/numcard';
import { Link } from 'react-router-dom'
import {getJsConfig, hideMenuItems} from '../../actions/wx';

let pageIndex = 1;

class NumberCard extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.cardId = props.userInfo.cardId
        this.token = props.userInfo.token
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            isLoading: true,
            dataSource,
            refreshing: false
        };
        this._data = [];

        getJsConfig(props.userInfo.shopId).then(data => hideMenuItems());
    }

    getData = () => {
        let params = {
            token: this.token,
            cardId: this.cardId
        }

        getNumCardList(params).then(res => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(res.list),
                isLoading: false,
                refreshing: false
            })
        }).catch(msg => {
            console.log(msg)
        });
    }

    componentDidMount() {
        pageIndex = 1
        this.getData()
    }

    onRefresh = () => {
    }


    onEndReached = () => {
    }
    _renderRow = (rowData, sectionID, rowID) => {
        let imgUrl = rowData.logo
        let dateStr = '';
        if (rowData.dateType == 'range') {
            dateStr = '有效期:' + rowData.dateBegin + '至' + rowData.dateEnd
        } else if (rowData.dateType == "regular") {
            dateStr = '购买后' + rowData.duration + ' 天内有效'
        }


        return (<div className='itemstyle'>
            <Link to={'/numcarddetail/' + rowData.id + `?openid=${this.props.userInfo.openid}&card_id=${this.props.userInfo.cardId}`}>
                <div className='itemView'>
                    <div className='itemViewTop' >
                        <img src={imgUrl} className='logo1' />
                        <div className='info'>
                            <div className='title'>{rowData.title}</div>
                            <div className='subTitle'>{rowData.subTitle}</div>
                        </div>
                        <div className='topRight'>
                            <div className='number'>{rowData.leftTimes}</div>
                            <div className='unit'>{rowData.unit}</div>
                            <img src={require('../../images/icon_right.png')} className='rightLogo' />
                        </div>
                    </div>
                    <div className='wavy-line'></div>
                    <div className='itemViewBottom'>
                        <div>{dateStr}</div>
                    </div>
                </div>
            </Link>
        </div>)
    }

    render() {
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
                    {this.state.isLoading ? '正在加载' : '暂无数据'}
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

const NumberCardConsumer = ({ }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <NumberCard
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default NumberCardConsumer
