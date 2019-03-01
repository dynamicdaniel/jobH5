import React,{Component} from 'react';
import {Flex,WhiteSpace,WingBlank,Button} from 'antd-mobile';
import './lift.css'

export default class Lift extends Component {
    constructor(props){
        super(props);
        this.state={
            disabled:true,
            value1:'',
            value2:'',
        }
       this.handleChange1=this.handleChange1.bind(this);
       this.handleChange2=this.handleChange2.bind(this);
    }
    render(){
        return(
            <div style={styles.mainbox}>
                <WingBlank>
                <WhiteSpace size='lg'/>
                <Flex justify='center'>
                  <img src={require('../../images/logo组.png')} style={{width:'90px',height:'90px'}}/>
                </Flex>
                <Flex direction='column'>
                <input placeholder='请输入礼品卡卡号' style={{marginTop:'10px',height:'33px'}} onChange={this.handleChange1} value={this.state.value1} ref={(input1)=>{this.input1=input1}}/>
                <div style={styles.line} />
                <input placeholder='请输入礼品卡密码' style={{marginTop:'10px',height:'33px'}} onChange={this.handleChange2} value={this.state.value2} ref={(input2)=>{this.input2=input2}}/>
                <div style={styles.line} />
                <Flex.Item>
                    <Button type='primary' disabled={this.state.disabled} style={{backgroundColor:'rgb(26,173,25)',width:'300px',marginTop:'26px',marginRight:'8px'}}>确认</Button>
                </Flex.Item>
                <a style={styles.tip}>礼品卡使用规则</a>
                </Flex>
                </WingBlank>
            </div>
        )
    }

    handleChange1=(e)=>{
             this.setState({
                 value1:e.target.value,
             })
             if(this.input1.value!=0 && this.input2.value!=0){
                this.setState({
                    disabled:false
                })
            }
            else{
                this.setState({
                    disabled:true
                })
            }
    }

    handleChange2=(e)=>{
            this.setState({
                value2:e.target.value,
            })
            if(this.input1.value!=0 && this.input2.value!=0){
                this.setState({
                    disabled:false
                })
            }
            else{
                this.setState({
                    disabled:true
                })
            }
    }
    
}

const styles={
    mainbox:{
        backgroundColor:'rgb(255,255,255)',
        width:'93%',
        height:'400px',
        margin:'15px auto'
    },
    tip:{
        fontSize:'13px',
        color:'rgb(153,153,153)',
        textDecoration:'underline',
        marginTop:'22px'
    },
    line:{
        width:'300px',
        height:'1px',
        backgroundColor:'rgb(242,242,242)'
    }
}