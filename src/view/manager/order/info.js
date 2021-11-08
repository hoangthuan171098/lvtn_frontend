import React, { Component } from 'react'
import Cookie from "js-cookie"
import axios from 'axios'
// import Modal from 'react-modal'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'

import Shipment from './component/shipment'
import Status from './component/status'
import UserInfo from '../components/UserInfo'


class OrderInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			order: {},
			isPartial: false,
			productList: [],
			packList: [],
			openModal: false,
			earlyDone: {show:false,reason:''},
			shipment: null,
			warehouse: []
		}
	}

	async componentDidMount() {
		axios
			.get(process.env.REACT_APP_BACKEND_URL + '/warehouses',
			{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				}
			})
			.then(res => {
				this.setState({warehouse: res.data})
			})

		let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/orders/" + this.props.match.params.id,{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		});
		if (!response.ok) {
			console.log('Cannot connect to sever!!!')
			return
		}
		let data = await response.json();
		this.setState({ 
			loading: false,
			order: data,
			productList:data.productList,
			packList:[],
			isPartial: false
		});
		return
	}

	openDoneModal = () =>{
		this.setState({earlyDone:{show:true,reason:''}})
	}

	closeDoneModal = () =>{
		this.setState({earlyDone:{show:false,reason:''}})
	}

	openModal = () =>{
		this.setState({openModal:true})
	}

	closeModal = () =>{
		this.setState({openModal:false})
	}

	confirmClick = async () =>{
		await axios
			.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.order.id, {
				status: 'processing'
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			.then(response => {
				axios
					.post(process.env.REACT_APP_BACKEND_URL + '/notifications/', {
						title: 'Xác nhận đơn hàng',
						content: 'Đơn hàng #' + this.state.order.id + ' đã được xác nhận.',
						to: this.state.order.buyer.id,
						isread: false
					},{ headers: {'Authorization':'bearer '+ Cookie.get('token')}})
				toast.success("Đã xác nhận đơn hàng")
				this.props.history.push('/manager/orders')
			})
			.catch(error => {
				toast.error("Đã xảy ra lỗi, hãy thử lại!")
				console.log('An error occurred:', error.response);
			});
		return
	}

	packAllClick = async () =>{
		let productList = this.state.order.productList
		for(let i=0; i<productList.length; i++){
			let item = productList[i]
			if(item.quantity){
				if(item.quantity>this.warehousequantity(item.product.name,item.color)){
					toast.warning("Sản phẩm "+item.product.name + ' tồn kho không đủ' )
					return
				}
			}
			if(item.quantity_m){
				if(item.quantity_m>this.warehousequantityM(item.product.name,item.color)){
					toast.warning("Sản phẩm "+item.product.name + ' tồn kho không đủ' )
					return
				}
			}
		}

		for(let i=0; i<productList.length; i++){
			let item = productList[i]
			if(item.quantity){
				let newExist = this.state.warehouse.find(i=>i.product.name===item.product.name).quantity
				let indexOfColor = newExist.findIndex(i=>i.color===item.color)
				newExist[indexOfColor].roll = newExist[indexOfColor].roll - item.quantity

				axios
					.put(process.env.REACT_APP_BACKEND_URL + '/warehouses/' + this.state.warehouse.find(i=>i.product.name===item.product.name).id, {
						quantity: newExist
					},{
						headers: {
							'Authorization':'bearer '+ Cookie.get('token'),
						},
					})
			}
			if(item.quantity_m){
				let newExist = this.state.warehouse.find(i=>i.product.name===item.product.name).quantity
				let indexOfColor = newExist.findIndex(i=>i.color===item.color)
				newExist[indexOfColor].m = newExist[indexOfColor].m - item.quantity_m

				axios
					.put(process.env.REACT_APP_BACKEND_URL + '/warehouses/' + this.state.warehouse.find(i=>i.product.name===item.product.name).id, {
						quantity: newExist
					},{
						headers: {
							'Authorization':'bearer '+ Cookie.get('token'),
						},
					})
			}
		}

		let exports = []
		for(let i=0; i<productList.length; i++){
			let item = productList[i]
			let isExist = false
			for(let j=0; j<exports.length; j++){
				if(item.product.name === exports[j].product.name){
					let quantity ={color:item.color}
					if(item.quantity_m) quantity.m=item.quantity_m
					if(item.quantity) quantity.roll=item.quantity
					exports[j].quantity.push(quantity)
					isExist = true
					break
				}
			}
			if(!isExist){
				let quantity ={color:item.color}
				if(item.quantity_m) quantity.m=item.quantity_m
				if(item.quantity) quantity.roll=item.quantity
				let data={
					product: item.product,
					quantity: [quantity]
				}
				exports.push(data)
			}
		}

		axios
			.post(process.env.REACT_APP_BACKEND_URL + '/exports', {
				creator: Cookie.get('id'),
				productList: exports
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			.catch(err=>{
				toast.error('Cannot create export!')
			})

		await axios
			.post(process.env.REACT_APP_BACKEND_URL + '/shipments', {
				productList: productList,
				status: 'waiting to deliver',
				buyer: this.state.order.buyer,
				orderID: this.state.order.id,
				theLast: true
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			.then(async (res)=>{
				await axios
					.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.order.id, {
						status: 'waiting to deliver',
						shipments: [res.data]
					},{
						headers: {
							'Authorization':'bearer '+ Cookie.get('token'),
						},
					})
					.catch(error => {
						toast.error('Cannot pack products')
						console.log('An error occurred:', error.response)
					});
				toast.success("Packed all product success!")
				this.props.history.push('/manager/orders')
			})
			.catch(err=>{
				toast.error('Cannot create shipment')
				console.log('An error occurred:', err.response)
			})
	}

	cancleClick = async () =>{
		await axios
			.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.order.id, {
				status: 'cancled'
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			.then(response => {
				axios
					.post(process.env.REACT_APP_BACKEND_URL + '/notifications/', {
						title: 'Đơn hàng đã bị hủy',
						content: 'Đơn hàng #' + this.state.order.id + ' đã bị hủy.',
						to: this.state.order.buyer.id,
						isread: false
					},{ headers: {'Authorization':'bearer '+ Cookie.get('token')}})
				toast.success("cancled order success!");
				this.props.history.push('/manager/orders')
			})
			.catch(error => {
				toast.error('An error occurred, please check again.');
				console.log('An error occurred:', error.response);
			});
	}

	confirmDoneClick = ()=>{
		if(this.state.earlyDone.reason === ''){
			toast.warning('Xin hãy nhập lý do.')
			return
		}
		axios
			.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.order.id, {
				status: 'done',
				doneReason: this.state.earlyDone.reason
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			.then(response => {
				toast.success("Đơn hàng đã hoàn tất!")
				this.props.history.push('/manager/orders')
			})
			.catch(error => {
				toast.error('Đã xãy ra lỗi.');
				console.log('An error occurred:', error.response);
			});
	}

	backClick = () =>{
		this.props.history.push('/manager/orders/')
	}

	updateClick = (e) =>{
		e.preventDefault()
		this.props.history.push('/manager/orders/' + this.state.order.id + '/update')
	}

	warehousequantity = (name,color) =>{
		let exist = this.state.warehouse.find(i=>i.product.name === name)
		if(exist){
			let quantity = exist.quantity.find(i=>i.color === color)
			if(quantity) return quantity.roll
			else return 0
		}
		else{
			return 0
		}
	}

	warehousequantityM = (name,color) =>{
		let exist = this.state.warehouse.find(i=>i.product.name === name)
		if(exist){
			let quantity = exist.quantity.find(i=>i.color === color)
			if(quantity) return quantity.m
			else return 0
		}
		else{
			return 0
		}
	}

	itemExistColor = (buyQuantity,existQuantity)=>{
		if(!buyQuantity) return 'blue'
		if(buyQuantity<=existQuantity) return 'blue'
		return 'red'
	}

	showPackClick = ()=>{
		if(this.state.order.remainProductList){
			this.setState({isPartial: !this.state.isPartial,show:'remainProducts'})
			return
		}
		this.setState({isPartial: !this.state.isPartial,show:'products'})
	}

	showProductList = () =>{
		let productList
		let title
		if(!this.state.order.remainProductList){
			productList = this.state.order.productList
			title = "Danh sách sản phẩm"
		}
		else{
			if(this.state.order.remainProductList.length === 0){
				productList = this.state.order.productList
				title = "Danh sách sản phẩm"
			}
			else{
				productList = this.state.order.remainProductList
				title = "sản phẩm chưa giao"
			}
		}
		return(
			<div className='row'>
				<span className='flex-v-center impress'>{title}</span>
				<table className='table'>
					<thead>
						<tr>
							<th>Tên</th>
							<th>Màu</th>
							<th>Cuộn</th>
							<th>Mét</th>
							<th style={{width:100+'px'}} className={this.state.isPartial? '':'d-none'}>Cuộn</th>
							<th style={{width:100+'px'}} className={this.state.isPartial? '':'d-none'}>Mét</th>
						</tr>
					</thead>
					<tbody>
						{productList.map((item,index)=>{
							return(
							<tr key={index}>
								<td><span>{item.product.name}</span></td>
								<td>{item.color}</td>
								<td>
									{item.quantity? item.quantity:'0'}/
									<span style={{color:this.itemExistColor(item.quantity,this.warehousequantity(item.product.name,item.color))}}>
										{this.warehousequantity(item.product.name,item.color)}
									</span>
								</td>
								<td>
									{item.quantity_m? item.quantity_m:'0'}/
									<span style={{color:this.itemExistColor(item.quantity_m,this.warehousequantityM(item.product.name,item.color))}}>
										{this.warehousequantityM(item.product.name,item.color)}
									</span>
								</td>
								<td className={this.state.isPartial? '':'d-none'}>
									<input type='number' className='short-input mr-4'
										onChange={e=>{this.changePackQuantity(e,index)}}
									></input>
								</td>
								<td className={this.state.isPartial? '':'d-none'}>
									<input type='number' className='short-input'
										onChange={e=>{this.changePackQuantityM(e,index)}}
									></input>
								</td>
							</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		)
	}



	showNote = () =>{
		if(this.state.order.note && this.state.order.note!==""){
			return(
				<div className='row'>
					<span className='impress'>Ghi chú : </span>
					{this.state.order.note}
				</div>
			)
		}
		return(<></>)
	}

	showReasonDone = () =>{
		if(this.state.order.reasonDone && this.state.order.reasonDone!==""){
			return(
				<div className='row'>
					<span className='impress'>Lý do hoàn tất: </span>
					{this.state.order.reasonDone}
				</div>
			)
		}
		return(<></>)
	}

	showShipment = () =>{
		if(this.state.shipment){
			return(
				<Shipment shipment={this.state.shipment} shipIndex={this.state.shipIndex}/>
			)
		}
		return(
			<></>
		)
	}

	showShipments = () =>{
		if(this.state.order.shipments.length !== 0){
			return(
				<div className='card'>
					<div className='card-body'>
						<div className='row'>
							<div className='w-100'>
								<span className='impress'>Giao hàng:</span>
							</div>
							{this.state.order.shipments.map((shipment,index)=>{
								return(
									<span index={index} onClick={(e)=>this.selectShipmentClick(e,shipment,index+1)}
										style={{cursor:'pointer'}}
									>#{index+1} - {shipment.status}</span>
								)
							})}
						</div>
					</div>
				</div>
			)
		}
	}

	showButton = () =>{
		let status = this.state.order.status
		if(status === 'waiting'){
			return(
				<div className='row'>
					<button onClick={this.confirmClick} className='btn btn-info mr-4'>Xác nhận</button>
					<button onClick={this.cancleClick} className='btn btn-danger mr-4'>Hủy</button>
					<button onClick={this.backClick} className='btn btn-success mr-4'>Trở về</button>
				</div>
			)
		}
		else if(status === 'processing'){
			return(
				<div className='row'>
					<button onClick={this.packAllClick}
						className={!this.state.isPartial? 'btn btn-info mr-4':'d-none'}
					>Đóng gói hết</button>
					<button onClick={this.showPackClick}
						className={!this.state.isPartial? 'btn btn-info mr-4':'d-none' }
					>Chọn sản phẩm</button>
					<button onClick={this.submitPackClick}
						className={this.state.isPartial? 'btn btn-info mr-4':'d-none'}
					>Xác nhận</button>
					<button onClick={this.backClick} className='btn btn-success mr-4'>Trở về</button>
				</div>
			)
		}
		else if(status === 'partial delivering'){
			return(
				<div className='row'>
					<button onClick={this.showPackClick}
						className={!this.state.isPartial? 'btn btn-info mr-4':'d-none' }
					>Chọn sản phẩm</button>
					<button onClick={this.submitPackClick}
						className={this.state.isPartial? 'btn btn-info mr-4':'d-none'}
					>Xác nhận</button>
					<button onClick={this.backClick} className='btn btn-success mr-4'>Trở về</button>
				</div>
			)
		}
		else if(status === 'partial delivered'){
			return(
				<div className='row'>
					<button onClick={this.openDoneModal}
						className={!this.state.isPartial? 'btn btn-info mr-4':'d-none' }
					>Hoàn tất</button>
					<button onClick={this.showPackClick}
						className={!this.state.isPartial? 'btn btn-info mr-4':'d-none' }
					>Chọn sản phẩm</button>
					<button onClick={this.submitPackClick}
						className={this.state.isPartial? 'btn btn-info mr-4':'d-none'}
					>Xác nhận</button>
					<button onClick={this.backClick} className='btn btn-success mr-4'>Trở về</button>
				</div>
			)
		}
		else if(status === 'waiting to deliver' && this.state.order.remainProductList){
			if(this.state.order.remainProductList.length !==0){
				return(
					<div className='row'>
						<button onClick={this.showPackClick}
							className={!this.state.isPartial? 'btn btn-info mr-4':'d-none' }
						>Chọn sản phẩm </button>
						<button onClick={this.submitPackClick}
							className={this.state.isPartial? 'btn btn-info mr-4':'d-none'}
						>Xác nhận</button>
						<button onClick={this.backClick} className='btn btn-success mr-4'>Trở về</button>
					</div>
				)
			}
		}
		return(
			<div className='row'><button onClick={this.backClick} className='btn btn-success mr-4'>Trở về</button></div>
		)
	}

	selectShipmentClick = (event,shipment,index) =>{
		event.preventDefault()
		this.setState({shipment:shipment,shipIndex:index})
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
                                    <h5>Thông tin đơn hàng 
										<i style={{cursor:'pointer',color:'blue'}}
										className={this.state.order.status==='waiting'? 'fa fa-edit':'d-none'}
										onClick={()=>{this.props.history.push("/manager/orders/"+this.state.order.id+"/update")}}
										></i>
									</h5>
									ID: {this.state.order.id + ' '}
									<Status status={this.state.order.status} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				
				<div className="card-body">
					
					<div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
						{this.showButton()}
					</div>

					<div className='w-75 float-left'>
						<div className='card'>
							<div className='card-body'>
								{this.showProductList()}
								{this.showReasonDone()}
								{this.showNote()}
							</div>
						</div>
					</div>

					<div className='float-right' style={{width: 20 + '%'}}>
						<div className='card'>
							<div className='card-body'>
								<div className='row'>
									<div className='w-50'>
										<span className='impress' style={{fontSize:13+'px'}}>NGƯỜI MUA:</span>
									</div>
									<div className='w-50'>
										<span onClick={()=>this.openModal()}
											style={{cursor:'pointer'}}
										>{this.state.order.buyer.username}</span>
									</div>
								</div>
								<div className='row'>
									<div className='w-50'>
										<span className='impress'>Tạo lúc:</span>
									</div>
									<div className='w-50'>
										<span>{this.state.order.createdAt.slice(0,10)}</span><br/>
										<span>{this.state.order.createdAt.slice(11,19)}</span>
									</div>
								</div>
							</div>
						</div>
						
						{this.showShipments()}

						<div className='card'>
							<div className='card-body' >
								<div className='row'>
									<div className='w-50'>
										<span className='impress'>Cập nhật:</span>
									</div>
									<div className='w-50'>
										<span>{this.state.order.updatedAt.slice(0,10)}</span><br/>
										<span>{this.state.order.updatedAt.slice(11,19)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{this.showShipment()}
					<div className='clear'></div>
				</div>
				
				<Modal
					show={this.state.openModal}
					onHide={this.closeModal}
					contentLabel="Chọn sản phẩm"
					ariaHideApp={false}
					style={{content:{marginLeft:300+'px',marginTop: 50+'px'}}}
				>
					<UserInfo user={this.state.order.buyer} clickBack={this.closeModal}/>
				</Modal>

				<Modal
					show={this.state.earlyDone.show}
					onHide={this.closeDoneModal}
					size='md'
					contentLabel="Lý do"
					centered
				>
					<Modal.Body >
						<div className="card border-0">
							<div className="card-header pb-0">
								<h2 className="card-title space ">Hoàn thành sớm đơn hàng</h2>
								<hr className="my-0" />
							</div>
							<div className="card-body">
								<div className='row'>
									<label style={{fontSize:15+'px'}}>Lý do:</label>
								</div>
								<textarea style={{width:100+'%',marginBottom:10+'px'}} rows={5}
									onChange={(e)=>this.setState({earlyDone:{...this.state.earlyDone,reason:e.target.value}})} />
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button className='btn-info mr-4' onClick={this.confirmDoneClick}>Xác nhận</button>
						<button style={{backgroundColor:'#e52d27',color:'white'}} onClick={this.closeDoneModal}>Hủy</button>
					</Modal.Footer>
				</Modal>
			</div>
		)
    }
    return (<h2>Waiting for API...</h2>);
  }

  submitPackClick = async (event) =>{
    event.preventDefault() 
    let packList = this.state.packList
    let newPackList = []
    let productList
    let newProductList

	if(packList.length===0){
		toast.warning('Xin hãy nhập số lượng vải đóng gói!')
		return
	}

    if(this.state.order.remainProductList){
      productList = this.state.order.remainProductList
      newProductList = this.state.order.remainProductList
    }
    else{
      productList = this.state.order.productList
      newProductList = this.state.order.productList
    }

    
    for(let i=0; i<productList.length; i++){
      if(packList[i]){
        // add new packed product to list
        let item = {
          product: productList[i].product,
          color: productList[i].color
        }
        if(packList[i].quantity){
			if(packList[i].quantity<0){
				toast.warning("Số lượng sản phẩm không được nhỏ hơn 0")
				return
			}
			if(packList[i].quantity>this.state.productList.find(i=>i.product.name===item.product.name&i.color===item.color).quantity){
				toast.warning("Số lượng sản phẩm vượt quá số sản phẩm trong đơn hàng")
				return
			}
			if(packList[i].quantity>this.warehousequantity(item.product.name,item.color)){
				toast.warning("Số lượng sản phẩm không được vượt quá tồn kho")
				return
			}
			item ={...item,quantity:packList[i].quantity}
			let newExist = this.state.warehouse.find(i=>i.product.name===item.product.name).quantity
			let indexOfColor = newExist.findIndex(i=>i.color===item.color)
			newExist[indexOfColor].roll = newExist[indexOfColor].roll - packList[i].quantity

			axios
				.put(process.env.REACT_APP_BACKEND_URL + '/warehouses/' + this.state.warehouse.find(i=>i.product.name===item.product.name).id, {
					quantity: newExist
				},{
					headers: {
						'Authorization':'bearer '+ Cookie.get('token'),
					},
				})
        }
        if(packList[i].quantity_m){
			if(packList[i].quantity_m<0){
				toast.warning("Số lượng sản phẩm không được nhỏ hơn 0")
				return
			}
			if(packList[i].quantity_m>this.state.productList.find(i=>i.product.name===item.product.name&i.color===item.color).quantity_m){
				toast.warning("Số lượng sản phẩm vượt quá số sản phẩm trong đơn hàng")
				return
			}
			if(packList[i].quantity_m>this.warehousequantityM(item.product.name,item.color)){
				toast.warning("Số lượng sản phẩm không được vượt quá tồn kho")
				return
			}
			item ={...item,quantity_m:packList[i].quantity_m}
			let newExist = this.state.warehouse.find(i=>i.product.name===item.product.name).quantity
			let indexOfColor = newExist.findIndex(i=>i.color===item.color)
			newExist[indexOfColor].m -= packList[i].quantity_m

			axios
				.put(process.env.REACT_APP_BACKEND_URL + '/warehouses/' + this.state.warehouse.find(i=>i.product.name===item.product.name).id, {
					quantity: newExist
				},{
					headers: {
						'Authorization':'bearer '+ Cookie.get('token'),
					},
				})
        }
        newPackList.push(item)

        // remove or decrease quantity in product list
        if(packList[i].quantity && packList[i].quantity_m){
          let newQuantity = productList[i].quantity - packList[i].quantity
          let newQuantity_m = productList[i].quantity_m - packList[i].quantity_m
          if(newQuantity===0 && newQuantity_m===0){
            newProductList[i] = null
          }
          else if(newQuantity===0){
            delete newProductList[i].quantity
            newProductList[i] = {...newProductList[i],quantity_m: newQuantity_m}
          }
          else if(newQuantity_m===0){
            delete newProductList[i].quantity_m
            newProductList[i] = {...newProductList[i],quantity: newQuantity}
          }
          else{
            newProductList[i] = {...newProductList[i],quantity: newQuantity,quantity_m: newQuantity_m}
          }
        }
        else if(packList[i].quantity){
          let newQuantity = productList[i].quantity - packList[i].quantity
          if(newQuantity===0){
			  if(productList[i].quantity_m){
				delete newProductList[i].quantity
			  }
			  else{
				newProductList[i] = null
			  }
          }
          else{
            newProductList[i] = {...newProductList[i],quantity: newQuantity}
          }
        }
        else{
          let newQuantity_m = productList[i].quantity_m - packList[i].quantity_m
          if(newQuantity_m===0){
			if(productList[i].quantity){
			  delete newProductList[i].quantity_m
			}
			else{
			  newProductList[i] = null
			}
          }
          else{
            newProductList[i] = {...newProductList[i],quantity_m: newQuantity_m}
          }
        }
      }
    }

    for(let i=newProductList.length-1; i>-1;i--){
      if(!newProductList[i]){
        newProductList.splice(i,1)
      }
    }

    let theLast
    if(newProductList.length === 0){
      theLast = true
    }
    else{
      theLast = false
    }

	let exports = []
	for(let i=0; i<newPackList.length; i++){
		let item = newPackList[i]
		let isExist = false
		for(let j=0; j<exports.length; j++){
			if(item.product.name === exports[j].product.name){
				let quantity ={color:item.color}
				if(item.quantity_m) quantity.m=item.quantity_m
				if(item.quantity) quantity.roll=item.quantity
				exports[j].quantity.push(quantity)
				isExist = true
				break
			}
		}
		if(!isExist){
			let quantity ={color:item.color}
			if(item.quantity_m) quantity.m=item.quantity_m
			if(item.quantity) quantity.roll=item.quantity
			let data={
				product: item.product,
				quantity: [quantity]
			}
			exports.push(data)
		}
	}

	axios
		.post(process.env.REACT_APP_BACKEND_URL + '/exports', {
			creator: Cookie.get('id'),
			productList: exports
		},{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		})
		.catch(err=>{
			toast.error('Cannot create export!')
		})

	await axios
		.post(process.env.REACT_APP_BACKEND_URL + '/shipments', {
			productList: newPackList,
			status: 'waiting to deliver',
			buyer: this.state.order.buyer,
			orderID: this.state.order.id,
			theLast: theLast
		},{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		})
		.then(async (res)=>{
			let shipments = []
			if(this.state.order.shipments){
				shipments = this.state.order.shipments
			}
			await axios
				.put(process.env.REACT_APP_BACKEND_URL + '/orders/' + this.state.order.id, {
					status: 'waiting to deliver',
					remainProductList: newProductList,
					shipments: [...shipments,res.data]
				},{
					headers: {
						'Authorization':'bearer '+ Cookie.get('token'),
					},
				})
				.catch(error => {
					toast.error('Cannot pack products')
					console.log('An error occurred:', error.response)
				});
			toast.success("Packed partial product success!")
			this.componentDidMount()
		})
		.catch(err=>{
			toast.success('Cannot create shipment')
			console.log('An error occurred:', err.response)
		})
    return
  }

  changePackQuantity = (event,index) =>{
    let value= Number(event.target.value)
    let lst = this.state.packList
    if(value===0 || value <-1){
      if(!lst[index]){
        return
      }
      else if(!lst[index].quantity_m){
        delete lst[index]
      }
      else{
        delete lst[index]['quantity']
      }
    }
    else{
      lst[index] = {...lst[index],quantity:value}
    }
    this.setState({packList:lst})
  }

  changePackQuantityM = (event,index) =>{
    let value = Number(event.target.value)
    let lst = this.state.packList

    if(value===0){
      if(!lst[index]){
        return
      }
      else if(!lst[index].quantity){
        delete lst[index]
      }
      else{
        delete lst[index]['quantity_m']
      }
    }
    else{
      lst[index] = {...lst[index],quantity_m:value}
    }

    this.setState({packList:lst})
  }
}

export default OrderInfo;