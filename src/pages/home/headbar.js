import {Component} from "react";
import {Avatar, Icon, Menu} from "antd";
import React from "react";
import cookie from "react-cookies";
import "../css/headbar.css";
import {NavLink} from "react-router-dom";


class HeadBar extends Component{
    constructor(props){
        super(props);

        this.state = {
            userId:cookie.load("userId"),
            userName:"",
            avatarSrc:""
        }
    }


    componentDidMount() {
        fetch(global.music.url+"FindUserServlet?userId="+this.state.userId,{
            method:"GET",
            mode:"cors",
        }).then(res => res.json()).then(data => {
            this.setState({
                userName:data.userName,
                avatarSrc:data.avatarSrc,
            })
        });
    }

    render() {
        return (
            <Menu
                theme="dark"
                mode="horizontal"
                onClick={this.props.onClick}
                selectedKeys={[this.props.current]}
                style={{ lineHeight: '64px' }}
            >
                <Menu.Item key={"/home"}><NavLink to={"/home"}><Icon type={"home"}/>主页</NavLink></Menu.Item>
                <Menu.Item key={"logout"} id={"logout"} onClick={this.props.Logout}><NavLink to={"/"}><Icon type={"logout"}/>注销</NavLink></Menu.Item>
                {/*<span style={{float:"right"}}>/</span>*/}
                <Menu.Item key={"/home/user"} id={"user"}><NavLink to={{
                    pathname:"/home/user/"+cookie.load("userId")
                }}><Avatar style={{marginRight:"5px"}} src={this.state.avatarSrc} alt={"nmsl"}/>{this.state.userName}</NavLink></Menu.Item>
            </Menu>
        )
    }
}

export default HeadBar;