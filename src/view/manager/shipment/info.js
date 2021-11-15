import React, { Component } from 'react'
import Cookie from "js-cookie"
import axios from 'axios'
import Modal from 'react-modal'
import { toast } from 'react-toastify'

import Status from './component/status'
import UserInfo from '../components/UserInfo'

class ShipmentInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			shipment: {},
			openModal: false,
			shipper: '',
			users: []
		}
	}

	async componentDidMount() {
		axios
			.get(process.env.REACT_APP_BACKEND_URL + "/users",{
				headers:{
					'Authorization' : 'bearer ' + Cookie.get('token')
				}
			})
			.then(res=>{
				this.setState({users:res.data})
			})
			.catch(err=>{
				toast.error('Cannot connect to server!!!!')
				console.log(err.response)
			})
		let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/shipments/" + this.props.match.params.id,{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		});
		if (!response.ok) {
			console.log('Cannot connect to sever!!!')
			return
		}
		let data = await response.json();
		this.setState({ loading: false, shipment: data });
	}

	openModal = () =>{
		this.setState({openModal:true})
	}

	closeModal = () =>{
		this.setState({openModal:false})
	}

	showShipper = () =>{
		if(this.state.shipment.shipper){
			return(
				<div className='card'>
					<div className='card-body-sm'>
						<div className='row'>
							<div className='w-50'>
								<span className='impress'>SHIPPER:</span>
							</div>
							<div className='w-50'>
								<span>{this.state.shipment.shipper.username}</span>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return(
			<></>
		)
	}

	showSelectShiper = () =>{
		if(!this.state.shipment.shipper){
			return(			
				<div className='row'>
					<div className='col-lg-6'>
						<div className="form-group">
						<label> Người giao: </label>
						<input type='text' className='row-fluid' list='user-list'
							onChange={e=>this.setState({shipper:e.target.value})}
						/>
						<datalist id='user-list'>
							{this.state.users
							.filter(user=>user.username.includes(this.state.shipper) && user.role.name==='Shipper')
							.map((user,index)=>{
								return(
									<option value={user.id} key={index}>{user.username}</option>
								)
							})}
						</datalist>
						</div>
					</div>
				</div>
			)
		}
		else{
			return(
				<></>
			)
		}
	}

  	deliverClick = async () =>{
		if(this.state.shipper){
			await axios
				.put(process.env.REACT_APP_BACKEND_URL + '/shipments/' + this.state.shipment.id, {
					status: 'waiting to deliver',
					shipper: this.state.shipper
				},{
					headers: {
						'Authorization':'bearer '+ Cookie.get('token'),
					}
				})
				.then(async(res) => {
					let status
					if(this.state.shipment.theLast){
						status = 'delivering'
					}
					else{
						status = 'partial delivering'
					}
					await axios
						.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.shipment.orderID, {
							status: status
						},{
							headers: {
								'Authorization':'bearer '+ Cookie.get('token'),
							}
						})
						.then(res=>{
							toast.success("deliver product  success!");
							this.props.history.push('/manager/shipments')
						})
						.catch(err=>{
							toast.error('An error occurred, please check again.');
							console.log('An error occurred:', err.response);
						})
				})
				.catch(err => {
					toast.error('An error occurred, please check again.');
					console.log('An error occurred:', err.response);
				});
			return
		}
		await axios
			.put(process.env.REACT_APP_BACKEND_URL + '/shipments/' + this.state.shipment.id, {
				status: 'delivering'
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				}
			})
			.then(async(res) => {
				let status
				if(this.state.shipment.theLast){
					status = 'delivering'
				}
				else{
					status = 'partial delivering'
				}
				await axios
					.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.shipment.orderID, {
						status: status
					},{
						headers: {
							'Authorization':'bearer '+ Cookie.get('token'),
						}
					})
					.then(res=>{
						toast.success("deliver product success!");
						this.props.history.push('/manager/shipments')
					})
					.catch(err=>{
						toast.error('An error occurred, please check again.');
						console.log('An error occurred:', err.response);
					})
			})
			.catch(err => {
				toast.error('An error occurred, please check again.');
				console.log('An error occurred:', err.response);
			});
		return
 	}


	doneClick = async () =>{
		await axios
			.put(process.env.REACT_APP_BACKEND_URL + '/shipments/' + this.state.shipment.id, {
				status: 'delivered'
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				}
			})
			.then(async(res) => {
				let status
				if(this.state.shipment.theLast){
					status = 'delivered'
				}
				else{
					status = 'partial delivered'
				}
				await axios
					.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.shipment.orderID, {
						status: status
					},{
						headers: {
							'Authorization':'bearer '+ Cookie.get('token'),
						}
					})
					.then(res=>{
						toast.success("deliver product  success!");
						this.props.history.push('/manager/shipments')
					})
					.catch(err=>{
						toast.error('An error occurred, please check again.');
						console.log('An error occurred:', err.response);
					})
			})
			.catch(err => {
				toast.error('An error occurred, please check again.');
				console.log('An error occurred:', err.response);
			});
		return
	}

	backClick = () =>{
		this.props.history.push('/manager/shipments')
	}

  	render() {
    if (!this.state.loading && Cookie.get('token')) {
      return (
        <div>
			<div className="page-header">
				<div className="page-block">
					<div className="row align-items-center">
						<div className="col-md-12 p-0">
							<div className="page-header-title">
								<h5>Thông tin giao hàng</h5>
								ID: {this.state.shipment.id} <Status status={this.state.shipment.status} />
							</div>
						</div>
					</div>
				</div>
			</div>

            <div>
				<div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
					<div className='row'>
						<button onClick={this.deliverClick}
							className={this.state.shipment.status === 'waiting to deliver'?
								'btn btn-info mr-4':'btn btn-info mr-4 d-none'}
						>Giao hàng</button>
						
						<button onClick={this.doneClick}
							className={this.state.shipment.status === 'delivering'?
								'btn btn-info mr-4':'btn btn-info mr-4 d-none'}
						>Hoàn thành</button>
						<button className='btn btn-success' onClick={this.backClick}>Trở lại</button>
					</div>
				</div>

                <div className='w-75 float-left'>
                    <div className='card'>
                        <div className='card-body'>
							<div className='row'>
								<span className='impress flex-v-center'>Danh sách sản phẩm: </span>
								<table className='table'>
									<thead>
										<tr>
											<th>Tên</th>
											<th>Màu</th>
											<th>Cuộn</th>
											<th>Mét</th>
										</tr>
									</thead>
									<tbody>
									{this.state.shipment.productList.map((item,index)=>{
										return(
											<tr key={index}>
												<td>{item.product.name}</td>
												<td>{item.color}</td>
												<td>
													{item.quantity? item.quantity:'0'}
												</td>
												<td>
													{item.quantity_m? item.quantity_m:'0'}
												</td>
											</tr>
										)
									})}
									</tbody>
								</table>
							</div>
							{this.showSelectShiper()}
                        </div>
                    </div>
                </div>
				
				

				<div className='float-right' style={{width: 20 + '%'}}>
					<div className='card'>		
						<div className='card-body-sm'>
							<div className='row'>
								<div className='w-50'>
									<span className='impress'>NGƯỜI MUA:</span>
								</div>
								<div className='w-50'>
									<span onClick={()=>this.openModal()}
										style={{cursor:'pointer'}}
									>{this.state.shipment.buyer.username}</span>
								</div>
							</div>
							<div className='row'>
								<div className='w-50'>
									<span className='impress'>Tạo lúc:</span>
								</div>
								<div className='w-50'>
									<span>{this.state.shipment.createdAt.slice(0,10)}</span><br/>
									<span>{this.state.shipment.createdAt.slice(11,19)}</span>
								</div>
							</div>
						</div>
					</div>

					{this.showShipper()}

					<div className='card'>
							<div className='card-body-sm'>
								<div className='row'>
									<div className='w-50'>
										<span className='impress'>Cập nhật:</span>
									</div>
									<div className='w-50'>
										<span>{this.state.shipment.updatedAt.slice(0,10)}</span><br/>
										<span>{this.state.shipment.updatedAt.slice(11,19)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
              	</div>

				<div className='clear'></div>

				<Modal
						isOpen={this.state.openModal}
						onRequestClose={this.closeModal}
						contentLabel="Select product"
						ariaHideApp={false}
						style={{content:{marginLeft:300+'px',marginTop: 50+'px'}}}
					>
					<UserInfo user={this.state.shipment.buyer} clickBack={this.closeModal}/>
				</Modal>
        </div>
      )
    }
    return (<h2>Waiting for API...</h2>);
  	}
}

export default ShipmentInfo