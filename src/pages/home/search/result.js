import React from "react";
import {Col, Empty, Icon, List, Modal, Row, Tabs, Tooltip, message} from "antd";
import {NavLink} from "react-router-dom";
import LoveModalBody from "../other/loveModalBody";
import cookies from "react-cookies"
import NewLoveModalBody from "../other/NewLoveModalBody";
import AlbumList from "./AlbumList";


class Result extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            hover:false,
            visible: false,
            confirmLoading: false,
            musicId:"",
            datasource:[],
            loved:{}
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            datasource:[...nextProps.result],
        });

        if (nextProps.match.params.type !== "专辑"){
            // eslint-disable-next-line
            if (nextProps.match.params.type === "用户"){
                nextProps.result.map(user => {
                    this.checkFriend(user.userId);
                })
            }
            nextProps.result.map(music => {
                this.checkLoved(music);
            })
        }
    };

    checkLoved = (music) =>{
        fetch(global.music.url+"CheckLovedServlet",{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`musicId=${music.musicId}&userId=${cookies.load("userId")}`,
        }).then(res => res.text() ).then(data => {
            if (data === "true"){
                this.setState({
                    loved:Object.assign(this.state.loved,{
                        [music.musicId]:true,
                    })
                })
            }
            else this.setState({
                loved:Object.assign(this.state.loved,{
                    [music.musicId]:false,
                })
            })
        })
    };

    renderList = (dataSource) => {
        if ( dataSource.length === 0 ){
            return (
                <Empty
                    style={{height:"100%"}}
                    description={(
                        <span>没有找到{this.props.type}<strong>{this.props.str}</strong>相关信息</span>
                    )}
                />
            )
        }
        else {
            return (
                <List
                    dataSource={dataSource}
                    pagination={{
                        pageSize:5,
                        hideOnSinglePage:true,
                    }}
                    renderItem={music => {
                        // alert(music.loved);
                        const actions = [
                            <Tooltip title={"播放"}><Icon onClick={this.playMusic.bind(this,music)} style={{marginLeft: "5px", fontSize: "large"}} type={"caret-right"}/></Tooltip>,
                            <Tooltip title={"添加到稍后播放"}><Icon onClick={this.addToPlayList.bind(this,music.musicId)} style={{marginLeft: "5px", fontSize: "large"}} type={"plus"}/></Tooltip>,
                            this.state.loved[music.musicId] ? <Tooltip title={"已收藏"}><Icon onClick={null} style={{marginLeft: "5px", fonullntSize: "large"}} type={"heart"} theme={"filled"}/></Tooltip> : <Tooltip title={"添加到收藏"}><Icon onClick={this.clickLove.bind(this,music.musicId)} style={{marginLeft: "5px", fontSize: "large"}} type={"heart"}/></Tooltip>
                        ];
                        return (
                            <List.Item
                                actions={this.props.match.params.type === "专辑"? null : actions}
                                onClick={this.handleClick}
                                onMouseOver={this.handelMouseEnter}
                                onMouseOut={this.handelMouseLeave}
                                className={this.state.hover ? "hover" : null}
                                id={music.musicId}
                            >
                                <List.Item.Meta
                                    title={<span><NavLink to={"/home/music/"+music.musicId} style={{fontSize:"x-large",marginTop:"3px"}}>{music.musicName}</NavLink></span>}
                                    description={
                                        <Row style={{bottom:"5px",width:"100%",marginTop:"10px"}}>
                                            <Col span={6}>
                                                <span style={{fontSize:"large"}}>歌手: {music.singer===undefined?"未知歌手":<NavLink to={"/home/search/"+music.singer.replace("/","&")+"/歌手"}>{music.singer}</NavLink>}</span>
                                            </Col>
                                            <Col span={12} offset={6}>
                                                <span style={{fontSize:"large"}}>专辑: <NavLink to={"/home/search/"+music.album+"/专辑"}>{music.album}</NavLink></span>
                                            </Col>
                                        </Row>
                                    }
                                    avatar={<img alt={"404"} src={music.picSrc} style={{height:"100%",maxHeight:"12vh"}}/>}
                                />
                            </List.Item>
                        )
                    }}
                    style={{
                        marginLeft:"3px",
                        marginRight:"3px"
                    }}
                />
            );
        }
    };

    renderUserList = (datasource) => {
        if ( datasource.length === 0 ){
            return (
                <Empty
                    style={{height:"100%"}}
                    description={(
                        <span>没有找到{this.props.type}<strong>{this.props.str}</strong>相关信息</span>
                    )}
                />
            )
        }
        else {
            return (
                <List
                    dataSource={datasource}
                    pagination={{
                        pageSize:5,
                        hideOnSinglePage:true,
                    }}
                    renderItem={user => {
                        if (user.userId===cookies.load("userId")){
                            return(
                                <div></div>
                            )
                        }
                        const actions = [
                            !this.state.loved[user.userId]? <Tooltip title={"关注"}><Icon onClick={this.addFriend.bind(this,user.userId)} style={{marginLeft: "5px", fontSize: "large"}} type={"plus"}/></Tooltip>:null,
                        ];
                        return (
                            <List.Item
                                actions={this.props.match.params.type === "专辑"? null : actions}
                                onMouseOver={this.handelMouseEnter}
                                onMouseOut={this.handelMouseLeave}
                                className={this.state.hover ? "hover" : null}
                                id={user.musicId}
                            >
                                <List.Item.Meta
                                    title={<span><NavLink to={"/home/user/"+user.userId} style={{fontSize:"x-large",marginTop:"3px"}}>{user.userName}</NavLink></span>}
                                    description={
                                        <Row style={{bottom:"5px",width:"100%",marginTop:"10px"}}>
                                            <Col span={6}>
                                                <span style={{fontSize:"large"}}>邮箱: {user.userEmail}</span>
                                            </Col>

                                        </Row>
                                    }
                                    avatar={<img alt={"404"} src={user.avatarSrc} style={{height:"100%",maxHeight:"12vh"}}/>}
                                />
                            </List.Item>
                        )
                    }}
                    style={{
                        marginLeft:"3px",
                        marginRight:"3px"
                    }}
                />
            );
        }
    };

    addFriend = (friendId) => {
        fetch(`${global.music.url}AddFriendServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`friendId=${friendId}&userId=${cookies.load("userId")}`,
        }).then(res=>res.text()).then(data=>{
            if (data==="true"){
                message.success("添加成功");
                this.props.reload();
            }
        })
    };

    checkFriend = (friendId) => {
        fetch(`${global.music.url}CheckFriendServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`friendId=${friendId}&userId=${cookies.load("userId")}`,
        }).then(res=>res.text()).then(data=>{
            if (data === "true"){
                this.setState({
                    loved:Object.assign(this.state.loved,{
                        [friendId]:true,
                    })
                })
            }
            else this.setState({
                loved:Object.assign(this.state.loved,{
                    [friendId]:false,
                })
            })
        })
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
                this.props.getPlayList();
            }
        })
    };

    playMusic = (music)=>{
        this.addToPlayList(music.musicId);
        this.props.getMusic(music);
    };

    handelTabClick = (e) => {
        this.props.changeType(e);
    };

    handelMouseEnter = (e) =>{
        let node = e.target;

        while (node.classList === undefined || !node.classList.contains("ant-list-item")){
            node = node.parentNode;
        }

        node.classList.add("hover");
    };

    handelMouseLeave = (e) => {
        let node = e.target;

        while (node.classList === undefined || !node.classList.contains("ant-list-item")){
            node = node.parentNode;
        }

        node.classList.remove("hover");
    };

    handleClick = (e) => {
        let node = e.target;

        // console.log(node)
        if (node.tagName !== "A" && node.tagName !== "path" && node.tagName !== "svg" && node.tagName !== "i"){
            while (!node.classList.contains("ant-list-item")){
                node = node.parentNode;
            }

            this.props.history.push({pathname:"/home/music/"+node.id});
        }
    };

    clickLove = (musicId) => {
        this.setState({
            visible: true,
            musicId: musicId,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            newLove:false,
        });
    };

    clickNewLove = () => {
        this.setState({
            newLove:true,
        })
    };

    clickBack = ()=>{
        this.setState({
            newLove:false,
        })
    };

    render() {
        return (
            <div>
                <Row>
                    <span style={{fontSize:"x-large"}}>以下是关于{this.props.type}<strong>{this.props.str}</strong>的搜索结果</span>
                </Row>
                <Row>
                    <Tabs
                        activeKey={this.props.type}
                        onTabClick={this.handelTabClick}
                    >
                        <Tabs.TabPane tab={"歌曲"} key={"歌曲"}>
                            {this.renderList(this.state.datasource)}
                            {/*<ResultList {...this.props}/>*/}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"歌手"} key={"歌手"}>
                            {this.renderList(this.state.datasource)}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"专辑"} key={"专辑"}>
                            {/*{this.renderList(this.state.datasource)}*/}
                            <AlbumList {...this.props} addToPlayList={this.addToPlayList.bind(this)} playMusic={this.playMusic.bind(this)}/>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"用户"} key={"用户"}>
                            {this.renderUserList(this.state.datasource)}
                        </Tabs.TabPane>
                    </Tabs>
                </Row>

                <Modal
                    className={"love-modal"}
                    title="添加到收藏夹"
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose={true}
                >
                    {this.state.newLove ? <NewLoveModalBody  musicId={this.state.musicId} clickBack={this.clickBack.bind(this)} closeModal={this.handleCancel.bind(this)}/>
                    :<LoveModalBody newLove={this.state.newLove} clickNewLove={this.clickNewLove.bind(this)} closeModal={this.handleCancel.bind(this)} musicId={this.state.musicId}/>
                    }
                </Modal>
            </div>
        )
    }
}

export default Result;