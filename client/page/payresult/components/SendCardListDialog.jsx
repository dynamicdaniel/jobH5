import React, { Component } from 'react';
import Bk from '../../../components/Bk';

const btn_src = [
    "https://ybimage.yishouyun.net/ebay_h5/img/btn_pay_result_go_normal.png",
    "https://ybimage.yishouyun.net/ebay_h5/img/btn_pay_result_go_active.png",
]
export default class Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: true,
            btn_img: "https://ybstatic.yishouyun.net/ebay_h5/img/button_default.png",
            title: props.title == undefined ? '默认标题' : props.title,
            content: props.content == undefined ? '默认额外内容' : props.content,
            tempData:props.data==undefined?[]:props.data,
            height:document.documentElement.clientHeight
        }
    }

    componentDidMount() {

        const hei = `${document.documentElement.clientHeight}px`
        this.setState({
            height:hei
        })
        console.log(hei)
    }

    render() {
        const Quan = (props) => {
            return (
                <Bk img="https://ybstatic.yishouyun.net/ebay_h5/img/Quan.jpg" height="86px" marginTop="5px" marginBottom="2px">
                    <Bk width='28%' display="flex" justifyContent="center" alignItems="center">
                        <Bk height='90%' >
                            <Bk height="50%" display="flex" alignItems="flex-end" justifyContent="center">
                                <span style={{ color: '#dd0627', fontSize: '1.6em' }}>{props.data.quan_leftSide_title}</span>
                            </Bk>
                            <Bk height="50%" display="flex" alignItems="flex-start" justifyContent="center">
                                <span style={{ fontSize: '0.8em', color: '#333' }}>{props.data.quan_leftSide_content}</span>
                            </Bk>
                        </Bk>
                    </Bk>
                    {
                        props.data.get == true ?
                            <Bk width='72%' img="https://ybstatic.yishouyun.net/ebay_h5/img/yilingqu1.jpg" bgSize="76px 76px" bgPos="110% center">
                                <Bk width="85%">
                                    <Bk height="50%" display="flex" alignItems="flex-end" justifyContent="center">
                                        <span style={{ color: '#333', fontSize: '1.2em' }}>{props.data.quan_rightSide_content}</span>
                                    </Bk>
                                    <Bk height="50%" display="flex" justifyContent="center" >
                                        <Bk width="94%" display="flex" alignItems="center" justifyContent="center" fontSize='0.75em' color='#888'>{props.data.quan_rightSide_extra}</Bk>
                                    </Bk>
                                </Bk>
                            </Bk>
                            :
                            <Bk width='72%'>
                                <Bk width="85%">
                                    <Bk height="50%" display="flex" alignItems="flex-end" justifyContent="center">
                                        <span style={{ color: '#333', fontSize: '1.2em' }}>{props.data.quan_rightSide_content}</span>
                                    </Bk>
                                    <Bk height="50%" display="flex" justifyContent="center" >
                                        <Bk width="94%" display="flex" alignItems="center" justifyContent="center" fontSize='0.75em' color='#888'>{props.data.quan_rightSide_extra}</Bk>
                                    </Bk>
                                </Bk>
                                {/* <Bk width="15%" bgColor="#ffb63f" display="flex" alignItems="center" justifyContent="center"
                                    onClick={(e) => {


                                        let tmArr = this.state.tempData
                                        tmArr[props.data.index].get = true
                                        this.setState({
                                            tempData: tmArr
                                        })
                                    }}>
                                    <Bk height="90%" display="flex" alignItems="center" justifyContent="center" color="white" fontSize="1.1em">
                                        领<br />取
                                    </Bk>
                                </Bk> */}
                            </Bk>
                    }
                </Bk>
            )
        }

        const PopComm = (props) => (
            <Bk position="absolute" left="0px" top="0px">
                <Bk bgColor="#666" opacity="0.8"/>
                <Bk display="flex" justifyContent="center" alignItems="center" position="absolute" left="0px" top="0px" >
                    <Bk img="https://ybstatic.yishouyun.net/ebay_h5/img/poplingquan.jpg" width="90%" height="90%" >
                        <Bk  pointerEvents="auto" img="https://ybstatic.yishouyun.net/ebay_h5/img/closebtn.jpg" position="absolute" left="80%" top="5%" width="30px" height="30px"
                            onClick={() => {props.closePop()}} />
                        <Bk height="21%" width="100%" color="white">
                            <Bk height="60%" display="flex" alignItems="flex-end" justifyContent="center">
                                <span style={{ fontSize: '2em' }}>{this.state.title}</span>
                            </Bk>
                            <Bk height="40%" display="flex" alignItems="center" justifyContent="center">
                                <span style={{ fontSize: '1em' }}>{this.state.content}</span>
                            </Bk>
                        </Bk>
                        <Bk height="15%" width="100%" />
                        <Bk height="47%" width="100%" >
                            <Bk display="flex" justifyContent="center" alignItems="center">
                                <Bk id="container" width="82%" height="98%" overflowY='auto'>
                                    {
                                        props.data.map((item, index) => {
                                            return (<Quan key={index} data={item} />)
                                        })
                                    }
                                </Bk>
                            </Bk>
                        </Bk>
                        <Bk height="17%" width="100%" display="flex" justifyContent="center" alignItems="center">
                            <Bk img={this.state.btn_img} width="160px" height="42px"
                                onClick={() => {
                                    this.props.onGoBtnClick();
                                    // let tmArr = this.state.tempData
                                    // for (let i = 0; i < this.state.tempData.length; i++) {
                                    //     tmArr[i].get = true
                                    // }

                                    // this.setState({
                                    //     tempData: tmArr
                                    // })
                                    // this.setState({ btn_img: btn_src[1] }, () => {
                                    //     let clock = setTimeout(() => {
                                    //         clearTimeout(clock)
                                    //         this.setState({ btn_img: btn_src[0] })
                                    //     }, 80)
                                    // })
                                }} />
                        </Bk>
                    </Bk>
                </Bk>

            </Bk>
        )
        return (
            <div style={{ height: `${this.state.height}`,}}>
                {this.state.show == true ? <PopComm data={this.state.tempData} closePop={() => { this.setState({ show: false })}}/> : null}

            </div>
        )
    }
}
