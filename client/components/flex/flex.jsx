import React, { Component } from 'react';
export default class Flex extends Component{
    constructor(props){
        super(props)
    }
    render(){
        //console.log({width:'100%',height:'100%',float:'left',background:'blue',...this.props})
        return(
            <div style={{width:'100%',height:'100%',float:'left',...this.props}}>
                {this.props.children}
            </div>
        )
    }
    
}