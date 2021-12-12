import React, {Component} from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'

import Status from './component/status'

class ShipmentList extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: true,
            filter: {id:'',buyer:'',status:'all'},
            shipments: []
        }
    }

    async componentDidMount(){
        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/shipments',{
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
        this.props.history.push('/manager/shipments/' + id)
    }

    resetFilterClick = () =>{
        this.setState({filter:{id:'',buyer:'',status:'all'}})
    }

    render(){
        return(
            <div className='ShipmentManager'>
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12 p-0">
                                <div className="page-header-title">
                                    <h5>GIAO HÀNG</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card'>
                    <div className='card-body'>

                        <div className="DataList-filter">
                            <form className="form-inline w-100 m-b-10">
                                <div className='controls'>
                                    <div className='input-prepend'>
                                        <span className='add-on'>Trạng thái</span>
                                        <select onChange={(e)=>this.setState({filter:{...this.state.filter,status: e.target.value}})}>
                                            <option value='all'>Tất cả</option>
                                            <option value='waiting to deliver'>Chờ giao</option>
                                            <option value='delivering'>Đang giao</option>
                                            <option value='delivered'>Đã giao</option>
                                            <option value='cancled'>Hủy</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='controls m-l-20'>
                                    <div className='input-prepend'>
                                        <span className='add-on'>ID</span>
                                        <input name="gmail_filter" type="text"
                                            onChange={(e)=>this.setState({filter:{...this.state.filter,id: e.target.value}})}/>
                                    </div>
                                </div>
                                <div className='controls m-l-20'>
                                    <div className='input-prepend'>
                                        <span className='add-on'>Người mua</span>
                                        <input name="gmail_filter" type="text"
                                            onChange={(e)=>this.setState({filter:{...this.state.filter,buyer: e.target.value}})}/>
                                    </div>
                                </div>
                                
                                <button type="reset" className='btn btn-primary m-l-10' style={{marginBottom:0}}
                                    onClick={this.resetFilterClick} >Reset</button>
                            </form>
                        </div>

                        <table className="table list-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Buyer</th>
                                <th>Status</th>
                                <th>productList</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {this.state.shipments
                                .filter(shipment=>
                                    shipment.id.includes(this.state.filter.id)
                                    && shipment.buyer.username.includes(this.state.filter.buyer)
                                    && (this.state.filter.status === 'all'
                                    || shipment.status === this.state.filter.status)
                                )
                                .map((shipment, index) => {
                                return (
                                    <tr key={index}>
                                        <td onClick={()=>this.infoClick(shipment.id)}>{shipment.id}</td>
                                        <td onClick={()=>this.infoClick(shipment.id)}>{shipment.buyer.username}</td>
                                        <td onClick={()=>this.infoClick(shipment.id)}>
                                            <Status status={shipment.status}/>
                                        </td>
                                        <td onClick={()=>this.infoClick(shipment.id)}>
                                            {shipment.productList.map((item,index)=>{
                                                if(index === 2)
                                                    return(<p key={index}>...</p>);
                                                if(index === 3)
                                                    return <></>;
                                                return(
                                                    <p key={index}>{item.product.name + ': '}{item.quantity_m ? 
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