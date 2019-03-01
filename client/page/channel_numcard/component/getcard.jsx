import React from 'react';
import Bk from '../../../components/Bk/Bk'
class Getcard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            show:false,

        };
    }
    render() {

        return (
            <Bk>
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
                    <Bk width='90%' height="auto">
                        <Bk height="280px" borderRadius="6px" bgColor='white'>
                            <Bk height='auto' color='#ef7460' fontSize='1.3em' align='center' marginTop='8%'>
                                恭喜获得{this.props.timesCardNum}{this.props.timesCardUnit}{this.props.timesCardName}次卡
                            </Bk>
                            <Bk height='110px' display='flex' justifyContent='center' marginTop='5%'>
                                <Bk width='120px' img="https://ybimage.atogether.com/ebayh5/img/liwu.png"/>
                            </Bk>
                            <Bk height='auto' display='flex' justifyContent='center' marginTop='10%'>
                                <Bk width='50%' 
                                    height='2.2em' 
                                    display='flex' 
                                    justifyContent='center' 
                                    alignItems='center' 
                                    color='white' 
                                    fontSize='1.1em'
                                    borderRadius='50px'
                                    bgColor='#ef7460'
                                    onClick={()=>{this.props.getCard()}}
                                    >
                                    立 即 领 取
                                </Bk>
                            </Bk>
                              
                        </Bk>
                        <Bk height='auto' display='flex' justifyContent='center' marginTop={30}> 
                            <Bk width='35px' height='35px' img='https://ybimage.atogether.com/close.png'
                                onClick={()=>{
                                    this.props.close()
                                }}
                            ></Bk>
                        </Bk> 
                    </Bk>
                    
                </Bk>
                
            </Bk>
            
        )
    }
}

export default Getcard