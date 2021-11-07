import axios from 'axios'
import React from 'react'
import Cookie from 'js-cookie'

export default class Info extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading: true,
            product: {},
            categories: [],
            imports: [],
            exports: []
        }
    }

    async componentDidMount(){
        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/warehouses/' + this.props.match.params.id,{
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                }
            })
            .then(res=>{
                this.setState({product:res.data})
            })
            .catch(err=>{
                alert('Cannot connect to server 1!')
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
                alert('Cannot connect to server 1!')
            })

        await axios
            .get(process.env.REACT_APP_BACKEND_URL + '/product-categories',{
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                }
            })
            .then(res=>{
                this.setState({categories:res.data})
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
                alert('Cannot connect to server 2!')
            })
        
        this.setState({loading:false})
    }

    backClick = () =>{
		this.props.history.push('/manager/warehouse/')
	}
    
    render(){
        if(!this.state.loading){
            return(
                <div>
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12 p-0">
                                    <div className="page-header-title">
                                        <h5>DETAIL</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="page-contain">
                        <div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
                            <button onClick={this.backClick} className='btn btn-success mr-4'>Trở về</button>
                        </div>
                        <div className='row'>
                            <div className="col-sm-12 col-xl-8">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active text-uppercase" id="have-tab" data-toggle="tab" href="#remain" role="tab" aria-controls="have" aria-selected="true">Ton kho</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-uppercase" id="import-tab" data-toggle="tab" href="#import" role="tab" aria-controls="import" aria-selected="false">Nhap</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link text-uppercase" id="export-tab" data-toggle="tab" href="#export" role="tab" aria-controls="export" aria-selected="false">Xuat</a>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTabContent" style={{margin:0+'px'}}>
                                    <div className="tab-pane fade show active" id="remain" role="tabpanel" aria-labelledby="have-tab">
                                        <table className="table">
                                            <thead className="brand-blue">
                                                <tr>
                                                    <th>Color</th>
                                                    <th>M</th>
                                                    <th>Cuộn</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.product.quantity.map((item,index)=>{
                                                    return(
                                                        <tr key={index}>
                                                            <td>{item.color}</td>
                                                            <td>{item.m? item.m:0}</td>
                                                            <td>{item.roll? item.roll:0}</td>
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
                                                    <th>Creator</th>
                                                    <th>Time</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.imports
                                                .sort((a,b)=>(new Date(b.updatedAt.slice(0,19)+'Z')) - (new Date(a.updatedAt.slice(0,19)+'Z')))
                                                .map((item,index)=>{
                                                    let isHave = item.productList.map(i=>i.product.name).includes(this.state.product.product.name)
                                                    if(isHave){
                                                        let location = item.productList.map(i=>i.product.name).findIndex(i=>i===this.state.product.product.name)
                                                        return(
                                                            <tr key={index}>
                                                                <td>{item.creator.username}</td>
                                                                <td>{item.createdAt.slice(0,10)+" "+item.createdAt.slice(11,19)}</td>
                                                                <td>
                                                                    {item.productList[location].quantity.map((item1,index1)=>{
                                                                        return(
                                                                            <p key={index1}>{item1.color + ': '}{item1.m ?
                                                                                (item1.roll? 
                                                                                    item1.m + ' x m,' + item1.roll + ' x roll'
                                                                                : item1.m + ' x m')
                                                                                :item1.roll + ' x roll'
                                                                            }
                                                                            </p>
                                                                        )
                                                                    })}
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="tab-pane fade" id="export" role="tabpanel" aria-labelledby="export-tab">
                                        <table className="table">
                                            <thead className="brand-blue">
                                                <tr>
                                                    <th>Creator</th>
                                                    <th>Time</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.exports
                                                .sort((a,b)=>(new Date(b.updatedAt.slice(0,19)+'Z')) - (new Date(a.updatedAt.slice(0,19)+'Z')))
                                                .map((item,index)=>{
                                                    let isHave = item.productList.map(i=>i.product.name).includes(this.state.product.product.name)
                                                    if(isHave){
                                                        let location = item.productList.map(i=>i.product.name).findIndex(i=>i===this.state.product.product.name)
                                                        return(
                                                            <tr key={index}>
                                                                <td>{item.creator.username}</td>
                                                                <td>{item.createdAt.slice(0,10)+" "+item.createdAt.slice(11,19)}</td>
                                                                <td>
                                                                    {item.productList[location].quantity.map((item1,index1)=>{
                                                                        return(
                                                                            <p key={index1}>{item1.color + ': '}{item1.m ?
                                                                                (item1.roll? 
                                                                                    item1.m + ' x m,' + item1.roll + ' x roll'
                                                                                : item1.m + ' x m')
                                                                                :item1.roll + ' x roll'
                                                                            }
                                                                            </p>
                                                                        )
                                                                    })}
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className='col-xl-4'>
                                <div className='card'>
                                    <div className="card-header">
                                        <h5>Thong tin</h5>
                                    </div>
                        
                                    <div className="card-body  text-center">
                                        <div className="user-image">
                                            <img src={process.env.REACT_APP_BACKEND_URL+this.state.product.product.image.url} className="wid-100 m-auto" alt="product image"/>
                                        </div>
                                        <h6 className="f-w-600 m-t-25 m-b-10">{this.state.product.product.name}</h6>
                                        <p>{'Loai: ' + this.state.categories.filter(i=>i.id===this.state.product.product.category)[0].name}</p>
                                        <p>{'Cap nhat: ' + this.state.product.updatedAt.slice(0,10)}</p>
                                        <hr/>
                                        <p>{this.state.product.product.description}</p>
                                        <div className="bg-c-blue counter-block m-t-10 p-10">
                                            <div className="row">
                                                <div className="col-6">
                                                    <span className="text-white">M</span>
                                                    <h6 className="text-white mt-2 mb-0">
                                                        {this.showTotalM()}
                                                    </h6>
                                                </div>
                                                <div className="col-6">
                                                    <span className="text-white">CUON</span>
                                                    <h6 className="text-white mt-2 mb-0">{this.showTotalRoll()}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div>Waiting API</div>
        )
    }

    showTotalM = () =>{
        let total=0
        this.state.product.quantity.map((item)=>{
            if(item.m && item.m>0){
                total +=item.m
            }
        })
        return(<>{total}</>)
    }
    showTotalRoll = () =>{
        let total=0
        this.state.product.quantity.map((item)=>{
            if(item.roll && item.roll>0){
                total +=item.roll
            }
        })
        return(<>{total}</>)
    }
} 