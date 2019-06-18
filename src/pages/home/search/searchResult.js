import React from "react";
import {Spin} from "antd";
import Result from "./result";

class SearchResult extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            type:"",
            str:"",
            result:[],
            loading:false
        };
    };


    componentDidMount() {
        const str = this.props.match.params.str.myReplace("&","/");
        const type = this.props.match.params.type;

        this.setState({
            type:type,
            str:str,
            loading:true
        });

        if (type === "歌手") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchBySingerServlet"+"?singer="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                });
            });
        } else if (type === "歌曲") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchByMusicNameServlet"+"?musicName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                });
            });
        } else if (type === "专辑") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchAlbumByNameServlet"+"?musicName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                // console.log(data);
                this.setState({
                    result:[...data]
                })
            });
        }
        else if (type === "用户"){
            fetch(`${global.music.url}FindUserServlet`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:`userName=${str}`,
            }).then(res => res.json()).then(data => {
                this.setState({
                    result:[...data]
                })
            })
        }

        this.setState({
            loading:false
        })
    }

    componentWillReceiveProps = nextProps => {
        const str = nextProps.match.params.str.myReplace("&","/");
        const type = nextProps.match.params.type;

        this.setState({
            type:type,
            str:str,
            loading:true
        });

        if (type === "歌手") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchBySingerServlet"+"?singer="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                })
            });
        } else if (type === "歌曲") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchByMusicNameServlet"+"?musicName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                });
            });
        } else if (type === "专辑") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchAlbumByNameServlet"+"?musicName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                })
            });
        }else if (type === "用户"){
            fetch(`${global.music.url}FindUserServlet`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:`userName=${str}`,
            }).then(res => res.json()).then(data => {
                this.setState({
                    result:[...data]
                })
            })
        }



        this.setState({
            loading:false
        })
    };

    changeType = (type) => {
        this.props.history.push({pathname:"/home/search/"+this.state.str.myReplace("/","&")+"/"+type})
    };

    reload = () => {
        const str = this.props.match.params.str.myReplace("&","/");
        const type = this.props.match.params.type;

        this.setState({
            type:type,
            str:str,
            loading:true
        });

        if (type === "歌手") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchBySingerServlet"+"?singer="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                });
            });
        } else if (type === "歌曲") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchByMusicNameServlet"+"?musicName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                });
            });
        } else if (type === "专辑") {
            // eslint-disable-next-line
            fetch(global.music.url + "SearchAlbumByNameServlet"+"?musicName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                // console.log(data);
                this.setState({
                    result:[...data]
                })
            });
        }
        else if (type === "用户"){
            fetch(`${global.music.url}FindUserServlet`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:`userName=${str}`,
            }).then(res => res.json()).then(data => {
                this.setState({
                    result:[...data]
                })
            })
        }

        this.setState({
            loading:false
        })
    };

    render() {

        return (
            <Spin style={{height:"100%"}} spinning={this.state.loading} className={"search-result"}>
                <Result reload={this.reload.bind(this)} result={this.state.result} str={this.state.str} type={this.state.type} changeType={this.changeType.bind(this)} {...this.props}/>
            </Spin>
        )
    }
}

export default SearchResult;