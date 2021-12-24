import React, { Component } from "react";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style/shoppingcart.scss";
import {withRouter} from "react-router"
import { ToastContainer, toast } from 'react-toastify';
class Shopcart extends Component {
  constructor(props){
    super(props);
    this.state ={
      loading :true,
      authenticate: true,
      note: '',
      productList: [],
      info: {}
    }
  }

  async componentDidMount(){
    let itemListString = Cookie.get('cart')
    
    if(typeof(itemListString)=== "string" && itemListString !==undefined){
      let itemList = JSON.parse(itemListString)
      this.setState({productList: itemList})
    }
    let response2 = await fetch(process.env.REACT_APP_BACKEND_URL + "/customer-infos?customerId=" + Cookie.get('id') ,{
			headers: {'Authorization':'bearer '+ Cookie.get('token')}
		});
    let data2 = await response2.json();
    if(data2.length !== 0){
			this.setState({info: data2[0]});
		}
  }


  checkOutClick = async () =>{
    axios
      .post(process.env.REACT_APP_BACKEND_URL + '/orders',{
        status:'waiting',
        productList : this.state.productList,
        note:this.state.note,
        buyer:Cookie.get('id')
      },{
        headers:{
          'Authorization':'bearer '+ Cookie.get('token'),
        }
      })
      .then(response =>{
        if(this.state.info){
          if(this.state.info.street && this.state.info.wards && this.state.info.district && this.state.info.region){
            this.props.history.push('/payment')
          }
        }
        else{
          this.props.history.push('/location')
        }
      })
      .catch(err => {
        this.props.history.push('/location')
      })
      this.props.history.push('/location')
  }
  updateMeterClick = (event,index) =>{
    let productList = this.state.productList
    if(event.target.value==0 && productList[index].quantity==0 ){
      toast.error("Số mét và số cuộn khổng thể bằng 0!");
      event.target.value = productList[index].quantity_m;
      return;
    }
    if(event.target.value< 0 ||  event.target.value %1 !==0 ){
      toast.error("Số mét không hợp lệ!");
      event.target.value = productList[index].quantity_m;
      return;
    }
    productList[index].quantity_m = Number(event.target.value)
    
    this.setState({productList:productList})
    Cookie.set('cart',JSON.stringify(productList))
  }
  updateProductClick = (event,index) =>{
    let productList = this.state.productList
    if(event.target.value==0 && productList[index].quantity_m==0 ){
      toast.error("Số mét và số cuộn khổng thể bằng 0!");
      event.target.value = productList[index].quantity;
      return;
    }
    if(event.target.value< 0 ||  event.target.value %1 !==0){
      toast.error("Số cuộn không hợp lệ!");
      event.target.value = productList[index].quantity;
      return;
    }
    productList[index].quantity = Number(event.target.value)
    this.setState({productList:productList})
    Cookie.set('cart',JSON.stringify(productList))
    
  }
  removeProductClick = (event,index) =>{
    event.preventDefault()
    let productList = this.state.productList
    productList.splice(index,1)
    if(productList.length === 0){
      this.setState({productList:productList})
      Cookie.remove('cart')
    }
    else{
      this.setState({productList:productList})
      Cookie.set('cart',JSON.stringify(productList))
    }
  }
  
  render() {
    var total =0;
   
    return (
      <div className="container padding-bottom-3x mb-1">
        <div className="table-responsive shopping-cart">
          <table className="table">
            <thead>
              <tr>
                <th style={{borderWidth:0 + 'px' }}>Tên sản phẩm</th>
                <th style={{borderWidth:0 + 'px' }} className="text-center">Số Cuộn</th>
                <th style={{borderWidth:0 + 'px' }} className="text-center">Số Mét</th>
                <th style={{borderWidth:0 + 'px' }} className="text-center">Giá</th>
                <th style={{borderWidth:0 + 'px' }} className="text-center">Tổng</th>
                <th style={{borderWidth:0 + 'px' }} className="text-center">
                  <a className="btn btn-sm btn-outline-danger" href="!#">
                    Xóa giỏ hàng
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.productList.map((item, index) => {
                total += parseInt(item.product.price)*item.quantity
                total += parseInt(item.product.price)*item.quantity_m
                return (
                  <tr key={index}>
                    <td>
                      <div className="product-item">
                        <a className="product-thumb" href="!#">
                          <img
                            src={process.env.REACT_APP_BACKEND_URL + item.product.image.url}
                            alt="Product"
                          />
                        </a>
                        <div className="product-info">
                          <h4 className="product-title">
                            <a href="!#">{item.product.name}</a>
                          </h4>
                         
                          <span>
                            <em>Màu:</em> {item.color}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="count-input" >
                        <input type="number" style={{ width: 110 + "px", textAlign:"center"}} pattern="[1-9][0-9]*" defaultValue={item.quantity}
                          onBlur = {(e) =>this.updateProductClick(e,index)}
                         />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="count-input">
                      
                        <input type="number" style={{ width: 110 + "px", textAlign:"center"}} defaultValue={item.quantity_m}
                           onBlur = {(e) =>this.updateMeterClick(e,index)}
                         />
                        
                      </div>
                    </td>
                    <td className="text-center text-lg text-medium">{(item.product.price*1).toLocaleString('en')} VNĐ</td>
                    <td className="text-center text-lg text-medium">{(parseInt(item.product.price)*item.quantity+parseInt(item.product.price)*item.quantity_m).toLocaleString('en')} VNĐ</td>
                    <td className="text-center">
                      <Link
                        className="remove-from-cart"
                        href="#"
                        data-toggle="tooltip"
                        title
                        data-original-title="Remove item"
                      >
                        <i className="fa fa-trash" onClick={e=>this.removeProductClick(e,index)} />
                      </Link>
                    </td>
                     
                  </tr>
                );
              })}

              
            </tbody>
          </table>
        </div>
        <div className="shopping-cart-footer">
          <div className="column">
            <form className="coupon-form" >
              <input
                className="form-control form-control-sm"
                type="text"
                placeholder="Ghi chú"
                required
              />
              
            </form>
          </div>
          <div className="column text-lg" style={{ fontSize: 20 + "px" }}>
            Tổng cộng:{" "}
            <span
              className="text-medium"
              style={{ fontSize: 20 + "px", color: "red" }}
            >
              {total.toLocaleString('en')} VNĐ
            </span>
          </div>
        </div>
        <div className="shopping-cart-footer">
          <div className="column">
            <Link to="/products" className="btn btn-outline-secondary" >
              <i className="icon-arrow-left" />
              &nbsp;Back to Shopping
            </Link>
          </div>
          <div className="column">
            <a
              className="btn btn-primary"
              href="!#"
              data-toast
              data-toast-type="success"
              data-toast-position="topRight"
              data-toast-icon="icon-circle-check"
              data-toast-title="Your cart"
              data-toast-message="is updated successfully!"
            >
              Update Cart
            </a>
            <Link className="btn btn-success" onClick={this.checkOutClick} >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Shopcart)
