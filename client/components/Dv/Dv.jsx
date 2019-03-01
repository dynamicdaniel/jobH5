import React, { Component } from 'react';
export default class Bk extends Component{

    render = () =>{
        let obj = {}
        obj = Object.assign(obj,this.props)

        obj.width = this.props.width || '100%'
        obj.height = this.props.height || 'auto'
        
        if(this.props.img != undefined){

            obj.backgroundPosition = this.props.backgroundPosition || 'center center'
            obj.backgroundRepeat = this.props.backgroundRepeat || 'no-repeat'
            obj.backgroundSize = this.props.backgroundSize || '100% 100%'
            obj.backgroundImage = `url(${obj.img})`
        }
        if(this.props.flex != undefined){
              
            obj.display = 'flex'
            const flex = {
                'hvcenter' : {'justifyContent' : 'center','alignItems' : 'center'},
                'hcenter' : {'justifyContent' : 'center'},
                'hstart' : {'justifyContent' : 'flex-start'},
                'hend' : {'justifyContent' : 'flex-end'},
                'hbetween' : {'justifyContent' : 'space-between'},
                'haround' : {'justifyContent' : 'space-around'},
                'vcenter' : {'alignItems' : 'center'},
                'vstart' : {'alignItems' : 'center'}, 
                'vend' : {'alignItems' : 'center'},
                'vbetween' : {'alignContent' : 'space-between'},
                'varound' : {'alignContent' : 'space-around'},
            }
            const arr  = this.props.flex.split(' ').filter(item=>item!='')
            arr.map(item=>{Object.keys(flex[item]).map(val=>{obj[val] = flex[item][val]})})
        }
        if(obj.display == undefined){
            obj.float = 'left'
        }   
        return(
            <div    className = {obj.className} 
                    style={obj}
                    onClick = {this.props.onClick}
                    onTouchStart={this.props.onTouchStart}
                    onTouchEnd={this.props.onTouchEnd}
            >
                {this.props.children}
            </div>
        )
    }
}