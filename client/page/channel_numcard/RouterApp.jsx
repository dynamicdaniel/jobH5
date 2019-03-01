import React from 'react'
import { BrowserRouter, Route} from 'react-router-dom';
import ChannelNumCard from './numberCard';   
import ChannelNumcardDetail from './channelNumcardDetail';
//import ScoreShop from '../scoreshop/scoreshop'

export default class RouterApp extends React.Component {
      constructor(props){
            super(props);
      }
      componentDidMount(){
            //console.log('RouterApp')
           // console.log('props:',this.props)
      }

    render() {
        return (
            <BrowserRouter>
                  <div>
                        <Route path='/channelNumCard' render={(props) => <ChannelNumCard info={this.props.info} {...props}/>}/>
                        <Route path='/channelNumcardDetail' render={(props) => <ChannelNumcardDetail info={this.props.info} {...props}/>}/>
                        {/*<Route path='/topbar' render={(props) => <Topbar info={this.props.info} {...props}/>}/>*/}
                        {/* <Route path='/scoreshop' render={(props) => <ScoreShop info={this.props.info} {...props}/>}/> */}
                  </div>
            </BrowserRouter>
        )
    }
}