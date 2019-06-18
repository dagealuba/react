import {AutoComplete, message, Button, Col, Form, Icon, Input, Layout, Row, Typography} from "antd";
import {Component} from "react";
import React from "react";

import "../css/login_regist.css"
import {Link} from "react-router-dom";
import "../router/config"

const AutoCompleteOption = AutoComplete.Option;
const { Title } = Typography;
const { Content } = Layout;

class RegisterForm extends Component{
    state = {
        confirm:false,
        autoComplete:[],
        idIsUsed:false,
        emailIsUsed:false,
        checking:false,
        registing:false
    };


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values) => {
            if (!err){
                // console.log('Received values of form: ',values)
                this.setState({
                    registing:true
                });

                //提交注册表单

                //表单信息
                let body = "userName="+values.userName+"&userPassword="+values.password+"&userEmail="+values.email;
                // console.log(body);
                fetch(global.music.url+"RegistServlet",{
                    method:"POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body:body,
                }).then(res => res.text() ).then( data => {
                    if (!!data){
                        this.setState({
                            registing:false
                        })
                    }

                    message.config({
                        top:200,
                        duration:2,
                        maxCount:1
                    });
                    if (data === "id-error"){
                        message.error("This nick name has been used.")
                    }
                    else if (data === "email_wrong") {
                        message.error("该邮箱已注册，请更换邮箱后重试")
                    }
                    else {
                        this.props.Login("true",data);
                        this.props.history.push("/home")
                    }
                })
            }
        })
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({
            confirm:this.state.confirm || !!value
        });
    };

    //第二个密码框的校验函数
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    //第一个密码框，值发生变化重新调用第二个密码框的校验函数
    validatorToNextPassword = (rule,value,callback) => {
        const form = this.props.form;

        if (value && this.state.confirm){
            form.validateFields(['confirm'],{force:true});
        }

        callback();
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
        const { autoComplete } = this.state;
        const mailAutoCompelete = autoComplete.map(mail => (
            <AutoCompleteOption key={mail}>{mail}</AutoCompleteOption>
        ));

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

                                <Form {...formItemLayout} onSubmit={this.handleSubmit} className={'register-form'} style={{marginRight:"10%"}}>
                                    <Title style={{textAlign:"center",marginLeft:"21%"}}>注册</Title>
                                    <Form.Item label={'用户名'}>
                                        {getFieldDecorator('userName',{
                                            rules:[
                                                {required:true,message:'place enter your nick name'},
                                                {max:10,message:"UserId cannot longer than 10 words"}
                                            ],
                                        })(
                                            <Input prefix={<Icon type={'user'} style={{color:'rgba(0,0,0,.25'}}/>} placeholder={"用户名"} />
                                        )}
                                    </Form.Item>
                                    <Form.Item label={'密码'}>
                                        {getFieldDecorator('password',{
                                            rules: [
                                                {required: true,message: 'place enter your password'},
                                                {max:12,message:"UserId cannot longer than 12 words"},
                                                {min:6,message:"Your password should more than 6 words"},
                                                {validator:this.validatorToNextPassword}
                                            ],
                                        })(
                                            <Input.Password prefix={<Icon type={'lock'} style={{color:'rgba(0,0,0,.25'}}/>} placeholder={"请输入密码"} type={'password'}/>
                                        )}
                                    </Form.Item>
                                    <Form.Item label={'确认密码'}>
                                        {getFieldDecorator('confirm',{
                                            rules:[
                                                {required:true,message:'请再次确认密码'},
                                                {validator:this.compareToFirstPassword}
                                            ]
                                        })(
                                            <Input.Password prefix={<Icon type={'lock'} style={{color:'rgba(0,0,0,.25'}}/>} placeholder={'确认密码'}
                                                   onBlur={this.handleConfirmBlur} type={"password"}
                                            />
                                        )
                                        }
                                    </Form.Item>
                                    <Form.Item label={'邮箱'}>
                                        {getFieldDecorator('email',{
                                            rules:[
                                                {required:true,message:'placec enter your email'},
                                                {type:"email",message:"E-mail address has something wrong"}
                                            ]
                                        })(
                                            <AutoComplete
                                                dataSource={mailAutoCompelete}
                                                onChange={this.handleMailChange}
                                            >
                                                <Input prefix={<Icon type={'mail'} style={{color:'rgba(0,0,0,.25'}}/>} placeholder={'输入您的邮箱'}/>
                                            </AutoComplete>
                                        )
                                        }
                                    </Form.Item>
                                    <Form.Item {...tailFormItemLayout}>
                                        <Button loading={this.state.registing} htmlType={"submit"} type={"primary"} className={"login-form-button"}>注册</Button>
                                        <span>已有账号，点此</span><Link to={"/"}>登陆</Link>
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

const Register = Form.create({name:'regist'})(RegisterForm)

export default Register;