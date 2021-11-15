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
                                    <label>MANAGER</label>
                                </li>
                                <li class="nav-item">
                                    <Link to="/manager/dashboard" class="nav-link"><span class="pcoded-micon"><i class="fa fa-home"></i></span><span class="pcoded-mtext">DASHBOARD</span></Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/manager/orders" class="nav-link"><span class="pcoded-micon"><i class="fa fa-navicon"></i></span><span class="pcoded-mtext">ĐƠN HÀNG</span></Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/manager/shipments" class="nav-link"><span class="pcoded-micon"><i class="fa fa-truck"></i></span><span class="pcoded-mtext">GIAO HÀNG</span></Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/manager/customers" class="nav-link"><span class="pcoded-micon"><i class="fa fa-user"></i></span><span class="pcoded-mtext">KHÁCH HÀNG</span></Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/manager/warehouse" class="nav-link"><span class="pcoded-micon"><i class="fa fa-cubes"></i></span><span class="pcoded-mtext">KHO HÀNG</span></Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/manager/chat" class="nav-link"><span class="pcoded-micon"><i class="fa fa-comments"></i></span><span class="pcoded-mtext">CHAT</span></Link>
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
