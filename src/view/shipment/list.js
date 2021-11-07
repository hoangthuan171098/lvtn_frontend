import React, {Component} from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'

import Status from './components/status'

class ShipmentList extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: true,
            filter: {},
            shipments: [], 
        }
    }

    async componentDidMount(){
        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/shipments?shipper=' + Cookie.get('id'),{
                headers:{
                    'Authorization' : 'bearer ' + Cookie.get('token')
                }
            })
            .then(res=>{
                this.setState({shipments:res.data})
            })
            .catch(err=>{
                console.log('Cannot connect to server')
            })
        this.setState({loading:false})
    }

    infoClick = (id) =>{
        this.props.history.push('/shipment/shipments-orders/' + id)
    }
    
    render(){
        return(
            <div className='ShipmentManager'>
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12 p-0">
                                <div className="page-header-title">
                                    <h5>SHIPMENTS</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div>
                            <select onChange={(e)=>this.setState({filter:{...this.state.filter,status: e.target.value}})}>
                                <option value='all'>All</option>
                                <option value='waiting to deliver'>Waiting to deliver</option>
                                <option value='delivering'>Delivering</option>
                                <option value='delivered'>Delivered</option>
                                <option value='cancled'>Cancled</option>
                            </select>
                        </div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Buyer</th>
                                <th>Status</th>
                                <th>Address</th>
                                <th>productList</th>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                this.state.shipments.map((shipment, index) => {
                                return (
                                    <tr key={index}>
                                        <td onClick={()=>this.infoClick(shipment.id)}>{shipment.id}</td>
                                        <td onClick={()=>this.infoClick(shipment.id)}>{shipment.buyer.username}</td>
                                        <td onClick={()=>this.infoClick(shipment.id)}>
                                            <Status status={shipment.status}/>
                                        </td>
                                        <td onClick={()=>this.infoClick(shipment.id)}>{shipment.address}</td>
                                        <td onClick={()=>this.infoClick(shipment.id)}>
                                            {shipment.productList.map((item,index)=>{
                                                if(index === 2)
                                                    return(<p key={index}>...</p>)
                                                if(index === 3)
                                                    return <></>
                                                return(
                                                    <p key={index}>{item.product.name+'-'+item.color+': '}{item.quantity_m ? 
                                                        (item.quantity? 
                                                          item.quantity_m + ' x m,' + item.quantity + ' x cuộn'
                                                          : item.quantity_m + ' x m')
                                                        :item.quantity + ' x cuộn'
                                                    }
                                                    </p>
                                                )
                                            })}
                                        </td>                                        
                                    </tr>
                                )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShipmentList