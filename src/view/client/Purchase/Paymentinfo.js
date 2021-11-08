import React, { Component } from "react";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
export default class Paymentinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      note: "",
      orders: [],
      currentpage: 1,
      perPage: 8,
      transections: [],
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
      let response2 = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/transections",
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      );
      if (!response2.ok) {
        return;
      }
      let transections = await response2.json();
      this.setState({ transections: transections });
      return;
    }
    this.setState({ authenticate: false });
  }
  paginate = (pageNumber) => {
    this.setState({ currentpage: pageNumber });
  };
  render() {
    var name = "";
    var { transections } = this.state;

    const indexOfLast = this.state.currentpage * this.state.perPage;
    const indexOfFirst = indexOfLast - this.state.perPage;
    const currenttransections = transections
      .reverse()
      .slice(indexOfFirst, indexOfLast);
    const pageNumber = [];
    for (
      let i = 1;
      i <= Math.ceil(transections.length / this.state.perPage);
      i++
    ) {
      pageNumber.push(i);
    }

    return (
      <div className="Account_layout">
        <h3 className="styles_Heading">Thông tin thanh toán</h3>
        <div className="inner">
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày mua</th>
                <th>Sản phẩm</th>
                <th>Tình trạng thanh toán</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.transections.filter(i=>i.order.buyer===Cookie.get('id')).map((payment, index) => {
                var total = 0;
                return (
                  <tr key={index}>
                    <td>
                      <Link>{payment._id.slice(0, 9)}</Link>
                    </td>
                    <td>
                      {payment.createdAt.slice(8, 10) +
                        "/" +
                        payment.createdAt.slice(5, 7) +
                        "/" +
                        payment.createdAt.slice(0, 4)}
                    </td>

                    {/* {payment.productList.map((item, index) => {
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
                      })} */}
                    {this.state.orders.map((order, index) => {
                      if (order.id === payment.order.id) {
                        {
                          order.productList.map((item, index) => {
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
                          });
                        }
                      }
                    })}
                    <td>
                      {" "}
                      {name.length > 26 ? name.slice(0, 26) + `...` : name}
                    </td>
                    {/* <td>{payment.total}đ</td> */}
                    <td>{payment.status === 'paid' ? 'Đã thanh toán': 'Chưa thanh toán'}</td>
                    <td>
                      <Link to={`/purchase/payment/${payment.order.id}`}>
                        {" "}
                        chi tiết đơn hàng{" "}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <nav aria-label="Page navigation example">
            <ul class="pagination pg-blue">
              {/* <li className="page-item">
                <Link className="page-link">Previous</Link>
              </li> */}
              {pageNumber.map((number) => {
                return (
                  <li className="page-ite" style={{ cursor: "pointer" }}>
                    <a
                      href
                      onClick={() => this.paginate(number)}
                      className="page-link"
                    >
                      {number}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
