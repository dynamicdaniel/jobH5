import React, { Component, Fragment } from 'react';
import { Flex, WhiteSpace, Button, Icon, Modal, List, WingBlank } from 'antd-mobile';
import { Link } from 'react-router-dom';

class StoreList extends Component {

    renderItem = (item) => {

        let check = false

        if (item.id == this.props.chooseStore.id) {
            check = true;
        }

        return <div style={{
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: "center",
            flexDirection: 'row',
        }}>
            <div style={{ marginRight: '10px', width: '50px' }}>
                {check ?
                    <Icon type="check" size={item} />
                    : null
                }
            </div>
            <div style={{

            }}>
                <div style={{ color: 'black', fontSize: '15px' }}>{item.storeName}</div>
                <div style={{ fontSize: '13px', color: 'gray', marginTop: '8px' }}>{item.address}</div>
            </div>
        </div>
    }

    render() {
        return <Modal
            popup
            animationType="slide-up"
            visible={this.props.visible}
            onClose={this.props.onClose()}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: "center",
                flexDirection: 'center',
                height: '50px',
                backgroundColor: "#eee"
            }}>选择门店</div>
            <List style={{ height: '200px', overflow: 'auto' }}>
                {
                    this.props.data.map(
                        (item, index) => {
                            return (
                                <List.Item key={index} onClick={() => this.props.chooseStoreAction(item)}>
                                    <Flex>
                                        {this.renderItem(item)}
                                    </Flex>
                                </List.Item>
                            )
                        }
                    )
                }
            </List>
        </Modal>
    }
}


export default StoreList;