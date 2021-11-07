import React, {Component} from 'react'
import {Route, Switch } from 'react-router-dom'

import SideBar from './components/SideBar'
import Header from './components/Header'

import './style/index.scss'

import ShipmentList from './list'
import ShipmentInfo from './info'
import AnnountList from './Annount/list'
import AnnountInfo from './Annount/info'

class Shipment extends Component{ 
    render(){
        return(
            <div className='Shipment'>
                <SideBar/>
                <Header />
                <div className='content'>
                    <Switch>  
                        <Route exact path='/shipment' component={DashBoard} />
                        <Route path='/shipment/list-shipments-orders' component={ShipmentList} />
                        <Route path='/shipment/shipments-orders/:id' component={ShipmentInfo}/>
                        <Route path='/shipment/annount-list' component={AnnountList} />
                        <Route path='/shipment/annount-item/:id' component={AnnountInfo} />
                    </Switch>
                </div>
            </div>
        )
    } 
}

class DashBoard extends Component{
    render(){
        return(
            <div>This is dashBoard</div>
        )
    }
}

export default Shipment
