import React from "react";
import {Layout, message} from "antd";
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
import Friend from "./home/friend/friend";

const { Header, Content, Sider } = Layout;


class Home extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            current:this.props.location.pathname,
            collapsed:true,
            musicPlaying:false,
            music:{
                musicSrc:"",
                musicName:"",
                picSrc:"",
                musicId:"",
            },
            playList:[],
        }
    }

    componentDidMount() {
        //获取历史的最后一首歌
        fetch(`${global.music.url}GetLatestHistoryServlet?userId=${cookies.load("userId")}`,{
            method:"GET"
        }).then(res => res.json()).then(data => {
            if (!data.hasOwnProperty("flag")){
                data.musicSrc += ".mp3";
                this.setState({
                    music:{...data}
                })
            }
        });

        this.setState({
            current:this.props.location.pathname,
        });
        this.getPlayList();
    }


    getPlayList = () => {
        fetch(`${global.music.url}GetPlayListServlet?userId=${cookies.load("userId")}`,{
            method:"get"
        }).then(res => res.json()).then(data => {
            this.setState({
                playList:[...data],
            })
        })
    };

    handleClick = (e) => {
        this.setState({
            current:e.key
        })
    };

    toMusicPage = () => {
        this.setState({
            current:this.props.location.pathname
        })
    };

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    };

    playMusic = () => {
        this.setState({
            musicPlaying:true
        })
    };

    suspendMusic = () => {
        this.setState({
            musicPlaying:false
        })
    };

    onLogout = () => {
        cookies.remove("userId",{path:"/"});
    };

    addToPlayList = musicId => {
        fetch(`${global.music.url}AddPlayListServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`musicId=${musicId}&userId=${cookies.load("userId")}`,
        }).then(res=>res.text()).then(data=>{
            if (data==="true"){
                message.success("添加成功");
                this.getPlayList();
            }
        })
    };

    getMusicMessage = (music) => {
        let _music = {...music};
        if (!_music.musicName.includes(".mp3")){
            _music.musicSrc = _music.musicSrc + ".mp3";
        }

        console.log(_music);
        this.setState({
            music:{..._music}
        });

        fetch(`${global.music.url}PlayMusicServlet`,{
            method:"POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`userId=${cookies.load("userId")}&musicId=${music.musicId}`
        }).then(res => res.text()).then(data => {
            if (data === "true"){
                this.playMusic();
            }
        });

    };

    restart = () => {
        const audio = document.getElementById("music-card-player");
        audio.pause();
        audio.load();
        audio.play();
    };

    nextMusic = () => {
        const playList = [...this.state.playList];

        const playing = {...this.state.music};

        const i = playList.findIndex(music => music.musicId===playing.musicId);

        if (playList.length === 0){
            this.restart();
        }
        else if (i === playList.length-1){
            this.getMusicMessage(playList[0])
        }
        else this.getMusicMessage(playList[i+1]);

    };

    preMusic = () => {
        const playList = [...this.state.playList];

        const playing = {...this.state.music};

        const i = playList.findIndex(music => music.musicId===playing.musicId);

        if (playList.length === 0){
            this.restart();
        }
        else if (i === 0){
            this.getMusicMessage(playList[playList.length-1])
        }
        else this.getMusicMessage(playList[i-1]);

    };

    deleteFromPlayList = (musicId) => {
        fetch(`${global.music.url}DeleteFromPlayListServlet`,{
            method:"post",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`userId=${cookies.load("userId")}&musicId=${musicId}`
        }).then(res=>res.text()).then(data => {
            if (data === "true"){
                message.success("删除成功");
                if (musicId === this.state.music.musicId){
                    alert("next")
                    this.nextMusic();
                }
                this.getPlayList();
            }
        })
    };


    render() {
        const siderStyle = {
            position:"fixed",
            left:"0px",
            height:"100vh",
            overflow: 'hidden',
            zIndex:"2"
        };

        if (!(!!cookies.load("userId"))){
            return <Redirect to={"/"} />
        }
        return (
            <Layout style={{width:"70vw",marginLeft:"15%",height:"100vh",opacity:0.9,minWidth:"600px",minHeight:"600px",overflow:"hidden"}}>
                <Sider style={siderStyle} width={"28%"} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} collapsedWidth={"20px"} >
                    <MusicCard deletePlayList={this.deleteFromPlayList.bind(this)} preMusic={this.preMusic.bind(this)} nextMusic={this.nextMusic.bind(this)} getMusicMessage={this.getMusicMessage.bind(this)} playList={this.state.playList} music={this.state.music} playing={this.state.musicPlaying} play={this.playMusic.bind(this)} suspendMusic={this.suspendMusic.bind(this)} display={this.state.collapsed ? "none" : null} toMusicPage={this.toMusicPage.bind(this)}/>
                </Sider>

                <Layout >
                    <Header>
                        <div className={"logo"}></div>
                        <HeadBar current={this.state.current} onClick={this.handleClick.bind(this)} Logout={this.onLogout} {...this.props}/>
                    </Header>

                    <Content style={{marginTop:"13px",marginBottom:"10px"}}>
                        <Switch>
                            <Route exact strict path={"/home/user/:userId"} render={props => {
                                return <User {...props} getPlayList={this.getPlayList.bind(this)} getMusic={this.getMusicMessage.bind(this)}/>
                            }}/>
                            <Route exact strict path={"/home"} component={ Index } />
                            <Route exact strict path={"/home/setup"} component={ Setup }/>
                            <Route exact strict path={"/home/friend"} render={props => {
                                return <Friend {...props} getPlayList={this.getPlayList.bind(this)} getMusic={this.getMusicMessage.bind(this)}/>
                            }}/>
                            <Route exact strict path={"/home/music/:musicId"} render={(props) => {
                                return <Music addToPlayList={this.addToPlayList.bind(this)} getMusic={this.getMusicMessage.bind(this)} {...props}/>
                            }}/>
                            <Route exact strict path={"/home/search/:str/:type"} render={(props) => {
                                return <SearchResult getPlayList={this.getPlayList.bind(this)} getMusic={this.getMusicMessage.bind(this)} playMusic={this.playMusic.bind(this)} {...props}/>;
                            }}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default Home;