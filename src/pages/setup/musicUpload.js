import React from "react";
import {Button, Icon, message, Upload} from "antd";


const Dragger = Upload.Dragger;

class MusicUpload extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            loading:false,
            fileList:[],
            file:""
        }
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formdata = new FormData();

        this.setState({
            loading:true
        })
        console.log(fileList.length);
        let i = 0;
        fileList.forEach((file) => {
            formdata.append("files"+i,file);
            i++;
        });

        fetch(global.music.url+"UploadMusicServlet",{
            method:"POST",
            mode:"cors",
            body:formdata,

        }).then(res => res.json() ).then(data => {
            this.setState({
                loading:false,
                fileList:[],
                file:""
            })
        });

    }


    render() {
        const { fileList } = this.state;

        const props = {
            multiple: true,
            beforeUpload: (file) => {
                const  fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                const size = file.size/1024/1024 < 15;
                const type = file.type === "audio/mpeg";

                if ( size && type ){
                    this.setState({
                        fileList: [...fileList,file]
                    });
                }
                else if ( !type ){
                    message.error("仅支持mp3格式文件!");
                }
                else if ( !size ){
                    message.error("文件大小不得超过15M!");
                }

                return false;
            },
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            fileList,
        }

        return (
            <div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload.
                        Strictly prohibit from uploading company data or other band files
                    </p>
                </Dragger>

                <Button
                    htmlType={"button"}
                    type={"primary"}
                    style={{float:"right",marginTop:"20px",marginRight:"10px"}}
                    disabled={this.state.fileList.length === 0}
                    loading={this.state.loading}
                    onClick={this.handleUpload}
                >
                    {this.state.loading ? null : <Icon type={"upload"}/>}
                    上传
                </Button>
            </div>
        )
    }
}

export default MusicUpload;