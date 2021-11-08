import React, { Component } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { withRouter } from "react-router";
import { toast } from 'react-toastify'
class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
  handleSubmit = (event) => {
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
            region: this.state.info.region,
            district: this.state.info.district,
            wards: this.state.info.wards,
            street: this.state.info.street,
          },
          {
            headers: {
              Authorization: "bearer " + Cookie.get("token"),
            },
          }
        )
        .then((response) => {
          this.props.history.push("/purchase/loca");
        })
        .catch((error) => {
          toast.error("Update failed !!!");
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
            region: this.state.info.region,
            district: this.state.info.district,
            wards: this.state.info.wards,
            street: this.state.info.street,
          },
          {
            headers: {
              Authorization: "bearer " + Cookie.get("token"),
            },
          }
        )
        .then((response) => {
          toast.success("update profile success.");
          this.props.history.push("/purchase/loca");
        })
        .catch((error) => {
          toast.error("Update failed !!!");
          console.log("An error occurred:", error.response);
        });
    }
    return;
  };
  render() {
    var regions_list = [
      "Hồ Chí Minh",
      "Hà Nội",
      "Bà Rịa - Vũng Tàu",
      "Đà Nẵng",
      "Bình Phước",
      "Bình Dương",
    ];
    var district_list = [
      "Quận 1",
      "Quận 2",
      "Quận 3",
      "Quận 4",
      "Quận 5",
      "Quận 6",
      "Quận 7",
      "Quận 8",
      "Quận 9",
      "Quận 10",
      "Quận 11",
      "Quận 12",
      "Quận Bình Tân",
      "Quận Bình Thạnh",
      "Quận Gò Vấp",
      "Quận Phú Nhuận",
      "Quận Tân Bình",
      "Quận Tân Phú",
      "Quận Thủ Đức",
      "Huyện Bình Chánh",
      "Huyện Cần Giờ",
      "Huyện Củ Chi",
      "Huyện Hóc Môn",
      "Huyện Nhà Bè",
    ];
    var ward_list = [
      // 0  quan 1
      "Phường Bến Nghé",
      "Phường Bến Thành",
      "Phường Cầu Kho",
      "Phường Cầu Ông Lãnh",
      "Phường Cô Giang",
      "Phường Đa Kao",
      "Phường Nguyễn Cư Trinh",
      "Phường Nguyễn Thái Bình",
      "Phường Phạm Ngũ Lão",
      "Phường Tân Định", // 9
      "Phường An Khánh", // quan 2 10
      "Phường An Lợi Đông",
      "Phường An Phú",
      "Phường Bình An",
      "Phường Bình Khánh",
      "Phường Bình Trưng Đông",
      "Phường Bình Trưng Tây",
      "Phường Cát Lái",
      "Phường Thạnh Mỹ Lợi",
      "Phường Thảo Điền",
      "Phường Thủ Thiêm",
      // quan 3
      "Phường 01",
      "Phường 02",
      "Phường 03",
      "Phường 04",
      "Phường 05",
      "Phường 06",
      "Phường 07",
      "Phường 08",
      "Phường 09",
      "Phường 10",
      "Phường 11",
      "Phường 12",
      "Phường 13",
      "Phường 14",
      "Phường 15",
    ];
    if (!this.state.loading && Cookie.get("token")) {
      return (
        <div className="Account_layout">
          <h3 className="styles_Heading">Tạo sổ địa chỉ</h3>
          <div className="Account_info">
            <form onSubmit={this.handleSubmit}>
              <div className="form-control">
                <label className="input-label">Họ:</label>
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
                <label className="input-label">Tên:</label>
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
                <label for="region" className="input-label">
                  Tỉnh/Thành phố:
                </label>
                <select
                  required
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, region: e.target.value },
                    })
                    
                  }
                  value="hêlo"
                >
                
                  {/* {this.state.info.region === "" ? (
                    <option value="">Chọn Tỉnh/Thành phố</option>
                  ) : (
                    <option defaultValue={this.state.info.region}>
                      {this.state.info.region}
                    </option>
                  )}
                  {regions_list.map((region, index) => {
                    if (this.state.info.region === region) {
                      return <></>;
                    }
                    return <option defaultValue={region}>{region}</option>;
                  })} */}
                </select>
              </div>

              <div className="form-control">
                <label for="district" className="input-label">
                  Quận huyện:
                </label>
                <select
                  required
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, district: e.target.value },
                    })
                  }
                >
                  {this.state.info.region === "" ? (
                    <option value="">Chọn Quận/Huyện</option>
                  ) : (
                    <option defaultValue={this.state.info.district}>
                      {this.state.info.district}
                    </option>
                  )}
                  {district_list.map((district, index) => {
                    if (this.state.info.district === district) {
                      return <></>;
                    }
                    if (this.state.info.region === "Hồ Chí Minh") {
                      return (
                        <option defaultValue={district}>{district}</option>
                      );
                    } else {
                      return (
                        <>
                          <option value="Quận 1">Huyện Bù Đăng</option>
                          <option value="Quận 2">Huyện Bù Na</option>
                          <option value="Quận 3">Huyện Bù Đốp</option>
                          <option value="Quận 4">Huyện Đồng Xoài</option>
                          <option value="Quận 5">Huyện Phước Long</option>
                          <option value="Quận 6">Huyện Bù Gia Mập</option>
                        </>
                      );
                    }
                  })}
                </select>
              </div>

              <div className="form-control">
                <label for="ward" className="input-label">
                  Phường xã:
                </label>
                <select
                  required
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, wards: e.target.value },
                    })
                  }
                >
                  {this.state.info.region === "" ? (
                    <option value="">Chọn Phường/Xã</option>
                  ) : (
                    <option defaultValue={this.state.info.wards}>
                      {this.state.info.wards}
                    </option>
                  )}
                  {ward_list.map((ward, index) => {
                    if (this.state.info.district === "Quận 1") {
                      if (index >= 10) {
                        return <></>;
                      } else {
                        return <option value={ward}>{ward}</option>;
                      }
                    } else if (this.state.info.district === "Quận 2") {
                      if (index < 10 || index > 20) {
                        return <></>;
                      } else {
                        return <option value={ward}>{ward}</option>;
                      }
                    } else {
                      if (index <= 20) {
                        return <></>;
                      } else {
                        return <option value={ward}>{ward}</option>;
                      }
                    }
                  })}
                </select>
              </div>
              <div className="form-control">
                <label for="address" className="input-label">
                  Địa chỉ:
                </label>
                <textarea
                  required=""
                  name="street"
                  rows="5"
                  placeholder="Nhập địa chỉ"
                  defaultValue={this.state.info.street}
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, street: e.target.value },
                    })
                  }
                ></textarea>
              </div>

              <div className="form-control">
                <label className="input-label">&nbsp;</label>
                <button type="submit" className="btn-submit">
                  Cập nhật
                </button>
              </div>
            </form>
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

export default withRouter(Account)
