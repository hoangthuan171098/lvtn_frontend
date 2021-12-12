import React, { Component } from 'react'
import Cookie from 'js-cookie'
import axios from 'axios'
import {toast} from 'react-toastify'

class AccountCreate extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			user: {
				username: "",
				email: "",
				password: "",
				confirmPassword: "",
			},
			images:[],
			info:{}
		}
	}


	async componentDidMount() {
		let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/users",{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		})
		if (!response.ok) {
			alert('Không thể kết nối với database!')
			return
		}
		this.setState({ loading: false })
		return
	}

	avatarImg = () =>{
		if(this.state.images.length === 0){
		  return
		}
		return(
		  <img className='image-preview' src={URL.createObjectURL(this.state.images[0])} alt=""></img>
		)
	}

	handleChangeImage = (e) =>{
		e.preventDefault()
		this.setState({images:e.target.files})
	}

	render(){
		const clickSubmit = async (e) =>{
			e.preventDefault()
			await axios
				.post(process.env.REACT_APP_BACKEND_URL + '/users', {
					username: this.state.user.username,
					email: this.state.user.email,
					password: this.state.user.password,
					confirm: true
				},{
					headers: {'Authorization':'bearer '+ Cookie.get('token')}
				})
				.then(async res => {
					const formData = new FormData();
				Array.from(this.state.images).forEach(image => {
					formData.append('files', image);
				});

				formData.append('ref','user')
				formData.append('refId',res.data.id)
				formData.append('field','avatar')
				formData.append('source', 'users-permissions')
					await axios
						.post(`http://localhost:1337/upload`, formData, {
							headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
						})
						.catch(() => {
							toast.error('Không thể thêm avatar.')
							return
						});
					await axios
						.post(process.env.REACT_APP_BACKEND_URL + '/customer-infos', {
							customerId: res.data.id,
							firstName: this.state.info.firstName,
							lastName: this.state.info.lastName,
							firm: this.state.info.lastName,
							address: this.state.info.address,
							dateOfBirth: this.state.info.dateOfBirth,
							gender: this.state.info.gender,
							phoneNumber: this.state.info.phoneNumber
						},{
							headers: {'Authorization':'bearer '+ Cookie.get('token')}
						})
						.then(()=>{
							toast.success('Thêm khách hàng mới thành công.')
							this.props.history.push('/manager/customers')
						})
						.catch(()=>{
							toast.error('Thêm thông tin tài khoản thất bại!')
						})
				})
				.catch(() => {
					toast.error('Tạo tài khoản thất bại!')
				})
			return
		}
		
		const clickBack = (event) =>{
			event.preventDefault()
			this.props.history.push('/manager/customers')
		}
		
		if (!this.state.loading) {
			return (
			<div className="Create">
				<div className="page-header">
					<div className="page-block">
						<div className="row align-items-center">
							<div className="col-md-12 p-0">
								<div className="page-header-title">
									<h5>KHÁCH HÀNG MỚI</h5>
								</div>
							</div>
						</div>
					</div>
				</div>


				<form onSubmit={e=>clickSubmit(e)}>
				<div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
					<button className="btn btn-primary" onClick={clickBack}>Trở về</button>
					<button className="btn btn-primary m-r-20">Xác nhận</button>
				</div>

				<div className="card">
					<div className="card-body" >
						<div className="controls">
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Tên tài khoản :</label>
										<input type="text" className="row-fluid" required
											data-error="Username is required." onChange={(e)=>this.setState({user:{...this.state.user,username:e.target.value}})} />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label> Email :</label>
										<input type="email" className="row-fluid" defaultValue='' required
											data-error="Email is required." onChange={(e)=>this.setState({user:{...this.state.user,email:e.target.value}})}/>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Mật khẩu :</label>
										<input type="password" className="row-fluid" defaultValue='' required
										onChange={(e)=>this.setState({user:{...this.state.user,password:e.target.value}})} />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label>Xác nhận mật khẩu :</label>
										<input type="password" className="row-fluid" required
										onChange={(e)=>this.setState({user:{...this.state.user,confirmPassword:e.target.value}})} />
									</div>
								</div>
							</div>
							<hr />

							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Họ :</label>
										<input type="text" className="row-fluid" required
										onChange={(e)=>this.setState({info:{...this.state.info,lastName:e.target.value}})} />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label>Tên :</label>
										<input type="text" className="row-fluid" required
										onChange={(e)=>this.setState({info:{...this.state.info,firstName:e.target.value}})} />
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Ngày sinh :</label>
										<input type="date" className="row-fluid" required
										onChange={(e)=>this.setState({info:{...this.state.info,dateOfBirth:e.target.value}})} />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label>Số điện thoại :</label>
										<input type="number" className="row-fluid" required
										onChange={(e)=>this.setState({info:{...this.state.info,phoneNumber:e.target.value}})} />
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Công ty :</label>
										<input type="text" className="row-fluid" required
										onChange={(e)=>this.setState({info:{...this.state.info,firm:e.target.value}})} />
									</div>
								</div>
								<div className="col-lg-6">
									<div className="form-group">
										<label>Địa chỉ :</label>
										<input type="text" className="row-fluid" required
										onChange={(e)=>this.setState({info:{...this.state.info,address:e.target.value}})} />
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-lg-6">
									<div className="form-group">
										<label>Giới tính:</label>
										<div>
											<div className="d-flex" style={{alignItems:'center'}}>
												<div className='col-4'>
													<input type="radio" name="gender"
														onChange={()=>this.setState({info:{...this.state.info,gender:true}})}/>
													<span >Nam</span>
												</div>

												<div className='col-4'>
													<input type="radio" name="gender"
														onChange={()=>this.setState({info:{...this.state.info,gender:false}})}/>
													<span>Nữ</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row">
								<div className='col-8'>
									<div className="form-group">
										<label>Ảnh đại diện :</label>
										<input ref={this.inputRef} class='img-input' type="file" required
											onChange={e=>{this.handleChangeImage(e)}}/>
										{this.avatarImg()}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				</form>
			</div>
			)
		}
		return (<h2 className="ProductList-title">Waiting for API...</h2>)
	}

}

export default AccountCreate