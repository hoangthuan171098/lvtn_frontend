import React from 'react'
import { Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import axios from 'axios'
import Cookie from 'js-cookie'


function mapStateToProps(state) {
    return {
       isLogined: state.auth.username
    }
}

function mapDispatchToProps(dispatch){
    return{
        logout: () =>{
            dispatch({
                type: 'LOGOUT'
            })
        }
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(class Header extends React.Component{
	constructor(props){
		super(props)
		this.state={
			notifications: []
		}
	}

	async componentDidMount(){
		this.getData()
		this.myInterval = setInterval(() => this.getData(),4000)
	}

	componentWillUnmount(){
		clearInterval(this.myInterval)
	}

	getData = async ()=>{
		await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/notifications?to='+Cookie.get('id'),{
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                }
            })
            .then(res=>{
                this.setState({notifications: res.data})
            })
	}

	markAllClick = (event) =>{
		event.preventDefault()
		let list = this.state.notifications.filter(i=>!i.isread)
		for(let i=0; i<list.length; i++){
			console.log(i)
			axios
				.put(process.env.REACT_APP_BACKEND_URL + '/notifications/'+list[i].id,{
					isread: true
				},{
					headers: {'Authorization':'bearer '+ Cookie.get('token')}
				})
		}
		this.getData()
	}

    logoutHandle = async (e) =>{
        e.preventDefault()
        this.props.logout()
        this.props.history.push('/login')
    }

	
	render(){
		return(
			<header className="navbar pcoded-header navbar-expand-lg navbar-light headerpos-fixed">
				<div className="m-header">
					<a className="mobile-menu" id="mobile-collapse1" href="#!"><span /></a>
					<Link to="/manager" className="b-brand">
						<img src="/assets/images/logo.svg" alt="" className="logo images" />
						<img src="/assets/images/logo-icon.svg" alt="" className="logo-thumb images" />
					</Link>
				</div>
				<a className="mobile-menu" id="mobile-header" href="#!">
					<i className="feather icon-more-horizontal" />
				</a>
				<div className="collapse navbar-collapse">
					<a href="#!" className="mob-toggler" />
					<ul className="navbar-nav mr-auto">
						<li className="nav-item">
							<div className="main-search open">
								<div className="input-group">
									<input type="text" id="m-search" className="form-control" placeholder="Search . . ." />
									<a href="#!" className="input-group-append search-close">
										{/* <i className="fa fa-times input-group-text" /> */}
									</a>
									<span className="input-group-append search-btn btn btn-primary">
										<i className="fa fa-search input-group-text" />
									</span>
								</div>
							</div>
						</li>
					</ul>
					<ul className="navbar-nav ml-auto">
						<li>
							<div className="dropdown">
								<a className="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded={false}>
									<i className="icon fa fa-bell-o" />
								</a>
								<div className="dropdown-menu dropdown-menu-right notification">
									<div className="noti-head">
										<h6 className="d-inline-block m-b-0">Notifications</h6>
										<div className="float-right">
											<a href='' className="m-r-10" onClick={(e)=>this.markAllClick(e)}>mark as read</a>
											<a href=''>clear all</a>
										</div>
									</div>
									<ul className="noti-body">
										{this.state.notifications.map((notification,index)=>{
											return(
												<li className={notification.isread? "notification":"notification gray-bg"}>
													<div className="media">
														<img className="img-radius" src="/assets/images/user/avatar-1.jpg" alt="Generic placeholder image" />
														<div className="media-body">
															<p><strong>{notification.title}</strong><span className="n-time text-muted"><i className="icon feather icon-clock m-r-10" />5 min</span></p>
															<p>{notification.content}</p>
														</div>
													</div>
												</li>
											)
										})}
									</ul>
									<div className="noti-footer">
										<a href="#!">show all</a>
									</div>
								</div>
							</div>
						</li>
						<li>
							<div className="dropdown drp-user">
								<a href="#" className="dropdown-toggle" data-toggle="dropdown">
									<i className="icon feather icon-settings" />
								</a>
								<div className="dropdown-menu dropdown-menu-right profile-notification">
									<div className="pro-head">
										<img src="/assets/images/user/avatar-1.jpg" className="img-radius" alt="User-Profile-Image" />
										<span>John Doe</span>
										<a href="auth-signin.html" className="dud-logout" onClick={e=>this.logoutHandle(e)}>
											<i className="feather icon-log-out" />
										</a>
									</div>
									<ul className="pro-body">
										<li><Link to="/manager" className="dropdown-item"><i className="fa fa-cog" style={{width:15+'px'}}/> Manager</Link></li>
										<li><Link to="/profile" className="dropdown-item"><i className="fa fa-user" style={{width:15+'px'}}/> Profile</Link></li>
										<li><Link to="#" className="dropdown-item"><i className="fa fa-envelope" style={{width:15+'px'}}/> My Messages</Link></li>
										<li><Link to="#" className="dropdown-item"><i className="fa fa-lock" style={{width:15+'px'}}/> Lock Screen</Link></li>
									</ul>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</header>
		)
	}
}))