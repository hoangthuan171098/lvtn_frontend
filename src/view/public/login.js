import React, { Component } from "react"
import "./style/login.scss"
import {Link} from 'react-router-dom'
import { Redirect } from 'react-router'
import Cookie from 'js-cookie'
import axios from 'axios'
import { connect } from 'react-redux'
import { toast } from "react-toastify"

class Login extends Component {
    constructor(props) {
        super(props);
            this.state = {
            email: "",
            password: "",
            isshowpassword: false,
            isLogined: false
        };
    } 
    async componentDidMount(){
        if(Cookie.get('username')){
            this.setState({isLogined:true})
        }
    }

    handleEmail = (e) => {
            this.setState({
            email: e.target.value,
        });
    };

    handlePassword = (e) => {
        this.setState({
            password: e.target.value
        });
    };

    handleLogin = async (e) => {
        e.preventDefault()
        await axios
        .post(process.env.REACT_APP_BACKEND_URL + '/auth/local', {
            identifier: this.state.email,
            password: this.state.password
        })
        .then(response => {
            let data = response.data
            this.props.loginHandle(data)
            if(data.user.role.name === 'Admin'){
                this.props.history.push('/admin')
            }
            else if(data.user.role.name === 'Manager'){
                this.props.history.push('/manager/dashboard')
            }else if(data.user.role.name === 'Shipper'){
                this.props.history.push('/shipment')
            }
            else{
                this.props.history.push('/')
            }
        })
        .catch(error => {
            toast.error('Email hoặc mật khẩu không chính xác, xin hẫy nhập lại!')
            console.log('An error occurred:', error.response)
        })
    };

    handleisshowpassword = () => {
        this.setState({
            isshowpassword: !this.state.isshowpassword,
        });
    };
    render() {
        if(this.state.isLogined){
            return(
                <Redirect to='/admin'/>
            )
        }
        return (
            <div className="Login">
                <form
                method="POST"
                className="form"
                id="form-1"
                >
                    <h3 className="heading">Đăng nhập</h3>
                    <p className="desc">❤️</p>
                    <div className="spacer" />

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="VD: ABC@gmail.com"
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
                            <i className={this.state.isshowpassword ? "far fa-eye" : "far fa-eye-slash"}></i>
                        </span>

                        <span className="form-message" />
                    </div>

                    <div className="porgotpassword">
                        <p>Quên mật khẩu?</p>
                    </div>

                    <button
                        className="form-submit"
                        onClick={this.handleLogin}
                    >Đăng Nhập</button>

                    <div className="dk">
                        <p className="textdk">Bạn chưa có tài khoản?</p>
                        <Link to="/register">
                            <p className="linkdk">Đăng ký ngay</p>
                        </Link>
                    </div>

                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
       auth: state.auth
    }
}

function mapDispatchToProps(dispatch){
    return{
        loginHandle: (user) =>{
            dispatch({
                type: 'LOGIN',
                payload: user
            })
        },
        logoutHandle: () =>{
            dispatch({
                type: 'LOGOUT'
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);