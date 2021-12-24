import React, { Component } from "react";
import "./styles/header.scss";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Cookie from "js-cookie";
import axios from 'axios'
class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      note: "",
      productList: [],
      notifications: []
    };
  }
  logoutHandle = async (e) => {
    e.preventDefault();
    this.props.logout();
    this.props.history.push("/login");
  };

  getData = async ()=>{
		await axios
      .get(process.env.REACT_APP_BACKEND_URL + '/notifications?to='+Cookie.get('id'),{
          headers: {
              'Authorization':'bearer '+ Cookie.get('token'),
          }
      })
      .then(res=>{
          this.setState({notifications: res.data})
      })
	}

  allReadClick = (event) =>{
    event.preventDefault()
    for(let i=0;i < this.state.notifications.length; i++){
      if(!this.state.notifications[i].isread){
        axios
          .put(process.env.REACT_APP_BACKEND_URL + '/notifications/' + this.state.notifications[i].id,{
            isread: true
          },{
              headers: {
                'Authorization':'bearer '+ Cookie.get('token'),
              }
          })
      }
    }
  }
  
  async componentDidMount() {
    this.getData()
    this.myInterval = setInterval(() => this.getData(),4000)
    if (Cookie.get("cart")) {
      let itemListString = Cookie.get("cart");

      if (typeof itemListString === "string" && itemListString !== undefined) {
        let itemList = JSON.parse(itemListString);
        this.setState({ productList: itemList });
      }
    } else {
      this.setState({ productList: [] });
    }
  }

  componentWillUnmount(){
		clearInterval(this.myInterval)
	}

  numberOfNotifications = () =>{
    let result = 0
    result = this.state.notifications.filter(item=>!item.isread).length
    return this.state.notifications.filter(item=>!item.isread).length
  }

  More = () => {
    if (Cookie.get("username")) {
      if (Cookie.get("role") === "Admin") {
        return (
          <li className="header__navbar-item header__navbar-user">
            <img
              src="./assets/img/user_avatar.png"
              alt=""
              className="header__navbar-user-img"
            />
            <span className="header__navbar-user-name">
              {Cookie.get("username")}
            </span>
            <ul className="header__navbar-user-menu">
              <li className="header__navbar-user-item">
                <Link to="/profile">Tài khoản của tôi</Link>
              </li>
              <li className="header__navbar-user-item">
                <Link to="/manager"> Quản lý </Link>
              </li>
              <li className="header__navbar-user-item">
                <Link to="/admin"> Quản trị </Link>
              </li>
              <li className="header__navbar-user-item header__navbar-user-item--separate">
                <Link onClick={(e) => this.logoutHandle(e)}>Đăng xuất</Link>
              </li>
            </ul>
          </li>
        );
      }
      if (Cookie.get("role") === "Shipper") {
        return (
          <li className="header__navbar-item header__navbar-user">
            <img
              src="./assets/img/user_avatar.png"
              alt=""
              className="header__navbar-user-img"
            />
            <span className="header__navbar-user-name">
              {Cookie.get("username")}
            </span>
            <ul className="header__navbar-user-menu">
              <li className="header__navbar-user-item">
                <Link to="/profile">Tài khoản của tôi</Link>
              </li>
              <li className="header__navbar-user-item">
                <Link to="/shipment"> Đơn giao hàng </Link>
              </li>

              <li className="header__navbar-user-item header__navbar-user-item--separate">
                <Link onClick={(e) => this.logoutHandle(e)}>Đăng xuất</Link>
              </li>
            </ul>
          </li>
        );
      } else if (Cookie.get("role") === "Manager") {
        return (
          <li className="header__navbar-item header__navbar-user">
            <img
              src="./assets/img/user_avatar.png"
              alt=""
              className="header__navbar-user-img"
            />
            <span className="header__navbar-user-name">
              {Cookie.get("username")}
            </span>
            <ul className="header__navbar-user-menu">
              <li className="header__navbar-user-item">
                <Link to="/profile">Tài khoản của tôi</Link>
              </li>
              <li className="header__navbar-user-item">
                <Link to="/manager"> Quản lý </Link>
              </li>
              <li className="header__navbar-user-item header__navbar-user-item--separate">
                <Link onClick={(e) => this.logoutHandle(e)}>Đăng xuất</Link>
              </li>
            </ul>
          </li>
        );
      }
      return (
        <li className="header__navbar-item header__navbar-user">
          <img
            src="data:image/png;base64,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"
            alt=""
            className="header__navbar-user-img"
          />
          <span className="header__navbar-user-name">
            {Cookie.get("username")}
          </span>
          <ul className="header__navbar-user-menu">
            <li className="header__navbar-user-item">
              <Link to="/purchase/profile">Tài khoản của tôi</Link>
            </li>
            <li className="header__navbar-user-item">
              <Link to="/shopping-cart"> Giỏ hàng </Link>
            </li>
            <li className="header__navbar-user-item">
              <Link to="/purchase"> Đơn hàng </Link>
            </li>
            <li className="header__navbar-user-item header__navbar-user-item--separate">
              <Link onClick={(e) => this.logoutHandle(e)}>Đăng xuất</Link>
            </li>
          </ul>
        </li>
      );
    }
    return (
      <>
        <Link to="/register">
          <li class="header__navbar-item header__navbar-item--strong header__navbar-item--separate">
            Đăng ký
          </li>
        </Link>
        <Link to="/login">
          <li class="header__navbar-item header__navbar-item--strong">
            Đăng Nhập
          </li>
        </Link>
      </>
    );
  };
  render() {
    if(Cookie.get("role") === "Manager" || Cookie.get("role") === "Admin" || Cookie.get("role") === "Shipper"  ){
      return(<></>)
    }

    var lenght = 0;
    return (
      <header className="header">
        <div className="grid wide">
          <nav className="header__navbar hide-on-mobile-tablet">
            <ul className="header__navbar-list">
              <li className="header__navbar-item header__navbar-item--has-qr header__navbar-item--separate">
                Cửa hàng shopping SSS+
              </li>
              <li className="header__navbar-item">
                <span className="header__navbar-title--no-pointer">
                  Kết nối
                </span>
                <a href className="header__navbar-icon-link">
                  <i className="header__navbar-icon fab fa-facebook" />
                </a>
                <a href className="header__navbar-icon-link">
                  <i className="header__navbar-icon fab fa-instagram" />
                </a>
              </li>
            </ul>
            <ul className="header__navbar-list">
              <li className="header__navbar-item header__navbar-item--has-notify">
                <a href className="header__navbar-item-link">
                  <i className="header__navbar-icon far fa-bell" />
                  <span className="header__cart-notice" style={{position:"initial"}}>
                    {this.state.notifications.filter(item=>!item.isread).length}
                  </span>
                  Thông báo
                </a>
                <div className="header__notify">
                  <header className="header__notify-header">
                    <h3>Thông báo mới nhận 
                      <span style={{color:'blue',cursor:'pointer'}}
                      onClick={(event)=>this.allReadClick(event)}
                      >Đọc tất cả</span>
                    </h3>
                  </header>
                  <ul className="header__notify-list">
                    {this.state.notifications
                    .sort((a,b)=>(new Date(b.updatedAt.slice(0,19)+'Z')) - (new Date(a.updatedAt.slice(0,19)+'Z')))
                    .slice(0,6)
                    .map((notification,index)=>{
											return(
                        <li className={notification.isread? "header__notify-item":"header__notify-item gray-bg"}>
                          <a href className="header__notify-link">
                            <div className="header__notify-info">
                              <span className="header__notify-name">
                                <strong>{notification.title}</strong>
                              </span>
                              <span className="header__notify-description">
                                {notification.content}
                              </span>
                            </div>
                          </a>
                        </li>
											)
										})}

                    {/* <li className="header__notify-item">
                      <a href className="header__notify-link">
                        <img
                          src="https://img.tickid.vn/photos/resized/200x120/83-1576046204-myphamohui-lgvina.png"
                          alt=""
                          className="header__notify-img"
                        />
                        <div className="header__notify-info">
                          <span className="header__notify-name">
                            Sale Sốc bộ dưỡng Ohui The First Tái tạo trẻ hóa da
                            SALE OFF 70%
                          </span>
                          <span className="header__notify-description">
                            Siêu sale duy nhất 3 ngày 11-13/12/2019
                          </span>
                        </div>
                      </a>
                    </li> */}
                  </ul>
                  <div className="header__notify-footer">
                    <a href className="header__notify-footer-btn">
                      Xem tất cả
                    </a>
                  </div>
                </div>
              </li>
              <li className="header__navbar-item">
                <a href className="header__navbar-item-link">
                  <i className="header__navbar-icon far fa-question-circle" />
                  Trợ giúp
                </a>
              </li>
              {/* <li
                  class="header__navbar-item header__navbar-item--strong header__navbar-item--separate"
                >
                  Đăng ký
                </li>
                <li class="header__navbar-item header__navbar-item--strong">
                  Đăng Nhập
                </li> */}
              {this.More()}
            </ul>
          </nav>
          {/* Header with Search */}
          <div className="header-with-search">
            <label
              htmlFor="mobile-search-checkbox"
              className="header__mobile-search"
            >
              <i className="header__mobile-search-icon fas fa-search" />
            </label>
            {/* Header Logo */}
            <div className="header__logo hide-on-tablet">
              <a href="/" className="header__logo-link">
                <h3 style={{fontSize:30 + 'px'
                , color:'#fff'
                }}>SSS+ Shop</h3>
              </a>
            </div>
            <input
              type="checkbox"
              hidden
              id="mobile-search-checkbox"
              className="header__search-checkbox"
            />
            {/* Header Search */}
            <ul className="navbar__list">
              <Link to="/">
                <li className="navbar__item"> Trang chủ</li>
              </Link>
              <Link to="/about">
                {" "}
                <li className="navbar__item">Giới thiệu</li>
              </Link>
              <Link to="/services">
                {" "}
                <li className="navbar__item">Dịch vụ</li>
              </Link>
              <Link to="/products">
                <li className="navbar__item">Sản phẩm</li>
              </Link>
              <Link to="/team">
                <li className="navbar__item">Thành viên</li>
              </Link>
              <Link to="/news">
                <li className="navbar__item">Tin tức</li>
              </Link>
            </ul>
            {/* Cart layout */}
            {this.state.productList.map((item, index) => {
              
              lenght = lenght + 1;
            })}
            <div className="header__cart">
              <div className="header__cart-wrap">
                <i className="header__cart-icon fas fa-shopping-cart" />
                <span className="header__cart-notice">{Cookie.get('cart')? lenght : 0}</span>
                {/* No cart : header__cart-list--no-cart */}

                <div className="header__cart-list ">
                  {/* Nocart */}

                  <img
                    src="./assets/img/no-cart.png"
                    alt="No Cart"
                    className="header__cart-no-cart-img"
                  />
                  <span className="header__cart-list-no-cart-msg">
                    Chưa có sản phẩm
                  </span>
                  {/* Hascart */}
                  <h4 className="header__cart-heading">Sản phẩm đã thêm</h4>
                  {/* Cart item */}
                  <ul className="header__cart-list-item">
                    {this.state.productList.map((item, index) => {
                      if (Cookie.get("cart")) {
                        return (
                          <li className="header__cart-item">
                            <img
                              src={
                                process.env.REACT_APP_BACKEND_URL +
                                item.product.image.url
                              }
                              alt=""
                              className="header__cart-img"
                            />
                            <div className="header__cart-item-info">
                              <div className="header__cart-item-head">
                                <h5 className="header__cart-item-name">
                                  {item.product.name}
                                </h5>
                                <div className="header__cart-item-price-wrap">
                                  <span className="header__cart-item-price">
                                    {item.quantity * item.product.price}đ
                                  </span>
                                  <span className="header__cart-item-multiply" />
                                  <span className="header__cart-item-qnt">
                                    {item.quantity} cuộn
                                  </span>
                                  <span className="header__cart-item-multiply">
                                    x
                                  </span>
                                  <span className="header__cart-item-qnt">
                                    {item.quantity_m} mét
                                  </span>
                                </div>
                              </div>
                              <div className="header__cart-item-body">
                                <span className="header__cart-item-description"></span>
                                <span className="header__cart-item-remove">
                                  Xóa
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      }
                    })}
                  </ul>
                  <Link
                    to="/shopping-cart"
                    href="!#"
                    className="header__cart-view-cart btn btn--primary"
                  >
                    Xem giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul className="header__sort-bar">
          <li className="header__sort-item">
            <a href className="header__sort-link">
              Liên Quan
            </a>
          </li>
          <li className="header__sort-item header__sort-item--active">
            <a href className="header__sort-link">
              Mới Nhất
            </a>
          </li>
          <li className="header__sort-item">
            <a href className="header__sort-link">
              Bán chạy
            </a>
          </li>
          <li className="header__sort-item">
            <a href className="header__sort-link">
              Giá
            </a>
          </li>
        </ul>
      </header>
    );
  }
}
function mapStateToProps(state) {
  return {
    isLogined: state.auth.username,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => {
      dispatch({
        type: "LOGOUT",
      });
    },
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topbar));
