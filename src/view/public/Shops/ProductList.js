import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProducItem from "./ProducItem";
import { connect } from "react-redux";
import { actFetchProductsRequest } from "../../../actions/index";
import "../style/productlist.css";
import Cookie from "js-cookie";
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search:  "",
      categories: [],
      price:'cao',
      cate:'all',
      currentpage : 1,
      perPage :12,
      task: []

    };
  }

  async componentDidMount() {
    let response2 = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/product-categories"
    );
    if (!response2.ok) {
      return;
    }
    let categories = await response2.json();
    this.setState({ categories: categories });
    this.props.fetchAllProducts();
  }
  paginate = ( pageNumber) =>{
    this.setState({currentpage:pageNumber})
  }
  render() {
    var { products } = this.props;
    var currentproducts
    const indexOfLast = this.state.currentpage * this.state.perPage;
    const indexOfFirst = indexOfLast - this.state.perPage;
    currentproducts = products.slice(indexOfFirst,indexOfLast);
    const pageNumber =[];
    for(let i=1;i<=Math.ceil(products.length / this.state.perPage);i++){
      pageNumber.push(i)
    }
    var {cate,search }= this.state;
    if(cate !== "all"){
      currentproducts = products.filter((val)=>{
        return val.category.name === this.state.cate
      })
    }
    if(search){
      currentproducts = products.filter((val)=>{
          return val.name.toLowerCase().indexOf(search) !== -1;
        })  
    }
    return (
      <div className="app__container">
        <div className="grid wide">
          <div className="row sm-gutter app__content">
            {/* Category */}
            <div className="col l-2 m-0 c-0">
              <nav className="category">
                <h3 className="category__heading">Danh mục</h3>
                <ul className="category-list">
                <li className="category-item" onClick={() =>this.setState({cate:'all'})} >
                          <Link className="category-item__link">
                            Tất cả
                          </Link>
                        </li>
                  {this.state.categories.map((category, index) => {
                    if (index > 10) {
                      return <></>;
                    } else {
                      return (
                        <li className="category-item" onClick={() =>this.setState({cate:category.name})} >
                          <Link className="category-item__link">
                            {category.name}
                          </Link>
                        </li>
                      );
                    }
                  })}
                </ul>
              </nav>
            </div>
            <div className="col l-10 m-12 c-12">
              {/* Filter */}
              <div className="home-filter hide-on-mobile-tablet">
                <div className="header__search ">
                  <div className="header__search-input-wrap">
                    <input
                    style={{border:"none"}}
                      type="text"
                      className="header__search-input"
                      placeholder="Nhập để tìm kiếm sản phẩm"
                      onChange={(e) =>this.setState({search:e.target.value})}
                    />
                  </div>
                  <button className="header__search-btn">
                    <i className="header__search-btn-icon fas fa-search" />
                  </button>
                </div>
                <div className="select-input">
                  <span className="select-input__label">Giá</span>
                  <i className="select-input__icon fas fa-angle-down" />
                  {/* List option */}
                  <ul className="select-input__list">
                    <li  className="select-input__item" >
                      <Link onClick={(e) =>this.setState({price:e.target.value})} value="cao" className="select-input__link" >
                        Giá: Thấp đến Cao
                      </Link>
                    </li>
                    <li onClick={(e) =>this.setState({price:e.target.value})} className="select-input__item" value="thap">
                      <Link  className="select-input__link" >
                        Giá: Cao đến Thấp
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Mobile Category */}

              {/* Product */}
              <div className="home-product">
                <div className="row sm-gutter">
                  {/* Product item */}
                  {currentproducts.map((product, index) => {
                    return (
                  
                      <div className="col l-2-4 m-4 c-6" key={index}>
                        <Link to={`/product/${product.id}`} href="!#" className="home-product-item">
                          <div
                            className="home-product-item__img"
                            style={{
                              backgroundImage: `url(${
                                process.env.REACT_APP_BACKEND_URL +
                                product.image.url
                              })`
                            }}
                            
                          />
                          <h4 className="home-product-item__name">
                            {product.name}
                          </h4>
                          <div className="home-product-item__price">
                            <span className="home-product-item__price-old">
                            {parseInt(product.price) + 200}$         
                            </span>
                            <span className="home-product-item__price-current">
                              {product.price}$
                            </span>
                          </div>
                          <div className="home-product-item__action">
                            <span className="home-product-item__like home-product-item__like--liked">
                              <i className="home-product-item__like-icon-empty far fa-heart" />
                              <i className="home-product-item__like-icon-fill fas fa-heart" />
                            </span>
                            <div className="home-product-item__rating">
                              <i className="home-product-item__star--gold fas fa-star" />
                              <i className="home-product-item__star--gold fas fa-star" />
                              <i className="home-product-item__star--gold fas fa-star" />
                              <i className="home-product-item__star--gold fas fa-star" />
                              <i className="fas fa-star" />
                            </div>
                            <div className="home-product-item__sold">
                              88 Đã bán
                            </div>
                          </div>
                          <div className="home-product-item__origin">
                            <span className="home-product-item__brand">
                              {product.category.name}
                            </span>
                            <span className="home-product-item__origin-name">
                              Hàn Quắc
                            </span>
                          </div>
                          <div className="home-product-item__favourite">
                            <i className="fas fa-check " />
                            <span>Yêu thích</span>
                          </div>
                          <div className="home-product-item__sale-off">
                            <span className="home-product-item__sale-off-percent">
                              43%
                            </span>
                            <span className="home-product-item__sale-off-label">
                              GIẢM
                            </span>
                          </div>
                        </Link>
                      </div>
                      
                    );
                  })}
                </div>
              </div>
              <ul className="pagination home-product__pagination">
                <li className="pagination-item">
                  <a href className="pagination-item__link">
                    <i className="pagination-item__icon fas fa-angle-left" />
                  </a>
                </li>
                {pageNumber.map((number)=>{
                  return(
                    <li className="pagination-item pagination-item--active"  style={{cursor:"pointer",fontSize:14 + 'px'}}>
                      <a href onClick={() => this.paginate(number)} className="pagination-item__link" style={{fontSize:14 + 'px'}}> 
                        {number}
                      </a>
                    </li>
                  )
                })}
                
                {/* <li className="pagination-item">
                  <a href className="pagination-item__link">
                    2
                  </a>
                </li>
                <li className="pagination-item">
                  <a href className="pagination-item__link">
                    3
                  </a>
                </li>
                <li className="pagination-item">
                  <a href className="pagination-item__link">
                    4
                  </a>
                </li>
                <li className="pagination-item">
                  <a href className="pagination-item__link">
                    5
                  </a>
                </li>
                <li className="pagination-item">
                  <a href className="pagination-item__link">
                    ...
                  </a>
                </li>
                <li className="pagination-item">
                  <a href className="pagination-item__link">
                    14
                  </a>
                </li>
                */}
                <li className="pagination-item">
                  <a href className="pagination-item__link" style={{fontSize:14 + 'px'}}>
                    <i className="pagination-item__icon fas fa-angle-right" />
                  </a>
                </li> 
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchAllProducts: () => {
      dispatch(actFetchProductsRequest());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
