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
      productList: []
    }
  }

  async componentDidMount(){
    let itemListString = Cookie.get('cart')
    
    if(typeof(itemListString)=== "string" && itemListString !==undefined){
      let itemList = JSON.parse(itemListString)
      this.setState({productList: itemList})
    }
  }


  checkOutClick = () =>{
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
          alert('Da dat hang thanh cong');
          // Cookie.remove('cart')
          window.location.href="/location"
        })
        .catch(err => {
        })
       
  }
  updateMeterClick = (event,index) =>{
    let productList = this.state.productList
    productList[index].quantity_m = Number(event.target.value)
    if(Number(event.target.value) === 0){
        toast.error('loi');
        return;
    }
    this.setState({productList:productList})
    Cookie.set('cart',JSON.stringify(productList))
  }
  updateProductClick = (event,index) =>{
    let productList = this.state.productList
    productList[index].quantity = Number(event.target.value)
    this.setState({productList:productList})
    Cookie.set('cart',JSON.stringify(productList))
    
  }
  removeProductClick = (event,index) =>{
    event.preventDefault()
    let productList = this.state.productList
    productList.splice(index,1)
    this.setState({productList:productList})
    console.log(this.state.productList)
    Cookie.set('cart',JSON.stringify(productList))
  }
  onBlurQuantity = (e) =>{
    if(e.target.value <= 0){
      toast.error("loi")
      return;
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
                <th>Tên sản phẩm</th>
                <th className="text-center">Số Cuộn</th>
                <th className="text-center">Số Mét</th>
                <th className="text-center">Giá</th>
                <th className="text-center">Tổng</th>
                <th className="text-center">
                  <a className="btn btn-sm btn-outline-danger" href="!#">
                    Xóa giỏ hàng
                  </a>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.productList.map((item, index) => {
                total += parseInt(item.product.price)*item.quantity
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
                        <input type="text" style={{ width: 110 + "px", textAlign:"center"}} pattern="[1-9][0-9]*" defaultValue={(item.quantity).toLocaleString('en')}
                          onChange = {(e) =>this.updateProductClick(e,index)}
                          onBlur = {(e) =>this.onBlurQuantity(e)}
                         />
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="count-input">
                      
                        <input type="text" style={{ width: 110 + "px", textAlign:"center"}} defaultValue={(item.quantity_m*1).toLocaleString('en')}
                           onChange = {(e) =>this.updateMeterClick(e,index)}
                         />
                        
                      </div>
                    </td>
                    <td className="text-center text-lg text-medium">{(item.product.price*1).toLocaleString('en')} VNĐ</td>
                    <td className="text-center text-lg text-medium">{(parseInt(item.product.price)*item.quantity).toLocaleString('en')} VNĐ</td>
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
            <form className="coupon-form" method="post">
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
            <a className="btn btn-outline-secondary" href="!#">
              <i className="icon-arrow-left" />
              &nbsp;Back to Shopping
            </a>
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
