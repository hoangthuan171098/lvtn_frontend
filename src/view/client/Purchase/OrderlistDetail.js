import React, { Component } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

export default class OrderlistDetail extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticate: true,
      note: "",total: 0,
      orders: [],shipment: {createdAt:''}, shipper:{},
      modal:{shipment: false}
    };
  }

  async componentDidMount() {
    if (Cookie.get('role') === 'Public' || Cookie.get('role') === 'Customer') {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/orders",{
          headers: {Authorization: "bearer " + Cookie.get("token")}
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
        headers: {'Authorization':'bearer '+ Cookie.get('token')}
      })
      .then(response => {})
      .catch(error => {
        toast.error('An error occurred, please check again.');
        console.log('An error occurred:', error.response);
      });
    return
  }

  shipped = (roll,m,product,color) =>{
    let order = this.state.orders.find(i=>i.id === this.props.match.params.id)
    if(!order.remainProductList || order.remainProductList.length===0){
      return(
        <></>
      )
    }
    else{
      let remain = order.remainProductList
      let index = remain.findIndex(i=>i.product.name==product&&i.color==color)
      if(index !== -1){
        let roll1=0,m1=0
        if(remain[index].quantity){
          roll1 = remain[index].quantity
        }
        if(remain[index].quantity_m){
          m1 = remain[index].quantity_m
        }
        let newroll = roll - roll1
        let newm = m - m1
        return(
          <>{newroll+'cuộn-'+ newm+'m'}</>
        )
      }
      return(
        <></>
      )
    }
    
  }

  translateStatus = (status) =>{
    if(status==='waiting to delivery')  return 'đợi giao'
    else if(status==='delivering') return 'đang giao'
    else return 'đã giao'
  }

  getTotalShipment = () =>{
    let total = 0
    if(this.state.shipment && this.state.shipment.productList){
      this.state.shipment.productList.map((item)=>{
        if(item.quantity && item.quantity_m){
          total += item.product.price * item.quantity + item.product.price * item.quantity_m
        }
        else if(item.quantity){
          total += item.product.price * item.quantity
        }
        else{
          total += item.product.price * item.quantity_m
        }
      })
    }
    return total
  }

  showProductList = () =>{
    if(this.state.shipment && this.state.shipment.productList){
      return(
        <div>
          {this.state.shipment.productList.map((item,index)=>{
            let money
            if(item.quantity && item.quantity_m){
              money = item.product.price * item.quantity + item.product.price * item.quantity_m
            }
            else if(item.quantity){
              money = item.product.price * item.quantity
            }
            else{
              money = item.product.price * item.quantity_m
            }
            return(
              <div className="row" key={index}>
                <div className="col-5"> <span id="name">{item.product.name}-{item.color}</span> </div>
                <div className="col-4"> <span id="name">{this.getQuantity(item.quantity,item.quantity_m)}</span> </div>
                <div className="col-3"> <span id="price">{money+ 'VNĐ'}</span> </div>
              </div>
            )
          })}
        </div>
      )
    }
  }

  getQuantity = (roll,m) =>{
    if(roll && roll !==0  && m && m!==0){
      return  roll + '(cuộn), ' + m+'(m)'
    }
    else if(roll && roll !==0 ){
      return roll + '(cuộn)'
    }
    else{
      return m + '(m)'
    }
  }

  showShipments = () =>{
    let order = this.state.orders.find(i=>i.id === this.props.match.params.id)

    if(order && order.shipments && order.shipments.length !== 0){
      return(
        <main class="leaderboard__profiles">
          {
            order.shipments.map((shipment,index)=>{
              return(
                <article class="leaderboard__profile" key={index} onClick={()=>this.openShipmentModal(shipment)}>
                  #{index+1}
                  <span class="leaderboard__name">{this.translateStatus(shipment.status)}</span>
                  <span style={{display:'inline-block'}}> {shipment.createdAt.slice(0,10)} </span>
                </article>
              )
            })
          }
        </main>
      )
    }
  }

  render() {
      
    var total = 0
    return (
      <div className="Account_layout Order_detail">
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
                <th>Màu</th>
                <th>Tạm tính</th>
                <th>Đã giao</th>
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
                            <td className="total">{this.shipped(item.quantity,item.quantity_m,item.product.name,item.color)}</td>
                          </tr>
                        );
                      })}
                    </>
                  );
                }
              })}
            </tbody>
          </table>
          <div className='card'>
            <div className='card-body'>
              <div className='row'>
                <div className='col-6'>
                  <div className='row'>
                    <div className='col-6'>
                      <span>Tạm tính</span><br />
                    </div>
                    <div className='col-6'>
                      <span>{total} VNĐ</span>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <span>Phí vận chuyển</span><br />
                    </div>
                    <div className='col-6'>
                      <span>0 VNĐ</span>
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <span>Tổng cộng</span><br />
                    </div>
                    <div className='col-6'>
                      <span>{total} VNĐ</span>
                    </div>
                  </div>
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
                </div>
                <div className='user-shipment-list col-6'>
                  <article class="leaderboard">
                    <header>
                      <h6 class="leaderboard__title"><span class="leaderboard__title--top">Danh sách giao hàng</span></h6>
                    </header>
                    {this.showShipments()}
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
					show={this.state.modal.shipment}
					onHide={this.closeShipmentModal}
					size='lg'
					contentLabel="giao hàng"
					centered
				>
          <div className="shipment-info">
            <div className="card">
              <div className="title">Thông tin giao hàng</div>
              <div className="info">
                  <div className="row">
                      <div className="col-6">
                        <span id="heading">Tạo lúc</span><br/>
                        <span id="details">{this.state.shipment.createdAt.slice(0,10)+' '+this.state.shipment.createdAt.slice(11,16)}</span>
                      </div>
                      <div className="col-6 pull-right"> 
                        <span id="heading">ID</span><br/>
                        <span id="details">{this.state.shipment.id}</span>
                      </div>
                  </div>
                  <div className='row'>
                    <div className='col-6'>
                      <span id="heading">Trạng thái</span><br/>
                      <span id="details">{this.translateStatus(this.state.shipment.status)}</span>
                    </div>
                    <div className="col-6 pull-right">
                      <span id="heading">Người giao</span><br/>
                      <span id="details">
                        {this.state.shipper.username?
                          this.state.shipper.username:'Chưa sắp xếp'}
                      </span><br/>
                      </div>
                  </div>
              </div>
              <div className="pricing">
                {this.showProductList()}
              </div>
              <div className="total">
                <div className="row">
                    <div className="col-9"></div>
                    <div className="col-3"><big>{this.getTotalShipment()}</big></div>
                </div>
              </div>
              {this.showConfirmImg()}
            </div>
          </div>
				</Modal>
      </div>
    );
  }

  showConfirmImg = () =>{
    if(this.state.shipment && this.state.shipment.confirmImage){
      return(
        <div className='info'>
          <span>Hình ảnh xác nhận</span>
          <img src={process.env.REACT_APP_BACKEND_URL + this.state.shipment.confirmImage.url}
						alt='Xác nhận nhận hàng' style={{height:200+'px'}}></img>
        </div>
      )
    }
  }

  openShipmentModal = async (shipment) =>{
    if(shipment.shipper){
      await axios
        .get(process.env.REACT_APP_BACKEND_URL + '/users/' + shipment.shipper,{
          headers: {'Authorization':'bearer '+ Cookie.get('token')}
        })
        .then(res => {
          this.setState({shipper:res.data})
        })
        .catch(() => {
          toast.error('Không thể kết nối đến server')
        });
    }
    this.setState({shipment:shipment})
    this.setState({modal:{...this.state.modal,shipment: true}})
  }

  closeShipmentModal = () =>{
    this.setState({modal:{...this.state.modal,shipment: false}})
  }
}