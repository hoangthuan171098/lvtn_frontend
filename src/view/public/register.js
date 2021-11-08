import React, { Component } from "react"
import { Link } from "react-router-dom"
import './style/register.scss'
import axios from 'axios'
import { toast } from "react-toastify"

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
            isshowpassword: false,
        };
    }

    handleEmail = (e) => {
        this.setState({
            email: e.target.value,
        });
    };

    handlePassword = (e) => {
        this.setState({
            password: e.target.value,
        });
    };
  
    handleConfirm = (e) => {
        this.setState({
            confirmpassword: e.target.value,
        });
        console.log(e.target.value);
    };

    handleusername = (e) => {
        this.setState({
            username: e.target.value,
        });
    };

    handleRegister = (e) => {
        e.preventDefault()
        if(true){
            axios
                .post(process.env.REACT_APP_BACKEND_URL + '/users', {
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password,
                    confirmed: true
                })
                .then(response => {
                    this.props.history.push('/login')
                })
                .catch(error => {
                    toast.error('Đăng ký thất bại');
                    console.log('An error occurred:', error.response);
                });
            return;
        }
        toast.error('Email or username have been use, please change!!!');
        return;
    };

    handleisshowpassword = () => {
        this.setState({
            isshowpassword: !this.state.isshowpassword,
        });
    };
  
    render() {
    return (
      <div className="Register">
        <form method="POST" className="form" id="form-1">
          <h3 className="heading">Đăng ký thành viên</h3>
          <p className="desc">❤️</p>

          <div className="spacer" />
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="username"
              className="form-control"
              onChange={(e) => this.handleusername(e)}
            />
            <span className="form-message" />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="abc@gmail.com"
              className="form-control"
              onChange={(e) => this.handleEmail(e)}
            />
            <span className="form-message" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type={this.state.isshowpassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="form-control"
              onChange={(e) => this.handlePassword(e)}
            />
            <span
              className="showpassword"
              onClick={() => this.handleisshowpassword()}
            >
              <i
                className={
                  this.state.isshowpassword ? "far fa-eye" : "far fa-eye-slash"
                }
              ></i>
            </span>
            <span className="form-message" />
          </div>
          <div className="form-group">
            <label htmlFor="password_confirmation" className="form-label">
              Nhập lại mật khẩu
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Nhập lại mật khẩu"
              type={this.state.isshowpassword ? "text" : "password"}
              className="form-control"
              onChange={(e) => this.handleConfirm(e)}
            />
            <span className="form-message" />
            <span
              className="showpassword"
              onClick={() => this.handleisshowpassword()}
            >
              <i
                className={
                  this.state.isshowpassword ? "fa fa-eye" : "fa fa-eye-slash"
                }
              ></i>
            </span>
          </div>

          <button className="form-submit" onClick={(e) => this.handleRegister(e)}>
            Đăng ký
          </button>

          <div className="dn">
            Bạn đã có tài khoản?{" "}
            <Link to="/login">
                Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    );
  }
}
export default Register;