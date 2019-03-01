/**
 * 绑定用户
 */
import React from 'react';
import { UserContext } from '../../userContext';
import { getShopDetail , getShopAdmin , setBandInfo} from '../../actions/home';
import {Button} from 'antd-mobile';
import imgUtil from '../../utils/imgUtil';
import './bandUser.css';
class BandUser extends React.Component{
    constructor(props){
        super(props);
        console.log(props.userInfo);
        this.userId = props.userInfo.userId;
        this.shopId = props.userInfo.shopId;
        this.openId = props.userInfo.openId;
        this.unionId = props.userInfo.unionId;
        this.state = {
            userInfo:{},
            code:''
        }
    }

    componentWillMount() {
        // 获取扫描用户的员工信息
        getShopAdmin({ shopId: this.shopId, id: this.userId }).then(res => {
            this.setState({ userInfo: res })
        }).catch(msg => {
            console.log(msg)
        });
    }


    setBandInfoAction = () => {
        // 点击绑定-目标产生登陆code
        setBandInfo({shopId:this.shopId , openId: this.openId,userId:this.userId, unionId:this.unionId}).then(res => {
            this.setState({code: res.code})
                    }).catch(msg => {
            console.log(msg)
        })
    }


    closeWindow = () => {
        window.WeixinJSBridge.call('closeWindow')
    }
    
    render(){
        return <div className='bandview'>
            <div className='band_shopname'>{this.state.userInfo.shopName || ''}</div>
            <div className='band_code_view'>
                <div>验证码</div>
                <div className='band_redtxt'>{this.state.code || '点击绑定获取'}</div>
            </div>
            <div className='band_itemviewTop'>
                <div>姓名</div>
                <div>{this.state.userInfo.name}</div>
            </div>
            <div className='band_line'></div>
            <div className='band_itemview'>
                <div>帐号</div>
                <div>{this.state.userInfo.loginId}</div>
            </div>
            <div className='band_line'></div>
            <div className='band_itemview'>
                <div>工号</div>
                <div>{this.state.userInfo.workNo}</div>
            </div>
            <div className='band_line'></div>
             <div className='band_itemviewBottom'>
                <div>角色</div>
                <div>{this.state.userInfo.workNo}</div>
            </div>

            <Button type='primary'
                onClick={() => this.setBandInfoAction()}
                className='btn_band'
                >绑定</Button>
            <Button 
                onClick={()=>this.closeWindow()}
                className='btn_band_cancel'
            >关闭</Button>
        </div>
    }
}

export default BandUser

