import React from "react";
import cookies from "react-cookies"
import {Button, Col, Empty, Icon, List, message, Modal, Row, Tabs, Tooltip} from "antd";
import {NavLink} from "react-router-dom";
import NewLoveModalBody from "../home/other/NewLoveModalBody";

const { TabPane } = Tabs;


class UserLove extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loves:[],
            visible:false,
            confirmLoading:false,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        fetch(`${global.music.url}GetUserLoveServlet?userId=${nextProps.userId}`,{
            method:"GET",
        }).then(res => res.json()).then(data => {
            this.setState({
                loves:[...data],
            })
        })
    };


    handleClickCLose = (musicId,loveName)=>{
        fetch(`${global.music.url}DeleteLoveServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`musicId=${musicId}&userId=${cookies.load("userId")}&loveName=${loveName}`,
        }).then(res => res.text()).then(data => {
            if (data === "true"){
                let loves = this.state.loves;

                loves.forEach(love => {
                    if (love.loveName === loveName){
                        let i = love.musics.findIndex(music=> music.musicId===musicId);
                        love.musics.splice(i,1);
                    }
                });

                this.setState({
                    loves:[...loves],
                })
            }
        })
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            newLove:false,
        });
        fetch(`${global.music.url}GetUserLoveServlet?userId=${cookies.load("userId")}`,{
            method:"GET",
        }).then(res => res.json()).then(data => {
            // console.log(data);

            this.setState({
                loves:[...data],
            })
        })
    };

    showModal = () =>{
        this.setState({
            visible:true,
        })
    };


    handleClickLoveClose = (loveName)=>{
        fetch(`${global.music.url}DeleteLoveServlet?loveName=${loveName}&userId=${cookies.load("userId")}`,{
            method:"get",
        }).then(res=>res.text()).then(data=>{
            if (data === "true"){
                let loves = this.state.loves;

                let i = loves.findIndex(love=>love.loveName===loveName);

                loves.splice(i,1);


                this.setState({
                    loves:[...loves],
                })
            }
        })

    };

    addToPlayList = (musicId) => {
        // alert("test");
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

    renderLoveMusics = (musics,loveName) => {
        return (
            <List dataSource={musics}
                  renderItem={music=>{
                      const actions = [
                          <Tooltip title={"播放"}><Icon onClick={this.playMusic.bind(this,music)} style={{marginLeft: "5px", fontSize: "large"}} type={"caret-right"}/></Tooltip>,
                          <Tooltip title={"添加到稍后播放"}><Icon onClick={()=>{this.addToPlayList(music.musicId)}} style={{marginLeft: "5px", fontSize: "large"}} type={"plus"}/></Tooltip>,
                          this.props.userId===cookies.load("userId") ? <Tooltip title={"删除"}><Icon onClick={this.handleClickCLose.bind(this,music.musicId,loveName)} style={{marginLeft: "5px", fontSize: "large"}} type={"close"}/></Tooltip> : null
                      ];

                      return (
                          <List.Item
                              actions={actions}
                              id={music.musicId}
                          >
                              <List.Item.Meta
                                  title={<span><NavLink to={"/home/music/"+music.musicId} style={{fontSize:"x-large",marginTop:"3px"}}>{music.musicName}</NavLink></span>}
                                  description={
                                      <Row style={{bottom:"5px",width:"100%",marginTop:"10px"}}>
                                          <Col span={6}>
                                              <span style={{fontSize:"large"}}>歌手: <NavLink to={"/home/search/"+music.singer.replace("/","&")+"/歌手"}>{music.singer}</NavLink></span>
                                          </Col>
                                          <Col span={12} offset={4}>
                                              <span style={{fontSize:"large"}}>专辑: <NavLink to={"/home/search/"+music.album+"/专辑"}>{music.album}</NavLink></span>
                                          </Col>
                                      </Row>
                                  }
                                  avatar={<img alt={"404"} src={music.picSrc} style={{height:"100%",maxHeight:"12vh"}}/>}
                              />
                          </List.Item>
                      )
                  }}
            />
        )
    };

    render() {
        const empty = (
            <Empty
                style={{height:"100%"}}
                description={(
                    <span>还没有收藏歌曲哦</span>
                )}
            />
        );

        const add = (
            <Tooltip title={"添加收藏夹"}>
                <Button htmlType={"button"} onClick={this.showModal}>
                    <Icon onClick={null} type={"plus"}/>
                </Button>
            </Tooltip>
        );

        return(
            <div className={"user-love-box"}>
                <Tabs tabBarExtraContent={this.props.userId===cookies.load("userId")?add:null}>
                    {this.state.loves.map((love,i) => {
                        const tab = (
                            <span>{love.loveName}{love.loveName==="默认收藏夹" || this.props.userId!==cookies.load("userId")?
                                null:<Tooltip title={"删除收藏夹"}>
                                        <Icon onClick={this.handleClickLoveClose.bind(this,love.loveName)} style={{fontSize:"12px",marginLeft:"10px"}} type={"close"}/>
                                     </Tooltip>
                            }</span>
                        );
                        return (
                            <TabPane tab={tab} key={`${love.loveName}${i}`}>
                                {love.musics.length > 0 ? this.renderLoveMusics(love.musics,love.loveName):empty}
                            </TabPane>
                        )
                    })}
                </Tabs>

                <Modal
                    className={"love-modal"}
                    title="添加收藏夹"
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose={true}
                >
                    <NewLoveModalBody  musicId={null} clickBack={null} closeModal={this.handleCancel.bind(this)}/>
                </Modal>
            </div>
        )

    }

}

export default UserLove;
