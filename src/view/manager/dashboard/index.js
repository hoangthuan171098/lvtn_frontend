import React, {Component} from 'react'
import {Route,Switch} from 'react-router-dom'
import List from './list'


export default class DashBoards extends Component{
    render(){
        return(
            <div className="ManagerWarehouse">
                <Switch>
                    <Route exact path='/manager/dashboards' component={List} />
                </Switch>
            </div>
        )
    }
}
