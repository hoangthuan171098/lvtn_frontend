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
        alert("Th??m avatar th??nh c??ng!");
      })
      .catch((err) => {
        console.log(err.response);
        alert("Th??m avatar th???t b???i!");
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
    if (this.state.images.length !== 0) {
      const formData = new FormData();
      Array.from(this.state.images).forEach(image => {
        formData.append('files', image);
      });

      formData.append('ref','user');
      formData.append('refId',this.state.user.id);
      formData.append('field','avatar');
      formData.append('source', 'users-permissions');

      if(this.state.user.avatar && this.state.user.avatar.id){
        await axios
          .delete(`http://localhost:1337/upload/files/`+this.state.user.avatar.id , {
            headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
          })
      }
  
      await axios
        .post(`http://localhost:1337/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
        })
        .then(res => {
        })
        .catch(err => {
          console.log(err.response)
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
          alert('C???p nh???t th??ng tin th??nh c??ng!')
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
      alert('S??? ti???n thanh to??n kh??ng ???????c l???n h??n s??? n???.')
      return
    }
    if(this.state.debtInput === 0){
      alert('Xin h??y nh???p s??? ti???n thanh to??n.')
      return
    }
    this.setState({method:'momo'})
    this.handleShow()
  }

  zaloClick = (event) =>{
    event.preventDefault()
    if(this.state.debtInput > this.state.info.debt){
      alert('S??? ti???n thanh to??n kh??ng ???????c l???n h??n s??? n???.')
      return
    }
    if(this.state.debtInput === 0){
      alert('Xin h??y nh???p s??? ti???n thanh to??n.')
      return
    }
    this.setState({method:'zalo'})
    this.handleShow()
  }

  atmClick = (event) =>{
    event.preventDefault()
    if(this.state.debtInput > this.state.info.debt){
      alert('S??? ti???n thanh to??n kh??ng ???????c l???n h??n s??? n???.')
      return
    }
    if(this.state.debtInput === 0){
      alert('Xin h??y nh???p s??? ti???n thanh to??n.')
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
        alert("Thanh to??n th??nh c??ng");
        this.handleClose()
        this.componentDidMount()
      })
      .catch((error) => {
        alert("Thanh to??n th???t b???i !!!");
        console.log("An error occurred:", error.response);
      });
  }

  onImageChange = (event) =>{
    if(event.target.files && event.target.files[0]){
      this.setState({images:event.target.files})
      let reader = new FileReader();
      reader.onload = (e) =>{
        this.setState({profileimage:e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  render() {
    console.log(this.state.imgURL)
    var total = this.state.debtInput
    var image = "https://cf.shopee.vn/file/059dfcece821ff6afb80ef012dfa2447";
    if(this.state.imgURL){
      image = process.env.REACT_APP_BACKEND_URL + this.state.imgURL
    }
    if (!this.state.loading && Cookie.get("token")) {
      return (
        <div className="Account_layout">
          <h3 className="styles_Heading">Th??ng tin t??i kho???n</h3>
          <div className="Account_info">
            <form onSubmit={this.handleSubmit}>
              <div className="form-control">
                <label className="input-label">T???ng n???: </label>
                <div>
                  {this.state.info.debt?
                    Number(this.state.info.debt).toLocaleString("en")+'VN??':'Kh??ng'}
                  <button onClick={(e)=>this.showDebtPay(e)}
                    className='btn btn-success ml-4'>Thanh to??n</button>
                </div>
              </div>

              <div
                className={this.state.showDebtPay? "form-control": 'd-none'}>
                <div className='row'>
                  <input type='number'
                  onChange={(e)=>this.setState({debtInput:Number(e.target.value)})}
                  placeholder='Nh???p s??? ti???n'></input>
                </div>
                <button className='btn btn-info ml-4'
                onClick={(e)=>this.momoClick(e)}>Momo</button>
                <button className='btn btn-info ml-4'
                onClick={(e)=>this.zaloClick(e)}>ZaloPay</button>
                <button className='btn btn-info ml-4'
                onClick={(e)=>this.atmClick(e)}>ATM</button>
              </div>

              <div className="form-control">
                <label className="input-label">T??n </label>
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
                <label className="input-label">H???</label>
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
                <label className="input-label">S??? ??i???n tho???i</label>
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
                <label className="input-label">C??ng ty</label>
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
                <label className="input-label">?????a Ch???</label>
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
                <Link to="/purchase/password"><p className="pass">Thay ?????i m???t kh???u?</p> </Link>
              </div>
              <div className="form-control">
                <label className="input-label">&nbsp;</label>
                <button type="submit" className="btn-submit">
                  C???p nh???t
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
                </div>
                <input type="file" name="file" id="file" className="inputfile" onChange={this.onImageChange}/>
                <label for="file" style={{padding:2 + 'px'}}>Ch???n ???nh</label>
                <div className="_3Jd4Zu">
                  <div className="_3UgHT6">D???ng l?????ng file t???i ??a 1 MB</div>
                  <div className="_3UgHT6">?????nh d???ng:.JPEG, .PNG</div>
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
                  <h2 className="card-title space ">THANH TO??N </h2>
                  <hr className="my-0" />
                </div>
                <div className="card-body">
                  <div className="row justify-content-between">
                  </div>
                  <div className="row mt-4">
                    <div className="col">
                      <p className="text-muted mb-2">THANH TO??N CHI TI???T</p>
                      <hr className="mt-0" />
                    </div>
                  </div>
                  {(this.state.method === "atm")
                    ?
                    <>
                    <div className="form-group">
                    {" "}
                    <label htmlFor="NAME" className="small text-muted mb-1">
                      T??N CH??? TH???
                    </label>{" "}
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="NAME"
                      id="NAME"
                      aria-describedby="helpId"
                      placeholder="H??? v?? t??n ?????y ?????"
                      style={{ boxShadow: "none" }}
                      onChange={(e) =>
                        this.setState({ name_pay: e.target.value })
                      }
                    />{" "}
                  </div>
                  <div className="form-group">
                    {" "}
                    <label htmlFor="NAME" className="small text-muted mb-1">
                      S??? TH???
                    </label>{" "}
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      name="NAME"
                      id="NAME"
                      aria-describedby="helpId"
                      placeholder="Nh???p s??? th???"
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
                          NG??Y PH??T H??NH
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
                          placeholder="Nh???p s??? CMND"
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
                          T???NG TI???N : {total.toLocaleString("en")} VN??
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
                Thanh To??n
              </Button>
              <Button variant="primary" onClick={this.handleClose}>
                Quay L???i
              </Button>
                </>
                :
                <>
                  <span 
                    style={{color:"blueviolet",cursor:"pointer"}}
                    onClick={this.handleClose}
                  >Thanh to??n b???ng ph????ng th???c kh??c</span>
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
