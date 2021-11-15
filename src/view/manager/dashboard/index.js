import React, {Component} from 'react'
import {Route,Switch} from 'react-router-dom'
import List from './list'


export default class DashBoards extends Component{
    render(){
        return(
            <div className="ManagerDashboard">
                <Switch>
                    <Route exact path='/manager/dashboard' component={List} />
                </Switch>
            </div>
        )
    }
}
