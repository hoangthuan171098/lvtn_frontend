import React,{Component} from 'react'

export default class Shipment extends Component{

	confirmImg = () =>{
		if(this.props.shipment.confirmImage){
			return(
				<>
					<p>Hình ảnh xác nhận:</p>
					<img src={process.env.REACT_APP_BACKEND_URL+this.props.shipment.confirmImage.url} className="m-auto" alt="confirm delivered"
						style={{width:400+'px'}}/>
				</>
			)
		}
	}

    render(){
        return(
			<div className='w-75 float-left Shipment-show'>
				<div className='card'>
					<div className='card-body'>
						<div className='row'>
							<span className='impress w-100'>Giao hàng #{this.props.shipIndex}</span>
							<span> ID: {this.props.shipment.id} </span>
							<span> Tình trạng:  {this.props.shipment.status}</span>
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
								{this.props.shipment.productList.map((item,index)=>{
									return(
									<tr key={index}>
										<td><span>{item.product.name}</span></td>
										<td>{item.color}</td>
										<td>
											{item.quantity? item.quantity:0}
										</td>
										<td>
											{item.quantity_m? item.quantity_m:0}
										</td>
									</tr>
									)
								})}
								</tbody>
							</table>
							{this.confirmImg()}
						</div>
					</div>
				</div>
			</div>
        )
    }
}