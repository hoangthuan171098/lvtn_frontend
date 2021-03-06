import React from "react"
import Modal from "react-modal"
import axios from 'axios'
import Cookie from 'js-cookie'
import { toast } from "react-toastify"

export default class Import extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            modal: {
                isOpen: false
            },
            products: [],
            productCategories: [],
            selectProduct: {
				quantity: {color:'',roll:'',m:''}
			},
            import:{
                productList: []
            },
            productFilter:{
                id: '',
                name: '',
                category: 'all'
            }
        }
    }

    async componentDidMount() {
        axios
            .get(process.env.REACT_APP_BACKEND_URL + "/product-categories",{
                headers:{
                    'Authorization' : 'bearer ' + Cookie.get('token')
                }
            })
            .then(res=>{
                this.setState({productCategories:res.data})
            })
            .catch(err=>{
                toast.error('Cannot connect to server!!!!')
                console.log(err.response)
            })

        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/products',{
                headers:{
                    'Authorization' : 'bearer ' + Cookie.get('token')
                }
            })
            .then(res=>{
                this.setState({products:res.data})
            })
            .catch(err=>{
                toast.error('Cannot connect to server!!!!')
                console.log(err.response)
            })
        this.setState({loading: false})
        return
    }

    openModal = () =>{
        this.setState({modal:{isOpen: true}})
    }

    closeModal = () =>{
        this.setState({modal:{isOpen: false}})
    }

    chooseProductClick = (product) =>{
		let newItem = {
			product: product,
			quantity: {color:product.colors[0],m:'',roll:''}
		}
        this.setState({selectProduct:newItem})
        this.closeModal()
    }

    addProductClick = (event,item) =>{
        event.preventDefault()
        if(Number(item.quantity.roll) <= 0 && Number(item.quantity.m)<=0){
            toast.warning('Xin h??y nh???p s??? cu???n ho???c m??t!')
            return
        }
        if(Number(item.quantity.roll) <= 0){
            delete item.quantity.roll
        }
        if(Number(item.quantity.m) <= 0){
            delete item.quantity.m
        }
        let list = this.state.import.productList
        if(list && list.length!==0){
            for(let i=0; i<list.length; i++){
                if(item.product === list[i].product){
					let quantities = list[i].quantity
					for(let j=0; j<quantities.length; j++){
						let quantity = quantities[j]
						if(item.quantity.color === quantity.color){
							if(item.quantity.roll){
								if(list[i].quantity[j].roll) list[i].quantity[j].roll+=item.quantity.roll
								else list[i].quantity[j].roll = item.quantity.roll
							}
							if(item.quantity.m){
								if(list[i].quantity[j].m) list[i].quantity[j].m+=item.quantity.m
								else list[i].quantity[j].m = item.quantity.m
							}
							this.setState({import:{...this.state.import,productList:list}})
							let quantity = {color:this.state.selectProduct.product.colors[0],roll:'',m:''}
							this.setState({selectProduct:{...this.state.selectProduct,quantity: quantity}})
							return
						}
					}
					let newQuantity = [...list[i].quantity,item.quantity]
					list[i].quantity = newQuantity
					this.setState({import:{...this.state.import,productList:list}})
					let quantity = {color:this.state.selectProduct.product.colors[0],roll:'',m:''}
					this.setState({selectProduct:{...this.state.selectProduct,quantity: quantity}})
                    return
                }
            }

        }

		let newItem = {
			product: item.product,
			quantity: [item.quantity]
		}
        let newList = [...this.state.import.productList,newItem]
        this.setState({import:{...this.state.import,productList:newList}})
        this.setState({selectProduct:{...this.state.selectProduct,quantity:{color:this.state.selectProduct.product.colors[0],roll:'',m:''}}})
    }

    removeProductClick = (event,index) =>{
        event.preventDefault()
        let productList = this.state.import.productList
        productList.splice(index,1)
        this.setState({import:{...this.state.import,productList:productList}})
    }

    closeProductClick = async (event) =>{
        event.preventDefault()
        await this.setState({selectItem:{color:'',roll:'',m:''}})
    }

    submitHandle = () =>{
        let list = this.state.import.productList
        if(list.length === 0){
            toast.warning('Xin hay them san pham!')
            return
        }
		
		axios
			.post(process.env.REACT_APP_BACKEND_URL + '/imports', {
				creator: Cookie.get('id'),
				productList: this.state.import.productList
			},{
				headers: {
					'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			.then(response => {
				toast.success('Nh???p h??ng th??nh c??ng!')
			})
			.catch(err=>{
				toast.error('Cannot connect to server!')
			})

        for(let i=0; i<list.length; i++){
            axios
                .get(process.env.REACT_APP_BACKEND_URL + '/warehouses?product=' +list[i].product.id,{
                    headers:{
                        'Authorization' : 'bearer ' + Cookie.get('token')
                    }
                })
                .then(res=>{
                    if(res.data.length !== 0){
                        let quantity = res.data[0].quantity
						for(let n=0; n<list[i].quantity.length; n++){
							let isExist = false
							let item = list[i].quantity[n]
							if(quantity && quantity.length !==0){
								for(let j=0; j<quantity.length; j++){
									if(quantity[j].color === item.color){
										isExist = true
										if(item.roll){
											if(quantity[j].roll) quantity[j].roll+=item.roll
											else quantity[j].roll = item.roll
										}
										if(item.m){
											if(quantity[j].m) quantity[j].m+=item.m
											else quantity[j].m = item.m
										}
										break
									}
								}
								if(!isExist){
									let newItem
									if(item.roll && item.m){
										newItem={
											color: item.color,
											m: item.m,
											roll: item.roll
										}
									}
									else if(item.roll){
										newItem={
											color: item.color,
											roll: item.roll
										}
									}
									else{
										newItem={
											color: item.color,
											m: item.m
										}
									}
									quantity = [...quantity,newItem]
								}
							}
                            else{
                                quantity = list[i].quantity
                            }
						}	
						axios
                            .put(process.env.REACT_APP_BACKEND_URL + '/warehouses/' + res.data[0].id, {
                                quantity: quantity
                            },{
                                headers: {
                                    'Authorization':'bearer '+ Cookie.get('token'),
                                },
                            })
                            .then(response => {
                                this.componentDidMount();
                            })
                            .catch(error => {
                                toast.error('An error occurred, please check again.');
                                console.log('An error occurred:', error.response);
                            });
                    }

					else{
						axios
                            .post(process.env.REACT_APP_BACKEND_URL + '/warehouses', {
                                product: list[i].product,
								quantity: list[i].quantity
                            },{
                                headers: {
                                    'Authorization':'bearer '+ Cookie.get('token'),
                                },
                            })
                            .then(response => {
								console.log('success')
                            })
					}
                })
        }
    }

    backClick = () =>{
        this.props.history.push("/manager/warehouse")
    }

    showSelectProduct = () =>{
        if(this.state.selectProduct.product !== undefined){
            return (
                <div className='col-10 m-auto'>
                    <div className='row d-flex align-items-center'  style={{marginTop: 15+ 'px'}}>
                        <div className='col-2'>
                            <img src={process.env.REACT_APP_BACKEND_URL + this.state.selectProduct.product.image.url} alt='preview img'></img>
                        </div>
                        <div className='col-2'>
                            <span>{this.state.selectProduct.product.name}</span><br/>
                            <span>{this.state.selectProduct.product.category.name}</span>
                        </div>
                        <div className='col-8'>
                            <div className='row d-flex align-items-center'>
                                <div className='col-lg-4 d-flex align-items-center'>
                                    <label className='float-left'>M??u:</label>
                                    <div className='float-left'>
                                        <select onChange={e=>this.setState({selectProduct:{...this.state.selectProduct,quantity:{...this.state.selectProduct.quantity,color:e.target.value}}})} 
                                            value={this.state.selectProduct.quantity.color} className='short-input'>
                                                {this.state.selectProduct.product.colors.map((color,index)=>{
                                                    return(
                                                        <option value={color} key={index}>{color}</option>
                                                    )
                                                })}
                                        </select>
                                    </div>
                                </div>

                                <div className='col-lg-3 d-flex align-items-center'>
                                    <label className='float-left'>m:</label>
                                    <input onChange={e=>this.setState({selectProduct:{...this.state.selectProduct,quantity:{...this.state.selectProduct.quantity,m:Number(e.target.value)}}})}
                                        type='number' value={this.state.selectProduct.quantity.m} className='float-left short-input'
                                    />
                                </div>

                                <div className='col-lg-3 d-flex align-items-center'>
                                    <label className='float-left'>cu???n:</label>
                                    <input onChange={e=>this.setState({selectProduct:{...this.state.selectProduct,quantity:{...this.state.selectProduct.quantity,roll:Number(e.target.value)}}})}
                                        type='number' value={this.state.selectProduct.quantity.roll} className='float-left short-input'
                                    />
                                </div>

                                <div className='col-lg-2 d-flex' style={{alignItems:'center'}}>
                                    <button className='hiden-btn' onClick={e=>this.addProductClick(e,this.state.selectProduct)}>
                                        <i className='fa fa-plus icon'></i>
                                    </button>
                                    <button className='hiden-btn ml-3' onClick={()=>this.setState({selectProduct:{quantity:{color:'',m:'',roll:''}}})}>
                                        <i className='fa fa-close icon'></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr style={{borderColor:'#29b7d3'}}/>
                </div>
            )
        }
    }

    render(){
        return(
            <div className="WarehouseImport">
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12 p-0">
                                <div className="page-header-title">
                                    <h5>NH???P KHO</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className='btn btn-info mr-4' onClick={this.submitHandle}>X??c nh???n</button>
                <button className='btn btn-success' onClick={this.backClick}>Tr??? v???</button>

                
                {this.showSelectProduct()}

				<div className='card'>
					<div className='card-body'>
                        <button className='btn btn-info' onClick={this.openModal}>Th??m s???n ph???m</button>
						<table className='table w-75' style={{margin:'auto'}}>
							<thead>
								<tr>
									<th>T??n</th>
									<th>S??? l?????ng</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
							{this.state.import.productList.map((item,index)=>{
								return(
									<tr key={index}>
										<td>{item.product.name}</td>
										<td>
											{item.quantity.map((item1,index1)=>{
												return(
													<p key={index1}>
														{item1.color + ':'}
														{item1.m ?
															(item1.roll? 
															item1.m + ' x m,' + item1.roll + ' x cu???n'
															: item1.m + ' x m')
															: item1.roll + ' x cu???n'
														}
													</p>
												)
											})}
										</td>
										<td>
											<button className='hiden-btn' onClick={e=>this.removeProductClick(e,index)}>
												<i className='fa fa-trash icon' style={{color:'red'}}></i>
											</button>
										</td>
									</tr>
								)
							})}
							</tbody>
						</table>
					</div>
				</div>

                <div className="card">
                    <div className='card-body'>
                        <div class="row">
                            <div className="col-md-6 pr-2">
                                <div className="form-group">
                                    <label>Nh???p t???:</label>
                                    <textarea className="form-control" rows="2"></textarea>
                                </div>
                            </div>
                            <div className="col-md-6 pl-2">
                                <div className="form-group">
                                    <label>Ghi ch??:</label>
                                    <textarea className="form-control" rows="2"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                        isOpen={this.state.modal.isOpen}
                        onRequestClose={this.closeModal}
                        contentLabel="Select product"
                        ariaHideApp={false}
                        style={{content:{marginLeft:270+'px',marginTop:70+'px'}}}
                    >
                        <div style={{marginBottom: 30+'px'}}>
                                <h2 className='pull-left'>Select product</h2>
                                <button className='pull-right btn' onClick={this.closeModal}>
                                    <i className='fa fa-close'></i>
                                </button>
                        </div>

                        <div style={{marginBottom: 30+'px'}}>
                            <form className="form-inline w-100">                
                                <div className='input-prepend' style={{marginRight: 30+'px'}}>
                                    <span className='add-on'>Name</span>
                                    <input
                                        type="text" className='form-control'
                                        onChange={e=>this.setState({productFilter:{...this.state.productFilter,name:e.target.value}})}
                                    />
                                </div>

                                <div className='input-prepend' style={{marginRight: 30+'px'}}>
                                    <span className='add-on'>ID</span>
                                    <input 
                                        type="text" className='form-control'
                                        onChange={e=>this.setState({productFilter:{...this.state.productFilter,id:e.target.value}})}
                                    />
                                </div>

                                <div className='input-prepend'>
                                    <span className='add-on'>Category</span>
                                    <select className='from-control'
                                        onChange={e=>this.setState({productFilter:{...this.state.productFilter,category:e.target.value}})}
                                    >
                                        <option value='all'>All</option>
                                        {this.state.productCategories.map((category,index)=>{
                                            return(
                                                <option key={index} value={category.name}> {category.name} </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </form>
                        </div>

                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>createAt</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {this.state.products.filter(product=>
                                    product.id.includes(this.state.productFilter.id)
                                    && product.name.includes(this.state.productFilter.name)
                                    &&
                                    (this.state.productFilter.category==='all' ? true :  product.category.name===this.state.productFilter.category)
                                ).map((product, index) => {
                                    return (
                                        <tr key={index} onClick={()=>this.chooseProductClick(product)}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.category.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.createdAt.slice(0,10) + " " + product.createdAt.slice(11,16)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Modal>
            </div>
        )
    }
}