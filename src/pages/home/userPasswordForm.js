import React from "react";
import {Form} from "antd";


class userPasswordForm extends React.Component{


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

        return(
            <Form {...formItemLayout}>

            </Form>
        )
    }
}