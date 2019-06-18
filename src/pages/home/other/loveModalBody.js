import React from "react";
import cookies from "react-cookies";
import {Avatar, Button, message, List,} from "antd";


class LoveModalBody extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loves:[],
        }
    }

    componentDidMount() {
        fetch(`${global.music.url}GetUserLoveNamesServlet?userId=${cookies.load("userId")}`,{
            method:"GET"
        }).then(res => res.json() ).then( data => {
            this.setState({
                loves:[...data]
            })
        })
    }

    handleClick = (loveName) => {
        fetch(`${global.music.url}AddLoveServlet`,{
            method:"POST",
            body:`loveName=${loveName}&userId=${cookies.load("userId")}&musicId=${this.props.musicId}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        }).then( res => res.text() ).then( data => {
            console.log(data);
            if (data === "true"){
                message.success("添加成功");
                this.props.closeModal();
            }
            else {
                message.error("已经在这个收藏夹中");
            }

        })
    };

    render() {
        return (
            <div>
                <div className={"love-modal-add"}>
                    <Button htmlType={"button"} block={true} icon={"plus-circle"} onClick={this.props.clickNewLove}>添加新收藏夹</Button>
                </div>
                <List
                    dataSource={this.state.loves}
                    renderItem={love => {
                        return (
                            <List.Item onClick={this.handleClick.bind(this,love.loveName)} className={"love-modal-list-item"}>
                                <List.Item.Meta
                                    avatar={<Avatar size={36} icon={"folder"}/>}
                                    title={love.loveName}
                                    description={`已收藏${love.musics.length}首歌曲`}
                                />
                            </List.Item>
                        )
                    }}
                />
            </div>
        );
    }
}

export default LoveModalBody;