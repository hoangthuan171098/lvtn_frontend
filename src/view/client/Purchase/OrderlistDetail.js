import React, { Component } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default class OrderlistDetail extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      note: "",
      orders: []
    };
  }

  async componentDidMount() {
    if (Cookie.get('role') === 'Public' || Cookie.get('role') === 'Customer') {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/orders",
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      );
      if (!response.ok) {
        return;
      }

      let orders = await response.json();
      
      this.setState({
        loading: false,
        authenticate: true,
        orders: orders,
      });
      return;
    }
  }

  removeOrder = (id) =>{
    var orders = this.state.orders
    orders.map((order,index)=>{
        order.status = 'cancled';
    })
    toast.success("Bạn đã hủy thành công đơn hàng!");
    this.setState({orders:orders})
    axios
      .put(process.env.REACT_APP_BACKEND_URL + '/orders/' + id, {
        status : 'cancled'
      },{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token'),
        },
      })
      .then(response => {
       
      })
      .catch(error => {
        toast.error('An error occurred, please check again.');
        console.log('An error occurred:', error.response);
      });
    return
  }
  render() {
      
    var total = 0
    return (
      <div className="Account_layout">
        <h3 className="styles_Heading">
          {`Chi tiết đơn hàng#${this.props.match.params.id.slice(0, 9)}
          -${this.state.orders.map((order)=>{
            if (order.id === this.props.match.params.id) {
                  return order.status
              }
          })}
          ` 
          }
        </h3>
        <div className="order-detail">
          <table className="productlist">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số cuộn</th>
                <th>Số mét</th>
                <th>Mau</th>
                <th>Tạm tính</th>
                <th>Trạng thái </th>
              </tr>
            </thead>
            <tbody>
              {this.state.orders.map((order, index) => {
                  
                if (order.id === this.props.match.params.id) {
                  return (
                    <>
                      {order.productList.map((item, index) => { 
                        let money 
                        if(item.quantity && item.quantity_m){
                          money = item.product.price * item.quantity + item.product.price * item.quantity_m
                          total += money
                        }
                        else if(item.quantity){
                          money = item.product.price * item.quantity
                          total += money
                        }
                        else{
                          money = item.product.price * item.quantity_m
                          total += money
                        }
                        return (
                          <tr>
                            <td>
                              <div className="product-item">
                                <img
                                  src={process.env.REACT_APP_BACKEND_URL + item.product.image.url}
                                  alt=""
                                />
                                <div className="product-info">
                                  <a className="product-name">
                                    {item.product.name}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="price">{item.product.price}đ</td>
                            <td className="quantity">{item.quantity}</td>
                            <td className="discount">{item.quantity_m}</td>
                            <td className="discount">{item.color}</td>
                            <td className="total">{money}đ</td>
                            <td className="total">{item.product.status}</td>
                          </tr>
                        );
                      })}
                    </>
                  );
                }
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4">
                  <span>Tạm tính</span>
                </td>
                <td>{total}đ</td>
              </tr>
              <tr>
                <td colSpan="4">
                  <span>Phí vận chuyển</span>
                </td>
                <td>0đ</td>
              </tr>
              <tr>
                <td colSpan="4">
                  <span>Tổng cộng</span>
                </td>
                <td>
                  <span className="sum">{total}đ</span>
                </td>
              </tr>
              <tr>
                <td colSpan="4"></td>
                <td>
                {
                    this.state.orders.map((order,index)=>{
                        if (order.id === this.props.match.params.id) {
                            
                                if(order.status ==='waiting'){
                                    return(
                                        <Link title="Hủy đơn hàng" className="cancel" onClick={()=>this.removeOrder(this.props.match.params.id)}>
                                            Hủy đơn hàng
                                        </Link>
                                    )
                                }
                                else if(order.status ==='cancled'){
                                    return(
                                        <Link title="Hủy đơn hàng" className="cancel" style={{backgroundColor:'#999999',borderColor:'#999999'}}>
                                        Đơn hàng đã hủy
                                        </Link>
                                    )
                                }
                                else{
                                  return(
                                    <></>
                                  )
                                }
                           
                        }
                    })
                }
                   
                
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
}