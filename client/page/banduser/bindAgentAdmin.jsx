import React from 'react';
import { UserContext } from '../../userContext';
import { getAgentAdminDetail, setAgentBindInfo } from '../../actions/home';
import { Button } from 'antd-mobile';
import imgUtil from '../../utils/imgUtil';
import './bandUser.css';

class BindAgentAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.agentAdminId = props.userInfo.agentAdminId;
        this.agentId = props.userInfo.agentId;
        this.openid = props.userInfo.openid;
        this.mainopenid = props.userInfo.mainopenid;
        this.state = {
            userInfo: {},
            code: ''
        }
    }

    componentWillMount() {
        // 获取扫描用户的员工信息
        getAgentAdminDetail({ id: this.agentAdminId }).then(res => {
            console.log("代理商管理员信息", res);
            this.setState({ userInfo: res });
        }).catch(msg => {
            console.log(msg);
        });
    }

    setBandInfoAction = () => {
        // 点击绑定-目标产生登陆code
        setAgentBindInfo({ agentAdminId: this.agentAdminId, agentId: this.agentId, openId: this.openid, mainOpenId: this.mainopenid })
            .then(res => {
                console.log(res);
                this.setState({ code: res.code });
            }).catch(msg => {
                console.log(msg);
            });
    }

    closeWindow = () => {
        window.WeixinJSBridge.call('closeWindow');
    }

    render() {
        return <div className='bandview'>
            <div className='band_shopname'>{this.state.userInfo.agentName || ''}</div>
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
            {/* <div className='band_itemview'>
                <div>工号</div>
                <div>{this.state.userInfo.workNo}</div>
            </div>
            <div className='band_line'></div>
            <div className='band_itemviewBottom'>
                <div>角色</div>
                <div>{this.state.userInfo.workNo}</div>
            </div> */}

            <Button type='primary'
                onClick={() => this.setBandInfoAction()}
                className='btn_band'
            >绑定</Button>
            <Button
                onClick={() => this.closeWindow()}
                className='btn_band_cancel'
            >关闭</Button>
        </div>
    }
}

export default BindAgentAdmin;

