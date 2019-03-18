//root 路由配置

import {Redirect, Route, } from "react-router-dom";
import App from "../App";
import React from "react";
import Login from "../pages/login";
import Register from "../pages/regist";
import Home from "../pages/home";
import cookie from "react-cookies";

class Root extends React.Component {
    state={
        isLogin:!!cookie.load("userId"),
        userId:cookie.load("userId")
    }

    Login = (value,id) => {
        this.setState({
            isLogin:value,
            userId:id
        });
        cookie.save("userId",id,{path:"/",maxAge:3600});
    }


    render() {
        return (
            <App Login={this.Login.bind(this)} isLogin={this.state.isLogin}>
                <Route path={"/"} exact render={() => (<Redirect to={"/login"}></Redirect>)}/>
                <Route path={"/login"} exact render={(props) => (<Login {...props} isLogin={this.state.isLogin} Login={this.Login.bind(this)}/>)}/>
                <Route path={"/register"} exact render={(props) => (<Register {...props} isLogin={this.state.isLogin} Login={this.Login.bind(this)}/>)}/>
                <Route path={"/home"}  render={(props) => {
                    if (this.state.isLogin){
                        return <Home isLogin={this.state.isLogin} Login={this.Login.bind(this)} {...props}/>
                    }
                    else {
                        return <Redirect to={"/login"}/>
                    }
                }}/>
            </App>
        )
    }
}


export default Root;