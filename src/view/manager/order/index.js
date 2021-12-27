import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import OrderList from "./manager";
import OrderInfo from "./info";
import OrderUpdate from "./update";

import "./style/index.scss";

export default class OrderProduct extends Component {
  render() {
    return (
      <div className="container-fuild">
      <div className="ManagerOrder">
        
          <div className="row align-items-center">
            <div className="col-12">
              <Switch>
                <Route exact path="/manager/orders" component={OrderList} />
                <Route
                  path="/manager/orders/:id/update"
                  component={OrderUpdate}
                />
                <Route path="/manager/orders/:id" component={OrderInfo} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
