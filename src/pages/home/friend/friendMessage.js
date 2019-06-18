import React from "react";
import {Avatar, Col, Row} from "antd";
import UserLove from "../../user/UserLove";

class FriendMessage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            friend:{},
            loves:[],
        }
    }


    getFriendMessage = (friendId) => {
        fetch(`${global.music.url}FindUserServlet?userId=${friendId}`,{
            method:"get",
        }).then(res=>res.json()).then(data => {
            this.setState({
                friend:{...data},
            })
        })

        fetch(`${global.music.url}GetUserLoveServlet?userId=${friendId}`,{
            method:"GET",
        }).then(res => res.json()).then(data => {
            // console.log(data);

            this.setState({
                loves:[...data],
            })
        })
    };



    componentDidMount() {
        this.getFriendMessage(this.props.friendId);
    }

    componentWillReceiveProps(nextProps) {
        this.getFriendMessage(nextProps.friendId)
    }

    render() {
        const user = {...this.state.friend};
        return (
            <div style={{paddingLeft:"24px"}} className={"friend-message"}>
                <Row>
                    <Col span={4}>
                        <Avatar src={user.avatarSrc}/>
                    </Col>
                    <Col span={18} style={{backgroundColor:"D2D2D2"}}>
                        <p className={"title"}><strong>{user.userName}</strong></p>
                        <p className={"description"}>{user.userEmail}</p>
                    </Col>
                </Row>
                <Row>
                    <UserLove userId={user.userId} {...this.props}/>
                </Row>
            </div>
        )
    }
}

export default FriendMessage;