import React from "react";
import {Button, Icon, Modal, Upload, message} from "antd";
import cookie from "react-cookies";

import "../css/upload.css"

class UserAvatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading:false,
            previewVisible: false,
            previewImage: '',
            fileList:[],
            file:""
        };
    };


    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        const size = fileList[0].size/1024/1024 < 2;
        const type = fileList[0].type === "image/jpeg" || fileList[0].type === "image/png";

        if (size && type ) {
            this.setState({fileList});
        }
        else if ( !size ){
            message.error("大小不超过2M");
            this.setState({fileList:[]});
        }
        else if ( !type ){
            message.error("只支持jpg及png格式");
            this.setState({fileList:[]});
        }
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formdata = new FormData();

        formdata.append("userId",cookie.load("userId"));
        formdata.append("file",fileList[0].originFileObj);


        this.setState({
            loading: true
        });


        console.log(formdata.get("userId"));

        fetch(global.music.url+"UpdateUserAvatarServlet",{
            method:"POST",
            mode:"cors",
            // headers:{
            //     "Content-Type": "multipart/form-data"
            // },
            body:formdata,

        }).then(res => res.text() ).then(data => {
            if (data === "true"){
                this.setState({
                    fileList:[],
                    loading:false
                });
                this.props.handleCancle();
            }
            else {
                this.setState({
                    fileList:[],
                    loading:false
                });
                message.error("上传失败，请时哦呵后再试");
            }
        })

    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        // const { imagUrl } = this.state;

        const { fileList } = this.state;

        const props = {
            beforeUpload: (file) => {

                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onload = e => {
                    file.thumbUrl = e.target.result
                };

                this.setState({
                    fileList:[file],
                });

                return false;
            },
            fileList
        }

        return (
            <div style={{height:"450px",width:"450px"}}>
                <Upload
                    name={"avatar"}
                    action={global.music.url+"UploadAvatarServlet"}
                    listType="picture-card"
                    onPreview={this.handlePreview}
                    {...props}
                    onChange={this.handleChange}
                    className={"uploader-avatar"}
                >
                    {this.state.fileList.length>=1 ? null : uploadButton}
                </Upload>
                <Button htmlType={"button"} type={"primary"} style={{float:"right",marginTop:"20px"}} disabled={this.state.fileList.length === 0} loading={this.state.loading} onClick={this.handleUpload}>{this.state.loading ? null : <Icon type={"upload"}/>}上传</Button>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}

export default UserAvatar;