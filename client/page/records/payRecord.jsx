/**
 * 消费记录
 */
import React from 'react';
import { ListView, PullToRefresh } from 'antd-mobile';
import { UserContext } from '../../userContext';
import { getPayRecordData } from '../../actions/home'
import moment from 'moment'
import './payRecord.css';
import { Link } from 'react-router-dom'
import {getJsConfig, hideMenuItems} from '../../actions/wx';

const NUM_ROWS = 10;
let pageIndex = 1;
let hasMore = false;

class PayRecordView extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            isLoading: true,
            dataSource,
            refreshing: false
        };
        this._data = [];
        this.cardId = props.userInfo.cardId;
        getJsConfig(props.userInfo.shopId).then(data => {
            hideMenuItems();
        });
    }


    getData = () => {
        let params = {
            page: pageIndex,
            size: NUM_ROWS,
            orderStatus: 4,         // 订单状态：已完成
            payType: 3,             // 支付方式：余额
            token: this.props.userInfo.token,
            card_id: this.cardId
        }

        console.log(params)


        getPayRecordData(params).then(res => {
            console.log(res)
            if (res.length < NUM_ROWS) {
                hasMore = false
            } else {
                hasMore = true
            }

            if (pageIndex == 1) {
                this._data = res.list
            } else {
                this._data = this._data.concat(res.list);
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



    _renderRow = (rowData, sectionID, rowID) => {
        // console.log(rowData)
        let creatTime = moment(rowData.createAt)
        let creatTimeStr = creatTime.format('YYYY-MM-DD HH:mm:ss')

        let payType = '';//1微信，2支付宝，3卡内余额，4银行卡
        switch (rowData.payType) {
            case 1: payType = '微信'; break;
            case 2: payType = '支付宝'; break;
            case 3: payType = '卡内余额'; break;
            case 4: payType = '银行卡'; break;
        }

        let orgPrice = parseFloat(rowData.originalAmount / 100).toFixed(2)
        let realPrice = parseFloat(rowData.realAmount / 100).toFixed(2)

        return <Link to={'/orderdetail/' + rowData.orderNo} key={rowID} className='itemrecord'  style={{ padding: '15px 15px 15px 15px' }}>
            <div className='recordinfo'>
                 <div className='record_storename'>{rowData.storeName}</div>
                 <div className='record_time'>{creatTimeStr}</div>
            </div>
            <div className='recordprice'>{ '-' + realPrice}</div>
        </Link>
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


const PayRecordConsumer = ({ }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <PayRecordView
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default PayRecordConsumer





