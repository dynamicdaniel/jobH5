/**
 * 免费券
 */
import React from 'react'
import './toUseList.css'
import { getFreeCardList , getCardExtStr} from '../../actions/card'
import { ListView, PullToRefresh } from 'antd-mobile';
import { getJsConfig, addCard } from '../../actions/wx';
import imgUtil from '../../utils/imgUtil'
import moment from 'moment'

export default class FreeCardList extends React.Component {

    constructor(props) {
        super(props)
        console.log(props.userInfo);
        this.shopId = props.userInfo.shopId;
        this.openId = props.userInfo.openId;
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
        console.log('this props:',this.props)
        let params = {
            shopId: this.shopId
        }
        getFreeCardList(params).then(res => {
            this.cardList = res.list.filter(item => item.card_type !== 'MEMBER_CARD');
            
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.cardList),
                refreshing: false
            });
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
            paramsJson: JSON.stringify({ openid: this.openId, card_id: record.card_id, outer_str: record.id })
        }
        console.log(params)
        getCardExtStr(params).then(res => {
            console.log(res)
            let lst = []
            lst.push({ cardId: record.card_id, cardExt: JSON.stringify(res) })
            getJsConfig(this.shopId).then(data => {
                addCard(lst, (res) => {
                    console.log(res);
                }, (error) => {
                    console.log(error);
                })
            }).catch(msg => {
                console.log(msg)
            });
        })
    }


    _renderRow = (rowData, sectionID, rowID) => {
        console.log(rowData);
        let dateInfo = JSON.parse(rowData.date_info);
        let dateStr = '';
        let stateStr = '';//卡券状态
        if (dateInfo) {
            // 使用时间的类型
            // DATE_TYPE_FIX_TIME_RANGE 表示固定日期区间，
            // DATE_TYPE_FIX_TERM表示固定时长（自领取后按天算），
            // DATE_TYPE_PERMANENT 表示永久有效（会员卡类型专用）。
            if (dateInfo.type == 'DATE_TYPE_PERMANENT') {
                dateStr = '永久有效'
            } else if (dateInfo.type == 'DATE_TYPE_FIX_TERM') {
                dateStr = '领取后' + (dateInfo.fixed_begin_term == 0 ? '当天' : dateInfo.fixed_begin_term) + '天生效,有效期' + dateInfo.fixed_term + '天'
            } else if (dateInfo.type == 'DATE_TYPE_FIX_TIME_RANGE') {
                let begin = moment(dateInfo.begin_timestamp, 'X')
                let end = moment(dateInfo.end_timestamp, 'X')
                dateStr =  begin.format('YYYY-MM-DD HH:mm:ss') + '至' + end.format('YYYY-MM-DD HH:mm:ss')
            }
        }
        // “CARD_STATUS_NOT_VERIFY”,待审核
        //  “CARD_STATUS_VERIFY_FAIL”,审核失败
        //  “CARD_STATUS_VERIFY_OK”，通过审核
        //  “CARD_STATUS_DELETE”，卡券被商户删除；
        // “CARD_STATUS_DISPATCH”，在公众平台投放过的卡券
        switch (rowData.status) {
            case 'CARD_STATUS_NOT_VERIFY': stateStr = '待审核'; break;
            case 'CARD_STATUS_VERIFY_FAIL': stateStr = '审核失败'; break;
            case 'CARD_STATUS_VERIFY_OK': stateStr = '审核通过'; break;
            case 'CARD_STATUS_DELETE': stateStr = '已删除'; break;
            case 'CARD_STATUS_DISPATCH': stateStr = '已投放'; break;
            default: break;
        }

        let logourl = imgUtil.getWxImgUrl(rowData.logo_url);

        return <div className='item'>
            <div className='itemView' onClick={()=>this.addCardAction(rowData)}>
                <div style={{
                    backgroundColor: `#${rowData.color}`, height: '80px',
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    borderTopLeftRadius: '5px', borderTopRightRadius: '5px'
                }}>
                    <img src={logourl} className='logo' />
                    <div className='title'>{rowData.title}</div>
                </div>
                <div style={{
                    backgroundColor: 'white', height: '40px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    justifyContent: 'flex-end',
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'
                }}>
                    <div>{dateStr + '(' + stateStr + ')'}</div>
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
