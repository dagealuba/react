import {Button, Checkbox, Col, Form, Icon, Input, Layout, Row, Typography, message} from "antd";
import {Component} from "react";
import React from "react";
import "./css/login_regist.css"
import {Link} from "react-router-dom";
import "../router/config"


const { Title } = Typography;
const { Content } = Layout;
class LoginForm extends Component {
    constructor(props){
        super(props);

        this.state={
            login_ing:false,
        }

        this.idInput = React.createRef();
        this.passwordInput = React.createRef();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err,values) => {
            if (!err){
                this.setState({
                    login_ing:!this.state.login_ing
                })
                // console.log('Received values of form: ', values);
                fetch(global.music.url+"LoginServlet",{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body:"userId="+values.userId+"&userPassword="+values.userPassword,
                    mode:"cors",
                }).then(res => res.text()).then(data => {
                    message.config({
                        top:250,
                        maxCount:1
                    });
                    if (data){
                        this.setState({
                            login_ing:!this.state.login_ing
                        })
                    }
                    if (data === "login_success") {
                        this.props.Login(data,values.userId);
                        // alert(this.props.isLogin)
                        this.props.history.push("/home");
                    }
                    else if (data === "id_wrong"){
                        // console.log("id_error")
                        message.error("No such user");
                    }
                    else {
                        message.error("Wrong password! Please check your password");
                    }
                })
            }
        })
    };



    render() {
        const { getFieldDecorator } = this.props.form;
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 19,
                    offset: 5,
                },
            },

        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <Layout style={{height:"100%",background:"none"}}>
                <Content className={"index-page"}>
                    <Row className={"index-row"}>
                        <Col span={12} offset={6} className={"index-col"}>
                            <center>
                                <Form {...formItemLayout}  className={"login-form"} onSubmit={this.handleSubmit} style={{marginRight:"10%"}}>
                                    <Title style={{textAlign:"center",marginLeft:"21%"}}>登陆</Title>

                                    <Form.Item label={"用户名："}>
                                        {getFieldDecorator('userId',{
                                            rules:[
                                                {required:true,message:'请输入用户名!'},
                                                {max:10,message:"UserId cannot longer than 10 words"}
                                            ],
                                        })(
                                            <Input ref={this.idInput} prefix={<Icon type={"user"} style={{color:'rgba(0,0,0,.25'}}/>} placeholder={"用户名"}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label={'密码：'}>
                                        {getFieldDecorator('userPassword',{
                                            rules: [
                                                {required: true,message: '请输入密码！'},
                                                {max:12,message:"Password can not longer than 12 words",}
                                            ]
                                        })(
                                            <Input.Password ref={this.passwordInput} prefix={<Icon type={"lock"} style={{color:'rgba(0,0,0,.25'}}/>} placeholder={"密码"} type={"password"}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item {...tailFormItemLayout}>
                                        {getFieldDecorator('remember',{
                                            valuePropName:'checked',
                                            initialValue:true,
                                        })(
                                            <Checkbox>记住密码</Checkbox>
                                        )}
                                        <a href={"/"} className={"login-form-forgot"}>忘记密码</a>
                                        <Button loading={this.state.login_ing} type={"primary"} htmlType={"submit"} className={"login-form-button"}>登陆</Button>
                                        还没有账号?点此<Link to={"/register"}>注册</Link>
                                    </Form.Item>
                                </Form>
                            </center>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }
}


const Login = Form.create({name:'normal_login'})(LoginForm);

export default Login;