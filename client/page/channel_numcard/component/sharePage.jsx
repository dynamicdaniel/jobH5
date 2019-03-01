import React from 'react';
import Bk from '../../../components/Bk/Bk'
class SharePage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            show:false,

        };
    }
    render() {

        return (
            <Bk onClick={()=>{this.props.close()}}>
                <Bk 
                    bgColor="#333" 
                    opacity="0.8" 
                    position='absolute'
                    img='https://ybimage.yishouyun.net/h5/bg_share.png'
                /> 
                
            </Bk>
            
        )
    }
}

export default SharePage