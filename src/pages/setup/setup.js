import React from "react";
import {Icon, Layout, Menu} from "antd";

import "../css/setup.css";
import UserSetup from "./userSetup";
import MusicUpload from "./musicUpload";

const { Sider, Content } = Layout;

class Setup extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            page:"user"
        }
    }

    handelMenuClick = (page) => {
        this.setState({
            page:page
        })
    }


    render() {


        return (
            <Layout style={{height:"100%"}}>
                <Sider style={{width:"20%",height:"100%",background:"rgba(0, 21, 41, 0)"}}>
                    <Menu openKeys={["music_setup"]} defaultSelectedKeys={["user_setup"]} mode="inline">
                        <Menu.Item key={"user_setup"} onClick={this.handelMenuClick.bind(this,"user")}>
                            <Icon type={"user"}/>用户设置
                        </Menu.Item>
                        <Menu.SubMenu key={"music_setup"} title={<span><Icon type={"setting"}/><span>其他</span></span>}>
                            <Menu.Item key={"upload"} onClick={this.handelMenuClick.bind(this,"upload")}><Icon type={"upload"}/>上传音乐</Menu.Item>
                            <Menu.Item key={"update"} onClick={this.handelMenuClick.bind(this,"update")}><Icon type={"edit"}/>修改音乐</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Sider>

                <Content className={"content"}>
                    {this.state.page === "user" ? <UserSetup/> : this.state.page === "upload" ? <MusicUpload/> : <div>nmsl</div>}
                </Content>
            </Layout>
        )
    }
}

export default Setup;