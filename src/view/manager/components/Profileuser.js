import React, { Component } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { withRouter } from "react-router";
import {Link} from "react-router-dom"
class Profileuser extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
        street: "",
      },
      images: [],
      authenticate: true,
    };
  }
  async componentDidMount() {
    let response1 = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "/users/" + Cookie.get("id"),
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
    this.setState({ loading: false, authenticate: true, user: data1 });
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
    // if(this.state.info.firstName === ""){
    //   this.setState({firstname_error: "Vui lòng nhập vào  Họ của bạn!"})
    //   return
    // }
    // else if(this.state.info.lastName ===""){
    //   this.setState({lastname_error: "Vui lòng nhập tên của bạn!"})
    //   return
    // }
    // else if(this.state.info.firm === ""){
    //   this.setState({firm_error:"Vui lòng nhập công ty của bạn!"})
    //   return
    // }
    // else if(this.state.info.phoneNumber ===""){
    //   this.setState({phone_error : "Vui lòng nhập số điện thoại của bạn!"})
    //   return
    // }
    // else if(this.state.info.location.street){
    //   this.setState({address_error:"Vui lòng chọn địa giao hàng!"})
    //   return
    // }
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
    console.log(this.state.profileimage)
    var  image = "https://cf.shopee.vn/file/059dfcece821ff6afb80ef012dfa2447";
    if (!this.state.loading && Cookie.get("token")) {
      return (
        <div className="Account_layout">
          <h3 className="styles_Heading">Thông tin tài khoản</h3>
          <div className="Account_info">
            <form onSubmit={this.handleSubmit}>
              <div className="form-control">
                <label className="input-label">Họ </label>
                <div>
                  <input
                    type="text"
                    name="fullName"
                    maxLength="128"
                    className="input-info"
                    defaultValue={this.state.info.firstName? this.state.info.firstName:""}
                    onChange={(e) =>
                      this.setState({
                        info: { ...this.state.info, firstName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="input-label">Tên</label>
                <div>
                  <input
                    type="text"
                    name="fullName"
                    maxLength="128"
                    className="input-info"
                    defaultValue={this.state.info.lastName?this.state.info.lastName:""}
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
                    defaultValue={this.state.info.phoneNumber?this.state.info.phoneNumber:""}
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
                    defaultValue={this.state.user.email?this.state.user.email:""}
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
                    defaultValue={this.state.info.firm?this.state.info.firm:""}
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
