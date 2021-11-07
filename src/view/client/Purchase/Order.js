import React, { Component } from "react";
import "../style/order.scss";
import {Switch,Route} from "react-router-dom";
import Account from "./Account";
import Listorder from "./Listorder";
import Nav from "./component/Nav";
import OrderlistDetail from "./OrderlistDetail";
import Cookie from "js-cookie";
import Location from "./Location";
import Paymentinfo from "./Paymentinfo";
import Paymentdetail from "./Paymentdetail";
import Profileuser from "./Profileuser";
import ChangePass from "./ChangePass";
export default class Order extends Component {
  render() {
    
    return (
      <div className="container-fluid">
          <div className="container_layout">
            <div className="Account_sidebar">
                <div className="Account_avatar">
                  <div className="info">
                  
                    <strong></strong>
                  </div>
                </div>
                <Nav />
            </div>

              <Switch>
                    <Route path='/purchase' exact component={Listorder} />
                    <Route path='/purchase/password' component={ChangePass} />
                    <Route path='/purchase/profile' component={Profileuser} />
                    <Route path='/purchase/loca'  component={Location} />
                    <Route path='/purchase/user'  component={Account} />
                    <Route path='/purchase/paymentinfo' component={Paymentinfo} />
                    <Route path='/purchase/payment/:id' component={Paymentdetail} />
                    <Route path='/purchase/:id'  component={OrderlistDetail} />
               </Switch> 
          </div>
      </div>
    );
  }
}