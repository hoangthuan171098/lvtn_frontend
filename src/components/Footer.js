import React, { Component } from "react";
import Cookie from 'js-cookie';

export default class Footer extends Component {
  
  render() {
    if(Cookie.get("role") === "Manager" || Cookie.get("role") === "Admin" || Cookie.get("role") === "Shipper"  ){
      return(<></>)
    }
    else{
      return (
        <footer className="footer" style={{marginTop:100 + 'px'}}>
          <div className="grid wide footer__content">
            <div className="row">
              <div className="col l-2-4 m-4 c-6">
                <h3 className="footer__heading">CHĂM SÓC KHÁCH HÀNG</h3>
                <ul className="footer-list">
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Trung Tâm Trợ Giúp</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Hướng Dẫn Mua Hàng</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Chính Sách Vận Chuyển</a>
                  </li>
                </ul>
              </div>
              <div className="col l-2-4 m-4 c-6">
                <h3 className="footer__heading">VỀ CHÚNG TÔI</h3>
                <ul className="footer-list">
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Giới Thiệu Về Shop</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Tuyển Dụng</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Điều Khoản Shop</a>
                  </li>
                </ul>
              </div>
              <div className="col l-2-4 m-4 c-6">
                <h3 className="footer__heading">DANH MỤC</h3>
                <ul className="footer-list">
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Kate</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Jeans</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">Cotton</a>
                  </li>
                </ul>
              </div>
              <div className="col l-2-4 m-4 c-6">
                <h3 className="footer__heading">THEO DÕI CHÚNG TÔI TRÊN</h3>
                <ul className="footer-list">
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">
                      <i className="footer-item__icon fab fa-facebook-square" />
                      Facebook</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">
                      <i className="footer-item__icon fab fa-instagram-square" />
                      Instagram</a>
                  </li>
                  <li className="footer-item">
                    <a href="#" className="footer-item__link">
                      <i className="footer-item__icon fab fa-linkedin" />
                      Linkedin</a>
                  </li>
                </ul>
              </div>
              
            </div>
          </div>
          <div className="footer__bottom">
            <div className="grid wide">
              <p className="footer__text">
                © 2021 LVTN Đề tài quản lý đơn hàng bán vải
              </p>
            </div>
          </div>
        </footer>
      );
    }
  }
}
