import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Checkout extends Component {
  render() {
    return (
      <div>
        <div className="breacrumb-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-text product-more">
                  <Link to="/">
                    <i className="fa fa-home" /> Home
                  </Link>
                  <Link to="/products">Shop</Link>
                  <span>Check Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Section Begin */}
        {/* Shopping Cart Section Begin */}

        <section className="checkout-section spad">
          <div className="container">
            <form action="#" className="checkout-form">
              <div className="row">
                <div className="col-lg-6">
                  <div className="checkout-content">
                    <Link to="/login" className="content-btn">
                      Click Here To Login
                    </Link>
                  </div>
                  <h4>Biiling Details</h4>
                  <div className="row">
                    <div className="col-lg-6">
                      <label htmlFor="fir">
                        First Name<span>*</span>
                      </label>
                      <input type="text" id="fir" />
                    </div>
                    <div className="col-lg-6">
                      <label htmlFor="last">
                        Last Name<span>*</span>
                      </label>
                      <input type="text" id="last" />
                    </div>
                    <div className="col-lg-12">
                      <label htmlFor="cun-name">Company Name</label>
                      <input type="text" id="cun-name" />
                    </div>
                    <div className="col-lg-12">
                      <label htmlFor="cun">
                        Country<span>*</span>
                      </label>
                      <input type="text" id="cun" />
                    </div>
                    <div className="col-lg-12">
                      <label htmlFor="street">
                        Street Address<span>*</span>
                      </label>
                      <input type="text" id="street" className="street-first" />
                      <input type="text" />
                    </div>
                    <div className="col-lg-12">
                      <label htmlFor="zip">Postcode / ZIP (optional)</label>
                      <input type="text" id="zip" />
                    </div>
                    <div className="col-lg-12">
                      <label htmlFor="town">
                        Town / City<span>*</span>
                      </label>
                      <input type="text" id="town" />
                    </div>
                    <div className="col-lg-6">
                      <label htmlFor="email">
                        Email Address<span>*</span>
                      </label>
                      <input type="text" id="email" />
                    </div>
                    <div className="col-lg-6">
                      <label htmlFor="phone">
                        Phone<span>*</span>
                      </label>
                      <input type="text" id="phone" />
                    </div>
                    <div className="col-lg-12">
                      <div className="create-item">
                        <label htmlFor="acc-create">
                          Create an account?
                          <input type="checkbox" id="acc-create" />
                          <span className="checkmark" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="checkout-content">
                    <input type="text" placeholder="Enter Your Coupon Code" />
                  </div>
                  <div className="place-order">
                    <h4>Your Order</h4>
                    <div className="order-total">
                      <ul className="order-table">
                        <li>
                          Product <span>Total</span>
                        </li>
                        <li className="fw-normal">
                          Combination x 1 <span>60.000 VNĐ</span>
                        </li>
                        <li className="fw-normal">
                          Combination x 1 <span>60.000 VNĐ</span>
                        </li>
                        <li className="fw-normal">
                          Combination x 1 <span>120.000 VNĐ</span>
                        </li>
                        <li className="fw-normal">
                          Subtotal <span>240.000 VNĐ</span>
                        </li>
                        <li className="total-price">
                          Total <span>240.00 VNĐ</span>
                        </li>
                      </ul>
                      <div className="payment-check">
                        <div className="pc-item">
                          <label htmlFor="pc-check">
                            Cheque Payment
                            <input type="checkbox" id="pc-check" />
                            <span className="checkmark" />
                          </label>
                        </div>
                        <div className="pc-item">
                          <label htmlFor="pc-paypal">
                            Paypal
                            <input type="checkbox" id="pc-paypal" />
                            <span className="checkmark" />
                          </label>
                        </div>
                      </div>
                      <div className="order-btn">
                        <button type="submit" className="site-btn place-btn">
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }
}
