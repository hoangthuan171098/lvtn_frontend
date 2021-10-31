import React, { Component } from "react";
import "./../style/payment.scss";
import Cookie from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import emailjs from "emailjs-com";
import { withRouter } from "react-router";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../style/modal.scss";
import { ToastContainer, toast } from "react-toastify";
class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name_pay: "",
      number_pay: "",
      time_pay: "",
      cmnd_pay: "",
      show: false,
      loading: true,
      status_payment: "",
      total: 0,
      note: "",
      orders: [],
      productList: [],
      info: {
        id: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        firm: "",
        address: "",
        gender: 1,
        dateOfBirth: "",
        region: "",
        district: "",
        wards: "",
        street: "",
      },
      images: [],
      authenticate: true,
    };
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  async componentDidMount() {
    let itemListString = Cookie.get("cart");

    if (typeof itemListString === "string" && itemListString !== undefined) {
      let itemList = JSON.parse(itemListString);
      this.setState({ productList: itemList });
    }

    let response1 = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "/users?username=" +
        Cookie.get("username"),
      {
        headers: {
          Authorization: "bearer " + Cookie.get("token"),
        },
      }
    );
    let response2 = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "/customer-infos?customerId=" +
        Cookie.get("id"),
      {
        headers: {
          Authorization: "bearer " + Cookie.get("token"),
        },
      }
    );
    if (!response1.ok && !response2.ok) {
      console.log("Cannot connect to sever!");
      return;
    }
    let data1 = await response1.json();
    let data2 = await response2.json();
    this.setState({ loading: false, authenticate: true, user: data1[0] });
    if (data2.length !== 0) {
      this.setState({ info: data2[0] });
    }
    if (!this.state.user.avatar) {
      this.setState({
        displayAddAvatar: "block",
        displayChangeAvatar: "none",
        imgURL: "/uploads/avatar-default.jpg",
      });
    } else {
      this.setState({
        displayAddAvatar: "none",
        displayChangeAvatar: "block",
        imgURL: this.state.user.avatar.url,
      });
    }
    let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/orders", {
      headers: {
        Authorization: "bearer " + Cookie.get("token"),
      },
    });
    if (!response.ok) {
      return;
    }
    let orders = await response.json();
    this.setState({
      orders: orders,
    });
    return;
  }
  handleClick = () => {
    if (this.state.name_pay === "") {
      toast.error("Tên Chủ Thẻ Còn Trống!");
      return;
    } else {
    }
    if (this.state.number_pay === "") {
      toast.error("Số thẻ còn trống!");
      return;
    } else if (this.state.number_pay.length !== 16) {
      toast.error("số thẻ không chính xác!");
      return;
    }

    if (this.state.time_pay === "") {
      toast.error("Ngày phát hàng còn trống!");
      return;
    } else {
      if (this.state.time_pay.length !== 5) {
        toast.error("Ngày phát hành không chính xác!");
        return;
      } else {
        // Array.from(this.state.time_pay).map((t,index) =>{

        // })
        var UseTime = this.state.time_pay.split("");
        console.log(UseTime[0]);
        if (UseTime[2] !== "/") {
          toast.error("Ngày phát hành không chính xác!");
          return;
        }
        if (UseTime[0] === "0" && UseTime[1] === "0") {
          toast.error("Ngày phát hành không chính xác!");
          return;
        }
        if (UseTime[3] === "0" && UseTime[4] === "0") {
          toast.error("Ngày phát hành không chính xác!");
          return;
        }

        if (UseTime[0] > "3") {
          toast.error("Ngày phát hành không chính xác!");
          return;
        } else {
          if (UseTime[3] > "1") {
            toast.error("Ngày phát hành không chính xác!");
            return;
          }

          if (UseTime[3] === "0") {
            if (
              UseTime[4] === "1" ||
              UseTime[4] === "3" ||
              UseTime[4] === "5" ||
              UseTime[4] === "7" ||
              UseTime[4] === "8"
            ) {
              if (UseTime[0] === 3) {
                if (UseTime[1] !== "0" && UseTime[1] !== "1") {
                  toast.error("Ngày phát hành không chính xác!");
                  return;
                }
              }
            } else {
              if (UseTime[0] === 3) {
                if (UseTime[1] !== "0") {
                  toast.error("Ngày phát hành không chính xác!");
                  return;
                }
              }
            }
          } else {
            if (
              UseTime[4] !== "0" &&
              UseTime[4] !== "1" &&
              UseTime[4] !== "2"
            ) {
              toast.error("Ngày phát hành không chính xác!");
              return;
            } else {
              if (UseTime[4] === "0" || UseTime[4] === "2") {
                if (UseTime[0] === 3) {
                  if (UseTime[1] !== "0" && UseTime[1] !== "1") {
                    toast.error("Ngày phát hành không chính xác!");
                    return;
                  }
                }
              } else {
                if (UseTime[0] === 3) {
                  if (UseTime[1] !== "0") {
                    toast.error("Ngày phát hành không chính xác!");
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }
    if (this.state.cmnd_pay === "") {
      toast.error("Số CMND còn trống!");
      return;
    } else if (this.state.cmnd_pay.length !== 9) {
      toast.error("Số chứng minh nhân dân không chính xác!");
      return;
    }
    var tempParams = {
      to_email: this.state.user.email,
      from_name: "SSS+ Shop",
      to_name: `${this.state.info.firstName} ${this.state.info.lastName}`,
      to_address: `${this.state.info.street},${this.state.info.wards},${this.state.info.district},${this.state.info.region}`,
      list_product: `
        ${this.state.productList.map((product) => {
          return `
            ${product.quantity} Cuộn x ${product.quantity_m} Mét - ${product.product.name} - Màu ${product.color}

            `;
        })}
      `,
    };
    emailjs
      .send(
        "service_usji67r",
        "template_fl6j2tu",
        tempParams,
        "user_P4FiW8xW41BqwLDdM7RSb"
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );

    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/transections",
        {
          total: 2000,
          status: this.state.status_payment,
          address: `${this.state.info.street},${this.state.info.wards},${this.state.info.district},${this.state.info.region}`,
          buyer: Cookie.get("id"),
          note: this.state.note,
          order: this.state.orders[this.state.orders.length - 1].id,
        },
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      )
      .then((response) => {
        
        Cookie.remove("cart");
        this.props.history.push("/purchase");
        window.location.href = "/purchase";
      })
      .catch((err) => {});
    toast.success("Thanh toán thành công!");
    this.setState({ show: false });
  };
  checkOutClick = () => {
    if (this.state.status_payment === "") {
      alert("vui long chon phuong thuc thanh toan");
      return;
    }
    if (this.state.status_payment === "paid") {
      this.setState({ show: true });
      return;
    }
    var tempParams = {
      to_email: this.state.user.email,
      from_name: "SSS+ Shop",
      to_name: `${this.state.info.firstName} ${this.state.info.lastName}`,
      to_address: `${this.state.info.street},${this.state.info.wards},${this.state.info.district},${this.state.info.region}`,
      list_product: `
        ${this.state.productList.map((product) => {
          return `
            ${product.quantity} Cuộn x ${product.quantity_m} Mét - ${product.product.name} - Màu ${product.color}

            `;
        })}
      `,
    };
    emailjs
      .send(
        "service_usji67r",
        "template_fl6j2tu",
        tempParams,
        "user_P4FiW8xW41BqwLDdM7RSb"
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );

    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + "/transections",
        {
          total: 2000,
          status: this.state.status_payment,
          address: `${this.state.info.street},${this.state.info.wards},${this.state.info.district},${this.state.info.region}`,
          buyer: Cookie.get("id"),
          note: this.state.note,
          order: this.state.orders[this.state.orders.length - 1].id,
        },
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      )
      .then((response) => {
       toast.success("Bạn đã đặt đơn hàng thành công!");
        Cookie.remove("cart");
        this.props.history.push("/purchase");
        window.location.href = "/purchase";
      })
      .catch((err) => {});
  };
  render() {
    var total = 0;
    this.state.productList.map((item) => {
      total += parseInt(item.product.price) * item.quantity;
    });

    return (
      <div className="Payment">
        <div className="content-left">
          <div className="section">
            <h3 className="title">Chọn hình thức thanh toán</h3>
            <div className="payment-method">
              <ul className="list">
                <li className="method">
                  <label className="style-radio">
                    <input
                      type="radio"
                      data-view-id="checkout.payment_method_select"
                      data-view-index="cod"
                      name="payment-methods"
                      value="cod"
                      onClick={() =>
                        this.setState({ status_payment: "unpaid" })
                      }
                    />
                    <span className="radio-fake"></span>
                    <span className="label">
                      <div className="method-label">
                        <img
                          className="method-icon"
                          src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-cod.svg"
                          alt=""
                        />
                        <div className="method-content">
                          <div className="method-name">
                            <span>Thanh toán tiền mặt khi nhận hàng</span>
                          </div>
                        </div>
                      </div>
                    </span>
                  </label>
                </li>

                <li className="method">
                  <label className="style-radio">
                    <input
                      type="radio"
                      data-view-id="checkout.payment_method_select"
                      data-view-index="cod"
                      name="payment-methods"
                      value="cod"
                      onClick={() =>
                        this.setState({ status_payment: "paid" })
                      }
                    />
                    <span className="radio-fake"></span>
                    <span className="label">
                      <div className="method-label">
                        <img
                          className="method-icon"
                          src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-mo-mo.svg"
                          alt=""
                        />
                        <div className="method-content">
                          <div className="method-name">
                            <span>Thanh toán bằng ví MoMo</span>
                          </div>
                        </div>
                      </div>
                    </span>
                  </label>
                </li>

                <li className="method">
                  <label className="style-radio">
                    <input
                      type="radio"
                      data-view-id="checkout.payment_method_select"
                      data-view-index="cod"
                      name="payment-methods"
                      value="cod"
                      onClick={() => this.setState({ status_payment: "paid" })}
                    />
                    <span className="radio-fake"></span>
                    <span className="label">
                      <div className="method-label">
                        <img
                          className="method-icon"
                          src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-zalo-pay.svg"
                          alt=""
                        />
                        <div className="method-content">
                          <div className="method-name">
                            <span>Thanh toán bằng ZaloPay</span>
                          </div>
                        </div>
                      </div>
                    </span>
                  </label>
                </li>

                <li className="method">
                  <label className="style-radio">
                    <input
                      type="radio"
                      data-view-id="checkout.payment_method_select"
                      data-view-index="cod"
                      name="payment-methods"
                      value="cod"
                      onClick={() => this.setState({ status_payment: "paid" })}
                    />
                    <span className="radio-fake"></span>
                    <span className="label">
                      <div className="method-label">
                        <img
                          className="method-icon"
                          src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-atm.svg"
                          alt=""
                        />
                        <div className="method-content">
                          <div className="method-name">
                            <span>Thanh toán ATM</span>
                          </div>
                        </div>
                      </div>
                    </span>
                  </label>
                </li>

                <li className="method">
                  <label className="style-radio">
                    <input
                      type="radio"
                      data-view-id="checkout.payment_method_select"
                      data-view-index="cod"
                      name="payment-methods"
                      value="cod"
                      onClick={(e) => this.setState({ status_payment: "debt" })}
                    />
                    <span className="radio-fake"></span>
                    <span className="label">
                      <div className="method-label">
                        <img
                          className="method-icon"
                          src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/checkout/icon-payment-method-credit.svg"
                          alt=""
                        />
                        <div className="method-content">
                          <div className="method-name">
                            <span>Nợ</span>
                          </div>
                        </div>
                      </div>
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div className="order-button">
            <button
              data-view-id="checkout.confirmation_navigation_proceed"
              className="btn"
              onClick={this.checkOutClick}
            >
              ĐẶT MUA
            </button>
          </div>
        </div>
        <div className="content-right">
          <div className="shipping-address">
            <div className="title">
              <span>Địa chỉ giao hàng</span>
              <Link
                to="/location"
                data-view-id="checkout.confirmation_shipping_location.change"
              >
                Sửa
              </Link>
            </div>
            <div className="address">
              <span className="name">{`${this.state.info.firstName}  ${this.state.info.lastName}`}</span>
              <span className="street">
                {" "}
                {`${this.state.info.street},${this.state.info.wards},${this.state.info.district},${this.state.info.region}`}
              </span>
              <span className="phone">
                Điện thoại: {this.state.info.phoneNumber}
              </span>
              <span className="phone">Công ty: {this.state.info.firm}</span>
            </div>
          </div>

          <div className="order-summary">
            <div className="title">
              <div className="sub-title">
                <b>Đơn hàng</b>
                <p>{this.state.productList.length} Sản phẩm</p>
              </div>
              <Link
                to="shopping-cart"
                data-view-id="checkout.confirmation_shipping_location.change"
              >
                Sửa
              </Link>
            </div>
            <div className="cart">
              <div className="price-sumary">
                <div className="price-info">
                  <div className="inner">
                    <div className="name ">Tạm tính</div>
                    <div className="value ">{total}$</div>
                  </div>
                </div>

                <div className="total">
                  <div class="name">Thành tiền:</div>
                  <div className="value">{total} $</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <div className="card border-0">
              <div className="card-header pb-0">
                <h2 className="card-title space ">THANH TOÁN </h2>
                {/* <p className="card-text text-muted mt-4 space">
                  SHIPPING DETAILS
                </p> */}
                <hr className="my-0" />
              </div>
              <div className="card-body">
                <div className="row justify-content-between">
                  {/* <div className="col-auto mt-0">
                    <p>
                      <b>
                        BBBootstrap Team Vasant Vihar 110020 New Delhi India
                      </b>
                    </p>
                  </div>
                  <div className="col-auto">
                    <p>
                      <b>BBBootstrap@gmail.com</b>{" "}
                    </p>
                  </div> */}
                </div>
                <div className="row mt-4">
                  <div className="col">
                    <p className="text-muted mb-2">THANH TOÁN CHI TIẾT</p>
                    <hr className="mt-0" />
                  </div>
                </div>
                <div className="form-group">
                  {" "}
                  <label htmlFor="NAME" className="small text-muted mb-1">
                    TÊN CHỦ THẺ
                  </label>{" "}
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="NAME"
                    id="NAME"
                    aria-describedby="helpId"
                    placeholder="Họ và tên đầy đủ"
                    style={{ boxShadow: "none" }}
                    onChange={(e) =>
                      this.setState({ name_pay: e.target.value })
                    }
                  />{" "}
                </div>
                <div className="form-group">
                  {" "}
                  <label htmlFor="NAME" className="small text-muted mb-1">
                    SỐ THẺ
                  </label>{" "}
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="NAME"
                    id="NAME"
                    aria-describedby="helpId"
                    placeholder="Nhập số thẻ"
                    style={{ boxShadow: "none" }}
                    onChange={(e) =>
                      this.setState({ number_pay: e.target.value })
                    }
                  />{" "}
                </div>
                <div className="row no-gutters">
                  <div className="col-sm-6 pr-sm-2">
                    <div className="form-group">
                      {" "}
                      <label htmlFor="NAME" className="small text-muted mb-1">
                        NGÀY PHÁT HÀNH
                      </label>{" "}
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="NAME"
                        id="NAME"
                        aria-describedby="helpId"
                        placeholder="mm/yy"
                        style={{ boxShadow: "none" }}
                        onChange={(e) =>
                          this.setState({ time_pay: e.target.value })
                        }
                      />{" "}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      {" "}
                      <label htmlFor="NAME" className="small text-muted mb-1">
                        CMND
                      </label>{" "}
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        name="NAME"
                        id="NAME"
                        aria-describedby="helpId"
                        placeholder="Nhập số CMND"
                        style={{ boxShadow: "none" }}
                        onChange={(e) =>
                          this.setState({ cmnd_pay: e.target.value })
                        }
                      />{" "}
                    </div>
                  </div>
                </div>
                {/* <div className="row mb-md-5">
                  <div className="col">
                    {" "}
                    <button
                      type="button"
                      name
                      id
                      className="btn btn-lg btn-block "
                    >
                      PURCHASE $37 SEK
                    </button>{" "}
                  </div>
                </div> */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClick}>
              Thanh Toán
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Quay Lại
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Payment);
