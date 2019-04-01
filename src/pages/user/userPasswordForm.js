import React from "react";
import {Button, Form, Input, message} from "antd";

import cookie from "react-cookies"


class userPasswordForm extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loading:false,
            confirm:false,
            check:false
        }
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({
            confirm:this.state.confirm || !!value
        });
    };

    handlePasswordBlur = (e) => {
        const value = e.target.value;
        this.setState({
            check:this.state.check || !!value
        })
    };

    /*
    * fetch "GET" to UpdateUserMessageServlet
    * success return success
    * else return wrong
    * */
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if ( !err ){
                this.setState({
                    loading:true
                });

                //修改密码
                fetch(global.music.url+"UpdateUserMessageServlet?userId="+cookie.load("userId")+"&newPassword="+values.newPassword,{
                    method:"GET",
                    mode:"cors",
                }).then(res => res.text() ).then(data => {
                    this.setState({
                        loading:false
                    });
                    if (data === "success") {
                        this.props.onClick();
                    }
                    else {
                        message.error("请求出错，请稍后再试")
                    }
                })
            }
        })
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;

        if (value && value !== form.getFieldValue("newPassword")) {
            callback("两次输入的密码不一致!");
        }
        else {
            callback();
        }
    };

    validatorToNextPassword = (rule, value, callback) => {
        const form = this.props.form;

        if (value && this.state.confirm){
            form.validateFields(['confirmNewPassword'],{force:true});
        }

        callback();
    };

    checkPassword = (rule, value, callback) => {
        // const form = this.props.form;

        // if (value && this.state.check){
        //     form.validateFields(['confirmNewPassword'],{force:true});
        // }

        fetch(global.music.url+"LoginServlet",{
            method:"POST",
            mode:"cors",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:"userId="+cookie.load("userId")+"&userPassword="+value
        }).then(res => res.text() ).then(data => {
            if (data === "login_success"){
                callback()
            }
            else {
                callback("密码错误!")
            }
        })
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 6,
                    offset: 18,
                },
            },

        };

        const { getFieldDecorator } = this.props.form;

        return(
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Input.Password style={{display:"none"}}/>
                <Form.Item label={"原密码"}>
                    {getFieldDecorator("userPassword",{
                        rules:[
                            {required:true,message:"原密码不能为空!"},
                            {validator:this.checkPassword}
                        ],
                        validateFirst:"true",
                        validateTrigger:"onBlur"
                    })(
                        <Input.Password onBlur={this.handlePasswordBlur}/>
                    )}
                </Form.Item>

                <Form.Item label={"新密码"}>
                    {getFieldDecorator("newPassword",{
                        rules: [
                            {required: true,message:"新密码不能为空!"},
                            {validator:this.validatorToNextPassword},
                            {max:12,message:"密码长度应为6～12位"},
                            {min:6,message:"密码长度应为6～12位"}
                        ]
                    })(
                        <Input.Password/>
                    )}
                </Form.Item>

                <Form.Item label={"确认密码"}>
                    {getFieldDecorator("confirmNewPassword",{
                        rules: [
                            {required:true,message:"请确认密码!"},
                            {validator:this.compareToFirstPassword}
                        ]
                    })(
                        <Input.Password onBlur={this.handleConfirmBlur}/>
                    )}
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button htmlType={"submit"} type={"primary"} size={"large"} loading={this.state.loading} style={{float:"right"}}>
                        确认
                    </Button>
                </Form.Item>

            </Form>
        )
    }
}

const UserPasswordForm = Form.create({name:"changePassword"})(userPasswordForm);

export default UserPasswordForm;