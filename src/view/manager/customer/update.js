import React, { Component } from 'react'
import Cookie from 'js-cookie'
import axios from 'axios'

class AccountUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            roleValue: "",
            user: {},
            info:{
                id: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                firm: '',
                address: '',
                gender: 1,
                dateOfBirth: '',
                avatar: {}
            }
        }
    }

    async componentDidMount() {
        let response1 = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/" + this.props.match.params.id,{
            headers: {
            'Authorization':'bearer '+ Cookie.get('token'),
            },
        });
        let response2 = await fetch(process.env.REACT_APP_BACKEND_URL + "/customer-infos?customerId=" + this.props.match.params.id ,{
            headers: {
                'Authorization':'bearer '+ Cookie.get('token'),
            },
        });
        if (!response1.ok && !response2.ok) {
            console.log('Cannot connect to sever!');
            return
        }
        let data1 = await response1.json();
        let data2 = await response2.json();
        this.setState({loading: false,authenticate: true, user: data1});
        if(data2.length !== 0){
            this.setState({info: data2[0]});
        }
        this.setState({roleValue: this.state.user.role.id});
    }

    render() {
        const clickSubmit = (event) =>{
            event.preventDefault();
            axios
              .put(process.env.REACT_APP_BACKEND_URL + '/users/' + this.state.user.id, {
                email: this.state.user.email,
                username: this.state.user.username,
                role: this.state.roleValue,
                confirmed: this.state.user.confirmed
              },{
                headers: {
                  'Authorization':'bearer '+ Cookie.get('token'),
                },
              })
              .catch(error => {
                // Handle error.
                alert('Update failed !!!');
                console.log('An error occurred:', error.response);
              });
            
            if(this.state.info.id){
              axios
                .put(process.env.REACT_APP_BACKEND_URL + '/customer-infos/' + this.state.info.id, {
                    firstName: this.state.info.firstName,
                    lastName: this.state.info.lastName,
                    phoneNumber: this.state.info.phoneNumber,
                    address: this.state.info.address,
                    gender: this.state.info.gender,
                    firm: this.state.info.firm,
                    dateOfBirth: this.state.info.dateOfBirth,
                    customerId: this.props.match.params.id
                },{
                    headers: {
                    'Authorization':'bearer '+ Cookie.get('token')
                    }
                })
                .then(response => {
                    alert('update account success.');
                    this.props.history.push('/manager/accounts')
                })
                .catch(error => {
                    alert('Update failed !!!');
                    console.log('An error occurred:', error.response);
                });
            }
            else{
              axios
                .post(process.env.REACT_APP_BACKEND_URL + '/customer-infos/' , {
                    firstName: this.state.info.firstName,
                    lastName: this.state.info.lastName,
                    phoneNumber: this.state.info.phoneNumber,
                    address: this.state.info.address,
                    gender: this.state.info.gender,
                    firm: this.state.info.firm,
                    dateOfBirth: this.state.info.dateOfBirth,
                    customerId: this.props.match.params.id
                },{
                    headers: {
                    'Authorization':'bearer '+ Cookie.get('token')
                    }
                })
                .then(response => {
                    alert('Cập nhật thông tin thành công');
                    this.props.history.push("/manager/accounts");
                })
                .catch(error => {
                    alert('Cập nhật thất bại !!!');
                    console.log('An error occurred:', error.response);
                });
            }
            
            return;
        }
      
      
        const clickBack = (event) => {
            event.preventDefault();
            this.props.history.push('/manager/accounts')
        }
      
        if (!this.state.loading) {
            return (
                <div className="Update">
                    <div class='module'>
                        <div className="module-head">
                            <h2>Update account</h2>
                        </div>
                        
                        <div className="module-body">
                            <form id="account-update-form">
                            <div className="messages"></div>
            
                            <div className="controls">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Username :</label>
                                            <input type="text" name="username" className="row-fluid" value={this.state.user.username} required="required"
                                                data-error="Username is required." onChange={(e)=>this.setState({user:{...this.state.user,username:e.target.value}})} />
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Email :</label>
                                            <input type="email" name="email" className="row-fluid" value={this.state.user.email} required="required"
                                                data-error="Email is required." onChange={(e)=>this.setState({user:{...this.state.user,email:e.target.value}})}/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Role :</label>
                                            <select className="row-fluid" value={this.state.roleValue} onChange={(e)=>this.setState({roleValue:e.target.value})}>
                                                <option value="605037228879df0bf81ba879"> Customer</option>
                                                <option value="6050394d8879df0bf81ba98e"> Admin</option>
                                            </select>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Confirmed :</label>
                                            <select className="row-fluid" value={this.state.user.confirmed} 
                                            onChange={(e)=>this.setState({user: {...this.state.user,confirmed: e.target.value}})}>
                                                <option value={true}> Yes</option>
                                                <option value={false}> No</option>
                                            </select>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>
            
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Phone Number :</label>
                                            <input className="row-fluid" type='number' value={this.state.info.phoneNumber}
                                            onChange={(e)=> this.setState({info: {...this.state.info, phoneNumber: e.target.value}})}/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Firm:</label>
                                            <input className="row-fluid" type='text' value={this.state.info.firm}
                                            onChange={(e)=> this.setState({info: {...this.state.info, firm: e.target.value}})}/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>
            
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Họ :</label>
                                            <input className="row-fluid" type='text' value={this.state.info.lastName}
                                            onChange={(e)=> this.setState({info: {...this.state.info, lastName: e.target.value}})}/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Tên :</label>
                                            <input className="row-fluid" type='text' value={this.state.info.firstName}
                                            onChange={(e)=> this.setState({info: {...this.state.info, firstName: e.target.value}})}/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>
            
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Adress :</label>
                                            <input className="row-fluid" type="text" value={this.state.info.address}
                                            onChange={(e)=> this.setState({info: {...this.state.info, address: e.target.value}})}/>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                        <label>Sex :</label>
                                        <div>
                                            <div className="d-flex" style={{alignItems:'center'}}>
                                                <div className='col-4'>
                                                    <input type="radio" name="gender" checked={this.state.info.gender} value="1"
                                                        onChange={()=>this.setState({info:{...this.state.info,gender:1}})}/>
                                                    <span >Male</span>
                                                </div>

                                                <div className='col-4'>
                                                    <input type="radio" name="gender" checked={!this.state.info.gender} value="0"
                                                        onChange={()=>this.setState({info:{...this.state.info,gender:0}})}/>
                                                    <span>Female</span>
                                                </div>
                                            </div>
                                        </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>
            
                                <div className="row">
                                    <label className="col-2 col-form-label">Birth Date :</label>
                                    <div className="col-sm-9 col-md-6 col-sm-2">
                                        <input value={this.state.info.dateOfBirth} type="date"
                                        onChange={(e)=> this.setState({info: {...this.state.info, dateOfBirth: e.target.value}})}/>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-2'>	
                                        <button className="btn btn-primary" onClick={e => clickSubmit(e)} > Submit</button>
                                    </div>
                                <button className="btn btn-primary" onClick={e => clickBack(e)} > Back</button>
                                </div>
            
                            </div>
                            </form>
                        </div>
                    </div>
                    
                </div>
            )
        }
        return (<h2 className="ProductList-title">Waiting for API...</h2>);
    }
}

export default AccountUpdate;