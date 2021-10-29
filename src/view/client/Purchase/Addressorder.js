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

                      <Modal show={this.state.show} onHide={this.handleClose}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header >
                          
                        </Modal.Header>
                        <Modal.Body>
                          <div className="modal-container">
                            <div className="modal_title">
                              Bạn có chắc chắn muốn bỏ sản phẩm này ?
                            </div>
                            <div className="modal_message">
                              Dao cạo lông mày tay cầm dài làm từ nhựa tiện dụng
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
