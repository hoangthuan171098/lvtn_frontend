import React, { Component } from 'react'
import Cookie from "js-cookie"
import axios from 'axios'
import Modal from 'react-modal'

class ShipmentInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			authenticate: true,
			shipment: {},
			images: [],
			confirmModal: false
		}
	}

	async componentDidMount() {
		if(true){     
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
			this.setState({ loading: false,authenticate: true, shipment: data });
			return
		}
	}

  	deliverClick = async () =>{
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
						axios
							.post(process.env.REACT_APP_BACKEND_URL + '/notifications/', {
								title: 'Đơn hàng bắt đầu giao hàng',
								content: 'Đơn hàng #' + this.state.shipment.orderID + ' đã bắt đầu giao hàng.',
								to: this.state.shipment.buyer.id,
								isread: false
							},{ headers: {'Authorization':'bearer '+ Cookie.get('token')}})

						alert("deliver product  success!");
						this.props.history.push('/shipment')
					})
					.catch(err=>{
						alert('An error occurred, please check again.');
						console.log('An error occurred:', err.response);
					})
			})
			.catch(err => {
				alert('An error occurred, please check again.');
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
				const formData = new FormData()
				Array.from(this.state.images).forEach(image => {
					formData.append('files', image)
				});
				formData.append('ref','shipment')
				formData.append('refId',this.state.shipment.id)
				formData.append('field','confirmImage')

				axios
					.post(`http://localhost:1337/upload`, formData, {
						headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
					})
					.catch(err => {
						console.log('Error : '+err.response)
				})

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
						axios
							.post(process.env.REACT_APP_BACKEND_URL + '/notifications/', {
								title: 'Đơn hàng đã giao hàng xong',
								content: 'Đơn hàng #' + this.state.shipment.orderID + ' đã được giao hàng thành công.',
								to: this.state.shipment.buyer.id,
								isread: false
							},{ headers: {'Authorization':'bearer '+ Cookie.get('token')}})
						alert("deliver product  success!");
						this.props.history.push('/shipment/list-shipments-orders/')
					})
					.catch(err=>{
						alert('An error occurred, please check again.');
						console.log('An error occurred:', err.response);
					})
			})
			.catch(err => {
				alert('An error occurred, please check again.');
				console.log('An error occurred:', err.response);
			});
		return
	}

	showConfirmImage = () =>{
		if(this.state.images[0]){
			return(
				<div className='row' style={{marginTop:5+'px'}}>
					<img src={URL.createObjectURL(this.state.images[0])} 
					alt='hinh xac nhan' style={{margin:'auto'}}/>
				</div>
			)
		}
	}

	totalMoney = () =>{
		let total=0
		let list = this.state.shipment.productList
		for(let i=0; i<list.length; i++){
			let price = list[i].product.price
			if(list[i].quantity) total+=list[i].quantity*price
			if(list[i].quantity_m) total+=list[i].quantity_m*price
		}
		return total
	}

	openConfirmModal = () =>{
		this.setState({confirmModal:true})
	}

	closeConfirmModal = () =>{
		this.setState({confirmModal:false,images:[]})
	}

	backClick = () =>{
		this.props.history.push('/shipment/list-shipments-orders/')
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
								<h5>SHIPMENT INFO</h5>
								ID: {this.state.shipment.id}
							</div>
						</div>
					</div>
				</div>
			</div>

            <div>
				<div className='row'>
					<div className='clear'>
						<button onClick={this.deliverClick}
							className={this.state.shipment.status === 'waiting to deliver'?
								'btn btn-primary mr-4':'btn btn-primary mr-4 d-none'}
						>Deliver</button>
						
						<button onClick={this.openConfirmModal}
							className={this.state.shipment.status === 'delivering'?
								'btn btn-primary mr-4':'btn btn-primary mr-4 d-none'}
						>Done</button>
						<button className='btn btn-success' onClick={this.backClick}>Back</button>
					</div>
				</div>
                <div className='w-75 float-left' style={{height: 50 + 'vh'}}>
                    <div className='card' >
                        <div className='card-body'>
							<div className='row'>
								<span className='impress flex-v-center'>Product List: </span>
								<table className='table' >
									<thead>
										<tr>
											<th>Name</th>
											<th>Color</th>
											<th>Cuộn</th>
											<th>M</th>
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
                        </div>
                    </div>
                </div>

				<div className='card float-right' style={{width: 20 + '%'}}>
					<div className='card-body'>
						<div className='row'>
							<div className='w-50'>
								<span className='impress'>BUYER:</span>
							</div>
							<div className='w-50'>
								<span>{this.state.shipment.buyer.username}</span>
							</div>
						</div>
						<div className='row'>
							<div className='w-50'>
								<span className='impress'>CREATED AT:</span>
							</div>
							<div className='w-50'>
								<span>{this.state.shipment.createdAt.slice(0,10)}</span><br/>
								<span>{this.state.shipment.createdAt.slice(11,19)}</span>
							</div>
						</div>
					</div>
				</div>

				<div className='card float-right' style={{width: 20 + '%'}}>
					<div className='card-body'>
						<div className='row'>
							<div className='w-50'>
								<span>Tổng tiền:</span>
							</div>
							<div className='w-50'>
								<span>{this.totalMoney()}đ</span><br/>
							</div>
						</div>
					</div>
				</div>
            </div>
			
			<Modal
				isOpen={this.state.confirmModal}
				onRequestClose={this.closeConfirmModal}
				contentLabel="Xác nhận"
				ariaHideApp={false}
				style={{content:
					{margin:'auto',width:500+'px',height:400+'px'}
				}}
			>
				<div className='row'>
					<label style={{fontSize:15+'px'}}>Xác nhận:</label>
				</div>
				
				<div style={{marginBottom: 10+'px'}}>
					<input type='file' onChange={e=>this.setState({images:e.target.files})}/>
					{this.showConfirmImage()}
				</div>
				<div className='row'>
					<button className='btn btn-info mr-4' onClick={this.doneClick}>Xác nhận</button>
					<button className='btn' style={{backgroundColor:'#e52d27',color:'white'}} onClick={this.closeConfirmModal}>Hủy</button>
				</div>
			</Modal>

        </div>
		
      )
    }
    if(!this.state.authenticate){
      return <h2>You need to login</h2>
    }
    return (<h2>Waiting for API...</h2>);
  	}
}

export default ShipmentInfo