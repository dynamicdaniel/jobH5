import React from 'react';
import {Toast} from 'antd-mobile'
export default class AuthOpen extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
          Toast.loading('加载中',10)
    }
    render(){
          return(
            <div style={{width:'100%',height:'100%',background:'white'}}/>
          )
    }
}
