import React from "react";
import {Button, Col, Input, Row, message} from "antd";
import cookies from "react-cookies";

class NewLoveModalBody extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            disabled:true,
        }
    }

    checkLoveName = (e) => {
        const value = e.target.value;

        fetch(`${global.music.url}CheckLoveNameServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`loveName=${value}&userId=${cookies.load("userId")}`
        }).then(res => res.text()).then(data => {
            if (data === "false"){
                message.error("收藏夹已存在");
                this.setState({
                    disabled:true,
                })
            }
            else this.setState({
                disabled:false,
            })
        })
    };

    handleClick = () => {
        const loveName = document.getElementById("newLove").value;
        const musicId = this.props.musicId;

        fetch(`${global.music.url}AddNewLoveServlet`,{
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:`loveName=${loveName}&musicId=${musicId}&userId=${cookies.load("userId")}`,
        }).then(res=>res.text()).then(data =>{
            if (data === "true"){
                this.props.closeModal();
            }
            else {
                message.error("添加出错")
            }
        })
    };

    render() {
        return(
            <div style={{marginTop:"20px",marginBottom:"10px"}}>
                <Row>
                    <Col span={12} offset={5}>
                        <span>新收藏夹：</span>
                        <Input id={"newLove"} title={"新收藏夹"} style={{width:"73%"}} onChange={this.checkLoveName}/>
                    </Col>
                </Row>
                <Row>
                    <Button htmlType={"button"} disabled={this.state.disabled} type={"primary"} style={{
                        float:"right",
                        marginRight:"20px"
                    }} onClick={this.handleClick}>确定</Button>
                </Row>
            </div>
        )
    }
}


export default NewLoveModalBody;