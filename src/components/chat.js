import React from 'react'
import axios from 'axios'
import Cookie from 'js-cookie'
import { toast } from 'react-toastify'

export default class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            chats : [],
            message: '',
            show: false
        }
        this.chatRef = React.createRef()
        this.chatBtnRef = React.createRef()
    }

    async componentDidMount(){
        this.myInterval = setInterval(() => this.getChatData(),1000)
        if(!Cookie.get('token')){
            return
        }
		await axios
            .get(process.env.REACT_APP_BACKEND_URL + 
                "/chats?_where[_or][0][from_eq]=" + Cookie.get('id') +
                "&_where[_or][1][to_eq]=" + Cookie.get('id'),
            {
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                },
            })
            .then(res=> {
                this.setState({chats:res.data})
            })
            .catch(error => {
                toast.error('Cannot connect to chat');
                console.log('An error occurred:', error.response);
            });
        return
    }

    componentWillUnmount(){
        clearInterval(this.myInterval)
    }

    getChatData = () =>{
        if(!Cookie.get('token')){
            return
        }
        if(!this.state.show){
            return
        }
		axios
            .get(process.env.REACT_APP_BACKEND_URL + 
                "/chats?_where[_or][0][from_eq]=" + Cookie.get('id') +
                "&_where[_or][1][to_eq]=" + Cookie.get('id') ,
            {
                headers: {
                    'Authorization':'bearer '+ Cookie.get('token'),
                },
            })
            .then(res=> {
                this.setState({chats:res.data})
            })
        return
    }

    showChatClick = () =>{
        this.chatRef.current.classList.toggle('d-none')
        this.chatBtnRef.current.classList.toggle('d-none')
        this.setState({show:!this.state.show})
    }

    sendMessageClick = (e) =>{
        e.preventDefault()
		axios
            .post(process.env.REACT_APP_BACKEND_URL + '/chats',{
                message: this.state.message,
                from: Cookie.get('id'),
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
                toast.error('Cannot connect to server');
                console.log('An error occurred:', error.response);
            });
        return
    }

    render(){
        return(
            <div style={{width:50+'%'}}>
                <button onClick={this.showChatClick} className='chat-btn' ref={this.chatBtnRef}>Chat</button>

                <div className="page-content page-container d-none" id="page-content" ref={this.chatRef}>
                        <div className="row d-flex justify-content-center">
                            <div className="card card-bordered">
                                <div className="card-header">
                                    <h4 className="card-title"><strong>Chat</strong></h4>
                                    <button onClick={this.showChatClick}>X</button>
                                </div>

                                <div className="ps-container ps-theme-default ps-active-y" id="chat-content" style={{overflowY: 'scroll !important', height: '400px !important'}}>                                    
                                    <div className="media media-meta-day">Today</div>
                                    {this.state.chats.map((chat,index)=>{
                                        if(chat.from){
                                            return(
                                                <div className="media media-chat" index={index}> <img className="avatar" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..." />
                                                    <div className="media-body">
                                                        <p>{chat.message}</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else{
                                            return(
                                                <div className="media media-chat media-chat-reverse">
                                                    <div className="media-body">
                                                        <p>{chat.message}</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                        <div className="ps-scrollbar-x-rail" style={{left: '0px', bottom: '0px'}}>
                                            <div className="ps-scrollbar-x" tabIndex={0} style={{left: '0px', width: '0px'}} /></div>
                                            <div className="ps-scrollbar-y-rail" style={{top: '0px', height: '0px', right: '2px'}}>
                                            <div className="ps-scrollbar-y" tabIndex={0} style={{top: '0px', height: '2px'}} />
                                        </div>
                                    </div>
                                    <div className="publisher bt-1 border-light"> 
                                        <img className="avatar avatar-xs" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..." /> 
                                        <input className="publisher-input" type="text" placeholder="Write something" 
                                            onChange={e=>this.setState({message:e.target.value})} value={this.state.message}/>
                                        <span className="publisher-btn file-group"> 
                                            <i className="fa fa-paperclip file-browser" />
                                            <input type="file" />
                                        </span>
                                        <a className="publisher-btn" href="#" data-abc="true">
                                            <i className="fa fa-smile" />
                                        </a>
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
        )
    }
}