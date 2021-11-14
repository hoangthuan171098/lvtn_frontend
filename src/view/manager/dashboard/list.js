import React, { Component } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import "./style/index.scss";
import Cookie from "js-cookie";
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      orders: [],
      users: [],
    };
  }
  async componentDidMount() {
    if (Cookie.get("role") === "Admin") {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/orders",
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      );

      let response2 = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/users",
        {
          headers: {
            Authorization: "bearer " + Cookie.get("token"),
          },
        }
      );
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
        authenticate: true,
        orders: orders,
        users: users,
      });
      return;
    }
    this.setState({ authenticate: false });
  }
  render() {
    var name = "";
    var data = [0, 0, 0, 0, 0];
    var dataproduct = [0, 0, 0, 0, 0];
    let date = new Date().toLocaleString();
    console.log(date.slice(13, 15));
    console.log(this.state.orders);
    var total = 0;
    var sum =0;
    this.state.orders.map((order) => {
      console.log(order);
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
        <div className="row">
          <div className="col-md-4">
            <div className="card-counter primary">
              <i className="fa fa-code-fork" />
              <span className="count-numbers">
                {this.state.orders.length.toLocaleString("en")}
              </span>
              <span className="count-name">ĐƠN HÀNG</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-counter danger">
              <i className="fa fa-ticket" />
              <span className="count-numbers">
                {total.toLocaleString("en")} VNĐ
              </span>
              <span className="count-name">DOANH THU</span>
            </div>
          </div>
          {/* <div className="col-md-3">
            <div className="card-counter success">
              <i className="fa fa-database" />
              <span className="count-numbers">6875</span>
              <span className="count-name">Data</span>
            </div>
          </div> */}
          <div className="col-md-4">
            <div className="card-counter info">
              <i className="fa fa-users" />
              <span className="count-numbers">
                {this.state.users.length.toLocaleString("en")}
              </span>
              <span className="count-name">TÀI KHOẢN</span>
            </div>
          </div>
        </div>
        <label>ĐƠN HÀNG GẦN ĐÂY</label>
        <table
          id="example"
          className="table table-striped table-bordered"
          style={{ width: "100%" ,fontFamily:"sans-serif"}}
        >
          <thead>
            <tr>
              <th style={{textAlign:"center"}}>Mã đơn hàng</th>
              <th style={{textAlign:"center"}}>Ngày mua</th>
              <th style={{textAlign:"center"}}>Sản phẩm</th>
              <th style={{textAlign:"center"}}>Tổng tiền</th>
              <th style={{textAlign:"center"}}>Trạng thái đơn hàng</th>
            </tr>
          </thead>
          <tbody>
          {this.state.orders.map((order,index)=>{
            if(index >=5){
              return <></>
            }
            else{
              return(
                <tr key={index}>
                      <td style={{textAlign:"center"}}>
                        {order.id.slice(0, 9)}
                      </td>
                      <td style={{textAlign:"center"}}>
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

                      <td style={{textAlign:"center"}}>
                        {" "}
                        {name.length > 26 ? name.slice(0, 26) + `...` : name}
                      </td>
                      <td style={{textAlign:"center"}}>{sum.toLocaleString("en")} VNĐ</td>
                      <td style={{textAlign:"center"}}>{order.status}</td>
                    </tr>
              )
              
            }
          })}
           
          </tbody>
        </table>
        <Bar
          style={{ marginTop: 50 + "px" }}
          data={{
            labels: ["Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11"],
            datasets: [
              {
                label: "Doanh Thu (VNĐ)",
                backgroundColor: [
                  "#3e95cd",
                  "#8e5ea2",
                  "#3cba9f",
                  "#e8c3b9",
                  "#c45850",
                ],
                data: data,
              },
            ],
          }}
          options={{
            legend: { display: false },
            title: {
              display: true,
              text: "Predicted world population (millions) in 2050",
            },
          }}
        />

        <div className="row">
          <div className="col-md-4">
            <Doughnut
              style={{ width: 50 + "%", marginTop: 50 + "px" }}
              data={{
                labels: [
                  "Africa",
                  "Asia",
                  "Europe",
                  "Latin America",
                  "North America",
                ],
                datasets: [
                  {
                    label: "Population (millions)",
                    backgroundColor: [
                      "#3e95cd",
                      "#8e5ea2",
                      "#3cba9f",
                      "#e8c3b9",
                      "#c45850",
                    ],
                    data: [2478, 5267, 734, 784, 433],
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
          </div>
        </div>
      </div>
    );
  }
}
