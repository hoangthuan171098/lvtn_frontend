import React, {Component} from 'react'
import {Route,Switch} from 'react-router-dom'
import AccountList from './list'
import AccountInfo from './info'
import AccountCreate from './create'
import AccountUpdate from './update'

import './style/index.scss'

export default class ManagerCustomer extends Component{
    render(){
        return(
            <div className="ManagerCustomer">
                <Switch>
                    <Route exact path='/manager/customers' component={AccountList} />
                    <Route path='/manager/customers/create' component={AccountCreate} />
                    <Route path='/manager/customers/:id/update' component={AccountUpdate} />
                    <Route path='/manager/customers/:id' component={AccountInfo} />
                </Switch>
            </div>
        )
    }
}
