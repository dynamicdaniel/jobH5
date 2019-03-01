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
        let dateStr = '';
        let dateInfo = this.props.cardInfo;
        if (dateInfo.dateType) {
            if (dateInfo.dateType == 'range') {
                dateStr = dateInfo.dateBegin + '  至 ' + dateInfo.dateEnd
            } else if (dateInfo.dateType == "regular") {
                dateStr = '购买后' + dateInfo.duration + '天内有效'
            }
        }
        this.setState({
            useOpera:this.props.cardInfo.description,
            useTime:dateStr
        })
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
                    <Bk width='320px' height="220px" display='flex' alignItems='center' marginTop={-60} borderRadius="6px">
                        <Bk img='https://ybimage.atogether.com/ebayh5/img/tishikuan.png'>
                            <Bk height="75%" marginTop='25%'>
                                <Bk height='30%'>
                                    <Bk width='40%' display='flex' justifyContent='center' alignItems='center' >
                                        使用说明
                                    </Bk>
                                    <Bk width='60%' display='flex' justifyContent='center' alignItems='center' >
                                    {this.state.useOpera}
                                    </Bk>
                                </Bk>
                                <Bk height='30%'>
                                    <Bk width='40%' display='flex' justifyContent='center' alignItems='center' >
                                        使用时间
                                    </Bk>
                                    <Bk width='60%' display='flex' justifyContent='center' alignItems='center' >
                                    {this.state.useTime}
                                    </Bk>
                                </Bk> 
                            </Bk>
                        </Bk>
                    </Bk>
                </Bk>
                
            </Bk>
            
        )
    }
}

export default Introduce
