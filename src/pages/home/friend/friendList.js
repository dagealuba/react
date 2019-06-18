import React from "react";
import {Avatar, Collapse, Empty, Icon, List, Tooltip} from "antd";

const  Panel = Collapse.Panel;
const  Item = List.Item;

class FriendList extends React.Component{

    render() {
        const { friends } = this.props;

        return (
            <Collapse defaultActiveKey={"friend-list"} className={"friends-list"}>
                <Panel key={"friend-list"} header={"好友"}>
                    {
                        friends.length>0 ?
                            <List
                                dataSource={friends}
                                renderItem={friend => {
                                    return (
                                        <Item
                                            actions={[<Tooltip title={"删除好友"}><Icon onClick={this.props.deleteFriend.bind(this,friend.userId)} style={{marginLeft: "5px", fontSize: "large"}} type={"close"}/></Tooltip>]}
                                        >
                                            <Item.Meta
                                                avatar={<Avatar src={friend.avatarSrc}/>}
                                                title={<h5 onClick={this.props.toFriendPage.bind(this,friend.userId)}>{friend.userName}</h5>}
                                                description={friend.userEmail}
                                            />
                                        </Item>
                                    )
                                }}/>:
                            <Empty
                                style={{height:"100%"}}
                                description={(
                                    <span>还没有关注任何人哦</span>
                                )}
                            />
                    }
                </Panel>
            </Collapse>
        )
    }
}

export default FriendList;