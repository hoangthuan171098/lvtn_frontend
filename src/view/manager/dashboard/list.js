import React, { Component } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "./style/index.scss";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      orders: [],
      users: [],
      warehouse: [],
    };
  }
  async componentDidMount() {
    let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/orders", {
      headers: {
        Authorization: "bearer " + Cookie.get("token"),
      },
    });

    let response2 = await fetch(process.env.REACT_APP_BACKEND_URL + "/users", {
      headers: {
        Authorization: "bearer " + Cookie.get("token"),
      },
    });
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/warehouses", {
        headers: {
          Authorization: "bearer " + Cookie.get("token"),
        },
      })
      .then((res) => {
        this.setState({ warehouse: res.data });
      });
    if (!response2.ok) {
      return;
    }
    if (!response.ok) {
      return;
    }
    let users = await response2.json();
    let orders = await response.json();
    this.setState({
      loading: false,
      orders: orders,
      users: users,
    });
    return;
  }
  infoClick = (id) => {
    this.props.history.push("/manager/orders/" + id);
  };
  render() {
    var listroll = [];
    var listname = [];
    var orders = this.state.orders;
    var name = "";
    var data = [0, 0, 0, 0, 0];
    var dataproduct = [0, 0, 0, 0, 0];
    let date = new Date().toLocaleString();
    var warehouse = this.state.warehouse;
    var abc = [];
    var orderroll = [];
    var ordername = [];
    var orderlist = [];
    var list = [];
    var count = 0;
    var z = 0;
    var sl = 0;

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].productList.length; j++) {
        for (let k = 0; k < orders.length; k++) {}
          var item = {
            name: orders[i].productList[j].product.name,
            quantity: orders[i].productList[j].quantity,
          };

          orderlist[count] = item;
          count = count + 1;
      }
    }

    for (var i = 0; i < orderlist.length - 1; i++) {
      for (var j = i + 1; j < orderlist.length; j++) {
        sl = orderlist[i].quantity;
        if (orderlist[i].name === orderlist[j].name) {
          sl += orderlist[j].quantity;
        } else {
          sl = orderlist[i].quantity;
        }
      }
      let item = {
        name: orderlist[i].name,
        quantity: sl,
      };

      list[count] = item;
      count++;
    }

    list = list.sort(function (a, b) {
      return b - a;
    });
    console.log(list);
    for (let i = 0; i < warehouse.length; i++) {
      var roll = 0;

      for (let k = 0; k < warehouse[i].quantity.length; k++) {
        roll += warehouse[i].quantity[k].roll;
      }
      let lst = {
        name: warehouse[i].product.name,
        roll: roll,
      };
      abc[i] = lst;
    }
    abc = abc.sort(function (a, b) {
      return b - a;
    });
    var finalroll = 0;
    for (let i = 0; i < abc.length; i++) {
      if (abc[i].roll > 100) {
        listname[i] = abc[i].name;
        listroll[i] = abc[i].roll;
      } else {
        finalroll += abc[i].roll;
      }
    }
    listroll[listroll.length] = finalroll;
    listname[listname.length] = "C??n l???i";
    var total = 0;
    var sum = 0;

    this.state.orders.map((order) => {
      order.productList.map((item) => {
        total += item.product.price * item.quantity;
        if (date.slice(13, 15) === order.createdAt.slice(5, 7)) {
          data[4] += item.product.price * item.quantity;
        } else if (order.createdAt.slice(5, 7) === "10") {
          data[3] += item.product.price * item.quantity;
        } else if (order.createdAt.slice(5, 7) === "9") {
          data[2] += item.product.price * item.quantity;
        } else if (order.createdAt.slice(5, 7) === "8") {
          data[1] += item.product.price * item.quantity;
        } else {
          data[0] += item.product.price * item.quantity;
        }
      });
    });

    return (
      <div className="dashboards">
        <div className="row mb-3">
          {/* Earnings (Monthly) Card Example */}
          <div className="col-xl-4 col-md-6 mb-5">
            <div
              className="card h-100 mr-3 "
              style={{ borderRadius: 10 + "px" }}
            >
              <div className="card-body ">
                <div className="row align-items-center ">
                  <div className="col mr-2 mt-3">
                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                      DOANH THU (Th??ng)
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {total.toLocaleString("en")} VN??
                    </div>
                    {/* <div className="mt-2 mb-0 text-muted text-xs">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> 3.48%
                      </span>
                      <span>Since last month</span>
                    </div> */}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Earnings (Annual) Card Example */}
          <div className="col-xl-4 col-md-6 mb-5">
            <div
              className="card h-100 mr-3"
              style={{ borderRadius: 10 + "px" }}
            >
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2 mt-3">
                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                      ????N H??NG
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {this.state.orders.length.toLocaleString("en")}
                    </div>
                    {/* <div className="mt-2 mb-0 text-muted text-xs">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 12%
                      </span>
                      <span>Since last years</span>
                    </div> */}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-shopping-cart fa-2x text-success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* New User Card Example */}
          <div className="col-xl-4 col-md-6 mb-5">
            <div
              className="card h-100 mr-3"
              style={{ borderRadius: 10 + "px" }}
            >
              <div className="card-body ">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2  mt-3">
                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                      T??I KHO???N
                    </div>
                    <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                      {this.state.users.length.toLocaleString("en")}
                    </div>
                    {/* <div className="mt-2 mb-0 text-muted text-xs">
                      <span className="text-success mr-2">
                        <i className="fas fa-arrow-up" /> 20.4%
                      </span>
                      <span>Since last month</span>
                    </div> */}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-users fa-2x text-info" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Pending Requests Card Example */}
          {/* <div className="col-xl-3 col-md-6 mb-5">
            <div
              className="card h-100 mr-3"
              style={{ borderRadius: 10 + "px" }}
            >
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2 mt-3">
                    <div className="text-xs font-weight-bold text-uppercase mb-1">
                      Pending Requests
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      18
                    </div>
                    <div className="mt-2 mb-0 text-muted text-xs">
                      <span className="text-danger mr-2">
                        <i className="fas fa-arrow-down" /> 1.10%
                      </span>
                      <span>Since yesterday</span>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-comments fa-2x text-warning" />
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="col-xl-8 col-lg-7">
            <Line
              data={{
                labels: [
                  "Th??ng 7",
                  "Th??ng 8",
                  "Th??ng 9",
                  "Th??ng 10",
                  "Th??ng 11",
                  "Th??ng 12",
                ],
                datasets: [
                  {
                    data: data,
                    label: "Doanh Thu (VN??)",
                    borderColor: "#3e95cd",
                    fill: false,
                  },
                  // {
                  //   data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                  //   label: "Asia",
                  //   borderColor: "#8e5ea2",
                  //   fill: false
                  // },
                  // {
                  //   data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                  //   label: "Europe",
                  //   borderColor: "#3cba9f",
                  //   fill: false
                  // },
                  // {
                  //   data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                  //   label: "Latin America",
                  //   borderColor: "#e8c3b9",
                  //   fill: false
                  // },
                  // {
                  //   data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
                  //   label: "North America",
                  //   borderColor: "#c45850",
                  //   fill: false
                  // }
                ],
              }}
              options={{
                title: {
                  display: true,
                  text: "World population per region (in millions)",
                },
                legend: {
                  display: true,
                  position: "bottom",
                },
              }}
            />
          </div>
          <div className="col-xl-4 col-lg-5">
            <h3 className="text-center">S???n ph???m b??n ch???y</h3>
            <div
              className="well"
              style={{ maxHeight: "300px", overflow: "auto" }}
            >
              <ul className="list-group checked-list-box">
                {list.map((item, index) => {
                  if (index >= 9) {
                    return <></>;
                  } else {
                    return (
                      <li
                        className="list-group-item"
                        data-checked="true"
                        key={index}
                      >
                        {item.name}
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
          </div>
          <label style={{ marginTop: 30 + "px" }}>????N H??NG G???N ????Y</label>
          <table
            id="example"
            className="table table-striped table-bordered"
            style={{ width: "100%", fontFamily: "sans-serif" }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>M?? ????n h??ng</th>
                <th style={{ textAlign: "center" }}>Ng??y mua</th>
                <th style={{ textAlign: "center" }}>S???n ph???m</th>
                <th style={{ textAlign: "center" }}>T???ng ti???n</th>
                <th style={{ textAlign: "center" }}>Tr???ng th??i ????n h??ng</th>
                <th style={{ textAlign: "center" }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.reverse().map((order, index) => {
                if (index >= 5) {
                  return <></>;
                } else {
                  return (
                    <tr key={index}>
                      <td style={{ textAlign: "center" }}>
                        {order.id.slice(0, 9)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {order.createdAt.slice(8, 10) +
                          "/" +
                          order.createdAt.slice(5, 7) +
                          "/" +
                          order.createdAt.slice(0, 4)}
                      </td>

                      {order.productList.map((item, index) => {
                        if (item.quantity && item.quantity_m) {
                          sum =
                            sum +
                            item.product.price * item.quantity +
                            item.product.price * item.quantity_m;
                        } else if (item.quantity) {
                          sum += item.product.price * item.quantity;
                        } else {
                          sum += item.product.price * item.quantity_m;
                        }
                        name += item.product.name + ",";

                        return <></>;
                      })}

                      <td style={{ textAlign: "center" }}>
                        {" "}
                        {name.length > 26 ? name.slice(0, 26) + `...` : name}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {sum.toLocaleString("en")} VN??
                      </td>
                      <td style={{ textAlign: "center" }}>{order.status}</td>
                      <td
                        style={{
                          textAlign: "center",
                          cursor: "pointer",
                          color: "blue",
                        }}
                        onClick={() => this.infoClick(order.id)}
                      >
                        Chi ti???t
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
          <Link
            to="/manager/orders/"
            style={{ textAlign: "center", cursor: "pointer", color: "blue" }}
          >
            Xem Th??m...
          </Link>
        </div>

        {/* <div className="col-xl-4 col-lg-5">
          <label>S??? l?????ng v???i trong kho</label>
          <Doughnut
            data={{
              labels: ['vai1','vai2','vai3','vai4'],
              datasets: [
                {
                  label: "Cu???n",
                  backgroundColor: [
                    "#FFCCFF",
                    "#99CCFF",
                    "#00CC33",
                    "#FF9933",
                  ],
                  data: [1,2,3,4],
                },
              ],
            }}
            option={{
              title: {
                display: true,
                text: "Predicted world population (millions) in 2050",
              },
            }}
          />
        </div> */}
      </div>
    );
  }
}
