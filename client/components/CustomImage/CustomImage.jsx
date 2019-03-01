import React, { Component } from 'react';
import cx from 'classnames';
import './CustomImage.css';

const IMAGE_PREFIX = 'https://ybimage.yishouyun.net/h5/image/';

export default class CustomImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            value: nextProps.value
        });
    };

    render() {
        let {cls} = this.props;
        let clsArray = cls.split(' ');
        let clsObj = {};
        for(let i= 0 ; i<clsArray.length; i++){
            clsObj[clsArray[i]] = true
        }

        return (
            <img
                src={`${IMAGE_PREFIX}${this.state.value}.png`}
                className={cx(Object.assign(clsObj || {}, {
                    'custom-image': true
                }))}
            />
        )
    }
}
