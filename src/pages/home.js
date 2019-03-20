import React from "react";
import {Layout} from "antd";
import HeadBar from "./home/headbar";

//css
import "./css/home.css";
import cookies from "react-cookies";
import {Redirect, Route, Switch,} from "react-router-dom";
import User from "./home/user";

const { Header, Content, } = Layout;


class Home extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            current:this.props.location.pathname,
        }
    }


    handleClick = (e) => {
        this.setState({
            current:e.key
        })
    }


    onLogout = () => {
        cookies.remove("userId",{path:"/"});
    }

    render() {

        if (!(!!cookies.load("userId"))){
            return <Redirect to={"/"} />
        }
        return (
            <Layout style={{width:"70%",marginLeft:"15%",height:"100%",opacity:0.9,minWidth:"1000px",minHeight:"600px"}}>
                <Header>
                    <div className={"logo"}></div>
                    <HeadBar current={this.state.current} onClick={this.handleClick.bind(this)} Logout={this.onLogout}/>
                </Header>

                <Content style={{marginTop:"13px",marginBottom:"10px"}}>
                <Switch>
                    <Route exact path={"/home/user/:userId"} component={User}/>
                    <Route path={"/home"} component={() => {return (<h1>home</h1>)}}/>
                </Switch>
                </Content>
            </Layout>
        )
    }
}

export default Home;