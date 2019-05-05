import React from "react";
import {Layout} from "antd";
import HeadBar from "./home/headbar";

//css
import "../css/home.css";
import cookies from "react-cookies";
import {Redirect, Route, Switch,} from "react-router-dom";
import User from "./user/user";
import Index from "./home/index";
import Setup from "./setup/setup";
import MusicCard from "./musicCard";
import Music from "./home/music/music";
import SearchResult from "./home/search/searchResult";

const { Header, Content, Sider } = Layout;


class Home extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            current:this.props.location.pathname,
            collapsed:true,
            musicPlaying:false,
            music:{
                musicSrc:global.music.url+"music/",
                musicName:"青木カレン ハセガワダイスケ - Great Days",
                picSrc:global.music.url+"pic/",
                musicId:"",
            }
        }
    }

    componentDidMount() {
        //获取历史的最后一首歌
        fetch(global.music.url+"",{

        })
    }

    handleClick = (e) => {
        this.setState({
            current:e.key
        })
    };

    toMusicPage = () => {
        this.setState({
            current:this.props.location.pathname
        })
    }


    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    }

    playMusic = () => {
        this.setState({
            musicPlaying:!this.state.musicPlaying
        })
    }

    onLogout = () => {
        cookies.remove("userId",{path:"/"});
    }

    render() {
        const siderStyle = {
            position:"fixed",
            left:"0px",
            height:"100vh",
            overflow: 'hidden',
            zIndex:"1"
        }

        if (!(!!cookies.load("userId"))){
            return <Redirect to={"/"} />
        }
        return (
            <Layout style={{width:"70%",marginLeft:"15%",height:"100%",opacity:0.9,minWidth:"600px",minHeight:"600px"}}>

                <Sider style={siderStyle} width={"30%"} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} collapsedWidth={"20px"} >
                    <MusicCard music={this.state.music} playing={this.state.musicPlaying} play={this.playMusic.bind(this)} display={this.state.collapsed ? "none" : null} toMusicPage={this.toMusicPage.bind(this)}/>
                </Sider>

                <Layout>
                    <Header>
                        <div className={"logo"}></div>
                        <HeadBar current={this.state.current} onClick={this.handleClick.bind(this)} Logout={this.onLogout} {...this.props}/>
                    </Header>

                    <Content style={{marginTop:"13px",marginBottom:"10px"}}>
                        <Switch>
                            <Route exact strict path={"/home/user/:userId"} component={ User }/>
                            <Route exact strict path={"/home"} component={ Index } />
                            <Route exact strict path={"/home/setup"} component={ Setup }/>
                            <Route exact strict path={"/home/music/:musicId"} component={ Music }/>
                            <Route exact strict path={"/home/search/:str/:type"} component={ SearchResult }/>
                        </Switch>
                    </Content>

                </Layout>
            </Layout>
        )
    }
}

export default Home;