import React,{Component,Fragment} from 'react';
import {Flex,WhiteSpace,Button,Icon} from 'antd-mobile';

export default class Youhui extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div>
                <WhiteSpace size='lg'/>
                <Button size='large'>送优惠劵</Button>
            </div>
        )
    }
}
