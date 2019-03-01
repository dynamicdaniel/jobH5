import React from 'react';
import Bk from '../../components/Bk/Bk'

class TestSvc extends React.Component {

      constructor(props) {
        super(props);
        this.state = {

        }

      }
      componentDidMount(){
            console.log(this.props)
      }
     
      render = () => {
        return (
            <Bk>
              test 
            </Bk>
            
        );
      }
}


export default TestSvc