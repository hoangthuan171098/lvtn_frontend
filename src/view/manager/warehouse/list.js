import React, {Component} from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify'

class List extends Component{
    constructor(props){
        super(props)
        this.state={
            loading: true,
            itemFilter: {
                show: false,
                category: "",
                name: ""
            },
            showMore: [],
            productCategories: [],
            warehouse: [],
            imports: [],
            exports: []
        }
    }

    async componentDidMount(){
        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/warehouses',{
                headers:{
                    'Authorization' : 'bearer ' + Cookie.get('token')
                }
            })
            .then(res=>{
                // console.log(new Date(res.data[0].createdAt.slice(0,19)+'Z') - new Date(res.data[1].createdAt.slice(0,19)+'Z'))
                this.setState({warehouse:res.data})
            })
            .catch(err=>{
                console.log('Cannot connect to server')
            })
        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/exports',{
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                }
            })
            .then(res=>{
                this.setState({exports:res.data})
            })
            .catch(err=>{
                toast.error('Cannot connect to server!')
            })

        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/product-categories',{
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                }
            })
            .then(res=>{
                this.setState({productCategories:res.data})
            })

        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/imports',{
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                }
            })
            .then(res=>{
                this.setState({imports:res.data})
            })
            .catch(err=>{
                toast.error('Cannot connect to server!')
            })
        this.setState({loading:false})
    }

    infoClick = (id) =>{
        this.props.history.push('/manager/warehouse/' + id)
    }

    importClick = () =>{
        this.props.history.push('/manager/warehouse/import')
    }
    
    exportClick = () =>{
        this.props.history.push('/manager/warehouse/export')
    }

    moreClick = (event,index) =>{
        event.preventDefault()
        let list = this.state.showMore
        list[index] = true
        this.setState({showMore:list})
    }

    hideClick = (event,index) =>{
        event.preventDefault()
        let list = this.state.showMore
        delete list[index]
        this.setState({showMore:list})
    }

    render(){
        return(
            <div className='WarehouseManager'>
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12 p-0">
                                <div className="page-header-title">
                                    <h5>KHO HÀNG</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
					<button onClick={this.importClick} className='btn btn-info mr-4'>Nhập kho</button>
					<button onClick={this.exportClick} className='btn btn-info mr-4'>Xuất kho</button>
                </div>

                <div className="col-sm-12">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active text-uppercase" id="have-tab" data-toggle="tab" href="#remain" role="tab" aria-controls="have" aria-selected="true">TỒN KHO</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-uppercase" id="import-tab" data-toggle="tab" href="#import" role="tab" aria-controls="import" aria-selected="false">LỊCH SỬ NHẬP</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-uppercase" id="export-tab" data-toggle="tab" href="#export" role="tab" aria-controls="export" aria-selected="false">LỊCH SỬ XUẤT</a>
                        </li>
                    </ul>

                    <div className="tab-content" id="myTabContent" style={{margin:0+'px'}}>
                        <div className="tab-pane fade show active" id="remain" role="tabpanel" aria-labelledby="have-tab">
                            <div className="btn-group mb-2 mr-2">
                                <button type="button" className="btn btn-outline-success">Filter</button>
                                <button type="button" className={!this.state.itemFilter.show? "btn btn-success":'d-none'}
                                    onClick={()=>this.setState({itemFilter:{...this.state.itemFilter,show:true}})}>
                                    <span className="pcoded-micon d-flex align-items-center"><i className="fa fa-chevron-down" /></span>
                                </button>
                                <button type="button" className={this.state.itemFilter.show? "btn btn-success":'d-none'}
                                    onClick={()=>this.setState({itemFilter:{...this.state.itemFilter,show:false}})}>
                                    <span className="pcoded-micon d-flex align-items-center"><i className="fa fa-chevron-up" /></span>
                                </button>
                            </div>


                            <div className={!this.state.itemFilter.show? "d-none" : "row" }>
                                <div className='col-4 m-r-20'>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">Name</span>
                                        </div>
                                        <input type="text" className="form-control"
                                            onChange={(e)=>this.setState({itemFilter:{...this.state.itemFilter,name:e.target.value}})}/>
                                    </div>
                                </div>

                                <div className="col-4">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">Category</span>
                                        </div>
                                        <select className='form-control h-100' style={{margin:0,borderRadius:0}}
                                            onChange={(e)=>this.setState({itemFilter:{...this.state.itemFilter,category:e.target.value}})}>
                                            <option value=''>all</option>
                                            {this.state.productCategories.map((category,index)=>{
                                                return(
                                                    <option value={category.id} key={index}>{category.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <table className="table list-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Sản phẩm</th>
                                        <th>Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.warehouse
                                    .filter((item)=>
                                        item.product.name.includes(this.state.itemFilter.name)
                                        && (this.state.itemFilter.category === ''
                                            || item.product.category === this.state.itemFilter.category)
                                    )
                                    .sort((a,b)=>(new Date(b.updatedAt.slice(0,19)+'Z')) - (new Date(a.updatedAt.slice(0,19)+'Z')))
                                    .map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td onClick={()=>this.infoClick(item.id)}>{item.id}</td>
                                            <td onClick={()=>this.infoClick(item.id)}>{item.product.name}</td>
                                            <td>
                                                {item.quantity.length!==0? item.quantity.map((quantity,index2)=>{
                                                    if(index2 === 2)
                                                        return(
                                                        <>
                                                            <p style={{cursor:'pointer'}}
                                                            className={this.state.showMore[index]?'d-none':''} onClick={(e)=>this.moreClick(e,index)}>...</p>
                                                            <p className={this.state.showMore[index]?'':'d-none'} 
                                                            >{quantity.color + ': '}{quantity.m ?
                                                                (quantity.roll? 
                                                                    quantity.m + ' x m,' + quantity.roll + ' x roll'
                                                                : quantity.m + ' x m')
                                                                :quantity.roll + ' x cuộn'
                                                            }
                                                            </p>
                                                        </>
                                                        )
                                                    if(index2 >= 3){
                                                        return(
                                                            <p key={index2} className={this.state.showMore[index]?'':'d-none'} 
                                                            >{quantity.color + ': '}{quantity.m ?
                                                                (quantity.roll? 
                                                                    quantity.m + ' x m,' + quantity.roll + ' x roll'
                                                                : quantity.m + ' x m')
                                                                :quantity.roll + ' x cuộn'
                                                            }
                                                            </p>
                                                        )
                                                    }
                                                    return(
                                                        <p key={index2}>{quantity.color + ': '}{quantity.m ?
                                                            (quantity.roll? 
                                                                quantity.m + ' x m,' + quantity.roll + ' x roll'
                                                            : quantity.m + ' x m')
                                                            :quantity.roll + ' x cuộn'
                                                        }
                                                        </p>
                                                    )
                                                })
                                                :<p>Trống</p>}
                                            </td>
                                        </tr>
                                    )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="tab-pane fade" id="import" role="tabpanel" aria-labelledby="import-tab">
                            <table className="table">
                                <thead className="brand-blue">
                                    <tr>
                                        <th>NGƯỜI tạo</th>
                                        <th>Thời gian</th>
                                        <th>Danh sách</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.imports
                                    .sort((a,b)=>(new Date(b.updatedAt.slice(0,19)+'Z')) - (new Date(a.updatedAt.slice(0,19)+'Z')))
                                    .map((item,index)=>{
                                        return(
                                            <tr key={index}
                                            onClick={()=>this.props.history.push('/manager/warehouse/import/' + item.id)}>
                                                <td>{item.creator.username}</td>
                                                <td>{item.createdAt.slice(0,10)+" "+item.createdAt.slice(11,19)}</td>
                                                <td>
                                                    {item.productList.map((item1,index1)=>{
                                                        let totalM=0
                                                        let totalRoll=0
                                                        for(let i=0;i<item1.quantity.length;i++){
                                                            if(item1.quantity[i].m) totalM+=item1.quantity[i].m
                                                            if(item1.quantity[i].roll) totalRoll+=item1.quantity[i].roll
                                                        }
                                                        return(
                                                            <p key={index1}>{item1.product.name + " :"}                                                  
                                                                {totalM? 
                                                                (totalRoll? 
                                                                    totalM + ' x m,' + totalRoll + ' x cuộn'
                                                                    : totalM + ' x m')
                                                                    :totalRoll + ' x cuộn'
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

                        <div className="tab-pane fade" id="export" role="tabpanel" aria-labelledby="export-tab">
                            <table className="table">
                                <thead className="brand-blue">
                                    <tr>
                                        <th>NGƯỜI TẠO</th>
                                        <th>THỜI GIAN</th>
                                        <th>DANH SÁCH</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {this.state.exports
                                    .sort((a,b)=>(new Date(b.updatedAt.slice(0,19)+'Z')) - (new Date(a.updatedAt.slice(0,19)+'Z')))
                                    .map((item,index)=>{
                                        return(
                                            <tr key={index}
                                            onClick={()=>this.props.history.push('/manager/warehouse/export/' + item.id)}>
                                                <td>{item.creator.username}</td>
                                                <td>{item.createdAt.slice(0,10)+" "+item.createdAt.slice(11,19)}</td>
                                                <td>
                                                    {item.productList.map((item1,index1)=>{
                                                        let totalM=0
                                                        let totalRoll=0
                                                        for(let i=0;i<item1.quantity.length;i++){
                                                            if(item1.quantity[i].m) totalM+=item1.quantity[i].m
                                                            if(item1.quantity[i].roll) totalRoll+=item1.quantity[i].roll
                                                        }
                                                        return(
                                                            <p key={index1}>{item1.product.name + " :"}                                                  
                                                                {totalM? 
                                                                (totalRoll? 
                                                                    totalM + ' x m,' + totalRoll + ' x roll'
                                                                    : totalM + ' x m')
                                                                    :totalRoll + ' x roll'
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
            </div>
        )
    }
}

export default List