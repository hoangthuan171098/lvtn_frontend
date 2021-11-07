import React, { Component } from "react"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"

class SideBar extends Component{
    render(){
        return(
            <div className="SideBar">
                <nav class="pcoded-navbar menupos-fixed menu-light brand-blue ">
                    <div class="navbar-wrapper ">
                        <div class="navbar-brand header-logo">
                            <a href="index.html" class="b-brand">
                                <img src="/assets/images/logo.svg" alt="" class="logo images"/>
                                <img src="/assets/images/logo-icon.svg" alt="" class="logo-thumb images"/>
                            </a>
                            <a class="mobile-menu" id="mobile-collapse" href="#!">
                                {/* <span></span> */}
                            </a>
                        </div>
                        <div class="navbar-content scroll-div">
                            <ul class="nav pcoded-inner-navbar">
                                <li class="nav-item pcoded-menu-caption">
                                    <label>SHIPPER</label>
                                </li>
                                <li class="nav-item">
                                    <Link to='/shipment'>
                                        <i className="menu-icon fa fa-dashboard"></i>
                                        Dashboard
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="#">
                                        <i class="menu-icon fa fa-bullhorn"></i>
                                        Announts
                                    </Link>  
                                </li>
                                <li class="nav-item">
                                    <Link to="/shipment/list-shipments-orders">
                                        <i class="menu-icon fa fa-inbox"></i>
                                        Shipments
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default withRouter(SideBar)
