import React, {Component} from 'react'
import {Route, Switch, Redirect } from 'react-router-dom'
import Cookie from 'js-cookie'
import { toast } from 'react-toastify'

import ManagerOrder from './order'
import ManagerShipment from './shipment'
import ManagerChat from './chat'
import ManagerWarehouse from './warehouse'
import ManagerCustomer from './customer'
import ManagerProduct from './product'
import Profileuser from './components/Profileuser'
import DashBoards from './dashboard'

import SideBar from './components/SideBar'
import Header from './components/Header'

import './style/index.scss'
import './style/style.scss'


class Manager extends Component{
    render(){
        if(Cookie.get('role')!=='Admin' && Cookie.get('role')!=='Manager'){
            toast.warning('You need to login Manager account!')
            return(
                <Redirect to='/'/>
            )
        }
        return(
            <div className='Manager'>
                <SideBar/>
                <Header/>
                <div className='content'>
                    <Switch>
                        <Route exact path='/manager' component={ManagerOrder} />
                        <Route path='/manager/dashboard' component={DashBoards} />
                        <Route path='/manager/orders' component={ManagerOrder} />
                        <Route path='/manager/shipments' component={ManagerShipment} />
                        <Route path='/manager/customers' component={ManagerCustomer} />
                        <Route path='/manager/warehouse' component={ManagerWarehouse} />
                        <Route path='/manager/products' component={ManagerProduct} />
                        <Route path='/manager/chat' component={ManagerChat} />
                        <Route path='/manager/profile' component={Profileuser} />
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

export default Manager
