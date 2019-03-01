/**
 * 可使用卡券
 */

import React from 'react'
import { getUseCardList } from '../../actions/card'
import { ListView, PullToRefresh } from 'antd-mobile';
import './toUseList.css'
import { getJsConfig, openCard } from '../../actions/wx';
import imgUtil from '../../utils/imgUtil'
export default class ToUseList extends React.Component {

    constructor(props) {
        super(props)
        this.shopId = props.userInfo.shopId;
        this.openId = props.userInfo.openId;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: false
        };
        this.cardList = [];
        this.wxCardList = [];
    }

    componentDidMount() {
        this.getCardListAction();
    }

    getCardListAction = () => {
        let params = {
            shopId: this.shopId,
            openId: this.openId
        }
        getUseCardList(params).then(res => {
            console.log(res)
            this.cardList = res.dbcardList
            this.wxCardList = res.wxcardList

            //
            let detailList = []
            this.wxCardList.map(item => {
                this.cardList.map(sub => {
                    if (sub.card_id == item.card_id){
                        sub.code = item.code
                        detailList.push(sub)
                    }
                })
            })

            console.log(detailList)

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(detailList),
                refreshing: false
            })
        }).catch(msg => {
            console.log(msg)
        });
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getCardListAction();
    }

    openCardAction = (record) => {
        console.log(record)
        let tempCardId = record.card_id
        let code = ''
        this.wxCardList.map(item => {
            if (item.card_id == tempCardId){
                code = item.code
            }
        })
       const lst = []
       lst.push({ cardId: tempCardId, code: code })
       getJsConfig(this.shopId).then((data) => {
            
            openCard(lst,(res) => {
                console.log('openCard:',res);
            }, (error) => {
                console.log('openCard error',error);
            })
       })
    }

    _renderRow = (rowData, sectionID, rowID) => {
        let logoUrl = imgUtil.getWxImgUrl(rowData.logo_url);
        return <div className='item'>
            <div className='itemView' onClick={() => this.openCardAction(rowData)}>
                <div style={{
                    backgroundColor: `#${rowData.color}`, height: '80px',
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    borderTopLeftRadius: '5px', borderTopRightRadius: '5px'
                }}>
                    <img src={logoUrl} className='logo' />
                    <div className='title'>{rowData.title}</div>
                </div>
                <div style={{
                    backgroundColor: 'white', height: '40px',
                    paddingLeft: '20px',
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px',

                }}>
                    <div>{rowData.brand_name}</div>
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

        return (<ListView
            style={{ flex: 1 }}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            className="am-list"
            pageSize={1}
            useBodyScroll
            scrollRenderAheadDistance={500}
            onEndReachedThreshold={60}
            pullToRefresh={<PullToRefresh
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
            />}
        />)
    }
}