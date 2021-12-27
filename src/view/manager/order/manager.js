import React, {Component} from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'

import Status from './component/status'

class OrderManager extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: true,
            filter: {id:'',status:'all',buyer:''},
            page: {now:1,max:1,perPage:5},
            orders: []
        }
    }

    async componentDidMount(){
        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/orders',{
                headers:{
                    'Authorization' : 'bearer ' + Cookie.get('token')
                }
            })
            .then(res=>{
                let max = Math.ceil(res.data.length/this.state.page.perPage)
                this.setState({orders:res.data,page:{...this.state.page,max: max}})
            })
            .catch(err=>{
                console.log('Cannot connect to server')
            })
        this.setState({loading:false})
    }

    infoClick = (id) =>{
        this.props.history.push('/manager/orders/' + id)
    }

    resetFilterClick = () =>{
        this.setState({filter:{id:'',buyer:'',status:'all'}})
    }

    changePage = (number) =>{
        console.log(number)
        this.setState({page:{...this.state.page,now: number}})
    }

    showPageNumber = () =>{
        let pageList = []
        for(let i=1; i <= this.state.page.max; i++){
            pageList[i]=i
        }
        return(
            <ul class="pagination pg-blue">
                {pageList.map((page,index)=>{
                    if(page===this.state.page.now){
                        return(
                            <li className="page-ite" style={{cursor:"pointer"}} key={index}
                            onClick={(e)=>this.changePage(page)}>
                                <a href className="page-link"
                                style={{backgroundColor:'blue'}}>{page}</a>
                            </li>
                        )
                    }
                    return(
                        <li className="page-ite" style={{cursor:"pointer"}} key={index}
                        onClick={(e)=>this.changePage(page)}>
                            <a href className="page-link">{page}</a>
                        </li>
                    )
                })}
            </ul>
        )
        
    }

    render(){
        return(
            
            <div className='OrderManager'>
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12 p-0">
                                <div className="page-header-title">
                                    <h5>ĐƠN HÀNG</h5>
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
                                            <option value='waiting'>Đang chờ</option>
                                            <option value='processing'>Đang xử lý</option>
                                            <option value='waiting to deliver'>Đợi giao hàng</option>
                                            <option value='delivering'>Đang giao</option>
                                            <option value='delivered'>Đã giao</option>
                                            <option value='partial delivering'>Đang giao một phần</option>
                                            <option value='partial delivered'>Đã giao một phần</option>
                                            <option value='done'>Hoàn tất</option>
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
                                    onClick={this.resetFilterClick}>Reset</button>
                                <div className="col-md-12 col-sm-6 col-md-4 col-lg-4 col-xl-4">

                                </div>
                                
                               
                            </form>
                        </div>

                        <div className="row">
                                    <div className='col-12'>
                                    <table className="table list-table">
                            
                           
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Người mua</th>
                                    <th>Trạng thái</th>
                                    <th>Danh sách</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.orders
                                .filter(order =>
                                    order.id.includes(this.state.filter.id)
                                    && order.buyer.username.includes(this.state.filter.buyer)
                                    && (this.state.filter.status === 'all'
                                    || order.status === this.state.filter.status)
                                )
                                .sort((a,b)=>(new Date(b.updatedAt.slice(0,19)+'Z')) - (new Date(a.updatedAt.slice(0,19)+'Z')))
                                .map((order, index) => {
                                return (
                                    <tr key={index}>
                                        <td onClick={()=>this.infoClick(order.id)}>{order.id}</td>
                                        <td onClick={()=>this.infoClick(order.id)}>{order.buyer.username}</td>
                                        <td onClick={()=>this.infoClick(order.id)}>
                                            <Status status={order.status} />
                                        </td>
                                        <td onClick={()=>this.infoClick(order.id)}>
                                            {order.productList.map((item,index)=>{
                                                if(index === 2)
                                                    return(<p key={index}>...</p>);
                                                if(index === 3)
                                                    return <></>;
                                                return(
                                                    <p key={index}>{item.product.name + ': '}{item.quantity_m ? 
                                                        (item.quantity? 
                                                          item.quantity_m + ' x m,' + item.quantity + ' x roll'
                                                          : item.quantity_m + ' x m')
                                                        :item.quantity + ' x roll'
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
                        
                        <nav aria-label="Page navigation example">
                            {/* {this.showPageNumber()} */}
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}

export default OrderManager