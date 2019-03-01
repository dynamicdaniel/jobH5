/**
 * 分享记录
 */
import React from 'react';
import './shareRecord.css';
import { UserContext } from '../../userContext';
import {getShareData  , getShareNum , getActivityUserLst} from '../../actions/share';
import { ListView, PullToRefresh } from 'antd-mobile';
import moment from 'moment';
import {getJsConfig, hideMenuItems} from '../../actions/wx';

const NUM_ROWS = 10;
let pageIndex = 1;
let hasMore = false;

class ShareRecord extends React.Component {
    constructor(props){
        super(props);
        this.shareId = props.id;
        this.cardId = props.userInfo.cardId;
        this.openId = props.userInfo.openId;

        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            result:{},
            shareNum:{},
            shareData:{},
            activityLst:{},
            isLoading: true,
            dataSource,
            refreshing: false
        }
        this._data = [];
        this.shareData = {};

        getJsConfig(props.userInfo.shopId).then(data => hideMenuItems());
    }

    componentDidMount(){
        getShareData(this.shareId).then(res => {
            this.shareData = res;
            this.getData();
        }).catch(msg => {
            console.log(msg)
        });

        getShareNum(this.shareId).then(res => {
            this.setState({shareNum:res});
        })
        
        
    }


    getData = () => {
        let outId = this.shareData.openId;
        getActivityUserLst(this.cardId, outId , pageIndex , NUM_ROWS).then(res => {
            console.log('激活信息：',res)
            this.setState({activityLst:res})

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

    onRefresh = () => {
        this.setState({ refreshing: true, isLoading: true });
        pageIndex = 1
        this.getData()
    }


    onEndReached = () => {
        // console.log('hasMore')
        // console.log(hasMore)
        if (hasMore) {
            pageIndex++;
            this.getData()
        }
    }

    _renderRow = (rowData, sectionID, rowID) => {
        // console.log(rowData)
        let time =  moment(rowData.createAt).format('YYYY-MM-DD HH:mm:ss');
        return <div className='shareuseritem'>
             <img className='shareuserlogo' src={rowData.photo==''?'https://ybimage.yishouyun.net/h5/img/defaulttou.jpg':rowData.photo} />
             <div className='shareuserinfo'>
                <div className='shareuser_name'>{rowData.nickName}</div>
                <div className='shareuser_time'>{time}</div>
             </div>
        </div>
    }


    render(){

        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 1,
                }}
            />
        );

        return <div className='shareRecord'>
            <div className='sharedata'>
                <div className='dataitem'>
                    <div className='dataitemkey'>激活数</div> 
                    <div>{this.state.activityLst.count}</div>
                </div>
                <div className='lline'></div>
                <div className='dataitem'>
                    <div className='dataitemkey'>浏览人数</div> 
                    <div>{this.state.shareNum.shareLinksUser}</div>
                </div>
                <div className='lline'></div>
                <div className='dataitem'>
                    <div className='dataitemkey'>浏览次数</div> 
                    <div>{this.state.shareNum.shareLinks}</div>
                </div>
            </div>

           <div className='lstdata'> 
            <ListView
                style={{flex:1}}
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
                    {this.state.isLoading ? '正在加载' : '暂无记录'}
                </div>)}
                renderRow={this._renderRow}
                renderSeparator={separator}
                className="am-list"
                pageSize={4}
                useBodyScroll={false}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
                pullToRefresh={<PullToRefresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />}
            />
          </div>

        </div>
    }
}

const ShareRecordConsumer = ({match}) => (
    <UserContext.Consumer>
        {user => {
            return (
                <ShareRecord
                    id={match.params.id}
                    userInfo={user.userInfo}
                />
            )
        }}
    </UserContext.Consumer>
)

export default ShareRecordConsumer;