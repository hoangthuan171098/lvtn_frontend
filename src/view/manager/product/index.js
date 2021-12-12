import React, {Component} from 'react'
import {Route,Switch} from 'react-router-dom'
import ProductList from './list'
import ProductInfo from './info'
import ProductCreate from './create'
import ProductUpdate from './update'

import './style/index.scss'


export default class ManagerProduct extends Component{
    render(){
        return(
            <div className="ManagerProduct">
                <Switch>
                    <Route exact path='/manager/products' component={ProductList} />
                    <Route path='/manager/products/create' component={ProductCreate} />
                    <Route path='/manager/products/:id/update' component={ProductUpdate} />
                    <Route path='/manager/products/:id' component={ProductInfo} />
                </Switch>
            </div>
        )
    }
}
