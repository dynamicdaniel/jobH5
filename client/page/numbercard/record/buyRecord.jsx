/**
 * 使用记录
 */

import React from 'react';
import { ListView, PullToRefresh } from 'antd-mobile';
import { UserContext } from '../../../userContext';
import { getRecordList } from '../../../actions/numcard';
import './useRecord.css';
import {getJsConfig, hideMenuItems} from '../../../actions/wx';

class UseRecordView extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
        };
        this._data = [];

        getJsConfig(props.userInfo.shopId).then(data => hideMenuItems());
    }


    getData = () => {
        let params = {
            id: this.props.id,
            token: this.props.userInfo.token,
            type: 1
        }

        console.log(params)


        getRecordList(params).then(res => {
            this._data = res
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this._data.list),
            })
        }).catch(msg => {
            console.log(msg)
        })
    }


    componentDidMount() {
        this.getData()
    }


    onRefresh = () => {
        this.getData()
    }


    onEndReached = () => {
    }



    _renderRow = (rowData, sectionID, rowID) => {
        let creatTime = new Date(rowData.createAt)
        let creatTimeStr = creatTime.toLocaleDateString() + ' ' + creatTime.toLocaleTimeString()

        let timeStr = ''
        timeStr = '+ ' + rowData.times

        console.log(rowData)

        return <div key={rowID} className='userecord_item'>
            <div className='userecord_left'>
                <img src={rowData.logo} className='userecord_logo' />
                <div className='userecord_info'>
                    <div>次卡</div>
                    <span>{creatTimeStr}</span>
                </div>
            </div>
            <div className='userecord_right'>{timeStr}</div>
        </div>
    }

    _renderHead = () => {
        return <div className='lsthead'>充次记录</div>
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
                renderHeader={this._renderHead}
                renderRow={this._renderRow}
                renderSeparator={separator}
                className="am-list"
                pageSize={4}
                useBodyScroll
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
                pullToRefresh={<PullToRefresh
                    refreshing={false}
                    onRefresh={this.onRefresh}
                />}
            />)
    }

}


const PayRecordConsumer = ({ match }) => (
    <UserContext.Consumer>
        {user => {
            return (
                <UseRecordView
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)
export default PayRecordConsumer





