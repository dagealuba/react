import React from "react";
import {Avatar, Col, Empty, List, Row, Tabs,} from "antd";
import {NavLink} from "react-router-dom";


class Result extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            hover:false
        }
    }


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
                        hideOnSinglePage:true
                    }}
                    renderItem={music => {
                        return (
                            <List.Item onClick={this.handleClick} onMouseOver={this.handelMouseEnter} onMouseOut={this.handelMouseLeave} className={this.state.hover ? "hover" : null} id={music.musicId}>
                                <List.Item.Meta
                                    title={<NavLink to={"/home/music/"+music.musicId} style={{fontSize:"x-large",marginTop:"3px"}}>{music.musicName}</NavLink>}
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
                                    avatar={<img src={music.picSrc} style={{height:"100%",maxHeight:"12vh"}}/>}
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

    handelTabClick = (e) => {
        this.props.changeType(e);
    };

    handelMouseEnter = (e) =>{
        let node = e.target;

        while (!node.classList.contains("ant-list-item")){
            node = node.parentNode;
        }

        node.classList.add("hover");
    };

    handelMouseLeave = (e) => {
        let node = e.target;

        while (!node.classList.contains("ant-list-item")){
            node = node.parentNode;
        }

        node.classList.remove("hover");
    };

    handleClick = (e) => {
        let node = e.target;

        if (node.tagName !== "A"){
            while (!node.classList.contains("ant-list-item")){
                node = node.parentNode;
            }

            this.props.history.push({pathname:"/home/music/"+node.id});
        }
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
                            {this.renderList(this.props.result)}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"歌手"} key={"歌手"}>
                            {this.renderList(this.props.result)}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"专辑"} key={"专辑"}>
                            {this.renderList(this.props.result)}
                        </Tabs.TabPane>
                    </Tabs>
                </Row>
            </div>
        )
    }
}

export default Result;