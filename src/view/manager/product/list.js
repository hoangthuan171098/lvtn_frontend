import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookie from "js-cookie";
import axios from "axios";

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      categories: [],
      products: [],
      filter:{
          name: '',
          id: '',
          category: 'all'
      }
    }
  }

  async componentDidMount() {
    let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/products",{
      headers: {
        'Authorization':'bearer '+ Cookie.get('token')
      },
    });
    if (!response.ok) {
      return
    }let response2 = await fetch(process.env.REACT_APP_BACKEND_URL + "/product-categories",{
      headers: {
        'Authorization':'bearer '+ Cookie.get('token')
      },
    });
    if (!response2.ok) {
      return
    }
    let products = await response.json();
    let categories = await response2.json();
    this.setState({ loading: false, products: products,categories: categories });
    return
  }

  HandleInfoClick = (id) =>{
    this.props.history.push('/manager/products/' + id+'/update')
  }


  render() {
    const clickDestroy = (idProduct,idImage) =>{
      axios
        .delete(`http://localhost:1337/upload/files/`+idImage , {
          headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err.response);
      });
      axios
        .delete(process.env.REACT_APP_BACKEND_URL + "/products/" + idProduct,{
          headers: {
            'Authorization':'bearer '+ Cookie.get('token'),
          },
        })
        .then(response => {
          alert('Destroy success.');
          window.location.href=('/manager/products')
        })
        .catch(error => {
          // Handle error.
          alert('Update failed !!!');
          console.log('An error occurred:', error.response);
        });
    }

    if (!this.state.loading && Cookie.get('token')) {
      return (
        <div className="ProductList">
          <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12 p-0">
                        <div className="page-header-title">
                            <h5>SẢN PHẨM</h5>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <Link to="/manager/products/create"><button className="btn btn-primary">Sản phẩm mới</button></Link>

          <div className='card'>
            <div className='card-body'>
              <div className="DataList-container">
                <div className="DataList-filter m-b-20">
                  <form className="form-inline w-100">
                    <div className='input-prepend'>
                      <span className='add-on'>Tên</span>
                      <input
                        type="text"
                        onChange={e=>this.setState({filter:{...this.state.filter,name:e.target.value}})}
                      />
                    </div>
                    <div className='input-prepend m-l-10'>
                      <span className='add-on'>ID</span>
                      <input 
                        type="text"
                        onChange={e=>this.setState({filter:{...this.state.filter,id:e.target.value}})}
                      />
                    </div>
                    <div className='input-prepend m-l-10'>
                      <span className='add-on'>Loại</span>
                      <select className='from-control'
                        onChange={e=>this.setState({filter:{...this.state.filter,category:e.target.value}})}
                      >
                        <option value='all'>All</option>
                        {this.state.categories.map((category,index)=>{
                          return(
                            <option key={index} value={category.name}> {category.name} </option>
                          )
                        })}
                      </select>
                    </div>
                  </form>
                </div>

                <table className="table">
                  <thead>
                  <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Loại</th>
                      <th>Giá</th>
                      <th>Tạo lúc</th>
                      <th></th>
                  </tr>
                  </thead>
                  <tbody>
                    {this.state.products.filter(product=>
                      product.id.includes(this.state.filter.id)
                      && product.name.includes(this.state.filter.name)
                      &&
                      (this.state.filter.category==='all' ? true :  product.category.name===this.state.filter.category)
                    ).map((product, index) => {
                      return (
                        <tr key={index}>
                          <td onClick={()=>this.HandleInfoClick(product.id)}>{product.id}</td>
                          <td onClick={()=>this.HandleInfoClick(product.id)}>{product.name}</td>
                          <td onClick={()=>this.HandleInfoClick(product.id)}>{product.category.name}</td>
                          <td onClick={()=>this.HandleInfoClick(product.id)}>{product.price}</td>
                          <td onClick={()=>this.HandleInfoClick(product.id)}>{product.createdAt.slice(0,10) + " " + product.createdAt.slice(11,16)}</td>
                          <td >
                            <i style={{fontSize:28 + "px",color:"red",cursor:"pointer"}} className="fa fa-remove" onClick={() =>clickDestroy(product.id,product.image.id)} ></i>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (<h2 className="ProductList-title">Waiting for API...</h2>);
  }
}

export default ProductList;