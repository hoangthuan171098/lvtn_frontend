import React, { Component } from "react";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
export default class Listorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      note: "",
      orders: [],
      currentpage : 1,
      perPage :8,
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
  paginate = ( pageNumber) =>{
    this.setState({currentpage:pageNumber})
  }
  render() {
    var name = "";
    var {orders} = this.state
    console.log(this.state.orders[this.state.orders.length - 1]);
   
    const indexOfLast = this.state.currentpage * this.state.perPage;
    const indexOfFirst = indexOfLast - this.state.perPage;
    const currentorders = orders.reverse().slice(indexOfFirst,indexOfLast);
    const pageNumber =[];
    for(let i=1;i<=Math.ceil(orders.length / this.state.perPage);i++){
      pageNumber.push(i)
    }
    return (
      <div className="Account_layout">
        <h3 className="styles_Heading">Đơn hàng của tôi</h3>
        <div className="inner">
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày mua</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái đơn hàng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentorders.map((order, index) => {
                if (order.buyer._id === Cookie.get("id")) {
                  var total = 0;
                  return (
                    <tr key={index}>
                      <td>
                        <Link>{order.id.slice(0, 9)}</Link>
                      </td>
                      <td>
                        {order.createdAt.slice(8, 10) +
                          "/" +
                          order.createdAt.slice(5, 7) +
                          "/" +
                          order.createdAt.slice(0, 4)}
                      </td>

                      {order.productList.map((item, index) => {
                        if (item.quantity && item.quantity_m) {
                          total =
                            total +
                            item.product.price * item.quantity +
                            item.product.price * item.quantity_m;
                        } else if (item.quantity) {
                          total += item.product.price * item.quantity;
                        } else {
                          total += item.product.price * item.quantity_m;
                        }
                        name += item.product.name + ",";

                        return <></>;
                      })}

                      <td>
                        {" "}
                        {name.length > 26 ? name.slice(0, 26) + `...` : name}
                      </td>
                      <td>{total}đ</td>
                      <td>{order.status}</td>
                      <td>
                        <Link to={`/purchase/${order.id}`}>
                          {" "}
                          chi tiết đơn hàng{" "}
                        </Link>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>

          <nav aria-label="Page navigation example">
            <ul class="pagination pg-blue">
            {/* <li className="page-item">
                <Link className="page-link">Previous</Link>
              </li> */}
              {pageNumber.map((number)=>{
                return(
                  <li className="page-ite" style={{cursor:"pointer"}}>
                    <a href onClick={() => this.paginate(number)} className="page-link">
                      {number}
                    </a>
                  </li>
                )
              })}
              {/*
                <a class="page-link">Next</a>
              </li> */}
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
