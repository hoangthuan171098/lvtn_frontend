import React, { Component } from 'react'
import Cookie from 'js-cookie'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import {toast} from 'react-toastify'

class AccountInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			user: {},orders:[],
			page: {
				max:1,
				now:1,
				number:5
			},
			modal:{
				info: false,
				address: false,
				debt: false
			},
			changeInfo:{},changeUser:{}
		}
	}

	async componentDidMount() {
		let response1 = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/" + this.props.match.params.id,{
			headers: {'Authorization':'bearer '+ Cookie.get('token')}
		});
		let response2 = await fetch(process.env.REACT_APP_BACKEND_URL + "/customer-infos?customerId=" + this.props.match.params.id ,{
			headers: {'Authorization':'bearer '+ Cookie.get('token')}
		});
		let response3 = await fetch(process.env.REACT_APP_BACKEND_URL + "/orders?buyer=" + this.props.match.params.id ,{
			headers: {'Authorization':'bearer '+ Cookie.get('token')}
		});
		if (!response1.ok || !response2.ok) {
			console.log("Không thể kết nối với sever!");
			return
		}
		let data1 = await response1.json();
		let data2 = await response2.json();
		let data3 = await response3.json();
		if(data2.length !== 0){
			this.setState({info: data2[0]});
		}
		if(data3.length !== 0){
			let maxPage = Math.ceil(data3.length/this.state.page.number)

			this.setState({orders: data3,page:{...this.state.page,max:maxPage}});
		}
		this.setState({ loading: false, user: data1 });
		return
	}

	updateInfoClick = async () =>{
		if(this.state.changeUser.email !== this.state.user.email){
			await axios
				.put(process.env.REACT_APP_BACKEND_URL + "/users/" + this.props.match.params.id,{
					email: this.state.changeUser.email
				},{
					headers: {'Authorization':'bearer '+ Cookie.get('token')}
				})
				.catch(()=>{
					toast.error('Không thể cập nhật thông tin.')
				})
		}
		else{
			if(this.isEqualsJson(this.state.changeInfo,this.state.info)){
				toast.warning('Không có thông tin thay đổi.')
				return
			}
		}
		await axios
			.put(process.env.REACT_APP_BACKEND_URL + "/customer-infos/" + this.state.info.id,{
				lastName: this.state.changeInfo.lastName,
				firstName: this.state.changeInfo.firstName,
				phoneNumber: this.state.changeInfo.phoneNumber,
				gender: this.state.changeInfo.gender
			},{
				headers: {'Authorization':'bearer '+ Cookie.get('token')}
			})
			.catch(()=>{
				toast.error('Không thể cập nhật thông tin.')
			})
		toast.success('Cập nhật thông tin thành công.')
		this.closeInfoModal()
		this.componentDidMount()
	}

	updateAddressClick = async () =>{
		if(this.isEqualsJson(this.state.changeInfo,this.state.info)){
			toast.warning('Không có thông tin thay đổi.')
			return
		}
		await axios
			.put(process.env.REACT_APP_BACKEND_URL + "/customer-infos/" + this.state.info.id,{
				region: this.state.changeInfo.region,
				district: this.state.changeInfo.district,
				wards :this.state.changeInfo.wards,
				street: this.state.changeInfo.street
			},{
				headers: {'Authorization':'bearer '+ Cookie.get('token')}
			})
			.catch(()=>{
				toast.error('Không thể cập nhật thông tin.')
			})
		toast.success('Cập nhật địa chỉ thành công.')
		this.closeAddressModal()
		this.componentDidMount()
	}

	updateDebtClick = async () =>{
		if(this.isEqualsJson(this.state.changeInfo,this.state.info)){
			toast.warning('Không có thông tin thay đổi.')
			return
		}
		await axios
			.put(process.env.REACT_APP_BACKEND_URL + "/customer-infos/" + this.state.info.id,{
				debtAble: this.state.changeInfo.debtAble,
				maxDebt: this.state.changeInfo.maxDebt
			},{
				headers: {'Authorization':'bearer '+ Cookie.get('token')}
			})
			.catch(()=>{
				toast.error('Không thể công nợ thông tin.')
			})
		toast.success('Cài đặt công nợ thành công.')
		this.closeDebtModal()
		this.componentDidMount()

	}

	chatUser = () =>{
		this.props.history.push('/manager/chat?to='+this.state.user.id)
	}

	blockUser = async () =>{
		let action
		if(this.state.user.blocked){
			action='mở khóa'
		}
		else action='khóa'
		if(window.confirm('Bạn có chắc chắn muốn ' + action + ' không?')){
			await axios
				.put(process.env.REACT_APP_BACKEND_URL + "/users/" + this.props.match.params.id,{
					blocked: !this.state.user.blocked
				},{
					headers: {'Authorization':'bearer '+ Cookie.get('token')}
				})
				.then(()=>{
					toast.success(action + ' tài khoản thành công.')
					this.componentDidMount()
				})
				.catch(()=>{
					toast.error('Đã xãy ra lỗi.')
				})
		}
	}

	openAddressModal = () =>{
		this.setState({modal:{...this.state.modal,address: true},changeInfo:this.state.info,changeUser:this.state.user})
	}

	closeAddressModal = () =>{
		this.setState({modal:{...this.state.modal,address: false}})
	}

	openDebtModal = () =>{
		this.setState({modal:{...this.state.modal,debt: true},changeInfo:this.state.info,changeUser:this.state.user})
	}

	closeDebtModal = () =>{
		this.setState({modal:{...this.state.modal,debt: false}})
	}

	openInfoModal = () =>{
		this.setState({modal:{...this.state.modal,info: true},changeInfo:this.state.info,changeUser:this.state.user})
	}

	closeInfoModal = () =>{
		this.setState({modal:{...this.state.modal,info: false,changeInfo:this.state.info}})
	}

	Region = async (e) =>{
		if(e.target.value !== this.state.changeInfo.region){
			await this.setState({
				changeInfo: { ...this.state.changeInfo,region:e.target.value,district: "",wards: ""}
			})
		}
	}
	Distric = async (e) =>{
		if(e.target.value !== this.state.changeInfo.district){
			await this.setState({
				changeInfo: { ...this.state.changeInfo, district: e.target.value,wards: ""}
			})
		}
	}
	Wards = async (e) =>{
		await this.setState({
			changeInfo: { ...this.state.changeInfo, wards: e.target.value }
		})
	}

	previousPage = () =>{
		if(this.state.page.now === 1) return
		else this.setState({page:{...this.state.page,now: this.state.page.now - 1}})
	}

	nextPage = () =>{
		if(this.state.page.now === this.state.page.max) return
		else this.setState({page:{...this.state.page,now: this.state.page.now + 1}})
	}

	moveToOrder = (orderId) =>{
		this.props.history.push('/manager/orders/'+orderId)
	}
	
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
		
			"Quận Ba Đình",
			"Quận Bắc Từ Liêm",
			"Quận Cầu Giấy",
			"Quận Đống Đa",
			"Quận Hà Đông",
			"Quận Hai Bà Trưng",
			"Quận Hoàn Kiếm",
			"Quận Hoàng Mai",
			"Quận Long Biên",
			"Quận Nam Từ Liêm",
			"Quận Tây Hồ",
			"QuậnThanh Xuân",
			"Thị Xã Sơn Tây",
			"Huyện Ba Vì",
			"Huyện Chương Mỹ",
			"Huyện Đan Phượng",
			"Huyện Đông Anh",
			"Huyên Gia Lâm",
			"Huyện Hoài Đức",
			"Huyện Mê Linh"
		];
		var ward_list = [
			"Phường Bến Nghé",
			"Phường Bến Thành",
			"Phường Cầu Kho",
			"Phường Cầu Ông Lãnh",
			"Phường Cô Giang",
			"Phường Đa Kao",
			"Phường Nguyễn Cư Trinh",
			"Phường Nguyễn Thái Bình",
			"Phường Phạm Ngũ Lão",
			"Phường Tân Định",
			"Phường An Khánh",
			"Phường An Lợi Đông",
			"Phường An Phú",
			"Phường Bình An",
			"Phường Bình Khánh",
			"Phường Bình Trưng Đông","Phường Bình Trưng Tây","Phường Cát Lái","Phường Thạnh Mỹ Lợi","Phường Thảo Điền","Phường Thủ Thiêm",
			"Phường 01","Phường 02","Phường 03","Phường 04","Phường 05","Phường 06","Phường 07","Phường 08","Phường 09","Phường 10","Phường 11","Phường 12","Phường 13","Phường 14","Phường 15"
		]
		let newestOrder
		if(this.state.orders.length !== 0){
			newestOrder = this.state.orders[this.state.orders.length-1]
		}
	  
		if (!this.state.loading) {
			return (
				<div className='CustomerInfo'>
                	<div className="page-header">
						<div className="page-block">
							<div className="row align-items-center">
								<div className="col-md-12 p-0">
									<div className="page-header-title">
										<h5>THÔNG TIN TÀI KHOẢN</h5>
										ID: {this.state.user.id}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div>
						<div className='float-left' style={{width:60+'%'}}>
							<div className='card'>
								<div className='card-body'>
									<div className='d-flex justify-content-between m-b-5'>
										<div className='d-flex align-items-center'>
											<img src={process.env.REACT_APP_BACKEND_URL + this.state.user.avatar.url}
												alt='avatar' style={{width:40+'px',height:40+'px',borderRadius:50+'%'}}
											/>
											<span className='min-h-0 ml-4'>
												<strong>{this.state.user.username}</strong>
											</span>
										</div>
										<div className='d-flex align-items-center'>
											<i className='fa fa-comments select-able fsize-20' onClick={this.chatUser}></i>
											<i className={this.state.user.blocked?'fa fa-unlock-alt select-warn fsize-20 m-l-5'
												:'fa fa-lock select-warn fsize-20 m-l-5'}
												onClick={this.blockUser}></i>
										</div>
									</div>
									<hr />
									<div className='row'>
										<div className='col-4'>
											<p className='text-center mb-0'>Đơn hàng gần nhất</p>
											<p className='text-center font-weight-bold'>
												{newestOrder?
													newestOrder.createdAt.slice(0,10)+' '+newestOrder.createdAt.slice(11,19)
													:'Chưa có'
												}
											</p>
										</div>
										<div className='col-4'>
											<p className='text-center mb-0'>Tổng nợ {' '}
												<i className='fa fa-cog select-able' onClick={this.openDebtModal}></i>
											</p>
											<p className='text-center font-weight-bold mb-0'>
												{this.state.info.debt? Number(this.state.info.debt).toLocaleString('en-US')+' VNĐ':' 0 VNĐ'}
											</p>
											<p className='text-center mb-0 fsize-12'>
												max: 
												{this.state.info.debtAble?
													this.state.info.maxDebt?
														Number(this.state.info.maxDebt).toLocaleString('en-US')
														:'0'
													:' Chưa mở'
												}
											</p>
										</div>
										<div className='col-4'>
											<p className='text-center mb-0'>Tạo lúc</p>
											<p className='text-center font-weight-bold'>
												{this.state.user.createdAt.slice(0,10)+' '+this.state.user.createdAt.slice(11,19)}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="card">
								<div className='card-header'>
									Đơn hàng {' ('+this.state.orders.length+')'}
									<div className='float-right'>
										<span style={{cursor:'pointer'}} onClick={this.previousPage}>{'< '}</span>
										<span>{this.state.page.now+'/'+this.state.page.max}</span>
										<span style={{cursor:'pointer'}} onClick={this.nextPage}>{' >'}</span>
									</div>
								</div>
								<div className='card-body'>
									<ul>
										{this.state.orders
										.sort((a,b)=>(new Date(b.createdAt.slice(0,19)+'Z')) - (new Date(a.createdAt.slice(0,19)+'Z')))
										.filter((order,index)=>index>=(this.state.page.now-1)*this.state.page.number
											&&index<this.state.page.now*this.state.page.number)
										.map((order,index)=>{
											return(
												<li key={index}>
													<span className='select-able' onClick={()=>this.moveToOrder(order.id)}>#{order.id}</span><br/>
													<span>Đặt lúc:{order.createdAt.slice(0,10)+' '
														+order.createdAt.slice(11,19)}
													</span>
													<span className='float-right min-h-0'>{order.status}</span>
													<hr/>
												</li>
											)
										})}
									</ul>
								</div>
							</div>
						</div>

						<div className='float-right' style={{width:35+'%'}}>
							<div className='card'>
								<div className='card-body-sm'>
									<h6>Thông tin <i className='fa fa-pencil select-able' onClick={this.openInfoModal}></i> </h6>
									<hr/>
									<div className='row'>
										<div className='w-25'>Email:</div>
										<div className='w-75'>{this.state.user.email}</div>
									</div>
									<div className='row'>
										<div className='w-25'>Họ tên:</div>
										<div className='w-75'>
											{this.state.info?
												this.state.info.lastName+' '+this.state.info.firstName
												: ""
											}
										</div>
									</div>
									<div className='row'>
										<div className='w-25'>Giới tính:</div>
										<div className='w-75'>{this.state.info? this.state.info.gender? 'Nam':'Nữ':''}</div>
									</div>
									<div className='row'>
										<div className='w-25'>Số ĐT:</div>
										<div className='w-75'>
											{this.state.info?
												this.state.info.phoneNumber
												: ""
											}
										</div>
									</div>
									<div className='row'>
										<div className='w-25'>Công ty:</div>
										<div className='w-75'>
											{this.state.info?
												this.state.info.firm
												: ""
											}
										</div>
									</div>
									<hr/>
									<h6>Địa chỉ <span className='fa fa-pencil select-able' onClick={this.openAddressModal}></span></h6>
									<div className='row'>
										{this.state.info?
											this.state.info.street
											: ""
										}
									</div>
									<div className='row'>
										{this.state.info?
											this.state.info.wards+','+this.state.info.district+','+this.state.info.region
											: ""
										}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style={{clear:'both'}}></div>

					<Modal
						show={this.state.modal.info}
						onHide={this.closeInfoModal}
						centered
					>
						<Modal.Body >
							<div className="card border-0">
								<div className="card-header pb-0">
									<h2 className="card-title space ">Chỉnh sửa thông tin</h2>
								</div>
								<div className="card-body">
									<form>
										<div className='row'>
											<div className='col-6'>
												<label>Họ:</label>
												<div>
													<input type='text' defaultValue={this.state.info.lastName?this.state.info.lastName:""}
													onChange={(e)=>this.setState({changeInfo:{...this.state.changeInfo,lastName:e.target.value}})}/>
												</div>
											</div>
											<div className='col-6'>
												<label>Tên:</label>
												<div>
													<input type='text' defaultValue={this.state.info.firstName?this.state.info.firstName:""}
													onChange={(e)=>this.setState({changeInfo:{...this.state.changeInfo,firstName:e.target.value}})} />
												</div>
											</div>
										</div>
										<div className='row'>
											<div className='col-6'>
												<label>Email:</label>
												<div>
													<input type='text' defaultValue={this.state.user.email}
													onChange={(e)=>this.setState({changeUser:{...this.state.changeUser,email:e.target.value}})} />
												</div>
											</div>
											<div className='col-6'>
												<label>SĐT:</label>
												<div>
													<input type='Number' defaultValue={this.state.info.phoneNumber?this.state.info.phoneNumber:""} 
													onChange={(e)=>this.setState({changeInfo:{...this.state.changeInfo,phoneNumber:e.target.value}})}/>
												</div>
											</div>
										</div>
										<div className='row'>
											<label>Giới tính:</label>
											<div>
												<div className="d-flex" style={{alignItems:'center'}}>
													<div className='col-4'>
														<input type="radio" name="gender" defaultChecked={this.state.info? this.state.info.gender?true:false:false}
															onChange={()=>this.setState({changeInfo:{...this.state.changeInfo,gender:true}})}/>
														<span >Nam</span>
													</div>

													<div className='col-4'>
														<input type="radio" name="gender" defaultChecked={this.state.info? this.state.info.gender?false:true:false}
															onChange={()=>this.setState({changeInfo:{...this.state.changeInfo,gender:false}})}/>
														<span>Nữ</span>
													</div>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<button className='btn-info mr-4' onClick={this.updateInfoClick}>Cập nhật</button>
							<button style={{backgroundColor:'#e52d27',color:'white'}} onClick={this.closeInfoModal}>Hủy</button>
						</Modal.Footer>
					</Modal>

					<Modal
						show={this.state.modal.address}
						onHide={this.closeAddressModal}
						centered
					>
						<Modal.Body >
							<div className="card border-0">
								<div className="card-header pb-0">
									<h2 className="card-title space ">Chỉnh sửa địa chỉ</h2>
								</div>
								<div className="card-body">
									<form>
										<div className='m-b-10'>
											<label className="input-label min-w-120">
												Tỉnh/Thành phố:
											</label>
											<select className='w-100' onChange={(e) =>this.Region(e)}>
												{this.state.changeInfo.region === "" ? (
													<option value="" selected disabled hidden>Chọn Tỉnh/Thành phố</option>
													) : (
													<option selected value={this.state.changeInfo.region}>
														{this.state.changeInfo.region}
													</option>
												)}
												{regions_list.map((region, index) => {
													if (this.state.changeInfo.region === region) return <></>
													return <option value={region} key={index}>{region}</option>;
												})}
											</select>
										</div>
											
										<div className='m-b-10'>
											<label className="input-label min-w-120">Quận huyện:</label>
											<select className='w-100' onChange={(e) =>this.Distric(e)}>
												{this.state.changeInfo.district === "" ? (
													<option value="" selected disabled hidden>Chọn Quận/Huyện</option>
													) : (
													<option selected="selected" value={this.state.changeInfo.district}>
														{this.state.changeInfo.district}
													</option>
												)}

												{district_list.map((district, index) => {
													if (this.state.changeInfo.district === district) return <></>;
													if (this.state.changeInfo.region === "Hồ Chí Minh") {
														if(index >23) return <></>
														return <option value={district}>{district}</option>;
													} 
													else{
														if(index >23) return <option value={district}>{district}</option>;
														else return <></>
													}
												})} 
											</select>
										</div>
										
										<div className='m-b-10'>
											<label className="input-label min-w-120">Phường xã:</label>
											<select className='w-100' onChange={(e) =>this.Wards(e)} >
												{this.state.changeInfo.wards === "" ? (
													<option value="" selected disabled hidden>Chọn Phường/Xã</option>
												) : (
												<option selected="selected" value={this.state.changeInfo.wards}>
													{this.state.changeInfo.wards}
												</option>
												)}
												{ ward_list.map((ward,index)=>{
													if(this.state.changeInfo.district === "Quận 1"){
														if(index >=10) return <></>
														else{
															return(<option value={ward}>{ward}</option>)
														}
													}
													else if(this.state.changeInfo.district === "Quận 2"){
														if(index <10 || index >20) return <></>
														else{
															return(<option value={ward}>{ward}</option>)
														}
													}
													else{
														if(index <=20) return <></>
														else{
															return(<option value={ward}>{ward}</option>)
														}
													}
												})}
											</select>
										</div>
									
										<div className='m-b-10'>
											<label className="input-label min-w-120">Địa chỉ:</label>
											<textarea className='w-100'
												required="" rows="3" placeholder="Nhập địa chỉ"
												value={this.state.changeInfo.street}
												onChange={(e) =>
													this.setState({changeInfo: { ...this.state.changeInfo, street: e.target.value }})
												}
											></textarea>
										</div>
									</form>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<button className='btn-info mr-4' onClick={this.updateAddressClick}>Cập nhật</button>
							<button style={{backgroundColor:'#e52d27',color:'white'}} onClick={this.closeAddressModal}>Hủy</button>
						</Modal.Footer>
					</Modal>
					<Modal
						show={this.state.modal.debt}
						onHide={this.closeDebtModal}
						centered
					>
						<Modal.Body >
							<div className="card border-0">
								<div className="card-header pb-0">
									<h2 className="card-title space ">Chỉnh sửa công nợ</h2>
								</div>
								<div className="card-body">
									<div className='m-b-10'>
										<label className="input-label min-w-120">
											Cho phép:
										</label>
										<select className='w-100' defaultValue={this.state.changeInfo.debtAble}
											onChange={(e)=>this.setState({
												changeInfo:{...this.state.changeInfo,debtAble:e.target.value}
											})}
										>
											<option value={true}>Có</option>
											<option value={false}>Không</option>
										</select>
									</div>
								
									<div className='m-b-10'>
										<label className="input-label min-w-120">
											Tối đa:
										</label>
										<select className='w-100' defaultValue={this.state.changeInfo.maxDebt}
											onChange={(e)=>this.setState({
												changeInfo:{...this.state.changeInfo,maxDebt:e.target.value}
											})}
										>
											<option value='500000000'>500,000,000 VNĐ</option>
											<option value='1000000000'>1,000,000,000 VNĐ</option>
											<option value='2000000000'>2,000,000,000 VNĐ</option>
											<option value='4000000000'>4,000,000,000 VNĐ</option>
											<option value='1000000000'>10,000,000,000 VNĐ</option>
											<option value='2000000000'>20,000,000,000 VNĐ</option>
										</select>
									</div>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<button className='btn-info mr-4' onClick={this.updateDebtClick}>Cập nhật</button>
							<button style={{backgroundColor:'#e52d27',color:'white'}} onClick={this.closeDebtModal}>Hủy</button>
						</Modal.Footer>
					</Modal>
				</div>
			)
		}
		return (<h2 className="ProductList-title">Waiting for API...</h2>);
	}

	isEqualsJson = (obj1,obj2)=>{
		let keys1 = Object.keys(obj1);
		let keys2 = Object.keys(obj2);
	
		//return true when the two json has same length and all the properties has same value key by key
		return keys1.length === keys2.length && Object.keys(obj1).every(key=>obj1[key]==obj2[key]);
	}
}


export default AccountInfo;