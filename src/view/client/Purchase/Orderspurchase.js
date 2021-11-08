import React, { Component } from "react";
import "../style/orderspurchase.scss";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
class Orderspurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      note: "",
      orders: [],
    };
  }

  async componentDidMount() {
    if (Cookie.get("role") === "Public" || Cookie.get("role") === "Customer") {
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
    this.setState({ authenticate: false });
  }
  render() {
    
    const removeOrder = (id) =>{
      axios
        .delete(process.env.REACT_APP_BACKEND_URL + "/orders/" + id,{
          headers: {
            'Authorization':'bearer '+ Cookie.get('token'),
          },
        })
        .then(response => {
          toast.success('Destroy success.');
          window.location.href = "/purchase"
        })
        .catch(error => {
          toast.error('Destroy failed !!!');
         
        });
    }
    return (
      <div className="orderspurchase">
        <div className="breacrumb-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-text product-more">
                  <Link to="/">
                    <i className="fa fa-home" /> Home
                  </Link>
                  <Link to="/products">Shop</Link>
                  <span>Bảng đơn đặt hàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            
            <div className="col-lg-8 col-md-10 ml-auto mr-auto">
              <h4>
                <small></small>
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th>Mã Đơn Hàng</th>
                      <th>Số lượng Sản Phẩm</th>
                      <th>Ghi Chú</th>
                      <th className="text-right">Thời gian đặt hàng</th>
                      <th className="text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.orders.map((order, index) => {
                     

                      return (
                        <tr>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">{order.id}</td>
                          <td className="text-center">
                            {order.productList.length}
                          </td>
                          <td>{order.note}</td>
                          <td className="text-right">
                            {order.createdAt.slice(0, 10) +
                              " " +
                              order.createdAt.slice(11, 16)}
                          </td>
                          <td className="td-actions text-right">
                            <button
                              type="button"
                              rel="tooltip"
                              className="btn btn-success btn-just-icon btn-sm"
                              data-original-title
                              title
                            >
                              <Link to={`/purchase/${order.id}`}>
                                <i className="material-icons">edit</i>
                              </Link>
                            </button>
                            <button type="button" rel="tooltip" className="btn btn-danger btn-just-icon btn-sm" data-original-title="" title=""
                              onClick={() =>removeOrder(order.id)}
                            >
                                    <i class="material-icons">delete</i>
                                </button>
                          </td>
                          
                            
                         
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default  withRouter(Orderspurchase);