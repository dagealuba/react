import React from "react";
import {Avatar, Button, Col, Comment, Empty, Icon, Input, List, Modal, Row, Spin, Tooltip} from "antd";
import cookie from "react-cookies";
import moment from "moment";
import "moment/locale/zh-cn";
import {NavLink} from "react-router-dom";


class Comments extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            user:{},
            comments:[],
            can_click:false,
            loading:false,
            visible:false,
            confirmLoading:false,
            replyTo:{},
        }
    }

    componentDidMount() {
        const userId = cookie.load("userId")

        fetch(global.music.url+"FindUserServlet?userId="+userId,{
            method:"GET"
        }).then(res => res.json()).then(data => {
            this.setState({
                user:{...data}
            })
        });

    }

    componentWillReceiveProps(nextProps, nextContext) {
        // alert(this.props.musicId);
        fetch(global.music.url+"CommentServlet?musicId="+nextProps.musicId,{
            method:"GET"
        }).then(res => res.json()).then(data => {
            // console.log(data);
            data.forEach(c => {
                this.checkLike(c.comment.commentId);
            });

            this.setState({
                comments:[...data]
            });
        });
    }

    reloadComments = () => {
        fetch(global.music.url+"CommentServlet?musicId="+this.props.musicId,{
            method:"GET"
        }).then(res => res.json()).then(data => {
            // console.log(data);
            data.forEach(c => {
                this.checkLike(c.comment.commentId);
            });
            this.setState({
                loading:false,
                comments:[...data]
            });
        })
    };

    handleChange = (e) => {
        const value = e.target.value;

        // console.log(value);
        if (value === "" || value === undefined){
            this.setState({
                can_click:false
            });
        }
        else {
            this.setState({
                can_click:true
            });

        }

    };

    handleSearch = () => {
        const input = document.getElementById("comments-textarea");

        this.setState({
            loading:true,
        });

        // let comment = new FormData();
        // comment.append("musicId",this.props.musicId);
        // comment.append("comment",input.value);

        const comment = `musicId=${this.props.musicId}&comment=${input.value}&commentToComment=null&userId=${cookie.load("userId")}`;

        fetch(global.music.url+"NewCommentServlet",{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:comment,
        }).then(res => res.text()).then(data => {
            this.setState({
                loading:false,
            });
            if (data === "true"){
                input.value = "";
                this.reloadComments();
            }
        })
    };

    handleLike = (commentId) => {
        fetch(`${global.music.url}LikeCommentServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`commentId=${commentId}&userId=${cookie.load("userId")}`
        }).then(res => res.text()).then(data => {
            if (data === "true") {
                this.reloadComments();
            }
        })
    };

    handleDisLike = (commentId) => {
        fetch(`${global.music.url}DislikeCommentServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`commentId=${commentId}&userId=${cookie.load("userId")}`
        }).then(res => res.text()).then(data => {
            if (data === "true") {
                this.reloadComments();
            }
        })
    };

    //是否点赞
    checkLike = (commentId) => {
        fetch(`${global.music.url}LikeCommentServlet?commentId=${commentId}&userId=${cookie.load("userId")}`,{
            method:"GET",
        }).then(res => res.text()).then(data => {
            const comments = [...this.state.comments];
            console.log(comments);
            // eslint-disable-next-line
            comments.map(c => {
                if (c.comment.commentId === commentId){
                    Object.assign(c.comment,{"liked":data});
                }
            });

            this.setState({
                comments:comments
            })
        })

    };

    handleOk = () => {
        this.setState({
            confirmLoading:true,
        });

        const input = document.getElementById("reply");

        const comment = `musicId=${this.props.musicId}&comment=${input.value}&commentToComment=${this.state.replyTo.comment.commentId}&userId=${cookie.load("userId")}`;


        fetch(global.music.url+"NewCommentServlet",{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:comment,
        }).then(res => res.text()).then(data => {
            this.setState({
                confirmLoading:false,
                visible:false,
            });
            if (data === "true"){
                input.value = "";
                this.reloadComments();
            }
        })
    };

    handleCancel = () => {
        this.setState({
            visible:false
        })
    };

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <div className={"comments"}>
                    <Row>
                        <Col span={4}>
                            <Avatar src={this.state.user.avatarSrc} size={"large"}/>
                        </Col>
                        <Col span={20}>
                            <Row>
                                <Input.TextArea
                                    id={"comments-textarea"}
                                    className={"comments-textarea"}
                                    autosize={{
                                        minRows:3,
                                        maxRows:3
                                    }}
                                    placeholder={"说点什么吧"}
                                    onChange={this.handleChange}
                                />
                            </Row>
                            <Row style={{marginTop:"5px"}}>
                                <Button className={"comments-btn"} htmlType={"button"} type={"primary"} disabled={!this.state.can_click} onClick={this.handleSearch}>评论</Button>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginTop:"2%"}}>
                        <List
                            size={"middle"}
                            pagination={{
                                pageSize:10
                            }}
                            locale={{
                                emptyText:<Empty description={"没有评论"}></Empty>
                            }}
                            dataSource={this.state.comments}
                            renderItem={commentwa => {

                                const actions = [
                                    <Tooltip title={"like"}>
                                        <Icon
                                            type={"like"}
                                            theme={commentwa.comment.liked === "true" ? "twoTone" : null}
                                            onClick={commentwa.comment.liked === "true" ? this.handleDisLike.bind(this,commentwa.comment.commentId) : this.handleLike.bind(this,commentwa.comment.commentId)}
                                        >
                                        </Icon>
                                        <span style={{marginLeft:"3px"}}>{commentwa.comment.likeNumber}</span>
                                    </Tooltip>,
                                    <Tooltip title={"Reply"}><Icon type={"edit"} onClick={() => {this.setState({visible:true,replyTo:{...commentwa}})}}/></Tooltip>
                                ];
                                let commentParent = "";
                                this.state.comments.forEach(c => {
                                    if (c.comment.commentId === commentwa.comment.commentToComment){
                                        commentParent = c;
                                    }
                                });
                                const comment = (
                                    <Comment
                                        actions={actions}
                                        avatar={<NavLink to={`/home/user/${commentwa.user.userId}`}><img alt={"404"} src={commentwa.user.avatarSrc}/></NavLink>}
                                        author={<NavLink to={`/home/user/${commentwa.user.userId}`}>{commentwa.user.userName}</NavLink>}
                                        content={
                                            commentwa.comment.commentToComment === "null" ? commentwa.comment.comment : (
                                                <div>
                                                    <div className={"commentParent"}><span>{commentParent.user.userName}:</span>{commentParent.comment.comment}</div>
                                                    <p>{commentwa.comment.comment}</p>
                                                </div>
                                            )
                                        }
                                        datetime={moment(commentwa.comment.commentTime).fromNow()}
                                    >
                                    </Comment>
                                );

                                console.log(moment(commentwa.comment.commentTime).format("YYYY-MM-DD HH:mm:ss"));
                                return (
                                    <li className={"comment"} key={commentwa.comment.commentId}>
                                        {comment}
                                    </li>
                                )
                            }}/>
                    </Row>
                </div>
                
                <Modal
                    className={"reply"}
                    title={`回复`}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText={"取消"}
                    okText={"确定"}
                >
                    <Input.TextArea rows={3} id={"reply"}/>
                </Modal>

            </Spin>
        );
    }
}


export default Comments;