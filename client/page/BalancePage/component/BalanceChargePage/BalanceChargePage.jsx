import React, { Component } from 'react';
import mathUtil from '../../../../utils/mathUtil';
import './BalanceChargePage.css';
import { getDeviceList, getChargeAmountLst } from '../../../../actions/home';
import DeviceList from '../../../home/deviceList';
import CustomImage from "../../../../components/CustomImage/CustomImage";
import constantUtil from "../../../../utils/constantUtil";
import {Button} from 'antd-mobile';

class BalanceChargePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeDeviceList: [],
            selectedStore: {},
            balanceList: [],
            selectedBalance: null,
            chargeAmount: 0,
            selectedIndex: -1,
            selectBalanceItem: false
        }
    }


    componentDidMount = () => {
        let { shopId } = this.props.userInfo.commonInfo;
        let { cardId } = this.props.userInfo;

        getChargeAmountLst({
            shopId: shopId,
            cardId: cardId
        }).then(res => {
            console.log(res);
            this.setState({
                balanceList: res
            });
        }).catch(error => {
            console.log(error);
        });


        getDeviceList({
            card_id: cardId
        }).then((data) => {
            console.log(data);
            if (data.length > 0) {
                this.setState({
                    storeDeviceList: data,
                    selectedStore: data[0]
                });
            }
        }).catch(error => {
            console.log(error);
        })
    };


    onPayClick = () => {

    };

    onStoreDeviceSelect = (item) => {
        this.setState({
            selectedStore: item
        });
    };

    onChargeChange = (v) => {
        this.setState({
            chargeAmount: v,
            selectedIndex: -1,
            selectedBalance: null,
            selectBalanceItem: false
        });
    };

    onBalanceItemChange = (item, index) => {
        this.setState({
            selectedBalance: item,
            selectedIndex: index,
            chargeAmount: mathUtil.getYuanInTable(item.price),
            selectBalanceItem: true
        });
    };

    render() {
        let chargeAmountValue = '';
        if(this.state.chargeAmount){
            chargeAmountValue = this.state.chargeAmount + '元';
        }

        return (
            <div className='balance-charge-page'>
                <StorePicker
                    data={this.state.storeDeviceList}
                    selectedStore={this.state.selectedStore}
                    onStoreDeviceSelect={item => this.onStoreDeviceSelect(item)}
                />
                <CustomBalanceInput
                    onChargeChange={v => this.onChargeChange(v)}
                    selectBalanceItem={this.state.selectBalanceItem}
                />
                <BalanceGrid
                    data={this.state.balanceList}
                    onChange={(item, index) => this.onBalanceItemChange(item, index)}
                    selectedIndex={this.state.selectedIndex}
                />
                <Button
                    className='balance-charge-page-pay-btn'
                    onClick={() => this.onPayClick()}>支付{chargeAmountValue}</Button>
                <BalanceHint
                    rule={this.state.selectedBalance}
                />
            </div>
        );
    }
}

class StorePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStore: props.selectedStore,
            data: props.data,
            storeListVisible: false
        };
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            selectedStore: nextProps.selectedStore,
            data: nextProps.data
        });
    };

    onSwitchStore = () => {
        this.setState({
            storeListVisible: true
        });
    };

    onCloseStore = () => {

    };

    render() {
        let { selectedStore } = this.state;
        let storeName = '暂无门店设备';
        if(selectedStore){
            storeName = selectedStore.storeName;
        }

        return (
            <div className='store-picker-node'>
                <span className='store-picker-text'>门店: </span>
                <span className='store-picker-text'>{storeName}</span>
                <span className='store-picker-btn' onClick={() => this.onSwitchStore()}>切换</span>
                <DeviceList
                    chooseStoreAction={(item) => {
                        this.setState({
                            storeListVisible: false
                        });
                        this.props.onStoreDeviceSelect(item);
                    }}
                    chooseStore={this.state.selectedStore}
                    onClose={() => this.onCloseStore()}
                    visible={this.state.storeListVisible}
                    data={this.state.data}
                    clicked={false}
                />
            </div>
        );
    }
}

class CustomBalanceInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changeAmount: 0
        };
    }


    componentDidMount = () => {
        console.log(this.props.selectBalanceItem);
        if(this.props.selectBalanceItem){
            this.setState({
                chargeAmount: 0
            });
        }
    };


    componentWillReceiveProps = (nextProps) => {
        console.log(nextProps.selectBalanceItem);
        if(nextProps.selectBalanceItem){
            this.setState({
                chargeAmount: 0
            });
        }
    };


    onChargeChange = v => {
        this.setState({
            changeAmount: v.target.value
        });
        this.props.onChargeChange(v.target.value);
    };

    render() {
        return (
            <div className="custom-balance-input">
                <span>余额充值: </span>
                <input
                    placeholder='输入充值金额'
                    value={this.state.changeAmount || ''}
                    onChange={(v) => this.onChargeChange(v)}
                />
            </div>
        );
    }
}

class BalanceGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            selectedIndex: props.selectedIndex
        };
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            data: nextProps.data,
            selectedIndex: nextProps.selectedIndex
        });
    };

    onItemClick = (item, index) => {
        // this.setState({
        //     selectedIndex: index
        // });
        this.props.onChange(item, index);
    };

    render() {
        let {data, selectedIndex} = this.state;
        console.log(selectedIndex);
        let renderData = data.map((item, index) => (Object.assign(item, {selected: index === selectedIndex})));
        console.log(renderData);

        return (
            <div className="balance-grid">
                {renderData.map((item, index) => {
                    let bgImage = constantUtil.IMAGE_PREFIX + 'weidianji.png';
                    if(item.selected){
                        bgImage = constantUtil.IMAGE_PREFIX + 'dianji.png';
                    }
                    let boxShadowValue = `none`;
                    if(item.selected){
                        boxShadowValue = `2px 2px 4px #DDDDDD`;
                    }
                    return (
                        <div
                            key={index}
                            className='balance-grid-item'
                            onClick={() => this.onItemClick(item, index)}
                            style={{
                                backgroundImage: `url('${bgImage}')`,
                                marginRight: `${(index + 1) % 3 !== 0 ? '5%' : '0'}`,
                                marginTop: '16px',
                                boxShadow: `${boxShadowValue}`
                            }}
                        >
                            <div className='balance-grid-item-value'>
                                {mathUtil.getYuanInTable(item.amount)}元
                            </div>
                            <div className="balance-grid-item-amount">
                                售价{mathUtil.getYuanInTable(item.price)}元
                            </div>
                            {
                                item.selected ?
                                    <CustomImage value='gou' cls='balance-grid-item-checked'/> :
                                    null
                            }
                        </div>
                    );
                })}
            </div>
        );
    }
}

class BalanceHint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rule: props.rule
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            rule: nextProps.rule
        });
    };

    render() {
        let {rule} = this.state;
        let limitString = `无购买限制`;
        if(rule && rule.limitNum){
            limitString = `每人限购${rule.limitNum}张`;
        }
        let rewardScoreString = `不赠送积分`;
        if(rule && rule.rewardScore){
            rewardScoreString = `赠送${rule.rewardScore}积分`;
        }
        let rewardCardString = `不赠送卡券`;
        if(rule && rule.rewardList && rule.rewardList.length > 0){
            rewardCardString = `赠送卡券: `;
            rule.rewardList.map((item, index) => {
                rewardCardString += `${item.title}${item.num}张`;
                if(index < rule.rewardList.length - 1){
                    rewardCardString += ',';
                }
            });
        }

        if(rule){
            return (
                <div className="balance-hint">
                    <div className="balance-hint-title">充值规则</div>
                    <ul className='balance-hint-list'>
                        <li>1. {limitString}</li>
                        <li>2. {rewardScoreString}</li>
                        <li>3. {rewardCardString}</li>
                    </ul>
                </div>
            );
        }else{
            return null;
        }
    }
}

export default BalanceChargePage;
