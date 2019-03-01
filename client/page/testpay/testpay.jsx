import React, { Component } from 'react';
// import CustomKeyBoard from 'client/components/CustomKeyBoard';
import styles from './testpay.scss';
import { getFreeCardList, getCardExtStr } from '../../actions/card'
import { ListView, PullToRefresh } from 'antd-mobile';
import { getJsConfig, addCard } from '../../actions/wx';

class TestPay extends Component {

    constructor(props) {
        super(props)
        this.state = {
            inputPrice: '',
        }
    }

    onAddCard = () => {
        // let params = [{
        //     brand_name: "测试体验会员卡专用",
        //     card_type: "GIFT",
        //     code_type: "CODE_TYPE_QRCODE",
        //     color: "509fc9",
        //     date_info: `{"type":"DATE_TYPE_FIX_TERM","fixed_term":5,"fixed_begin_term":1}`,
        //     get_card_id: "pmmFtwi7gatPRPKYuX2uUzku5ozs",
        //     id: 1048,
        //     logo_url: "https://mmbiz.qpic.cn/mmbiz_jpg/ukoicRPickS4oAzf0Tue4XJM75WkwNvKJuk0ic1rSL4icD2U63d9HPXiaAow6AphsYSTUkqueia6JCJ8tqLNc5DuG98w/0?wx_fmt=jpeg",
        //     member_card_id: "pmmFtwhcQ4QYtlf7qv6zI_3QB5k8",
        //     notice: "",
        //     orderNo: "201811141601033540978877307",
        //     sendAt: 1542182465000,
        //     shopId: 1,
        //     source: "SActivityAfter",
        //     sourceId: 11,
        //     status: 0,
        //     title: "饮料兑换券",
        //     userId: "0c8c64c6fb68454397949a6a63bf2ed2",
        // }, {
        //         brand_name: "测试体验会员卡专用",
        //         card_type: "GIFT",
        //         code_type: "CODE_TYPE_BARCODE",
        //         color: "e4b138",
        //         date_info: `{"type":"DATE_TYPE_FIX_TERM","fixed_term":20,"fixed_begin_term":1}`,
        //         get_card_id: "pmmFtwobWa-dXEmHNsnFdtT94smU",
        //         id: 1049,
        //         logo_url: "https://mmbiz.qpic.cn/mmbiz_jpg/ukoicRPickS4oAzf0Tue4XJM75WkwNvKJuemvuic9EPp4Ngxq0lQ7hib54icnqGAPzhY8icvTZ55P5YMOAeyH8x9SHVw/0?wx_fmt=jpeg",
        //         member_card_id: "pmmFtwhcQ4QYtlf7qv6zI_3QB5k8",
        //         notice: "",
        //         orderNo: "201811141601033540978877307",
        //         sendAt: 1542182465000,
        //         shopId: 1,
        //         source: "SActivityAfter",
        //         sourceId: 11,
        //         status: 0,
        //         title: "兑换券",
        //         userId: "0c8c64c6fb68454397949a6a63bf2ed2"
        // }];
        // this.addCardAction(params);
        let list = [
            {
                card_id: 'pmmFtwi7gatPRPKYuX2uUzku5ozs',
                cardExt: '{timestamp: "1542184964", signature: "5682986791635426519bb75003e9b5677dd74a10", code: "", openid: "ommFtwvzxkUZyFaKyr1EITXC3l-Q"}'
            },
            {
                card_id: 'pmmFtwobWa-dXEmHNsnFdtT94smU',
                cardExt: '{timestamp: "1542185011", signature: "8c32d73140a17cf246a85c13cb396dab1eb8b348", code: "", openid: "ommFtwvzxkUZyFaKyr1EITXC3l-Q"}'
            }
        ]
        this.addCardList(list);
    };

    // addCardAction = (record) => {
    //     console.log(record)
    //     let params = {
    //         shopId: this.shopId,
    //         paramsJson: JSON.stringify({ openid: this.openId, card_id: record.card_id, outer_str: record.id })
    //     }
    //     console.log(params)
    //     getCardExtStr(params).then(res => {
    //         console.log(res)
    //         let lst = []
    //         lst.push({ cardId: record.card_id, cardExt: JSON.stringify(res) })
    //         getJsConfig(this.shopId).then(data => {
    //             addCard(lst, (res) => {
    //                 console.log(res);
    //             }, (error) => {
    //                 console.log(error);
    //             })
    //         }).catch(msg => {
    //             console.log(msg)
    //         });
    //     })
    // };

    addCardList = (list) => {
        let lst = [];
        list.map(item => {
            lst.push({ cardId: item.card_id, cardExt: JSON.stringify(item.cardExt) });
        });
        getJsConfig(1).then(data => {
            addCard(lst, (res) => {
                console.log(res);
            }, (error) => {
                console.log(error);
            })
        }).catch(msg => {
            console.log(msg)
        });
    }

    render = () => {

        return (
            <div className={styles['home-container']}>
                <div className={styles.price_container}>
                    <div className={styles.pricelable}>金额</div>
                    <div className={styles.input}>{this.state.inputPrice}</div>
                    <div className={styles.rmb}>¥</div>
                </div>
                {/* <button onClick={() => this.onAddCard()}>新增卡券</button> */}
            </div>
        );
    }
}

export default TestPay;
