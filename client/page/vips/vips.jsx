import React from 'react';
import { Flex, WhiteSpace, WingBlank, Icon, Grid, NoticeBar, NavBar, List, Modal, Button } from 'antd-mobile';

const Item = List.Item;
import './vips.css'
import { getStores, userLogin, createOrder, getUserLever, getUserCoupons, changeDiscountInfo } from '../../actions/home'
import { UserContext } from '../../userContext';
import { createHashHistory } from 'history';
const hashHistory = createHashHistory();
import clientConfig from '../../clientConfig';
class Vips extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.token = props.userInfo.token;
    this.shopId = props.userInfo.commonInfo.shopId;
    this.memberInfo = props.userInfo.commonInfo.memberInfo;
    this.cardId = props.userInfo.cardId;
    this.userCardBaseInfo = props.userInfo.commonInfo.userCardBaseInfo;
    this.cardDetail = props.userInfo.commonInfo.cardDetail;
    this.state = {
      modal1: false,
      userLever: {},
      showModal: false
    }
  }


  componentDidMount() {
    getUserLever(this.token, this.cardId).then((data) => {
      console.log(data);
      this.setState({ userLever: data });
    }).catch(msg => {
      console.log(msg)
    })
  }


  showModal = (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    console.log('show Modal')
    this.setState({
      showModal: true,
    });
  }
  onClose = () => {
    this.setState({
      showModal: false,
    });
  }

  // toXfRecord = () => {
  //   let xfUrl = '/recordpay?shopId=' + this.props.userInfo.commonInfo.shopId + '&openid=' + this.props.userInfo.openId
  //   hashHistory.replace(xfUrl)
  // }

  // toCzRecord = () => {
  //   let czRecordUrl = '/recordrecharge?shopId=' + this.props.userInfo.commonInfo.shopId + '&openid=' + this.props.userInfo.openId
  //   hashHistory.replace(czRecordUrl)
  // }

  render() {

    let czUrl = '/recharge?openid=' + this.props.userInfo.openId + '&card_id=' + this.props.userInfo.cardId + '&shopId=' + this.props.userInfo.commonInfo.shopId;
    // let xfUrl = '/recordpay?shopId=' + this.props.userInfo.commonInfo.shopId + '&openid=' + this.props.userInfo.openId;
    let xfUrl = `/recordpay?shopId=${this.props.userInfo.commonInfo.shopId}&openid=${this.props.userInfo.openId}&card_id=${this.cardId}`;
    // let czRecordUrl = '/recordrecharge?shopId=' + this.props.userInfo.commonInfo.shopId + '&openid=' + this.props.userInfo.openId;
    let czRecordUrl = `/recordrecharge?shopId=${this.props.userInfo.commonInfo.shopId}&openid=${this.props.userInfo.openId}&card_id=${this.cardId}`;

    return (
      <div>
        <div style={{
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
            {/* <img className='logo' src='https://image.hongheyu1688.com/member/logo.png' /> */}
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

        <div className='extra' style={styles.extra}>
          <Flex align='center'>
            <Flex.Item>
              <Flex direction='column' align='center'>
                <span style={{ marginTop: '10px', color: 'rgb(153,153,153)' }}>余额</span>
                <span style={{ marginTop: '5px', fontSize: '20px', color: 'rgb(66,66,66)' }}>{'¥' + parseFloat(this.userCardBaseInfo.money / 100).toFixed(2)}</span>
                <a href={czUrl} style={{ marginTop: '5px', color: 'rgb(251,27,106)', textDecoration: 'underline' }}>点击充值</a>
              </Flex>
            </Flex.Item>
            <div style={styles.line} />
            <Flex.Item>
              <Flex direction='column' align='center' style={styles.extraRight}>
                <span style={{ marginTop: '10px', color: 'rgb(153,153,153)' }}>积分</span>
                <span style={{ marginTop: '5px', fontSize: '20px', color: 'rgb(66,66,66)' }}>{this.props.userInfo.commonInfo.memberInfo.bonus}</span>
                {/* <a style={{ marginTop: '5px', color: 'rgb(251,27,106)', textDecoration: 'underline' }}>积分商城</a> */}
              </Flex>
            </Flex.Item>
          </Flex>
        </div>
        <WhiteSpace />
        <List>
          <Item arrow='horizontal' thumb='https://image.hongheyu1688.com/member/icon_xfjl.png'
            onClick={() => window.location.assign(xfUrl)}
            style={{ height: '60px', backgroundColor: 'rgb(255,,255,255)' }}>
            <div style={{ color: '#333' }}> 消费记录 </div>
          </Item>
          <Item arrow='horizontal' thumb='https://image.hongheyu1688.com/member/icon_czjl.png'
            onClick={() => window.location.assign(czRecordUrl)}
            style={{ height: '60px', backgroundColor: 'rgb(255,255,255)' }}>
            <div style={{ color: '#333' }}> 充值记录 </div>
          </Item>
          <Item arrow='horizontal' thumb='https://image.hongheyu1688.com/member/icon_lpkqdh.png' style={{ height: '60px', backgroundColor: 'rgb(255,255,255)' }}
            onClick={this.showModal}>
            礼品卡兑换
        </Item>
        </List>
        <Modal
          visible={this.state.showModal}
          onClose={this.onClose}
          style={{ width: '84%', height: '300px' }}
        >
          <Flex direction='column'>
            <h2 style={{ color: 'rgb(32,32,32)' }}>兑换信息</h2>
            <Flex.Item>
              <Flex direction='column'>
                <span style={{ fontSize: '16px' }}>您的礼品卡兑换金额为2000元确认兑换后,</span>
                <span style={{ fontSize: '16px', marginTop: '5px', marginRight: '6px' }}>兑换金额将增加至您的储值金额账户，</span>
                <span style={{ fontSize: '16px', marginTop: '5px', marginRight: '15px' }}>之后能在花开嫣然旗下门店消费使用</span>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Button type='primary' style={{ backgroundColor: 'rgb(222,122,16)', width: '200px', marginTop: '55px' }}> <a href='/lift?openid=1' style={{ color: 'white' }}>确认兑换</a></Button>
            </Flex.Item>

          </Flex>
        </Modal>
      </div>
    );
  }
}

const styles = {
  header: {
    width: '100%',
  },
  // banner: {
  //   width: '100%',
  //   height: '210px',
  //   backgroundImage: `url(${require('../../images/11.png')})`,
  //   backgroundRepeat: 'no-repeat',
  //   backgroundSize: 'cover',
  // },
  extra: {
    width: '100%',
    height: '80px',
    backgroundColor: 'rgb(255,255,255)'
  },
  extraLeft: {
    textAlign: 'center',
    paddingTop: '18px'
  },
  extraRight: {
    textAlign: 'center',
  },
  line: {
    width: '1px',
    height: '50px',
    backgroundColor: 'rgb(222,222,222)',
    marginTop: '10px'
  }
}

export default Vips