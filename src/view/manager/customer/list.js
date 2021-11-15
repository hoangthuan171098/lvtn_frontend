import React, { Component } from 'react'
import Cookie from 'js-cookie'
import axios from 'axios'
import { Link } from 'react-router-dom'

class AccountList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            authenticate: true,
            filter_username:'',
            filter_email:'',
            users: []
        }
    }

    async componentDidMount(){
        let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/users",{
            headers: {
              'Authorization':'bearer '+ Cookie.get('token'),
            },
        });
        if (!response.ok) {
            return
        }
        let users = await response.json()
        this.setState({ loading: false,authenticate: true, users: users })
        return
    }
    
    render(){
        const clickInfo = (id) =>{
            this.props.history.push('/manager/customers/'+id)
        }
    
        const clickUpdate = (id) =>{
            this.props.history.push('/manager/customers/'+id+'/update')
        }
    
        const clickDestroy = (id) =>{
            axios
            .delete(process.env.REACT_APP_BACKEND_URL + "/users/" + id,{
                headers: {
                'Authorization':'bearer '+ Cookie.get('token'),
                },
            })
            .then(response => {
                alert('Destroy success.')
                this.props.history.push("/manager/customers")
            })
            .catch(error => {
                alert('Update failed !!!')
                console.log('An error occurred:', error.response)
            });
        }

        return(
            <div className="CustomerList">
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12 p-0">
                                <div className="page-header-title">
                                    <h5>TÀI KHOẢN</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Link to='/manager/customers/create'><button className="btn btn-primary"> Khách hàng mới</button></Link>

                <div className='card'>
                    <div className='card-body'>
                        <div className="DataList-container">
                            <div className="DataList-filter" onSubmit={this.filterSubmmitHandle}>
                                <form className="form-inline w-100">
                                    <div className='controls'>
                                        <div className='input-prepend'>
                                            <span className='add-on'>Username</span>
                                            <input name="username_filter" type="text"
                                                onChange={e=>this.setState({filter_username: e.target.value})} value={this.state.filter_username}
                                                />
                                        </div>
                                    </div>

                                    <div className='controls'>
                                        <div className='input-prepend'>
                                            <span className='add-on'>Gmail</span>
                                            <input name="gmail_filter" type="text" 
                                            onChange={e=>this.setState({filter_email: e.target.value})} value={this.state.filter_email}
                                            />
                                        </div>
                                    </div>
                                    
                                    <button type="reset" className='btn btn-success'
                                    onClick={ ()=>this.setState({filter_email:'',filter_username:''})} >Reset</button>
                                </form>
                            </div>

                            <table className="table">
                                <thead>
                                    <tr class="heading">
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.users
                                    .filter(user=>
                                        user.role.name.includes('Customer')
                                        && user.username.includes(this.state.filter_username)
                                        && user.email.includes(this.state.filter_email)
                                    )
                                    .map((user, index) => {
                                    return (
                                        <tr key={index} >
                                            <td onClick={() =>clickInfo(user.id)}>{user.id}</td>
                                            <td onClick={() =>clickInfo(user.id)}>{user.username}</td>
                                            <td onClick={() =>clickInfo(user.id)}>{user.email}</td>
                                            <td >
                                                <i style={{fontSize:25 + "px",color:"blue",cursor:"pointer",marginRight:10 + "px"}} className="fa fa-edit" onClick={() =>clickUpdate(user.id)} ></i>
                                                <i style={{fontSize:28 + "px",color:"red",cursor:"pointer"}} className="fa fa-remove" onClick={() =>clickDestroy(user.id)} ></i>
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
}

export default AccountList;