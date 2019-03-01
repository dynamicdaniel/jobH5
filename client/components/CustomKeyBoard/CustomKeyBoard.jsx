import React, {Component} from 'react';
import './CustomKeyBoard.css';

export default class componentName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }


    componentDidMount = () => {
        this.setState({
            show: true
        });
    };


    onNumInput = (value) => {
        if(this.props.onNumInput){
            this.props.onNumInput(value);
        }
    };

    onConfirm = () => {
        if(this.props.onConfirm){
            this.props.onConfirm();
        }
    };

    render() {
        return (
            <div className='custom-keyboard' style={{display: this.state.show ? 'flex': 'none'}}>
                <div className='num-node'>
                    <div className='num-row-node'>
                        <div className='num' onClick={() => this.onNumInput(1)}>1</div>
                        <div className='num' onClick={() => this.onNumInput(2)}>2</div>
                        <div className='num' onClick={() => this.onNumInput(3)}>3</div>
                    </div>
                    <div className='num-row-node'>
                        <div className='num' onClick={() => this.onNumInput(4)}>4</div>
                        <div className='num' onClick={() => this.onNumInput(5)}>5</div>
                        <div className='num' onClick={() => this.onNumInput(6)}>6</div>
                    </div>
                    <div className='num-row-node'>
                        <div className='num' onClick={() => this.onNumInput(7)}>7</div>
                        <div className='num' onClick={() => this.onNumInput(8)}>8</div>
                        <div className='num' onClick={() => this.onNumInput(9)}>9</div>
                    </div>
                    <div className='num-row-node'>
                        <div className='num num-two' onClick={() => this.onNumInput(0)}>0</div>
                        <div className='num' onClick={() => this.onNumInput('.')}>.</div>
                    </div>
                </div>
                <div className='operate-node'>
                    <div className='return-btn' onClick={() => this.onNumInput(-1)}>
                        <img src='http://ybimage.yishouyun.net/h5/keybord-return.png'
                            className='keybord-img' />
                    </div>
                    <div className='confirm-btn' onClick={() => this.onConfirm()}>
                        <div>确认</div>
                        <div>支付</div>
                    </div>
                </div>
            </div>
        )
    }
}
