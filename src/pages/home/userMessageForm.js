import React from "react";
import {AutoComplete, Button, Form, Input, message} from "antd";
import cookie from "react-cookies"

const AutoCompleteOption = AutoComplete.Option;


class userMessageForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            userName: "",
            userEmail: "",
            autoComplete:[],
            loading:false
        }
    }

    componentDidMount() {
        fetch(global.music.url+"FindUserServlet?userId="+cookie.load("userId"),{
            method:"GET",
            mode:"cors"
        }).then(res => res.json() ).then(data => {
            this.setState({
                userName: data.userName,
                userEmail:data.userEmail
            })
        })
    }

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
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields( (err,values) => {
            if (!err) {
                this.setState({
                    loading:true
                })

                let body = "userName="+values.userName+"&userEmail="+values.userEmail;

                fetch(global.music.url+"UpdateUserMessageServlet",{
                    method:"POST",
                    mode:"cors",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body:body
                }).then(res => res.text() ).then(data => {
                    if (data === "true"){
                        this.setState({
                            loading:true
                        })
                        this.props.onClick();
                    }
                    else if (data === "wrong"){
                        this.setState({
                            loading:true
                        })
                        message.error("更新失败，请稍候再试!")
                    }
                })
            }
        })
    }

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

        const mailAutoCompelete = this.state.autoComplete.map(mail => (
            <AutoCompleteOption key={mail}>{mail}</AutoCompleteOption>
        ));

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label={"用户名"}>
                    {getFieldDecorator("userName",{
                        rules:[{
                            required:true,message:"User name is required!"
                        },],
                        initialValue:this.state.userName
                    })(
                        <Input/>
                    )
                    }
                </Form.Item>

                <Form.Item label={"邮箱"}>
                    {getFieldDecorator("userEmail",{
                        rules:[{
                            required:true,message: "User email is required"
                    },{
                            type:"email",message: "Email 格式错误！"
                        }],
                        initialValue:this.state.userEmail
                    })(
                        <AutoComplete
                            dataSource={mailAutoCompelete}
                            onChange={this.handleMailChange}
                        >
                            <Input/>
                        </AutoComplete>
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type={"primary"} size={"large"} htmlType={"submit"} loading={this.state.loading} style={{float:"right"}}>
                        确定
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

const UserMessageForm = Form.create({name:"userMessage"})(userMessageForm);

export default UserMessageForm