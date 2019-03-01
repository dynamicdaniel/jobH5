import React from 'react'
import './cardinfoView.css'
import imgUtil from '../../../utils/imgUtil'
import moment from 'moment'

export default class CardInfoView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            brandDetail: props.cardDetail
        }
    }


    render() {
        let goodsDetail = this.props.goodsDetail;
        let dateStr = ''

        if (goodsDetail.date_info) {
            let dateInfo = JSON.parse(goodsDetail.date_info);
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
                    dateStr = moment(dateInfo.begin_timestamp).format('YYYY-MM-DD') + '至' + moment(dateInfo.end_timestamp).format('YYYY-MM-DD')
                }
            }
        }
        let logoUrl = imgUtil.getWxImgUrl(this.state.brandDetail.logo_url)

        let bgColor = this.state.brandDetail.color;
        return <div className='card' style={{ backgroundColor: `#${bgColor}` }}>
            <div className='cardimg'>
                <img src={logoUrl} className='cardlogo' />
                <div className='cardname'>{this.state.brandDetail.brand_name}</div>
            </div>
            <div className='cardtitle'>{goodsDetail.goodsName}</div>
            <div className='carddes'>{dateStr}</div>
        </div>
    }

}