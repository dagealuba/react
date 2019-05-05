import React from "react";
import {Avatar, Empty, List} from "antd";

class SearchResult extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            type:"",
            str:"",
            result:[],
            page:1
        };
    };

    componentDidMount() {
        const str = this.props.match.params.str;
        const type = this.props.match.params.type;

        this.setState({
            type:type,
            str:str,
        });

        if (type === "歌手") {
            fetch(global.music.url + "SearchBySingerServlet"+"?singer="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                })
            });
        } else if (type === "歌曲") {
            fetch(global.music.url + "SearchByMusicNameServlet"+"?musicName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                })
            });
        } else if (type === "专辑") {
            fetch(global.music.url + "SearchAlbumByNameServlet"+"?albumName="+str, {
                method:"GET"
            }).then( res => res.json() ).then( data => {
                this.setState({
                    result:[...data]
                })
            });
        }
    };

    renderEmpty() {
        return (
            <Empty
                style={{height:"100%"}}
                description={(
                    <span>没有找到<strong>{this.state.str}</strong>相关数据</span>
                )}
            />
        )
    };


    render() {

        return (
            <div style={{height:"100%"}}>
                {this.state.result.length === 0 ? this.renderEmpty() : (
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.result}
                        renderItem={ music =>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar style={{}} src={music.picSrc}/>}
                                    title={music.musicName}
                                    description={"歌手:"+music.singer}
                                />
                            </List.Item>
                        }
                    />
                )}
            </div>
        )
    }
}

export default SearchResult;