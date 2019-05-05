import React from "react";
import {AutoComplete, Icon, Input} from "antd";
import debounce from "lodash.debounce"
import {NavLink} from "react-router-dom";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

class SearchMusic extends React.Component{
    constructor(props){
        super(props);

        this.Search = debounce(this.Search,500);

        this.state = {
            result:[{
                title:"歌手",
                children:[]
            },{
                title:"歌曲",
                children:[]
            },{
                title:"专辑",
                children:[]
            }],
            type:"歌曲"
        }
    };


    handlePressEnter = () => {
        const input = document.getElementById("search-input");


        if(input.value !== null && input.value !== ""){
            this.props.history.push({pathname:"/home/search/"+input.value+"/"+this.state.type})
        }
    };

    handleSearch = (value) => {
       this.Search(value);
    };

    Search = (value) => {
        console.log(value !== null && value !== "");

        // eslint-disable-next-line
        if (value !== null && value !== ""){
            fetch(global.music.url+"SearchBySingerServlet"+"?singer="+value,{
                method:"GET",

            }).then(res => res.json() ).then( data => {
                let result = this.state.result;

                data = data.slice(0,3);
                result[0].children = [...data]

                this.setState({
                    result:result
                })

            });

            fetch(global.music.url+"SearchByMusicNameServlet"+"?musicName="+value,{
                method:"GET",

            }).then(res => res.json() ).then( data => {
                let result = this.state.result;

                data = data.slice(0,3);
                result[1].children = [...data]

                this.setState({
                    result:result
                })

            })

            fetch(global.music.url+"SearchAlbumByNameServlet"+"?musicName="+value,{
                method:"GET",

            }).then(res => res.json() ).then( data => {
                let result = this.state.result;

                data = data.slice(0,3);
                result[2].children = [...data]

                this.setState({
                    result:result
                })

            })
        }
        else {
            this.setState({
                result:[{
                    title:"歌手",
                    children:[]
                },{
                    title:"歌曲",
                    children:[]
                },{
                    title:"专辑",
                    children:[]
                }]
            })
        }
    };

    renderTitle(title) {
        return (
            <span>
                {title}
                <a
                    style={{ float: 'right' }}
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                >更多
                </a>
            </span>
        );
    }


    render() {
        const options = this.state.result.map(group => (
            <OptGroup
                key={group.title}
                label={this.renderTitle(group.title)}
            >
                {group.children.map(opt => (
                    <Option
                        key={group.title === "歌手" ? opt.singer: group.title === "歌曲" ? opt.musicName : opt.albumId}
                        onClick={() => this.setState({type:group.title})}
                    >
                        {group.title === "歌手" ? opt.singer: group.title === "歌曲" ? opt.musicName : opt.albumId}
                    </Option>
                ))}
            </OptGroup>
            )
        );

        return (
            <AutoComplete
                backfill={true}
                style={{width:"15%",marginLeft:"10px"}}
                onSearch={this.handleSearch}
                dataSource={options}
            >
                <Input
                    prefix={<Icon type="search" onClick={this.handlePressEnter}/>}
                    placeholder={"搜索音乐，歌手，专辑"}
                    onPressEnter={this.handlePressEnter}
                    id={"search-input"}
                />
            </AutoComplete>
        );
    }
}

export default SearchMusic;