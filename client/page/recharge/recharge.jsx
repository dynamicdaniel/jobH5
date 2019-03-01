import React from 'react';
import { Flex, WhiteSpace, Modal, Icon, Grid, NoticeBar, NavBar, Button, Toast } from 'antd-mobile';
import './recharge.css';
import { UserContext } from '../../userContext';
import { getStores, userLogin, getUserLever, getChargeAmountLst } from '../../actions/home';
import { changeDiscountInfo, createChargeOrder, createOrder, gotoPay } from '../../actions/order';

class Recharge extends React.Component {


  constructor(props) {
    super(props);
    console.log('recharge')
    console.log(props)
    this.token = props.userInfo.token;
    this.shopId = props.userInfo.commonInfo.shopId;
    this.memberInfo = props.userInfo.commonInfo.memberInfo;
    this.cardId = props.userInfo.cardId;
    this.userCardBaseInfo = props.userInfo.commonInfo.userCardBaseInfo;
    this.cardDetail = props.userInfo.commonInfo.cardDetail;
    this.state = {
      flag: true,
      clicked: true,
      datas: [],
      chooseItem: {},
      stores: [],
      currentStore: {},
      showStoreDialog: false,
      userLever: {},
      payInfo: {}
    };
  }

  componentDidMount() {
    let token = this.props.userInfo.token;
    getUserLever(token, this.props.userInfo.cardId).then((data) => {
      console.log(data);
      this.setState({ userLever: data });
    })

    let params = { shopId: this.props.userInfo.shopId, cardId: this.props.userInfo.cardId }
    let that = this;
    getChargeAmountLst(params).then(res => {
      that.setState({
        datas: res
      })
    }).catch(msg => {

    })

    getStores(this.props.userInfo.shopId).then((data) => {
      if (data.list.length > 0) {
        this.setState({ stores: data.list, currentStore: data.list[0] });
      }
    });
  }


  startPayAction = () => {
    if (this.state.chooseItem) {
      this.createOrderInfo();
    } else {
      Toast.info("请选择充值套餐")
    }
  }

  createOrderInfo = () => {
    let token = this.props.userInfo.token;
    let shopId = this.props.userInfo.shopId;
    let params = {
      token: token,
      shopId: shopId,
      storeId: this.state.currentStore.storeId,
      amountId: this.state.chooseItem.id
    }

    Toast.loading('加载中...')

    console.log(params)

    //开始创建订单
    createChargeOrder(params).then((rs) => {
      Toast.hide();
      let data = rs;
      console.log('charegeInfo');
      console.log(rs);
      this.setState({ payInfo: rs })
      this.toPayAction()
    });
  }


  toPayAction = () => {
    console.log(this.props.userInfo)

    let params = {
      token: this.token,
      openId: this.props.userInfo.openid,
      shopId: this.props.userInfo.shopId,
      tradeId: this.state.payInfo.id
    }
    console.log(params);
    gotoPay(params).then(res => {
      console.log('gotopay')
      console.log(res)
      this.WxPay(res.data)
    }).catch(msg => {
      console.log(msg)
    })
  }



  WxPay = (data) => {
    let resultUrl = '/payresult?shopId=' + this.props.userInfo.shopId + '&openid='
      + this.props.userInfo.openid

    window.WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        "appId": data.appId,     //公众号名称，由商户传入     
        "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
        "nonceStr": data.nonceStr, //随机串     
        "package": data.package,
        "signType": 'MD5',         //微信签名方式：     
        "paySign": data.sign //微信签名 
      },
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          window.location.assign(resultUrl)
        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
      }
    );
  }


  chooseItemAction = (item) => { this.setState({ chooseItem: item, display1: true }) }
  onCloseStore = () => { this.setState({ showStoreDialog: false }) }
  onShowStoreDialog = () => { this.setState({ showStoreDialog: true }) }
  changeStore = (store) => { this.setState({ currentStore: store, showStoreDialog: false }) }

  _renderItem = (dataItem) => {
    let payPrice = parseFloat(dataItem.price / 100);

    return <div
      key={dataItem.id}
      onClick={() => this.chooseItemAction(dataItem)}
      style={dataItem.id == this.state.chooseItem.id ? styles.itemStyleSelect : styles.itemStyleNor}>
      <div style={dataItem.id != this.state.chooseItem.id ? styles.itemTitle1Nor : styles.itemTitle1Select}>{payPrice + '元'}</div>
      <div style={dataItem.id != this.state.chooseItem.id ? styles.itemTitle2Nor : styles.itemTitle2Select}>{'积分' + dataItem.rewardScore}</div>
    </div>
  }


  render() {
    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${this.cardDetail.background_pic_url})`,
            backgroundColor: `#${this.cardDetail.color}`,
            position: 'relative',
            width: '100%',
            height: '200px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            zIndex: '1'
          }}>
          <WhiteSpace size='xs' />
          <Flex justify='between'>
            <img className='logo' src={this.cardDetail.logo_url} />
            <Flex direction='column'>
              <p style={{ color: '#fff', marginRight: '30px', fontSize: '25px' }}>&nbsp;&nbsp;&nbsp;VIP<br /><span style={{ fontSize: '16px' }}>{this.state.userLever.name}</span></p>
            </Flex>
          </Flex>
          <div style={{ position: 'absolute', left: '8%' }}>
            <p style={{ fontSize: '18px', color: 'white' }}>{this.userCardBaseInfo.user_code}</p>
            <span style={{ fontSize: '18px', color: 'white' }}>{this.memberInfo.nickname}</span>
          </div>
        </div>

        <div style={styles.mendian}>
          <p style={styles.mendianText}>
            <span style={{ color: 'gray' }}>充值门店:</span> &nbsp;{this.state.currentStore.storeName}&nbsp;
            <span style={{ color: 'red' }} onClick={() => this.onShowStoreDialog()}>更换</span>
          </p>
        </div>



        <Grid
          data={this.state.datas}
          columnNum={3}
          hasLine={false}
          square={false}
          activeStyle={styles.grid}
          itemStyle={{ backgroundColor: '#f5f5f9' }}
          renderItem={this._renderItem}
        />

        <div style={{ height: '20px' }}></div>

        <Flex style={{ width: '100%' }} justify='center'>
          {this.state.chooseItem.id ?
            <Button onClick={() => this.startPayAction()} style={{ width: '320px', height: '46px', backgroundColor: 'rgb(222,122,16)', color: 'white' }}>立即充值</Button>
            :
            <Button style={{ width: '320px', height: '46px', backgroundColor: 'rgb(247,247,247)', color: 'rgb(222,222,222)' }}>立即充值</Button>
          }
        </Flex>

        <Modal
          popup
          visible={this.state.showStoreDialog}
          onClose={this.onCloseStore}
          animationType="slide-up">
          <div className='listview'>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: "center",
              flexDirection: 'row',
              height: '50px',
              backgroundColor: "#eee"
            }}>请选择所在的门店</div>

            {this.state.stores.map(item => {

              let check = this.state.currentStore.storeId == item.id

              return <div style={{
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: "center",
                flexDirection: 'row',
              }}>
                <div style={{ marginRight: '10px', width: '50px' }}>
                  {check ?
                    <Icon type="check" size='lg' />
                    : null
                  }
                </div>
                <div style={{

                }}>
                  <div style={{ color: 'black', fontSize: '15px' }}>{item.storeName}</div>
                  <div style={{ fontSize: '13px', color: 'gray', marginTop: '8px' }}>{item.address}</div>
                </div>
              </div>
            })}
          </div>
        </Modal>
      </div>
    );
  }


}

const RechargeConsumer = ({ }) => (
  <UserContext.Consumer>
    {user => {
      return (
        <Recharge
          userInfo={user.userInfo}
        />
      )
    }}
  </UserContext.Consumer>
)
const styles = {
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  headerTitle: {
    width: '100px',
    textAlign: 'center',
    height: '60px',
    marginTop: '8px',
    marginRight: '630px'
  },
  banner: {
    position: 'relative',
    width: '100%',
    height: '200px',
    // backgroundImage: `url('${this.cardDetail.background_pic_url}')`,
    // backgroundImage: { url: this.cardDetail.background_pic_url },
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    zIndex: '1'
  },
  mendian: {
    width: '100%',
    paddingTop: '5px'
  },
  mendianText: {
    marginLeft: '20px',
  },
  selector: {
    width: '85%',
    margin: '20px auto',
  },
  itemStyleNor: {
    borderRadius: '3px', display: 'flex', borderStyle: 'solid', borderWidth: '1px',
    flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    borderColor: '#ccc', margin: '10px', paddingLeft: '5px', paddingTop: '5px',
    backgroundColor: 'white',
    paddingRight: '5px', paddingBottom: '5px'
  },
  itemStyleSelect: {
    borderRadius: '3px', display: 'flex', borderStyle: 'solid', borderWidth: '1px',
    flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    borderColor: '#ccc', margin: '10px', paddingLeft: '5px', paddingTop: '5px',
    backgroundColor: 'rgb(222,122,16)',
    paddingRight: '5px', paddingBottom: '5px'
  },

  itemTitle1Nor: {
    fontWeight: 'bold', fontSize: '13px', color: '#333', marginBottom: '3px'
  },

  itemTitle1Select: {
    fontWeight: 'bold', fontSize: '13px', color: 'white', marginBottom: '3px'
  },

  itemTitle2Nor: {
    fontSize: '10px', color: '#666'
  },

  itemTitle2Select: {
    fontSize: '10px', color: 'white'
  }
}


export default RechargeConsumer

