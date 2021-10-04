import React from "react"
import Cookie from 'js-cookie'
import axios from 'axios'

export default class ManagerChat extends React.Component{
	constructor(props){
		super(props)
		this.state={
			message: '',
			chats : [],
			user: {},
			userList: []
		}
		this.boxchatRef = React.createRef()
	}

	async componentDidMount(){
		this.myInterval = setInterval(() => this.getChatData(),1000)
		if(!Cookie.get('token')){
				return
		}
		await axios
			.get(process.env.REACT_APP_BACKEND_URL + '/chats',
			{
					headers: {
							'Authorization':'bearer '+ Cookie.get('token'),
					},
			})
			.then(res=> {
				let chats = res.data
				let userList = []
				for(let i=chats.length-1;i>-1;i--){
					if(chats[i].from){
						userList.push({...chats[i],user:chats[i].from})
					}
					else if(chats[i].to){
						userList.push({...chats[i],user:chats[i].to})
					}
				}
				let data = userList.filter((obj,index,arr)=>{
					return arr.map(mapObj=>mapObj.user.username).indexOf(obj.user.username) === index
				})
				this.setState({chats:res.data,userList:data})
			})
			.catch(error => {
					alert('Cannot connect to chat');
					console.log('An error occurred:', error.response);
			});
		return
	}

	componentWillUnmount(){
		clearInterval(this.myInterval)
	}

	getChatData = async () =>{
		this.scrollToBottom()
		if(!Cookie.get('token')){
				return
		}
		await axios
			.get(process.env.REACT_APP_BACKEND_URL + '/chats',{
					headers: {
							'Authorization':'bearer '+ Cookie.get('token'),
					},
			})
			.then(res=> {
				let chats = res.data
				let userList = []
				for(let i=chats.length-1;i>-1;i--){
					if(chats[i].from){
						userList.push({...chats[i],user:chats[i].from})
					}
					else if(chats[i].to){
						userList.push({...chats[i],user:chats[i].to})
					}
				}
				let data = userList.filter((obj,index,arr)=>{
					return arr.map(mapObj=>mapObj.user.username).indexOf(obj.user.username) === index
				})
				this.setState({chats:res.data,userList:data})
			})

		return
	}

	scrollToBottom() {
		const scrollHeight = this.boxchatRef.current.scrollHeight;
		const height = this.boxchatRef.current.clientHeight;
		const maxScrollTop = scrollHeight - height;
		this.boxchatRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
	}

	sendMessageClick = (e) =>{
		e.preventDefault()
		axios
			.post(process.env.REACT_APP_BACKEND_URL + '/chats',{
				message: this.state.message,
				to: this.state.user.id,
				type: 'assist'
			},{
				headers: {
						'Authorization':'bearer '+ Cookie.get('token'),
				},
			})
			.then(res=> {
				this.getChatData()
				this.setState({message: ''})
			})
			.catch(error => {
				alert('Cannot connect to server');
				console.log('An error occurred:', error.response);
			});
		return
	}

	chatUserClick = (user) =>{
		this.setState({user:user})
		this.scrollToBottom()
	}

  render(){
		return(
			<div className="container ManagerChat">
				<div className="page-title">
					<div className="row gutters">
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
							<h5 className="title">Chat</h5>
						</div>
						<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"> </div>
					</div>
				</div>
				<div className="content-wrapper">
					<div className="row gutters">
						<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
							<div className="card m-0">
								<div className="row no-gutters">
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
										<div className="users-container">
											<div className="chat-search-box">
												<div className="input-group">
													<input className="form-control" placeholder="Search" />
													<div className="input-group-btn">
														<button type="button" className="btn btn-info">
															<i className="fa fa-search" />
														</button>
													</div>
												</div>
											</div>
										<ul className="users">
											{this.state.userList.map((user,index)=>{
												return(
													<li className="person" data-chat="person1" index={index} onClick={()=>this.chatUserClick(user.user)}>
														<div className="user">
															<img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin" />
														</div>
														<p className="name-time">
															<span className="name">{user.user.username}</span><br/>
															<span className="time">{user.message}</span>
														</p>
													</li>)
											})}
										</ul>
									</div>
								</div>

								<div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
									<div className="selected-user">
										<span>To: <span className="name">{this.state.user.username? this.state.user.username:''}</span></span>
									</div>

									<div className="chat-container" style={{maxHeight:350+'px',overflowY:'scroll'}}  ref={this.boxchatRef}>
										<ul className="chat-box chatContainerScroll">
											{this.state.chats.
												filter(chat=>{
													if(chat.from){
														if(chat.from.id === this.state.user.id){
															return true
														}
														return false
													}
													else{
														if(chat.to.id === this.state.user.id){
															return true
														}
														return false
													}
												}).map((chat,index)=>{	
												if(chat.from){
													return(
														<li className="chat-left">
															<div className="chat-avatar">
																<img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin" />
																<div className="chat-name">Russell</div>
															</div>
															<div className="chat-text">
																{chat.message}
															</div>
														</li>
													)
												}
												else{
													return(
														<li className="chat-right">
															<div className="chat-text">
																{chat.message}
															</div>
															<div className="chat-avatar">
																<img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin" />
																<div className="chat-name">Sam</div>
															</div>
														</li>
													)
												}
											})}
										</ul>
								</div>

								<div className={this.state.user.username? "ml-4 form-group mt-3 mb-0":'d-none'}>
									<textarea className="form-control" rows={2} placeholder="Type your message here..." style={{width:85+"%"}}
										value={this.state.message} onChange={(e)=>this.setState({message:e.target.value})} />
									
									<a className="publisher-btn text-info" href="#" data-abc="true"
										onClick={e=>this.sendMessageClick(e)}
									>
										<i className="fa fa-paper-plane" />
									</a>
								</div>

								</div>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
} 
