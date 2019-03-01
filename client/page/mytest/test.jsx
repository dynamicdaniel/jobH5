import React, { Component } from 'react';

class MyTest extends Component {
    constructor(props) {
        super(props);

        this.state = {};
   
    }

    componentDidMount(){
          console.log(this.props)
          console.log('myTest')
    }
    render() {
        return (
            <div>
                MyTest
            </div>
        )
    }
}
export default MyTest