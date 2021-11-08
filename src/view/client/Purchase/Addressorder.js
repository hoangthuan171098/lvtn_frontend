import React, { Component } from "react";
import "../style/order.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../style/modal.scss";
export default class Addressorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };
  render() {
    var Background =
      "https://cf.shopee.vn/file/059dfcece821ff6afb80ef012dfa2447";
    return (
      <>
        <div className="container-fluid">
          <div className="container_layout">
            <div className="Account_sidebar">
              <div className="Account_avatar">
                <div className="info"></div>
              </div>
              <ul className="Account_nav">
                <li>
                  <a className="is_acitve">
                    <i class="fas fa-user"></i>
                    <span>Thông tin tài khoản</span>
                  </a>
                </li>
                <li>
                  <a className="is_acitve">
                    <i class="fas fa-bell"></i>
                    <span>Thông báo của tôi</span>
                  </a>
                </li>
                <li>
                  <a className="is_acitve">
                    <i class="fas fa-clipboard"></i>
                    <span>Quản lý đơn hàng</span>
                  </a>
                </li>
                <li>
                  <a className="is_acitve">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Số địa chỉ</span>
                  </a>
                </li>
                <li>
                  <a className="is_acitve">
                    <i class="far fa-credit-card"></i>
                    <span>Thông tin thanh toán</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="Account_layout">
              <h3 className="styles_Heading">
                Thêm Mật Khẩu
                <p>
                  Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho
                  người khác
                </p>
              </h3>
              <div className="Account_info">
                <form>
                  <div className="form-control">
                    <label className="input-label">Mật khẩu mới</label>
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        maxLength="128"
                        className="input-info"
                        value="Kiếm Tiền Nuôi Em"
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="input-label">Xác Nhận Mật Khẩu</label>
                    <div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        maxLength="128"
                        className="input-info"
                        value="0394007104"
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="input-label"></label>
                    <div>
                      <input
                        style={{
                          width: 350 + "px",
                          borderTopRightRadius: "none",
                          borderBottomRightRadius: "none",
                        }}
                        type="text"
                        name="email"
                        maxLength="128"
                        className="input-info"
                        value="ledinhdiep123456789@gmail.com"
                      />
                      <button className="check">Mã Xác Minh</button>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="input-label">&nbsp;</label>
                    <button type="button" className="btn btn-primary">
                      Xác nhận
                    </button>
                    <>
                      <Button variant="primary" onClick={this.handleShow}>
                        Launch demo modal
                      </Button>

                      <Modal
                        show={this.state.show}
                        onHide={this.handleClose}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header>header</Modal.Header>
                        <Modal.Body>
                          <div className="card border-0">
                            <div className="card-header pb-0">
                              <h2 className="card-title space ">Checkout</h2>
                              <p className="card-text text-muted mt-4 space">
                                SHIPPING DETAILS
                              </p>
                              <hr className="my-0" />
                            </div>
                            <div className="card-body">
                              <div className="row justify-content-between">
                                <div className="col-auto mt-0">
                                  <p>
                                    <b>
                                      BBBootstrap Team Vasant Vihar 110020 New
                                      Delhi India
                                    </b>
                                  </p>
                                </div>
                                <div className="col-auto">
                                  <p>
                                    <b>BBBootstrap@gmail.com</b>{" "}
                                  </p>
                                </div>
                              </div>
                              <div className="row mt-4">
                                <div className="col">
                                  <p className="text-muted mb-2">
                                    PAYMENT DETAILS
                                  </p>
                                  <hr className="mt-0" />
                                </div>
                              </div>
                              <div className="form-group">
                                {" "}
                                <label
                                  htmlFor="NAME"
                                  className="small text-muted mb-1"
                                >
                                  NAME ON CARD
                                </label>{" "}
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  name="NAME"
                                  id="NAME"
                                  aria-describedby="helpId"
                                  placeholder="BBBootstrap Team"
                                />{" "}
                              </div>
                              <div className="form-group">
                                {" "}
                                <label
                                  htmlFor="NAME"
                                  className="small text-muted mb-1"
                                >
                                  CARD NUMBER
                                </label>{" "}
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  name="NAME"
                                  id="NAME"
                                  aria-describedby="helpId"
                                  placeholder="4534 5555 5555 5555"
                                />{" "}
                              </div>
                              <div className="row no-gutters">
                                <div className="col-sm-6 pr-sm-2">
                                  <div className="form-group">
                                    {" "}
                                    <label
                                      htmlFor="NAME"
                                      className="small text-muted mb-1"
                                    >
                                      VALID THROUGH
                                    </label>{" "}
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      name="NAME"
                                      id="NAME"
                                      aria-describedby="helpId"
                                      placeholder="06/21"
                                    />{" "}
                                  </div>
                                </div>
                                <div className="col-sm-6">
                                  <div className="form-group">
                                    {" "}
                                    <label
                                      htmlFor="NAME"
                                      className="small text-muted mb-1"
                                    >
                                      CVC CODE
                                    </label>{" "}
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      name="NAME"
                                      id="NAME"
                                      aria-describedby="helpId"
                                      placeholder={183}
                                    />{" "}
                                  </div>
                                </div>
                              </div>
                              <div className="row mb-md-5">
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
                              </div>
                            </div>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={this.handleClose}
                          >
                            Có
                          </Button>
                          <Button variant="primary" onClick={this.handleClose}>
                            Không
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
