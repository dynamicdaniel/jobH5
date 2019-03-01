import React,{Component,Fragment} from 'react';
import {Flex,Checkbox,Button,Icon,Modal,List,WingBlank} from 'antd-mobile';
import {Link} from 'react-router-dom';

const CheckboxItem = Checkbox.CheckboxItem;

class ChooseCoupon extends Component {

    constructor(props){
        super(props);

        this.state = {
            chooseCoupon:{}
        }
    }


    confirm = () => {
        this.props.chooseCouponAction(this.state.chooseCoupon)
    }

    render(){


        return <Modal visible={this.props.visible} 
                    onClose={this.props.onClose} 
                    closable={true} 
                    style={{width:'95%',height:'500px'}}>
        <List>
            <img src={require('../../images/logo组.png')} style={{width:'90px',height:'90px'}} />
            <p style={{transform:'translateY(-20px)',color:'black'}}>请选择一张优惠劵</p>
            {
                this.props.data.map(
                    (item,index)=>{
                        let checked = false;
                        if (this.state.chooseCoupon.id == item.id){
                            checked = true;
                        }
                        return(
                            <div key={item.id} style={{paddingLeft:"20px",paddingRight:"20px"}}>
                                 <CheckboxItem 
                                    checked={checked}
                                    onChange={() => this.setState({chooseCoupon:item}) }>
                                    {item.name}
                                </CheckboxItem>
                            </div>    
                        )
                    }
                )
            }
             
                <List.Item>
                <Button onClick={this.confirm} type='primary' style={{background:'rgb(26,173,25)'}}>确认选择</Button>
                </List.Item>
            </List>
        </Modal>
    }

}

export default ChooseCoupon;