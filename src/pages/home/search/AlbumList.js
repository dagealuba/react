import React from "react";
import {Col, Collapse, Empty, Icon, List, Row, Tooltip} from "antd";
import {NavLink} from "react-router-dom";


const  Panel = Collapse.Panel;
const  Item = List.Item;

class AlbumList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            result:[],
            loved:[],
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            result:[...nextProps.result],
        });
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

    render() {
        if (this.props.result.length===0){
            return (
                <Empty
                    style={{height:"100%"}}
                    description={(
                        <span>没有找到{this.props.type}<strong>{this.props.str}</strong>相关信息</span>
                    )}
                />
            )
        }
        return (
            <div>
                <List
                    dataSource={this.props.result}
                    renderItem={album => {
                        return (
                            <List.Item>
                                <Collapse style={{width:"100%"}} defaultActiveKey={this.props.result[0].albumId}>
                                    <Panel key={album.albumId} header={<Row><Col span={12}>{album.albumName}</Col><Col span={8}><span>歌手:</span>{album.singer}</Col></Row>}>
                                        <List dataSource={album.musics} renderItem={music=>{
                                            const actions = [
                                                <Tooltip title={"播放"}><Icon onClick={this.props.playMusic.bind(this,music)} style={{marginLeft: "5px", fontSize: "large"}} type={"caret-right"}/></Tooltip>,
                                                <Tooltip title={"添加到稍后播放"}><Icon onClick={this.props.addToPlayList.bind(this,music.musicId)} style={{marginLeft: "5px", fontSize: "large"}} type={"plus"}/></Tooltip>,
                                            ];
                                            return(
                                                <Item actions={actions} onClick={this.handleClick} id={music.musicId}>
                                                    <Item.Meta
                                                        title={<span><NavLink to={"/home/music/"+music.musicId} style={{fontSize:"x-large",marginTop:"3px"}}>{music.musicName}</NavLink></span>}
                                                        description={
                                                            <Row style={{bottom:"5px",width:"100%",marginTop:"10px"}}>
                                                                <Col span={6}>
                                                                    <span style={{fontSize:"large"}}>歌手: <NavLink to={"/home/search/"+music.singer.replace("/","&")+"/歌手"}>{music.singer}</NavLink></span>
                                                                </Col>
                                                                <Col span={12} offset={6}>
                                                                    <span style={{fontSize:"large"}}>专辑: <NavLink to={"/home/search/"+music.album+"/专辑"}>{music.album}</NavLink></span>
                                                                </Col>
                                                            </Row>
                                                        }
                                                        avatar={<img alt={"404"} src={music.picSrc} style={{height:"100%",maxHeight:"12vh"}}/>}
                                                    >

                                                    </Item.Meta>
                                                </Item>
                                            )
                                        }}/>
                                    </Panel>
                                </Collapse>
                            </List.Item>
                        )
                    }}
                    pagination={{
                        pageSize:5
                    }}
                />
            </div>
        )

    }

}

export default AlbumList;