/**
 * 未领取
 */
import React from 'react';
import {   getCardListByState , getCardExtStr } from '../../actions/card'
import { getJsConfig, addCard } from '../../actions/wx';
import { ListView, PullToRefresh } from 'antd-mobile';
import './toUseList.css'
import imgUtil from '../../utils/imgUtil'
export default class NoReceiveList extends React.Component {
    constructor(props) {
        super(props)
        this.shopId = props.userInfo.shopId;
        this.openId = props.userInfo.openId;
        this.token = props.userInfo.token;
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            refreshing: false
        };
        this.cardList = []
    }

    componentDidMount() {
        this.getCardListAction();
    }

    getCardListAction = () => {
        let params = {
            shopId: this.shopId,
            token: this.token,
            status: 0
        }
        getCardListByState(params).then(res => {
            console.log(res)
            this.cardList = res
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.cardList),
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

    addCardAction = (record) => {
        console.log(record)
        let params = {
            shopId: this.shopId,
            paramsJson: JSON.stringify({ openid: this.openId, card_id: record.get_card_id , outer_str: record.id })
        }
        console.log(params)
        getCardExtStr(params).then(res => {
            console.log(res)
            let lst = []
            lst.push({ cardId: record.get_card_id, cardExt: JSON.stringify(res) })
            getJsConfig(this.shopId).then(data => {
                addCard(lst, (res) => {
                    console.log(res);
                    this.onRefresh();
                }, (error) => {
                    console.log(error);
                })
            }).catch(msg => {
                console.log(msg)
            });
        })
    }

    _renderRow = (rowData, sectionID, rowID) => {
        let logoUrl = imgUtil.getWxImgUrl(rowData.logo_url);
        return <div className='item' onClick={()=>this.addCardAction(rowData)}>
            <div className='itemView'>
                <div style={{
                    backgroundColor: `#${rowData.color}`, height: '80px',
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    borderTopLeftRadius: '5px', borderTopRightRadius: '5px'
                }}>
                    <div style={{backgroundImage: `url('${logoUrl}')`}} className='logo'/>
                    <div className='title'>{rowData.title}</div>
                </div>
                <div style={{
                    backgroundColor: 'white', height: '40px',
                    paddingLeft: '20px',
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'
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
