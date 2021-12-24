import React, { Component } from "react"
import { Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import Cookie from "js-cookie"

class NavBar extends Component {

    logoutHandle = async (e) =>{
        e.preventDefault()
        this.props.logout()
        this.props.history.push('/login')
    }

    More = () =>{
        if(Cookie.get('username')){
          if(Cookie.get('role') === 'Admin'){
            return(
                <li className="drop-down"><Link to='/profile'>{Cookie.get('username')}</Link>
                  <ul className='dropdown-ul'>
                    <li><Link to='/admin'> ADMIN </Link></li>
                    <li><Link to='/manager'> MANAGER </Link></li>
                    <li><Link to='/profile'> PROFILE </Link></li>
                    <li><button onClick={(e)=>this.logoutHandle(e)} className="more-button"> LOG OUT</button></li>
                  </ul>
                </li>
            )
          }
          if(Cookie.get('role') === 'Shipper'){
            return(
                <li className="drop-down"><Link to='/profile'>{Cookie.get('username')}</Link>
                  <ul className='dropdown-ul'>
                    <li><Link to='/shipment'> SHIPMENT </Link></li>
                    <li><Link to='/profile'> PROFILE </Link></li>
                    <li><button onClick={(e)=>this.logoutHandle(e)} className="more-button"> LOG OUT</button></li>
                  </ul>
                </li>
            )
          }
          else if(Cookie.get('role') === 'Manager'){
            return(
                <li className="drop-down"><Link to='/profile'>{Cookie.get('username')}</Link>
                  <ul className='dropdown-ul'>
                    <li><Link to='/manager'> MANAGER </Link></li>
                    <li><Link to='/profile'> PROFILE </Link></li>
                    <li><button onClick={(e)=>this.logoutHandle(e)} className="more-button"> LOG OUT</button></li>
                  </ul>
                </li>
            )
          }
          return(
              <li className="drop-down"><Link to='/profile'>{Cookie.get('username')}</Link>
                <ul className='dropdown-ul'>
                  <li><Link to='/shopping-cart'> CART </Link></li>
                  <li><Link to='/purchase'> ORDER </Link></li>
                  <li><Link to='/profile'> PROFILE </Link></li>
                  <li><button onClick={(e)=>this.logoutHandle(e)} className="more-button"> LOG OUT</button></li>
                </ul>
              </li>
          );
        }
        return(
          <li><Link to='/login' className="login"><i className="icofont-login" /> lOGIN</Link></li>
        )
    }

    render() {
        if(Cookie.get('role')){
            let role = Cookie.get('role')
            if(role == 'Customer'){
                return( 
                    <div className="Navbar d-flex">
                        <div className="logo mr-auto">
                            <h2><Link to="/">TTD</Link></h2>
                        </div>
                        <nav className="nav-menu d-none d-lg-block">
                        <ul>
                            <li><Link to="/">TRANG CHỦ</Link></li>
                            <li><Link to="/about">GIỚI THIỆU</Link></li>
                            <li><Link to="/services">DỊCH VỤ</Link></li>
                            <li><Link to="/products">SẢN PHẨM</Link></li>
                            <li><Link to="/team">THÀNH VIÊN</Link></li>
                            <li><Link to="/news">TIN TỨC</Link></li>
                            <li> <Link to="/contact">LIÊN HỆ </Link></li>
                            {this.More()}
                        </ul>
                        </nav>
                    </div>
                )
            }
            else{
                return( 
                    <div className="Navbar d-flex">
                        <div className="logo mr-auto">
                            <h2><Link to="/">TTD</Link></h2>
                        </div>
                        <nav className="nav-menu d-none d-lg-block">
                        <ul>
                            {this.More()}
                        </ul>
                        </nav>
                    </div>
                )

            }
        }
        return (
            <div className="Navbar d-flex">
                <div className="logo mr-auto">
                    <h2><Link to="/">TTD</Link></h2>
                </div>
                <nav className="nav-menu d-none d-lg-block">
                <ul>
                    <li><Link to="/">TRANG CHỦ</Link></li>
                    <li><Link to="/about">GIỚI THIỆU</Link></li>
                    <li><Link to="/services">DỊCH VỤ</Link></li>
                    <li><Link to="/products">SẢN PHẨM</Link></li>
                    <li><Link to="/team">THÀNH VIÊN</Link></li>
                    <li><Link to="/news">TIN TỨC</Link></li>
                    <li> <Link to="/contact">LIÊN HỆ </Link></li>
                    {this.More()}
                </ul>
                </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
       isLogined: state.auth.username
    }
}

function mapDispatchToProps(dispatch){
    return{
        logout: () =>{
            dispatch({
                type: 'LOGOUT'
            })
        }
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(NavBar))