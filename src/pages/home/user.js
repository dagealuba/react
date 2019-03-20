import React from "react";
import {Card, Col, Icon, Modal, Row, Tooltip} from "antd";

import "../../router/config";
import "../css/user.css";
import UserMessageForm from "./userMessageForm";
import UserPasswordForm from "./userPasswordForm";
import UserAvatar from "./userAvatar";
import cookie from "react-cookies";

const  { Meta } = Card;

class User extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            avatarSrc:"",
            userId: "",
            userEmail:"",
            userName:"",
            loading:true,
            visible:false,
            confirmLoading:false,
            modalContent:"userMessage"//头像和其他信息
        }
    }

    componentDidMount(){
        fetch(global.music.url+"FindUserServlet?userId="+this.props.match.params.userId,{
            method:"get",
            mode:"cors",
        }).then( res => res.json() ).then(data => {
            this.setState({
                // avatarSrc:data.avatarSrc,
                userId:data.userId,
                userEmail:data.userEmail,
                userName:data.userName,
                avatarSrc:data.avatarSrc,
                loading:!this.state.loading
            })
            // alert(data.avatarSrc);
        })
    }

    changeAvatar = () => {
        this.setState({
            modalContent: "avatar"
        });
        this.showModal();
    };

    changeUserMessage = () => {
        this.setState({
            modalContent:"userMessage"
        });
        this.showModal();
    };

    changeUserPassword = () => {
        this.setState({
            modalContent:"userPassword"
        });
        this.showModal()
    };

    showModal = () =>{
        this.setState({
            visible:true,
        })
    };

    handleCancel = () => {
        this.setState({
            visible:false,
        })
    };

    handleOk = () => {
        this.setState({
            visible:false
        })
    };

    aftarChangeAvatar = () => {
        window.location.reload();
    }

    render() {
        const userMessage = <UserMessageForm onClick={this.handleOk.bind(this)}/>;
        const avatar = <UserAvatar handleCancle={this.handleCancel.bind(this)} />
        const changePassword = <UserPasswordForm onClick={this.handleOk.bind(this)}/>;

        const actions = [
            <Tooltip placement={"topLeft"} arrowPointAtCenter={"true"} title={<div><strong><p style={{fontSize:"20px"}}>修改个人信息</p></strong></div>}>
                <Icon type={"edit"} onClick={this.changeUserMessage}/>
            </Tooltip>,
            <Tooltip placement={"topLeft"} arrowPointAtCenter={"true"} title={<div><strong><p style={{fontSize:"20px"}}>修改密码</p></strong></div>}>
                <Icon type={"form"} onClick={this.changeUserPassword}/>
            </Tooltip>
        ];

        return(
            <div style={{height:"100%",minHeight:"500px"}}>
                <Row style={{height:"100%"}}>
                    <Col span={8} style={{height:"100%"}}>
                        <Card
                            style={{height:"100%"}}
                            loading={this.state.loading}
                            cover={
                                <Tooltip placement={"right"} title={<strong><p style={{fontSize:"20px"}}>点击更换头像</p></strong>}>
                                    <img className={"avatar"} alt={"avatar"} src={this.state.avatarSrc} onClick={this.changeAvatar}/>
                                </Tooltip>
                            }
                            hoverable={"true"}
                            actions={this.state.userId === this.props.match.params.userId ? actions : ""}
                        >
                            <Meta
                                title={this.state.userName}
                                description={this.state.userEmail}
                            />

                        </Card>
                    </Col>
                </Row>

                <Modal
                    title={this.state.modalContent === "userMessage" ? "修改用户信息" : this.state.modalContent === "avatar" ? "更换头像" : "修改密码"}
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    destroyOnClose={"true"}
                    footer={null}
                    afterClose={this.state.modalContent === "avatar" ? this.aftarChangeAvatar : null}
                >
                    {this.state.modalContent === "userMessage" ? userMessage : this.state.modalContent === "avatar" ? avatar : changePassword}
                </Modal>
            </div>
        )
    }
}

export default User;