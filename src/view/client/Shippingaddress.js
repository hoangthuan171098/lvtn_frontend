import React, { Component } from "react";
import "./style/shippingaddress.scss";
import Cookie from "js-cookie";
import axios from "axios";
import {Link} from "react-router-dom"
import { toast } from "react-toastify";
export default class Shippingaddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname_error : "",
      lastname_error : "",
      firm_error: "",
      phone_error:"",
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
        wards :"",
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
  handleSubmit = (event) => {
    event.preventDefault();
    if(this.state.info.firstName ===""){
        toast.error("Vui l??ng nh???p h??? c???a b???n!")
        return
    }
    // if(this.state.info.firstName === ""){
    //   this.setState({firstname_error: "Vui l??ng nh???p v??o  H??? c???a b???n!"})
    //   return
    // }
    // else if(this.state.info.lastName ===""){
    //   this.setState({lastname_error: "Vui l??ng nh???p t??n c???a b???n!"})
    //   return
    // }
    // else if(this.state.info.firm === ""){
    //   this.setState({firm_error:"Vui l??ng nh???p c??ng ty c???a b???n!"})
    //   return
    // }
    // else if(this.state.info.phoneNumber ===""){
    //   this.setState({phone_error : "Vui l??ng nh???p s??? ??i???n tho???i c???a b???n!"})
    //   return
    // }
    // else if(this.state.info.location.street){
    //   this.setState({address_error:"Vui l??ng ch???n ?????a giao h??ng!"})
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
            wards :this.state.info.wards,
            street: this.state.info.street
          },
          {
            headers: {
              Authorization: "bearer " + Cookie.get("token"),
            },
          }
        )
        .then((response) => {
          this.props.history.push("/payment");
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
            wards :this.state.info.wards,
            street: this.state.info.street
          },
          {
            headers: {
              Authorization: "bearer " + Cookie.get("token"),
            },
          }
        )
        .then((response) => {
          toast.success("update profile success.");
          this.props.history.push("/payment");
        })
        .catch((error) => {
          toast.error("Update failed !!!");
          console.log("An error occurred:", error.response);
        });
    }
    return;
  };
  // changeStreet = (e) => {
  //   var { location } = this.state.info;
  //   location.street = e.target.value;
  //   this.setState({ location: location });
    
  // };
  // changeRegion = (e) => {
  //   var { location } = this.state.info;
  //   location.region = e.target.value;
  //   this.setState({ location: location });
  // };

  // changeWard = (e) => {
  //   var { location } = this.state.info;
  //   location.wards = e.target.value;
  //   this.setState({ location: location });
  // };
  // chageDistric = (e) => {
  //   var { location } = this.state.info;
  //   location.district = e.target.value;
  //   this.setState({ location: location });
  // };
  Region = async (e) =>{
     if(e.target.value !== this.state.info.region){
      await this.setState({
        info: { ...this.state.info, region: e.target.value },
      })
      await this.setState({
        info: { ...this.state.info, district: "" },
      })
      await this.setState({
        info: { ...this.state.info, wards: "" },
      })
     }
  }
  Distric = async (e) =>{
    if(e.target.value !== this.state.info.district){
      await this.setState({
        info: { ...this.state.info, district: e.target.value },
      })
      await this.setState({
        info: { ...this.state.info, wards: "" },
      })

    
     }
  }

  Wards = async (e) =>{
    
      await this.setState({
        info: { ...this.state.info, wards: e.target.value },
      })
  }
  render() {
    console.log(this.state.info.region)
    var regions_list = [
      "H??? Ch?? Minh",
      "H?? N???i",
      "B?? R???a - V??ng T??u",
      "???? N???ng",
      "B??nh Ph?????c",
      "B??nh D????ng",
    ];
    var district_list = [
      "Qu???n 1",
      "Qu???n 2",
      "Qu???n 3",
      "Qu???n 4",
      "Qu???n 5",
      "Qu???n 6",
      "Qu???n 7",
      "Qu???n 8",
      "Qu???n 9",
      "Qu???n 10",
      "Qu???n 11",
      "Qu???n 12",
      "Qu???n B??nh T??n",
      "Qu???n B??nh Th???nh",
      "Qu???n G?? V???p",
      "Qu???n Ph?? Nhu???n",
      "Qu???n T??n B??nh",
      "Qu???n T??n Ph??",
      "Qu???n Th??? ?????c",
      "Huy???n B??nh Ch??nh",
      "Huy???n C???n Gi???",
      "Huy???n C??? Chi",
      "Huy???n H??c M??n",
      "Huy???n Nh?? B??",

      "Qu???n Ba ????nh",
      "Qu???n B???c T??? Li??m",
      "Qu???n C???u Gi???y",
      "Qu???n ?????ng ??a",
      "Qu???n H?? ????ng",
      "Qu???n Hai B?? Tr??ng",
      "Qu???n Ho??n Ki???m",
      "Qu???n Ho??ng Mai",
      "Qu???n Long Bi??n",
      "Qu???n Nam T??? Li??m",
      "Qu???n T??y H???",
      "Qu???nThanh Xu??n",
      "Th??? X?? S??n T??y",
      "Huy???n Ba V??",
      "Huy???n Ch????ng M???",
      "Huy???n ??an Ph?????ng",
      "Huy???n ????ng Anh",
      "Huy??n Gia L??m",
      "Huy???n Ho??i ?????c",
      "Huy???n M?? Linh"
    ];
    var ward_list = [
        // 0  quan 1
        "Ph?????ng B???n Ngh??",
        "Ph?????ng B???n Th??nh",
        "Ph?????ng C???u Kho",
        "Ph?????ng C???u ??ng L??nh",
        "Ph?????ng C?? Giang",
        "Ph?????ng ??a Kao",
        "Ph?????ng Nguy???n C?? Trinh",
        "Ph?????ng Nguy???n Th??i B??nh",
        "Ph?????ng Ph???m Ng?? L??o",
        "Ph?????ng T??n ?????nh", // 9
        "Ph?????ng An Kh??nh", // quan 2 10
        "Ph?????ng An L???i ????ng",
        "Ph?????ng An Ph??",
        "Ph?????ng B??nh An",
        "Ph?????ng B??nh Kh??nh",
        "Ph?????ng B??nh Tr??ng ????ng","Ph?????ng B??nh Tr??ng T??y","Ph?????ng C??t L??i","Ph?????ng Th???nh M??? L???i","Ph?????ng Th???o ??i???n","Ph?????ng Th??? Thi??m",
        // quan 3
        "Ph?????ng 01","Ph?????ng 02","Ph?????ng 03","Ph?????ng 04","Ph?????ng 05","Ph?????ng 06","Ph?????ng 07","Ph?????ng 08","Ph?????ng 09","Ph?????ng 10","Ph?????ng 11","Ph?????ng 12","Ph?????ng 13","Ph?????ng 14","Ph?????ng 15"
    ]
    if (!this.state.loading && Cookie.get("token")) {
      return (
        <div className="Shipping_address">
          <h3 className="address_order">?????a ch??? giao h??ng</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-control">
              <label for="fullName" className="input-label">
                H???:
              </label>
              <div>
                <input
                  type="text"
                  required=""
                  name="fullName"
                  placeholder="Nh???p h??? v?? t??n"
                  
                  className="Input-sc-17i9bto-0 girQwT"
                  value={this.state.info.firstName}
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, firstName: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <p className="message-error">{this.state.firstname_error}</p>
            <div className="form-control">
              <label for="fullName" className="input-label">
                T??n:
              </label>
              <div>
                <input
                  type="text"
                  required=""
                  name="fullName"
                  placeholder="Nh???p h??? v?? t??n"
                 
                  className="Input-sc-17i9bto-0 girQwT"
                  value={this.state.info.lastName}
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, lastName: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <p className="message-error">{this.state.lastname_error}</p>
            <div className="form-control">
              <label for="company" className="input-label">
                C??ng ty:
              </label>
              <div>
                <input
                  type="text"
                  name="company"
                  placeholder="Nh???p c??ng ty"
                  className="Input-sc-17i9bto-0 girQwT"
                  value={this.state.info.firm}
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, firm: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <p className="message-error">{this.state.firm_error}</p>
            <div className="form-control">
              <label for="telephone" className="input-label">
                S??? ??i???n tho???i:
              </label>
              <div>
                <input
                  type="text"
                  required=""
                  name="telephone"
                  placeholder="Nh???p s??? ??i???n tho???i"
                  className="Input-sc-17i9bto-0 girQwT"
                  value={this.state.info.phoneNumber}
                  onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, phoneNumber: e.target.value },
                    })
                  }
                  
                />
              </div>
            </div>
            <p className="message-error">{this.state.phone_error}</p>
            <div className="form-control">
              <label for="email" className="input-label">
                Email:
              </label>
              <div>
                <input
                  type="text"
                  required=""
                  name="email"
                  placeholder="Nh???p email"
                  className="Input-sc-17i9bto-0 girQwT"
                  value={this.state.user.email}
                />
              </div>
            </div>
            
            <div className="form-control">
              <label for="region" className="input-label">
                T???nh/Th??nh ph???:
              </label>
              <select  onChange={(e) =>
                    // this.setState({
                    //   info: { ...this.state.info, region: e.target.value },
                    // })
                    this.Region(e)
                  }>
                {this.state.info.region === "" ? (
                  <option value="" selected disabled hidden>Ch???n T???nh/Th??nh ph???</option>
                ) : (
                  <option selected value={this.state.info.region}>
                    {this.state.info.region}
                  </option>
                )}
                {regions_list.map((region, index) => {
                  if (this.state.info.region === region) {
                    return <></>;
                  }
                  return <option value={region}>{region}</option>;
                })}
              </select>
            </div>
            
            <div className="form-control">
              <label for="district" className="input-label">
                Qu???n huy???n:
              </label>
               <select required onChange={(e) =>this.Distric(e)}>
                  {/* <select>
                  <option value="" selected disabled hidden>Choose here</option>
                  <option>1</option>
                  <option >2</option>
                  <option>3</option>
                  <option>4</option> */}
                 {this.state.info.district === "" ? (
                  <option value="" selected disabled hidden>Ch???n Qu???n/Huy???n</option>
                ) : (
                  <option selected="selected" value={this.state.info.district}>
                    {this.state.info.district}
                  </option>
                )} 
                 {district_list.map((district, index) => {
                  if (this.state.info.district === district) {
                    return <></>;
                  }
                  if (this.state.info.region === "H??? Ch?? Minh") {
                    if(index >23){
                      return <></>
                    }
                    return <option value={district}>{district}</option>;
                  } else {
                   
                      if(index >23){
                        return <option value={district}>{district}</option>;
                      }
                      else{
                        return <></>
                      }
                   
                  }
                })} 
              </select>
            </div>
            
            <div className="form-control">
              <label for="ward" className="input-label">
                Ph?????ng x??:
              </label>
              <select required onChange={(e) =>this.Wards(e)} >
                {this.state.info.wards === "" ? (
                    <option value="" selected disabled hidden>Ch???n Ph?????ng/X??</option>
                ) : (
                  <option selected="selected" value={this.state.info.wards}>
                    {this.state.info.wards}
                  </option>
                )}
                { ward_list.map((ward,index)=>{
                    if(this.state.info.district === "Qu???n 1"){
                        if(index >=10){
                            return <></>                        
                        }
                        else{
                            return(
                                <option value={ward}>{ward}</option>
                            )
                        }
                    }
                    else if(this.state.info.district === "Qu???n 2"){
                        if(index <10 || index >20){
                            return <></>                        
                        }
                        else{
                            return(
                                <option value={ward}>{ward}</option>
                            )
                        }
                    }
                    else{
                        if(index <=20){
                            return <></>                        
                        }
                        else{
                            return(
                                <option value={ward}>{ward}</option>
                            )
                        }
                    }
                })}
                
               
              </select>
            </div>
           
            <div className="form-control">
              <label for="address" className="input-label">
                ?????a ch???:
              </label>
              <textarea
                required=""
                name="street"
                rows="5"
                placeholder="Nh???p ?????a ch???"
                value={this.state.info.street}
                onChange={(e) =>
                    this.setState({
                      info: { ...this.state.info, street: e.target.value },
                    })
                  }
              ></textarea>
            </div>
            <p className="message-error">{this.state.address_error}</p>
            <div className="form-control">
              <label className="input-label">&nbsp;</label>
              <button type="submit" className="btn-submit">
                Giao t???i ?????a ch??? n??y
              </button>
              <Link to="/shopping-cart">
              <button type="submit" className="btn-submit" style={{marginLeft:50 +'px',backgroundColor:"blue",color:"#fff"}}>
                Quay L???i
              </button>
              </Link>
            </div>
           
          </form>
        </div>
      );
    }
    if (!this.state.authenticate) {
      return <h2 className="ProductList-title">You need to login</h2>;
    }
    return <h2 className="ProductList-title">Waiting for API...</h2>;
  }
}
