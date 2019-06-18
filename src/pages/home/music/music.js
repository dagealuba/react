import React from "react";
import {Button, Card, Col, Icon, Modal, Row} from "antd";
import {NavLink} from "react-router-dom";
import Comments from "./comments";
import cookies from "react-cookies";
import NewLoveModalBody from "../other/NewLoveModalBody";
import LoveModalBody from "../other/loveModalBody";


class Music extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            music:{
                singer:"未知歌手",
                musicId:null,
            },
            loved:false,
            visible: false,
            confirmLoading: false,
            newLove:false,
        }
    }


    componentDidMount() {
        const musicId = this.props.match.params.musicId;
        fetch(global.music.url+"SearchMusicByIdServlet?musicId="+musicId,{
            method:"GET",
        }).then(res => res.json() ).then(data => {
            this.setState({
                music:{...data}
            });

            this.checkLoved(data);
        });
    }

    checkLoved = (music) => {
        fetch(global.music.url+"CheckLovedServlet",{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`musicId=${music.musicId}&userId=${cookies.load("userId")}`,
        }).then(res => res.text() ).then(data => {
            if (data === "true"){
                this.setState({
                    loved:true
                })
            }
        })
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

    clickLove = () => {
        this.setState({
            visible: true,
        });
    };

    renderLyr = (lyrSrc) => {
        if (lyrSrc === null || lyrSrc === ""){
            return (
                <center className={"no-lyric"}
                >
                    <p>暂无歌词</p>
                </center>
            )
        }
        else {
            fetch(lyrSrc,{
                method:"GET"
            }).then( res => res.json() ).then(data => {
                console.log(data);
            })
        }
    };

    play = (music) => {
        this.props.addToPlayList(music.musicId);
        this.props.getMusic(music);
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            newLove:false,
        });

        this.checkLoved(this.state.music);
    };

    render() {
        const { music } = this.state;
        return(
            <div>
                <Row className={"musicRow"} >
                    <Col span={6}>
                        <img className={"musicPic"} alt={"404"} src={music.picSrc}/>
                    </Col>
                    <Col span={10}>
                        <Card
                            style={{
                                width:"94%",
                                height:"100%",
                                marginLeft:"3%",
                                backgroundColor:"rgba(0,0,0,0)"
                            }}
                            headStyle={{
                                border:"none",
                                fontSize:"xx-large",
                            }}
                            bodyStyle={{
                                fontSize:"x-large"
                            }}
                            bordered={false}
                            title={music.musicName}
                        >
                            <Row>
                                <span>歌手: <NavLink to={"/home/search/"+music.singer.replace("/","&")+"/歌手"}>{music.singer}</NavLink></span>
                            </Row>
                            <Row style={{marginTop:"3%"}}>
                                <span>专辑: <NavLink to={"/home/search/"+music.album+"/专辑"}>{music.album}</NavLink></span>
                            </Row>
                            <Row style={{marginTop:"5%"}}>
                                <Button htmlType={"button"} icon={"caret-right"} size={"large"} type={"primary"} onClick={this.play.bind(this,music)}>播放</Button>
                                {this.state.loved ?
                                    <Button htmlType={"button"}  size={"large"} type={"primary"} style={{marginLeft:"2%"}}><Icon type={"heart"} theme={"filled"}></Icon>已收藏</Button> :
                                    <Button htmlType={"button"} onClick={this.clickLove}  size={"large"} type={"dashed"} style={{marginLeft:"2%"}}><Icon type={"heart"}></Icon>收藏</Button>
                                }
                            </Row>
                        </Card>
                    </Col>

                    <Col span={8} style={{height:"100%",maxHeight:"100%"}}>
                        {this.renderLyr(music.lyricSrc)}
                    </Col>
                </Row>
                <Row id={"comment"}>
                    <div >
                        <span style={{fontSize:"xx-large",fontWeight:"550"}}>评论</span>
                        {/*<span style={{marginLeft:"20px"}}>总共{}条评论</span>*/}
                    </div>
                    <div id={"line"}></div>
                </Row>
                <Row>
                    <Comments musicId={music.musicId}/>
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
                    {this.state.newLove ?
                        <NewLoveModalBody musicId={music.musicId} clickBack={this.clickBack.bind(this)} closeModal={this.handleCancel.bind(this)}/>
                        :<LoveModalBody newLove={this.state.newLove} clickNewLove={this.clickNewLove.bind(this)} closeModal={this.handleCancel.bind(this)} musicId={music.musicId}/>
                    }
                </Modal>
            </div>

        )
    }
}

export default Music;