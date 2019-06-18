import {Button, Checkbox, Col, Form, Icon, Input, Layout, Row, Typography, message, AutoComplete} from "antd";
import {Component} from "react";
import React from "react";
import "../css/login_regist.css"
import {Link} from "react-router-dom";
import "../router/config"


const AutoCompleteOption = AutoComplete.Option;
const { Title } = Typography;
const { Content } = Layout;
class LoginForm extends Component {
    constructor(props){
        super(props);

        this.state={
            login_ing:false,
            autoComplete:[],
        };

        this.idInput = React.createRef();
        this.passwordInput = React.createRef();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err,values) => {
            if (!err){
                this.setState({
                    login_ing:true
                });
                // console.log('Received values of form: ', values);
                fetch(global.music.url+"LoginServlet",{
                    method:"POST",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body:"userEmail="+values.userEmail+"&userPassword="+values.userPassword,
                    mode:"cors",
                }).then(res => res.text()).then(data => {
                    message.config({
                        top:250,
                        duration:1,
                        maxCount:1
                    });
                    if (data){
                        this.setState({
                            login_ing:false
                        })
                    }

                    if (data === "email_wrong"){
                        // console.log("id_error")
                        message.error("No such user");
                    }
                    else if (data === 'password_wrong'){
                        message.error("Wrong password! Please check your password");
                    }
                    else{
                        this.props.Login("login_success",data);
                        // alert(this.props.isLogin)
                        this.props.history.push("/home");
                    }
                })
            }
        })
    };

    handleMailChange = (value) => {
        let autocomplete;

        if (!value || value.indexOf('@') >= 0){
            autocomplete = [];
        }
        else {
            autocomplete = ["@qq.com","@163.com","@mails.ccnu.edu.cn"].map((domain) => {
                let res;
                res = value.toString()+domain.toString();
                return res;
            });
        }

        this.setState({
            autoComplete:autocomplete,
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

        const { autoComplete } = this.state;
        const mailAutoCompelete = autoComplete.map(mail => (
            <AutoCompleteOption key={mail}>{mail}</AutoCompleteOption>
        ));

        return (
            <Layout style={{height:"100%",background:"none"}}>
                <Content className={"index-page"}>
                    <Row className={"index-row"}>
                        <Col span={12} offset={6} className={"index-col"}>
                            <center>
                                <Form {...formItemLayout}  className={"login-form"} onSubmit={this.handleSubmit} style={{marginRight:"10%"}}>
                                    <Title style={{textAlign:"center",marginLeft:"21%"}}>登陆</Title>

                                    <Form.Item label={"邮箱："}>
                                        {getFieldDecorator('userEmail',{
                                            rules:[
                                                {required:true,message:'请输入邮箱!'},
                                                {max:10,message:"UserId cannot longer than 10 words"}
                                            ],
                                        })(
                                            <AutoComplete
                                                dataSource={mailAutoCompelete}
                                                onChange={this.handleMailChange}
                                            >
                                                <Input ref={this.idInput} prefix={<Icon type={"mail"} style={{color:'rgba(0,0,0,.25'}}/>} placeholder={"邮箱地址"}/>
                                            </AutoComplete>
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