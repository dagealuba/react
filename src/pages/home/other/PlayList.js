import React from "react";
import {Col, Empty, Icon, List, Row, Tooltip} from "antd";

class PlayList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            playList:[...this.props.playList]
        }
    }

    delete = (musicId,e) => {
        this.props.deletePlayList(musicId);
    };

    render() {
        if (this.props.playList.length === 0){
            return (
                <Empty
                    description={(
                        <span>播放列表没有东西</span>
                    )}
                />
            )
        }

        return (
            <div>
                <List
                    dataSource={this.props.playList}
                    renderItem={music => {
                        const actions = [
                            <Tooltip title={"删除"}><Icon onClick={this.delete.bind(this,music.musicId)} style={{marginLeft: "5px", fontSize: "large",marginTop:"8px"}} type={"close"}/></Tooltip>,
                        ];
                        return (
                            <List.Item
                                actions={actions}
                                className={this.state.hover ? "hover" : null}
                                id={music.musicId}
                            >
                                <List.Item.Meta
                                    description={
                                        <Row style={{bottom:"5px",width:"100%",marginTop:"10px"}}>
                                            <Col span={12} >
                                                {this.props.playingMusic.musicId === music.musicId ? <Icon type="caret-right" theme="filled" style={{color:"red"}}/>:null}
                                                <span onClick={() => {this.props.getMusicMessage(music)}} style={{fontSize:"large",color:"black"}}>{music.musicName}</span>
                                            </Col>
                                            <Col span={12}>
                                                <span style={{fontSize:"large"}}>{music.singer}</span>
                                            </Col>

                                        </Row>
                                    }
                                />
                            </List.Item>
                        )
                    }}/>
            </div>
        );
    }

}

export default PlayList;