import React from "react";
import {Layout} from "antd";
import HeadBar from "./home/headbar";

//css
import "./css/home.css";
import cookies from "react-cookies";
import {Redirect, Route, Switch,} from "react-router-dom";
import User from "./user/user";
import Index from "./home/index";
import Setup from "./setup/setup";
import MusicCard from "./musicCard";

const { Header, Content, Sider } = Layout;


class Home extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            current:this.props.location.pathname,
            collapsed:true
        }
    }


    handleClick = (e) => {
        this.setState({
            current:e.key
        })
    }


    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }

    onLogout = () => {
        cookies.remove("userId",{path:"/"});
    }

    render() {
        const siderStyle = {
            position:"fixed",
            left:"0px",
            height:"100vh",
        }

        if (!(!!cookies.load("userId"))){
            return <Redirect to={"/"} />
        }
        return (
            <Layout style={{width:"70%",marginLeft:"15%",height:"100%",opacity:0.9,minWidth:"600px",minHeight:"600px"}}>
               <Sider style={siderStyle} width={"15%"} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} collapsedWidth={"20px"} >
                   <MusicCard display={this.state.collapsed ? "none" : "block"}/>
               </Sider>

                <Layout>
                    <Header>
                        <div className={"logo"}></div>
                        <HeadBar current={this.state.current} onClick={this.handleClick.bind(this)} Logout={this.onLogout}/>
                    </Header>

                    <Content style={{marginTop:"13px",marginBottom:"10px"}}>
                        <Switch>
                            <Route exact strict path={"/home/user/:userId"} component={ User }/>
                            <Route exact strict path={"/home"} component={ Index } />
                            <Route exact strict path={"/home/setup"} component={ Setup }/>
                        </Switch>
                    </Content>

                </Layout>
            </Layout>
        )
    }
}

export default Home;