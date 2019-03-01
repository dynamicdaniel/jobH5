import React from 'react';
import Bk from '../../../components/Bk/Bk'


class Introduce extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            show:false,
            useOpera:'',
            useTime:''
        };
    }

    componentDidMount() {
    }
    render() {

        return (
            <Bk onClick={()=>{this.props.close()}}>
                <Bk 
                    bgColor="#333" 
                    opacity="0.8" 
                    position='absolute'
                /> 
                <Bk position='absolute'
                    display="flex"
                    justifyContent="center" 
                    alignItems='center' 
                    zIndex='2'
                >
                    <Bk width='240px' height="160px" display='flex' alignItems='center' marginTop={-60} borderRadius="6px">
                        <Bk img='https://ybimage.atogether.com/ebayh5/img/tishikuan.png' display='flex' alignItems='center'>
                            <Bk height='40%' display='flex' flexWrap='wrap' alignItems='center' justifyContent='center' color='#555' fontSize='1.15em' marginTop='15px'>
                                <Bk height='auto' align='center'>该面额已达最大充值次数</Bk>
                                <Bk height='auto' align='center'>请选择其他充值面额</Bk>
                            </Bk>
                            
                        </Bk>
                    </Bk>
                </Bk>
                
            </Bk>
            
        )
    }
}

export default Introduce
