import React from 'react';
import { UserContext } from '../../userContext';
import { Tabs } from 'antd-mobile'
import './topbars.css';
import FreeCard from '../card/freeCard';
import NoReceive from '../card/noReceiveList';
import ToUse from '../card/toUseList';
import BonusShop from '../bonus/bonusShop';
import CardShop from '../card/cardShop';
import {getJsConfig, hideMenuItems} from '../../actions/wx';

const tabs = [
    { title: '可使用' },
    { title: '未领取' },
    { title: '免费券' },
    { title: '卡券商城' },
    { title: '积分商城' }
];

class Topbars extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            tabIndex: parseInt(props.info.tabIndex) || 0
        }
        this.token = props.info.token;
        this.shopId = props.info.commonInfo.shopId;
        this.cardId = props.info.cardId;
        this.memberInfo = props.info.commonInfo.memberInfo;

        getJsConfig(this.shopId).then(data => {
            hideMenuItems();
        });
    }

    render = () => {
        return (
            <Tabs
                tabs={tabs}
                initialPage={this.state.tabIndex}
                onTabClick={(tab, index) => this.setState({ tabIndex: index })}
                swipeable={false}
            >
                <ToUse {...this.props} />
                <NoReceive {...this.props} />
                <FreeCard {...this.props} />
                <CardShop {...this.props} />
                <BonusShop {...this.props} />
            </Tabs>
        );
    }
}


export default Topbars