import React from 'react';
import Bk from '../../../../components/Bk/Bk'


class Activecard extends React.Component {

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
                    <Bk width='300px' height="auto">
                        <Bk height="310px" display='flex' alignItems='center' marginTop={-80} borderRadius="6px">
                            <Bk img='https://ybimage.atogether.com/ebayh5/img/jihuo.png'>
                            <Bk height='60%' marginTop='40%'>
                                    <Bk height='70%' display='flex' justifyContent='center' alignItems='center' >
                                        <Bk width='auto' height="auto" display='flex' flexWrap='wrap' fontSize='1.3em'>
                                            <Bk height="auto" align='center'>会 员 卡 未 激 活</Bk>
                                            <Bk height="auto" align='center' marginTop='15px'>领 取 前 请 先 激 活 会 员 卡</Bk>
                                        </Bk>
                                    </Bk>
                                    <Bk height='30%' display='flex' justifyContent='center' alignItems='flex-start'>
                                    <Bk width='50%' 
                                            height='2.2em' 
                                            display='flex' 
                                            justifyContent='center' 
                                            alignItems='center' 
                                            color='white' 
                                            fontSize='1.1em'
                                            borderRadius='50px'
                                            bgColor='#f6a623'
                                            onClick={()=>{window.location.assign(this.props.activeURL)}}
                                            >立 即 激 活     
                                        </Bk>
                                    </Bk>     
                            </Bk>
                            </Bk>
                        </Bk>
                        <Bk height='auto' display='flex' justifyContent='center' marginTop={30}> 
                            <Bk width='35px' height='35px' img='https://ybimage.atogether.com/close.png'
                                onClick={()=>{this.props.close()}}
                            ></Bk>
                        </Bk> 
                    </Bk>
                    
                </Bk>
                
            </Bk>
            
        )
    }
}

export default Activecard
