import React, { Component } from 'react';
import Cookie from "js-cookie";
import axios from "axios";
import Modal from 'react-bootstrap/Modal'
import {toast} from 'react-toastify'

class ProductUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rollSize:{lengt:"",width:""},
      color: "",
      addCategory:{},
      modal: {category:false},
      images: [],categories: [],
      product: {}
    }
  }

  async componentDidMount() {
    let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/products/" + this.props.match.params.id,{
      headers: {
        'Authorization':'bearer '+ Cookie.get('token'),
      },
    });
    let response1 = await fetch(process.env.REACT_APP_BACKEND_URL + "/product-categories/",{
      headers: {
        'Authorization':'bearer '+ Cookie.get('token'),
      },
    });
    if (!response.ok && !response1.ok) {
      return
    }
    let data = await response.json();
    let data1 = await response1.json();
    this.setState({ loading: false, product: data, categories: data1});
    return
  }

  addRollSize = (event) =>{
    event.preventDefault();
    if(this.state.rollSize.lengt<1 || this.state.rollSize.width<1){
      toast.warn("Chiều dài và rộng phải lớn hơn 0!");
      return;
    }
    for(const index in this.state.product.rollSizes){
      let value=this.state.product.rollSizes[index];
      if(value.width===this.state.rollSize.width && value.lengt===this.state.rollSize.lengt){
        toast.warn("Kích thước cuộn đã tồn tại!");
        return;
      }
    }
    let list = this.state.product.rollSizes;
    list.push(this.state.rollSize);
    this.setState({product:{...this.state.product,rollSizes:list},rollSize:{lengt:"",width:""}});
  }

  addColor = (event) =>{
    if(event.key === 'Enter'){
      event.preventDefault();
      if(this.state.color===""){
        toast.warn("Xin hãy nhập màu.")
        return
      }
      let list = this.state.product.colors;
      for(let i=0; i<list.length; i ++){
        if(list[i].toLowerCase() === this.state.color.toLocaleLowerCase()){
          toast.warn("Màu này đã tồn tại.")
          return
        }
      }
      list.push(this.state.color);
      event.target.value = ''
      this.setState({product:{...this.state.product,colors:list},color:""});
    }
  }

  addColorBtn = (event) =>{
    event.preventDefault();
    if(this.state.color===""){
      toast.warn("Xin hãy nhập màu.")
      return
    }
    let list = this.state.product.colors;
    for(let i=0; i<list.length; i ++){
      if(list[i].toLowerCase() === this.state.color.toLocaleLowerCase()){
        toast.warn("Màu này đã tồn tại.")
        return
      }
    }
    list.push(this.state.color);
    event.target.value = ''
    this.setState({product:{...this.state.product,colors:list},color:""});
  }

  destroyColor = (event,indexDestroy) =>{
    event.preventDefault();
    let list = this.state.product.colors;
    list.splice(indexDestroy,1);
    this.setState({product:{...this.state.product,colors: list}});
  }

  rollSizes = () =>{
    let returnList = [];
    this.state.product.rollSizes.map((item,index)=>{
      returnList.push(
        <button className="destroy-rollSize" onClick={(e)=>{this.destroyRollSize(e,index)}}
          key={index}>{item.lengt}x{item.width}</button>
      );
      return 1;
    })
    return (
      <>
        {returnList}<br/>
      </>
    );
  }

  colors = () =>{
    let returnList = [];
    this.state.product.colors.map((item,index)=>{
      returnList.push(
        <button className="destroy-color" onClick={(e)=>{this.destroyColor(e,index)}}
          key={index}>{item}</button>
      );
      return 1;
    })
    return (
      <>
      {returnList}<br/>
      </>
    );
  }

  imagePreview = () =>{
    if(this.state.images.length === 0){
      return(
        <img src={process.env.REACT_APP_BACKEND_URL+this.state.product.image.url} className="wid-100 m-auto" alt="product image"/>
      )
    }
    return(
      <img src={URL.createObjectURL(this.state.images[0])} className="wid-100 m-auto" alt="product image"/>
    )
  }

  addCategoryHandle = () =>{
    if(!this.state.addCategory.name || this.state.addCategory.name===''){
      toast.warn('Xin hãy nhập tên loại sản phẩm')
      return
    }
    if(!this.state.addCategory.description || this.state.addCategory.description===''){
      toast.warn('Xin hãy nhập mô tả cho loại sản phẩm')
      return
    }
    axios
      .post(process.env.REACT_APP_BACKEND_URL+'/product-categories',{
        name: this.state.addCategory.name,
        description: this.state.addCategory.description
      },{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token')
        }
      })
      .then(res=>{
        toast.success('Thêm loại vải thành công.')
        this.closeCategoryModal()
        this.componentDidMount()
      })
      .catch(err=>{
        toast.error('Thêm loại vải thất bại.')
      })
  }

  openCategoryModal = () =>{
    this.setState({modal:{...this.state.modal,category:true}})
  }
  closeCategoryModal = () =>{
    this.setState({modal:{...this.state.modal,category:false}})
  }

  render() {
    const clickSubmit = async () =>{
      if(Number(this.state.product.price) < 1 && Number(this.state.product.price2) < 1){
        toast.warn("You must input at least 1 price value");
        return
      }

      if(this.state.images.length !==0){
        await axios
          .delete(`http://localhost:1337/upload/files/`+this.state.product.image.id , {
            headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
          })
          .then(async (response) => {
            const formData = new FormData();
            Array.from(this.state.images).forEach(image => {
              formData.append('files', image);
            });
  
            formData.append('ref','product');
            formData.append('refId',this.state.product.id);
            formData.append('field','image');
            await axios
              .post(`http://localhost:1337/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
              })
              .then(res => {
              })
              .catch(err => {
                toast.error('cannot update product !!!');
                console.log(err.response);
            });
          })
          .catch(err => {
            console.log(err.response);
        });
      }

      axios
        .put(process.env.REACT_APP_BACKEND_URL + '/products/' + this.state.product.id, {
          description: this.state.product.description,
          name: this.state.product.name,
          category: this.state.product.category,
          price: this.state.product.price,
          colors: this.state.product.colors,
          width: this.state.product.width,
          height: this.state.product.height
        },{
          headers: {
            'Authorization':'bearer '+ Cookie.get('token'),
          },
        })
        .then(res=>{
        })
        .catch(error => {
          toast.error('Update failed !!!');
          console.log('An error occurred:', error.response);
        })
      toast.success('Update success')
      return;
    }

    const clickBack = () =>{
      this.props.history.goBack()
    }

    const handleChangeCategory = async (categoryName) =>{
      let response = await fetch(process.env.REACT_APP_BACKEND_URL + '/product-categories?name=' + categoryName ,{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token'),
        }
      });
      if (!response.ok) {
        return;
      }
      let data = await response.json();
      this.setState({ product: {...this.state.product,category: data[0]}});
    }


    if (!this.state.loading && Cookie.get('token')) {
      return (
        <div className="product-update">
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-12 p-0">
                  <div className="page-header-title">
                    <h5>CẬP NHẬT SẢN PHẨM</h5>
                    ID: {this.state.product.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='page-contain'>
            <div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
              <button className="btn btn-primary" onClick={clickBack}>Trở về</button>
              <button className="btn btn-primary m-r-20" onClick={clickSubmit}>Cập nhật</button>
            </div>

            <div className='row'>
              <div className='col-sm-12 col-xl-8'>
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={clickSubmit} className='m-t-0 p-t-0'>
                      <div className="controls">
                        <div className="row">
                          <div className="col-lg-6 p-r-20">
                            <div className="form-group">
                              <label>Tên :</label>
                              <input type="text" className="row-fluid" value={this.state.product.name} required="required" size="50"
                                data-error="Name is required." onChange={(e)=>this.setState({product:{...this.state.product,name:e.target.value}})}/>
                            </div>
                          </div>
                        </div>

                        <div className='row'>
                          <div className="form-group">
                            <label>Miêu tả :</label>
                            <textarea rows={7} className="row-fluid" value={this.state.product.description} required="required"
                                data-error="Description is required." onChange={(e)=>this.setState({product:{...this.state.product,description:e.target.value}})}/>
                          </div>
                        </div>

                        <div className="row">
                          <div className='col-6 p-r-20'>
                            <div className="form-group">
                                <label>Giá (1 m2) :</label>
                                <input type="number" value={this.state.product.price} className='row-fluid'
                                    onChange={(e)=>this.setState({product:{...this.state.product,price:e.target.value}})} />
                            </div>
                          </div>
                          <div className="col-lg-6 p-r-20">
                              <div className="form-group">
                                  <label>Kích thước cuộn :</label><br/>
                                  <input type='number' className='m-r-20' style={{width:40+'%'}} placeholder='Dài'
                                    defaultValue={this.state.product.width}
                                    onChange={e=>this.setState({product:{...this.state.product,width:Number(e.target.value)}})}></input>
                                  <input type='number' className='m-l-20' style={{width:40+'%'}} placeholder='Rộng'
                                    defaultValue={this.state.product.height}
                                    onChange={e=>this.setState({product:{...this.state.product,height:Number(e.target.value)}})}></input>
                              </div>
                          </div>
                        </div>

                        <div className='row'>
                          <div className="form-group">
                              <label>Màu sắc :</label><br/>
                              <input type="text" className="w-50 m-b-10" onKeyPress={e=>this.addColor(e)}
                                onChange={e=>{this.setState({color:e.target.value})}}/>
                              <button className='btn btn-primary m-l-10' onClick={e=>this.addColorBtn(e)}> Thêm </button>  
                              <br/>
                              {this.colors()}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className='col-xl-4 pl-4'>
                <div className='card'>
                  <div className="card-body-sm  text-center">
                    <label>Hình ảnh</label>
                    <div className="user-image">
                      {this.imagePreview()}
                    </div>
                    <label htmlFor='files' style={{color:'blue',cursor:'pointer'}}> Thay đổi</label>
                    <input type="file" name="files" class='d-none' id='files'
                      onChange={e=>{this.setState({images:e.target.files})}}/>
                    <p className='mb-0'>{'Cập nhật: ' + this.state.product.updatedAt.slice(0,10)}</p>
                    <p className='mb-0'>{'Tạo lúc: ' + this.state.product.createdAt.slice(0,10)}</p>
                  </div>
                </div>

                <div className='card'>
                  <div className="card-body-sm">
                    <div className="form-group">
                      <label>Loại</label> <i className='fa fa-plus select-able' onClick={this.openCategoryModal}></i>
                      <select value={this.state.product.category.name} className='row-fluid'
                        onChange={(e)=>handleChangeCategory(e.target.value)}>
                          {this.state.categories.map((category,index)=>{
                            return(
                              <option value={category.name} key={index}>{category.name}</option>
                            )
                          })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Modal
						show={this.state.modal.category}
						onHide={this.closeCategoryModal}
						centered
					>
						<Modal.Body >
							<div className="card border-0">
								<div className="card-header pb-0">
									<h2 className="card-title space ">Thêm loại sản phẩm</h2>
								</div>
								<div className="card-body">
									<div className='m-b-10'>
										<label className="input-label min-w-120">
											Tên:
										</label>
										<input type='text' className='w-100' defaultValue=''
											onChange={(e)=>this.setState({
												addCategory:{...this.state.addCategory,name:e.target.value}
											})}
										/>
									</div>
								
									<div className='m-b-10'>
										<label className="input-label min-w-120">
											Mô tả:
										</label><br/>
                    <textarea className='w-100' rows={6}
                      onChange={(e)=>this.setState({
                        addCategory:{...this.state.addCategory,description:e.target.value}
                    })}></textarea>
									</div>
								</div>
							</div>
						</Modal.Body>
						<Modal.Footer>
							<button className='btn-info mr-4' onClick={this.addCategoryHandle}>Xác nhận</button>
							<button style={{backgroundColor:'#e52d27',color:'white'}} onClick={this.closeCategoryModal}>Hủy</button>
						</Modal.Footer>
					</Modal>

        </div>
      )
    }
    return (<h2 className="ProductList-title">Waiting for API...</h2>);
  }
}

export default ProductUpdate;