import React, { Component } from 'react';
import Cookie from "js-cookie";

class ProductInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      product: {}
    }
  }

  async componentDidMount() {
      let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/products/" + this.props.match.params.id,{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token'),
        }
      });
      if (!response.ok) {
        return
      }
      let data = await response.json();
      this.setState({ loading: false, product: data });
      return
  }


  render() {
    const clickUpdate = () =>{
        this.props.history.push('/manager/products/' + this.state.product.id +'/update')
    }

    const clickBack = () =>{
        this.props.history.push('/manager/products')
    }

    if (!this.state.loading && Cookie.get('token')) {
      return (
        <div className="ProductInfo">
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12 p-0">
                            <div className="page-header-title">
                                <h5>THÔNG TIN SẢN PHẨM</h5>
                                ID: {this.state.product.id}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-contain">
                <div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
                    <button className="btn btn-primary" onClick={clickBack}>Trở về</button>
                    <button className="btn btn-primary m-r-20" onClick={clickUpdate}>Cập nhật</button>
                </div>
                <div className='row'>
                    <div className="col-sm-12 col-xl-8">
                        <div className='card'>
                            <div className='card-body'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-user  text-primary"></span>    
                                                    Tên :                                       
                                                </strong>
                                            </td>
                                            <td>
                                                {this.state.product.name}
                                            </td>
                                        </tr>
                                        <tr>    
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-user  text-primary"></span>    
                                                    Miêu tả :                                       
                                                </strong>
                                            </td>
                                            <td>
                                                {this.state.product.description}
                                            </td>
                                        </tr>
                                        <tr>    
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-user  text-primary"></span>    
                                                    Loại:                                       
                                                </strong>
                                            </td>
                                            <td>
                                                {this.state.product.category.name}
                                            </td>
                                        </tr>

                                        <tr>    
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-user  text-primary"></span>    
                                                    giá (1m2):                                       
                                                </strong>
                                            </td>
                                            <td>
                                                {this.state.product.price}
                                            </td>
                                        </tr>

                                        <tr>    
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-user  text-primary"></span>    
                                                    Kích thước cuộn:                                      
                                                </strong>
                                            </td>
                                            <td>
                                                {this.state.product.rollSizes.map((item,index)=>{
                                                    if(index === this.state.product.rollSizes.length-1){
                                                        return(<span key={index}>{item.lengt}m x {item.width}m.</span>)
                                                    }
                                                    return(<span key={index}>{item.lengt}m x {item.width}m, </span>)
                                                })}
                                            </td>
                                        </tr>
                                        
                                        <tr>    
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-user  text-primary"></span>    
                                                    Màu sắc:                                      
                                                </strong>
                                            </td>
                                            <td>
                                                    {this.state.product.colors.map((item,index)=>{
                                                        if(index === this.state.product.colors.length-1){
                                                            return(<span key={index} style={{color:item}}>{item}.</span>)
                                                        }
                                                        return(<span key={index} style={{color:item}}>{item}, </span>)
                                                    })}
                                            </td>
                                        </tr>
                                        
                                        <tr>        
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-cloud text-primary"></span>  
                                                    Tạo lúc :                                             
                                                </strong>
                                            </td>
                                            <td>
                                                {this.state.product.createdAt}
                                            </td>
                                        </tr>
                                        
                                        <tr>        
                                            <td className="text-primary">
                                                <strong>
                                                    <span className="glyphicon glyphicon-cloud text-primary"></span>  
                                                    Cập nhật :                                           
                                                </strong>
                                            </td>
                                            <td>
                                                {this.state.product.updatedAt}
                                            </td>
                                        </tr>                          
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className='col-xl-4 pl-4'>
                        <div className='card'>
                            <div className="card-body-sm  text-center">
                                <div className="user-image">
                                    <img src={process.env.REACT_APP_BACKEND_URL+this.state.product.image.url} className="wid-100 m-auto" alt="product image"/>
                                </div>
                                <h6 className="f-w-600 m-t-25 m-b-10">{this.state.product.name}</h6>
                                <p>{'Loại: ' + this.state.product.category.name}</p>
                                <p>{'Cập nhật: ' + this.state.product.updatedAt.slice(0,10)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )
    }
    return (<h2 className="ProductList-title">Waiting for API...</h2>);
  }
}

export default ProductInfo;