import React, { Component } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { withRouter } from "react-router";
import "../style/order.scss";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {Link} from "react-router-dom"
class Profileuser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDebtPay: false,
      show: false, method: '',debtInput: 0,
      profileimage: "",
      firstname_error: "",
      lastname_error: "",
      firm_error: "",
      phone_error: "",
      address_error: "",
      loading: true,
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
        street: ""
      },
      images: [],
      authenticate: true,
    };
  }
  async componentDidMount() {
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
  }
  onSubmitAddAvatar = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Array.from(this.state.images).forEach((image) => {
      formData.append("files", image);
    });

    formData.append("ref", "user");
    formData.append("refId", this.state.user.id);
    formData.append("field", "avatar");
    formData.append("source", "users-permissions");

    await axios
      .post(`http://localhost:1337/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "bearer " + Cookie.get("token"),
        },
      })
      .then((res) => {
        console.log(res);
        alert("Thêm avatar thành công!");
      })
      .catch((err) => {
        console.log(err.response);
        alert("Thêm avatar thất bại!");
      });
    window.location.href = "/profile";
  };

  showDebtPay = (event) =>{
    event.preventDefault()
    this.setState({showDebtPay:!this.state.showDebtPay})
  }

  onSubmitChangeAvatar = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Array.from(this.state.images).forEach((image) => {
      formData.append("files", image);
    });

    formData.append("ref", "user");
    formData.append("refId", this.state.user.id);
    formData.append("field", "avatar");
    formData.append("source", "users-permissions");

    await axios
      .delete(
        `http://localhost:1337/upload/files/` + this.state.user.avatar.id,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });

    await axios
      .post(`http://localhost:1337/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "bearer " + Cookie.get("token"),
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
    window.location.href = "/profile";
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.state.info.id) {

      const formData = new FormData();
    
        Array.from(this.state.images).forEach(image => {
          formData.append('files', image);
        });

        formData.append('ref','user');
        formData.append('refId',this.state.user.id);
        formData.append('field','avatar');
        formData.append('source', 'users-permissions');
    
        await axios
          .post(`http://localhost:1337/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
          })
          .then(res => {
            console.log(res);
            alert('Thêm avatar thành công!')
          })
          .catch(err => {
            console.log(err.response);
            alert('Thêm avatar thất bại!')
        });
      axios
        .put(
          process.env.REACT_APP_BACKEND_URL +
            "/customer-infos/" +
            this.state.info.id,
          {
            firstName: this.state.info.firstName,
            lastName: this.state.info.lastName,
            phoneNumber: this.state.info.phoneNumber,
            address: this.state.info.address,
            gender: this.state.info.gender,
            firm: this.state.info.firm,
            dateOfBirth: this.state.info.dateOfBirth,
            customerId: this.state.user.id,
          },
          {
            headers: {
              Authorization: "bearer " + Cookie.get("token"),
            },
          }
        )
        .then((response) => {
          this.props.history.push(`/purchase/profile`);
        })
        .catch((error) => {
          alert("Update failed !!!");
          console.log("An error occurred:", error.response);
        });
    } else {
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "/customer-infos/",
          {
            firstName: this.state.info.firstName,
            lastName: this.state.info.lastName,
            phoneNumber: this.state.info.phoneNumber,
            address: this.state.info.address,
            firm: this.state.info.firm,
            location: this.state.info.location,
            customerId: this.state.user.id,
          },
          {
            headers: {
              Authorization: "bearer " + Cookie.get("token"),
            },
          }
        )
        .then((response) => {
          alert("update profile success.");
          this.props.history.push("/purchase/profile");
        })
        .catch((error) => {
          alert("Update failed !!!");
          console.log("An error occurred:", error.response);
        });
    }
    return;
  };

  momoClick = (event) =>{
    event.preventDefault()
    if(this.state.debtInput > this.state.info.debt){
      alert('Số tiền thanh toán không được lớn hơn số nợ.')
      return
    }
    if(this.state.debtInput === 0){
      alert('Xin hãy nhập số tiền thanh toán.')
      return
    }
    this.setState({method:'momo'})
    this.handleShow()
  }

  zaloClick = (event) =>{
    event.preventDefault()
    if(this.state.debtInput > this.state.info.debt){
      alert('Số tiền thanh toán không được lớn hơn số nợ.')
      return
    }
    if(this.state.debtInput === 0){
      alert('Xin hãy nhập số tiền thanh toán.')
      return
    }
    this.setState({method:'zalo'})
    this.handleShow()
  }

  atmClick = (event) =>{
    event.preventDefault()
    if(this.state.debtInput > this.state.info.debt){
      alert('Số tiền thanh toán không được lớn hơn số nợ.')
      return
    }
    if(this.state.debtInput === 0){
      alert('Xin hãy nhập số tiền thanh toán.')
      return
    }
    this.setState({method:'atm'})
    this.handleShow()
  }

  handleClose = () => {
    this.setState({ show: false });
  };
  handleShow = () => {
    this.setState({ show: true });
  };

  handleClickQr = () =>{
    let newdebt = Number(this.state.info.debt) - Number(this.state.debtInput)
    axios
      .put(
        process.env.REACT_APP_BACKEND_URL + "/customer-infos/" + this.state.info.id,
        {
          debt: newdebt
        },
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      )
      .then((response) => {
        alert("Thanh toán thành công");
        this.handleClose()
        this.componentDidMount()
      })
      .catch((error) => {
        alert("Thanh toán thất bại !!!");
        console.log("An error occurred:", error.response);
      });
  }

  onImageChange = (event) =>{
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();
      reader.onload = (e) =>{
        this.setState({profileimage:e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  render() {
    var total = this.state.debtInput
    var image = "https://cf.shopee.vn/file/059dfcece821ff6afb80ef012dfa2447";
    if (!this.state.loading && Cookie.get("token")) {
      return (
        <div className="Account_layout">
          <h3 className="styles_Heading">Thông tin tài khoản</h3>
          <div className="Account_info">
            <form onSubmit={this.handleSubmit}>
              <div className="form-control">
                <label className="input-label">Tổng nợ: </label>
                <div>
                  {this.state.info.debt?
                    Number(this.state.info.debt).toLocaleString("en")+'VNĐ':'Không'}
                  <button onClick={(e)=>this.showDebtPay(e)}
                    className='btn btn-success ml-4'>Thanh toán</button>
                </div>
              </div>

              <div
                className={this.state.showDebtPay? "form-control": 'd-none'}>
                <div className='row'>
                  <input type='number'
                  onChange={(e)=>this.setState({debtInput:Number(e.target.value)})}
                  placeholder='Nhập số tiền'></input>
                </div>
                <button className='btn btn-info ml-4'
                onClick={(e)=>this.momoClick(e)}>Momo</button>
                <button className='btn btn-info ml-4'
                onClick={(e)=>this.zaloClick(e)}>ZaloPay</button>
                <button className='btn btn-info ml-4'
                onClick={(e)=>this.atmClick(e)}>ATM</button>
              </div>

              <div className="form-control">
                <label className="input-label">Tên </label>
                <div>
                  <input
                    type="text"
                    name="fullName"
                    maxLength="128"
                    className="input-info"
                    defaultValue={this.state.info.firstName}
                    onChange={(e) =>
                      this.setState({
                        info: { ...this.state.info, firstName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="input-label">Họ</label>
                <div>
                  <input
                    type="text"
                    name="fullName"
                    maxLength="128"
                    className="input-info"
                    defaultValue={this.state.info.lastName}
                    onChange={(e) =>
                      this.setState({
                        info: { ...this.state.info, lastName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="input-label">Số điện thoại</label>
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    maxLength="128"
                    className="input-info"
                    defaultValue={this.state.info.phoneNumber}
                    onChange={(e) =>
                      this.setState({
                        info: {
                          ...this.state.info,
                          phoneNumber: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="input-label">Email</label>
                <div>
                  <input
                    type="text"
                    name="email"
                    maxLength="128"
                    className="input-info"
                    defaultValue={this.state.user.email}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="input-label">Công ty</label>
                <div>
                  <input
                    type="text"
                    name="company"
                    maxLength="128"
                    className="input-info"
                    defaultValue={this.state.info.firm}
                    onChange={(e) =>
                      this.setState({
                        info: { ...this.state.info, firm: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="input-label">Địa Chỉ</label>
                <div>
                  <input
                    type="text"
                    name="address"
                    maxLength="128"
                    className="input-info"
                    value={this.state.info.address}
                    onChange={(e) =>
                      this.setState({
                        info: { ...this.state.info, address: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="input-label"></label>
                <Link to="/purchase/password"><p className="pass">Thay đổi mật khẩu?</p> </Link>
              </div>
              <div className="form-control">
                <label className="input-label">&nbsp;</label>
                <button type="submit" className="btn-submit">
                  Cập nhật
                </button>
              </div>
            </form>
            <div className="image-user">
              <div className="X1SONv">
                <div className="_1FzaUZ">
                  <div
                    className="TgSfgo"
                    style={{ backgroundImage: `url(${this.state.profileimage !== "" ? this.state.profileimage :  image})`}}
                  ></div>
                  {/* <Avatar size={64} icon="user" src={this.state.profileimage} /> */}
                </div>
                {/* <input
                  className="_2xS5eV"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={e=>this.setState({images:e.target.files})}
                /> */}
                {/* <button
                  type="button"
                  className="btn btn-light btn--m btn--inline"
                >
                  Chọn ảnh
                </button> */}
                <input type="file" name="file" id="file" className="inputfile" onChange={this.onImageChange}/>
                <label for="file" style={{padding:2 + 'px'}}>Chọn ảnh</label>
                <div className="_3Jd4Zu">
                  <div className="_3UgHT6">Dụng lượng file tối đa 1 MB</div>
                  <div className="_3UgHT6">Định dạng:.JPEG, .PNG</div>
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
                  <hr className="my-0" />
                </div>
                <div className="card-body">
                  <div className="row justify-content-between">
                  </div>
                  <div className="row mt-4">
                    <div className="col">
                      <p className="text-muted mb-2">THANH TOÁN CHI TIẾT</p>
                      <hr className="mt-0" />
                    </div>
                  </div>
                  {(this.state.method === "atm")
                    ?
                    <>
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
                    </>
                    :
                    <>
                      <div>
                        <div style={{color:"red",fontSize:15 + 'px'}}> 
                          TỔNG TIỀN : {total.toLocaleString("en")} VNĐ
                        </div>
                        <img  
                            onClick = {this.handleClickQr}
                            style = {{cursor:"pointer",height:400 + 'px'}}
                            src="https://cdn.printgo.vn/uploads/media/790919/tao-ma-qr-code-san-pham-1_1620927223.jpg" alt="" />
                      </div>
                    </>
                  }
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
            {(this.state.method === "atm") 
                ?
                <>
                <Button variant="secondary" 
                // onClick={this.handleClick}
                >
                Thanh Toán
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Quay Lại
              </Button>
                </>
                :
                <>
                  <span 
                    style={{color:"blueviolet",cursor:"pointer"}}
                    onClick={this.handleClose}
                  >Thanh toán bằng phương thức khác</span>
                </>
            }
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
    if (!this.state.authenticate) {
      return <h2 className="ProductList-title">You need to login</h2>;
    }
    return <h2 className="ProductList-title">Waiting for API...</h2>;
  }
}

export default withRouter(Profileuser);
