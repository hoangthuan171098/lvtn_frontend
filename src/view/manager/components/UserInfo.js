import React, { Component } from 'react'
import Cookie from 'js-cookie'

class AccountInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			user: {}
		}
	}

	async componentDidMount() {
		let response1 = await fetch(process.env.REACT_APP_BACKEND_URL + "/users/" + this.props.user.id,{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		});
		let response2 = await fetch(process.env.REACT_APP_BACKEND_URL + "/customer-infos?customerId=" + this.props.user.id ,{
			headers: {
				'Authorization':'bearer '+ Cookie.get('token'),
			},
		});
		if (!response1.ok || !response2.ok) {
			console.log("Không thể kết nối với sever!");
			return
		}
		let data1 = await response1.json();
		let data2 = await response2.json();
		this.setState({ loading: false, user: data1 });
		if(data2.length !== 0){
			this.setState({info: data2[0]});
		}
	}

	detailInfo = () =>{
		if(this.state.info){
			return(
			<>
				<tr>        
					<td> Số điện thoại: </td>
					<td className="text-primary">
						{this.state.info.phoneNumber}
					</td>
				</tr>
		
				<tr>        
					<td> Họ và tên: </td>
					<td className="text-primary">
						{this.state.info.lastName + ' ' + this.state.info.firstName}
					</td>
				</tr>
				<tr>        
					<td> Giới tính: </td>
					<td className="text-primary">
						{this.state.info.gender? 'Nam' : 'nữ'}
					</td>
				</tr>
				<tr>        
					<td> Công ty: </td>
					<td className="text-primary">
						{this.state.info.firm}
					</td>
				</tr>
				<tr>        
					<td> Địa chỉ: </td>
					<td className="text-primary">
						{this.state.info.address}
					</td>
				</tr>
			</>
			)
		}
		return (<></>);
	}

	render() {
		if (!this.state.loading && Cookie.get('token')) {
			return (
				<div className="container">
					<div className="container col-lg-8">
                        <table className="table td-none-border">
                            <tbody>
                                <tr>  
                                    <td> Account ID: </td>
                                    <td className="text-primary">
                                        {this.state.user.id}
                                    </td>
                                </tr>
                                <tr>    
                                    <td> Tên tài khoản: </td>
                                    <td className="text-primary">
                                        {this.state.user.username}
                                    </td>
                                </tr>
                                <tr>    
                                    <td> Email: </td>
                                    <td className="text-primary">
                                        {this.state.user.email}
                                    </td>
                                </tr>
        
                                <this.detailInfo />
                                <tr>
                                    <td>
                                        <button className="btn btn-primary" onClick={this.props.clickBack}>Trở về</button>
                                    </td>
                                </tr>         
                            </tbody>
                        </table>
					</div>
				</div>
			)
		}
		return (<h2 className="ProductList-title">Waiting for API...</h2>);
	}
}


export default AccountInfo;