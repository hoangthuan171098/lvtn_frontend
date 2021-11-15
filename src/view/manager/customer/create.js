import React, { Component } from 'react'
import Cookie from 'js-cookie'
import axios from 'axios'

class AccountCreate extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			user: {
				username: "",
				email: "",
				type: {name:'none'},
				password: "",
				confirmPassword: "",
			}
		}
	}


	async componentDidMount() {
		let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/product-categories",{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		})
		let response2 = await fetch(process.env.REACT_APP_BACKEND_URL + "/product-categories",{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		})
		if (!response.ok || !response2.ok) {
			alert('Không thể kết nối với database!')
			return
		}
		this.setState({ loading: false })
		return
	}

	render(){
		const clickSubmit = (event) =>{
			event.preventDefault()
			if(Number(this.state.user.username) < 1){
			  alert("Bạn phải nhập username")
			  return
			}
			axios
				.post(process.env.REACT_APP_BACKEND_URL + '/users/', {
					username: this.state.user.username,
					email: this.state.user.email,
					role: this.state.user.type.id,
					password: this.state.user.password,
					confirm: true
				},{
					headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
					},
				})
				.then(response => {
					alert('Tạo tài khoản thành công!')
					this.props.history.push('/manager/customers')
				})
				.catch(error => {
					alert('Tạo tài khoản thất bại!')
					console.log('An error occurred:', error.response)
				})
			return
		}
		
		const clickBack = (event) =>{
			event.preventDefault()
			this.props.history.push('/manager/customers')
		}
		
		const handleChangeType = async (typeName) =>{
			let response = await fetch(process.env.REACT_APP_BACKEND_URL + '/users-permissions/roles' ,{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			if (!response.ok) {
				return
			}
			let data = await response.json()
			let roleList = data.roles
			let role = roleList.find((index) => typeName===index.name)
			console.log(role)
			this.setState({ user: {...this.state.user,type: role} })
			console.log(data)
		}
		
		
		if (!this.state.loading) {
			return (
			<div className="Create">
	
			<div className="module">
				<div className="module-head">
					<h2>Create customer</h2>
				</div>
				<div className="module-body" >
	
					<form id="account-create-form">
			
						<div className="controls">
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Username :</label>
										<input type="text" className="row-fluid" value={this.state.user.username} required
											data-error="Username is required." onChange={(e)=>this.setState({user:{...this.state.user,username:e.target.value}})} />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label> Email :</label>
										<input type="email" className="row-fluid" value={this.state.user.email} required
											data-error="Email is required." onChange={(e)=>this.setState({user:{...this.state.user,email:e.target.value}})}/>
									</div>
								</div>
							</div>
	
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Password :</label>
										<input type="password" className="row-fluid" value={this.state.user.password} required
										onChange={(e)=>this.setState({user:{...this.state.user,password:e.target.value}})} />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label>Confirmed password :</label>
										<input type="password" className="row-fluid" value={this.state.user.confirmPassword} required
										onChange={(e)=>this.setState({user:{...this.state.user,confirmPassword:e.target.value}})} />
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Role :</label>
										<select className="row-fluid" value={this.state.user.type.name}
										onChange={(e)=>handleChangeType(e.target.value)}>
											<option value="none">Select Role</option>
											<option value="Customer"> Customer</option>
											<option value="Manager"> Manager</option>
											<option value="Admin"> Admin </option>
										</select>
									</div>
								</div>
							</div>
	
							<div className='row'>
								<div className='col-2'>	
									<button  className="btn btn-primary" onClick={e=>clickSubmit(e)}>Create</button>
								</div>
								<button className="btn btn-primary" onClick={(e)=>clickBack(e)} style={{marginLeft: 30+'px'}} > Back </button>
							</div>
						</div>
					</form>
				</div>
			</div>
			</div>
			)
		}
		return (<h2 className="ProductList-title">Waiting for API...</h2>)
	}

}

export default AccountCreate