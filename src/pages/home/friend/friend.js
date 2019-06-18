import React from "react";
import cookies from "react-cookies";
import {Col, Row} from "antd";
import FriendMessage from "./friendMessage";
import FriendList from "./friendList";

class Friend extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            friends:[],
            friendId:null,
        }
    }

    componentDidMount() {
        fetch(`${global.music.url}GetUserFriendsServlet?userId=${cookies.load("userId")}`,{
            method:"get",
        }).then(res => res.json()).then(data =>{
            this.setState({
                friends:[...data],
            });

            console.log(data);
            if (data.length > 0){
                this.toFriendPage(data[0].userId);
            }
        })
    }

    reloadFriends = () =>{
        fetch(`${global.music.url}GetUserFriendsServlet?userId=${cookies.load("userId")}`,{
            method:"get",
        }).then(res => res.json()).then(data =>{
            this.setState({
                friends:[...data],
            });
        });
    };

    deleteFriend = (id) => {
        fetch(global.music.url+"DeleteFriendServlet",{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`friendId=${id}&userId=${cookies.load("userId")}`,
        }).then(res => res.text() ).then(data => {
            if (data==="true"){
                this.reloadFriends();
            }
        });
    };

    toFriendPage = (id) => {
        // alert(id);
        this.setState({
            friendId:id,
        })
    };

    render() {
        return(
            <div style={{height:"100%"}}>
                <Row style={{height:"100%"}}>
                    <Col span={5}  style={{height:"100%",backgroundColor:"white",marginLeft:"5px"}}>
                        <FriendList toFriendPage={this.toFriendPage.bind(this)} deleteFriend={this.deleteFriend.bind(this)} friends={this.state.friends}/>
                    </Col>
                    <Col span={18}>
                        <FriendMessage {...this.props} friendId={this.state.friendId}/>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default Friend;
