import React, { Component } from "react";
import ModalBuyProduct from "../Cart/ModalBuyProduct";
import Category from "../components/Category";
import "../Cart/styles/buycart.scss";
import { Link } from "react-router-dom";
import "./styleproductitem.scss";
import Cookie from "js-cookie";
import {withRouter} from "react-router"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class ProductDetailItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      quantity: "",
      color: "",
      quantity_m: "",
    };
  }
  handleMeter = (e) => {
    // if( this.state.quantity_m === "" ){
    //   toast.error("Vui lòng nhập số Mét!");
     
    //   return;
    // }
   
    // if(this.state.quantity_m <= 0 || this.state.quantity_m %1 !==0){
    //   toast.error("Số mét không hợp lệ!");
    //   e.target.value=""
    //   return;
    // }
    this.setState({
      quantity_m: Number(e.target.value),
    });
  };
  handleQuantity = (e) => {
    // if (this.state.quantity ==="" ) {
    //   toast.error("Vui lòng nhập số Cuộn!");
      
    //   return;
    // }
    // if( this.state.quantity <= 0 ||  this.state.quantity % 1 !==0  ){
    //   toast.error("Số cuộn không hợp lệ!");
    //   e.target.value=""
    //   return;
    // }
    this.setState({
      quantity: Number(e.target.value),
    });
  };
  handlecolor = (e) => {
    this.setState({
      color: e.target.value,
    });
  };
  handlenote = (e) => {

    this.setState({
      note: e.target.value,
    });
  };

  addtocart = () => {
    var { productdetail } = this.props;
    
    if (this.state.quantity ==="" ) {
      toast.error("Vui lòng nhập số Cuộn!");
     
      return;
    }
    if( this.state.quantity <= 0 ||  this.state.quantity % 1 !==0  ){
      toast.error("Số cuộn không hợp lệ!");
     
      return;
    }
    if( this.state.quantity_m === "" ){
      toast.error("Vui lòng nhập số Mét!");
     
      return;
    }
   
    if(this.state.quantity_m <= 0 || this.state.quantity_m %1 !==0){
      toast.error("Số mét không hợp lệ!");
     
      return;
    }
    if(this.state.color ===""){
      toast.error("Màu của sản phẩm chưa được chọn!");
      return;
    }
    if (!Cookie.get("username")) {
      toast.error("Bạn cần phải đăng nhập để đặt hàng!");
      return;
    }
    let item = {
      product: {
        id: productdetail.id,
        name: productdetail.name,
        image: { url: productdetail.image.url },
        price: productdetail.price,
        description: productdetail.description,
        status:'watting'
      },
      color: this.state.color,
      quantity: this.state.quantity,
      quantity_m: this.state.quantity_m,
    };
    let itemList = Cookie.get("cart");
    if(typeof(itemList)=== "string" && itemList !==undefined){
      
      let list = JSON.parse(itemList)
     console.log(list) 
      list.map((productitem,index)=>{
        if(productitem.product.id === productdetail.id && productitem.color === item.color){
            productitem.quantity += item.quantity
            productitem.quantity_m += item.quantity_m
            Cookie.set('cart',JSON.stringify(list))
            return
        }
        else{
          let newlist = [...list,item]
          Cookie.set('cart',JSON.stringify(newlist))
        }
        
      })
      
    }
    else{
      Cookie.set('cart',JSON.stringify([item]))
    }
    toast.success("Bạn đã thêm thành công sản phẩm vào giỏ hàng!");
    
    window.location.href="/products"
  };
  render() {
    var { productdetail } = this.props;
   
    return (
      <div className="product-detail">
        <div className="pd-wrap">
          <div className="container">
            <div className="heading-section">
              <h2>Chi tiết sản phẩm</h2>
            </div>
            <div className="row">
              <div className="col-md-6">
                <img
                  alt=""
                  src={
                    process.env.REACT_APP_BACKEND_URL + productdetail.image.url
                  }
                />
                {/* <div id="slider" className="owl-carousel product-slider">
               
                <div className="item">
                 
                </div>
              </div> */}
              </div>
              <div className="col-md-6">
                <div className="product-dtl">
                  <div className="product-info">
                    <div className="product-name">{productdetail.name}</div>
                    <div className="reviews-counter">
                      <div className="rate">
                        <input
                          type="radio"
                          id="star5"
                          name="rate"
                          defaultValue={5}
                          defaultChecked
                        />
                        <label htmlFor="star5" title="text">
                          5 stars
                        </label>
                        <input
                          type="radio"
                          id="star4"
                          name="rate"
                          defaultValue={4}
                          defaultChecked
                        />
                        <label htmlFor="star4" title="text">
                          4 stars
                        </label>
                        <input
                          type="radio"
                          id="star3"
                          name="rate"
                          defaultValue={3}
                          defaultChecked
                        />
                        <label htmlFor="star3" title="text">
                          3 stars
                        </label>
                        <input
                          type="radio"
                          id="star2"
                          name="rate"
                          defaultValue={2}
                        />
                        <label htmlFor="star2" title="text">
                          2 stars
                        </label>
                        <input
                          type="radio"
                          id="star1"
                          name="rate"
                          defaultValue={1}
                        />
                        <label htmlFor="star1" title="text">
                          1 star
                        </label>
                      </div>
                      <span>3 Reviews</span>
                    </div>
                    <div className="product-price-discount">
                      <span>{productdetail.price}$</span>
                      <span className="line-through">
                        {parseInt(productdetail.price) + 200}$
                      </span>
                    </div>
                  </div>
                  <p> {productdetail.description}</p>
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="size">Số cuộn</label>
                      <br />
                      <input
                        type="number"
                        onBlur={(e) => this.handleQuantity(e)}
                      ></input>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="color">Màu</label>
                      <select
                        onChange={(e) => this.handlecolor(e)}
                        id="color"
                        name="color"
                        className="form-control"
                      >
                      {this.state.color === "" ? 
                        <option value="" selected disabled hidden>-- Chọn Màu --</option>
                        :
                        <option value={this.state.color} selected disabled hidden>{this.state.color}</option>
                      }
                        {productdetail.colors.map((item, index) => {
                          return <option value={item}>{item}</option>
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="product-count">
                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="size">Số mét</label>
                        <br />
                        <input
                          type="number"
                          onBlur={(e) => this.handleMeter(e)}
                        ></input>
                      </div>
                    </div>
                    <Link
                      
                      className="round-black-btn"
                      onClick={() => this.addtocart()}
                    >
                      Thêm vào giỏ hàng
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default  withRouter(ProductDetailItem)