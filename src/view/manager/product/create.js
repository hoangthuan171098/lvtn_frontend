import React, { Component } from 'react';
import Cookie from "js-cookie";
import axios from "axios";
import * as XLSX from 'xlsx';
import {toast} from 'react-toastify'

class ProductCreate extends Component {
  constructor(props) {
    super(props);

    this.inputRef= React.createRef();
    this.state = {
      loading: true,
      imagePreviewUrl: '',
      categories:{},
      images: [],
      files: [],
      rollSize:{lengt:"",width:""},
      color: "",
      product: {
        name: "",
        description: "",
        category: {name: "none"},
        price: "",
        width: 0,height: 0,
        colors: []
      }
    }
  }

  async componentDidMount() {
    let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/product-categories",{
      headers: {
        'Authorization':'bearer '+ Cookie.get('token')
      },
    })
    if (!response.ok) {
      return
    }

    let categoryList = await response.json();
    this.setState({ loading: false, categories: categoryList ,product:{...this.state.product,category:categoryList[0]}});
    return
  }

  // create many products throungh excel file
  handleUpload = (e) => {
    e.preventDefault();
    var files = this.state.files, f = files[0];
    var reader = new FileReader();
    reader.onload = (e) => {
        var data = e.target.result;
        let readedData = XLSX.read(data, {type: 'binary'});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        /* Convert array to csv*/
        const dataParse = XLSX.utils.sheet_to_csv(ws, {header:1});
        let dataLine = dataParse.split('\n');
        for(let i=1; i<dataLine.length-1; i++){
          let productData = dataLine[i].split(',');
          let rollSizes = productData[2].split(' ');
          let colorList = productData[3].split(' ');
          let filePath = productData[6]
          let rollSizeList=[];
          for(let index in rollSizes){
            let lengtRoll = Number(rollSizes[index].split('x')[0]);
            let widthRoll = Number(rollSizes[index].split('x')[1]);
            let data = {lengt: lengtRoll, width: widthRoll};
            rollSizeList.push(data);
          }
          let category = this.state.categories.filter((i)=>i.name===productData[5])[0];

          let pathList = filePath.split('\\')
          let fileName = pathList[pathList.length-1]

          axios
            .post(process.env.REACT_APP_BACKEND_URL + '/products/', {
              name: productData[0],
              description: productData[1],
              category: category,
              price: productData[4],
              rollSizes: rollSizeList,
              colors: colorList
            },{
              headers: {
                'Authorization':'bearer '+ Cookie.get('token'),
              },
            })
            .then(async (response) => {
              await axios
                .post(`http://localhost:1337/product-upload`, {
                  fileName: fileName,
                  filePath: filePath,
                  productId: response.data.id
                }, {
                  headers: {'Authorization':'bearer '+ Cookie.get('token') },
                })
                .then(res => {
                  console.log( i+ '.Create product '+ productData[0]  +' success!!');
                })
                .catch(err => {
                  console.log(i+'.Cannot upload image of product'+ productData[0] + '!!!');
              })
            })
            .catch(error => {
              console.log(i+ '.Cannot create product '+ productData[0], error.response);
            })
        }
    };
    reader.readAsBinaryString(f);
    return;
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

  colors = () =>{
    let returnList = [];
    this.state.product.colors.map((item,index)=>{
      returnList.push(
        <button className="destroy-color m-r-10" onClick={(e)=>{this.destroyColor(e,index)}}
          style={{backgroundColor:item}}  key={index}>{item}</button>
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
      return
    }
    return(
      <img className='image-preview' src={URL.createObjectURL(this.state.images[0])} alt=""></img>
    )
  }

  render() {
    const clickSubmit = (event) =>{
      event.preventDefault();
      if(this.state.product.name === ''){
        alert("Xin hãy nhập tên sản phẩm.");
        return
      }
      if(this.state.product.description === ''){
        alert("Xin hãy nhập mô tả sản phẩm.");
        return
      }
      if(Number(this.state.product.price) < 1){
        alert("Xin hãy nhập lại giá.");
        return
      }
      if(this.state.images.length === 0){
        alert("Xin hãy chọn hình ảnh cho sản phẩm.");
        return
      }
      axios
        .post(process.env.REACT_APP_BACKEND_URL + '/products/', {
          description: this.state.product.description,
          name: this.state.product.name,
          category: this.state.product.category,
          price: this.state.product.price,
          rollSizes: this.state.product.rollSizes,
          colors: this.state.product.colors,
          width: this.state.product.width,
          height: this.state.product.height
        },{
          headers: {
            'Authorization':'bearer '+ Cookie.get('token'),
          },
        })
        .then(async (response) => {
          const formData = new FormData();
          Array.from(this.state.images).forEach(image => {
            formData.append('files', image);
          });

          formData.append('ref','product');
          formData.append('refId',response.data.id);
          formData.append('field','image');
          await axios
            .post(`http://localhost:1337/upload`, formData, {
              headers: { 'Content-Type': 'multipart/form-data','Authorization':'bearer '+ Cookie.get('token') },
            })
            .then(res => {
              console.log(res);
              alert("Create product success!!")
            })
            .catch(err => {
              alert('cannot create product !!!');
              console.log(err.response);
          });
          this.props.history.push('/manager/products')
        })
        .catch(error => {
          alert('cannot create product !!!');
          console.log('An error occurred:', error.response);
        });
      return;
    }

    const clickBack = async (event) =>{
      event.preventDefault()
      this.props.history.goBack()
    }

    const handleChangeCategory = async (categoryName) =>{
      let response = await fetch(process.env.REACT_APP_BACKEND_URL + '/product-categories?name=' + categoryName ,{
        headers: {
          'Authorization':'bearer '+ Cookie.get('token'),
        },
      });
      if (!response.ok) {
        return;
      }
      let data = await response.json();
      this.setState({ product: {...this.state.product,category: data[0]}});
    }

    const handleChangeImage = (e) =>{
      e.preventDefault()
      this.setState({images:e.target.files})
    }


    if (!this.state.loading) {
      return (
        <div className="product-create">
          <div className="page-header">
            <div className="page-block">
              <div className="row align-items-center">
                <div className="col-md-12 p-0">
                  <div className="page-header-title">
                    <h5>TẠO SẢN PHẨM</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-100 d-flex flex-row-reverse' style={{marginBottom:10+'px'}}>
            <button className="btn btn-primary" onClick={clickBack}>Trở về</button>
            <button className="btn btn-primary m-r-20" onClick={clickSubmit}>Tạo</button>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <label> Tải file excel: </label>
                <div className='d-flex'>
                  <input className='excel-input' type='file' onChange={(e)=>this.setState({files: e.target.files})} accept=".xls,.xlsx,.csv" />
                  <button className='btn-upload-excel btn btn-primary' onClick={(e)=>this.handleUpload(e)} > Upload </button>
                </div>
              </div>

              <hr/>

              <div className="controls">
                  <div className="row">
                      <div className="col-lg-6">
                          <div className="form-group">
                              <label>Tên :</label>
                              <input type="text" className="row-fluid" value={this.state.product.name} required="required" size="50"
                                data-error="Name is required." onChange={(e)=>{this.setState({product:{...this.state.product,name:e.target.value}})}}/>
                          </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group">
                            <label>Loại :</label>
                            <select className="row-fluid" value={this.state.product.category.name} 
                              onChange={(e)=>handleChangeCategory(e.target.value)}>
                                {this.state.categories.map((category,index)=>{
                                  return(
                                    <option key={index} value={category.name}>{category.name}</option>
                                  )
                                })}
                            </select>
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
                    <div className='col-lg-6'>
                      <div className="form-group">
                          <label>giá (1 m2) :</label>
                          <input type="number" className="row-fluid" value={this.state.product.price}
                              onChange={(e)=>this.setState({product:{...this.state.product,price:e.target.value}})} />
                      </div>
                    </div>
                    <div className="col-lg-6 p-r-20">
                      <div className="form-group">
                          <label>Kích thước cuộn :</label><br/>
                          <input type='number' className='m-r-20' style={{width:40+'%'}} placeholder='Dài'
                            onChange={e=>this.setState({product:{...this.state.product,width:Number(e.target.value)}})}></input>
                          <input type='number' className='m-l-20' style={{width:40+'%'}} placeholder='Rộng'
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

                  <div className="row">
                    <div className='col-8'>
                      <div className="form-group">
                          <label>Hình ảnh :</label>
                          <input ref={this.inputRef} class='img-input' type="file" required
                            onChange={e=>{handleChangeImage(e)}}/>
                          {this.imagePreview()}
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          </div>
        </div>
      )
    }
    return (<h2 className="ProductList-title">Waiting for API...</h2>);
  }
}

export default ProductCreate;