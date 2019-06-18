import React from "react";
import {AutoComplete, Icon, Input} from "antd";
import debounce from "lodash.debounce"

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
            },{
                title:"用户",
                children:[],
            }],
            type:"歌曲"
        }
    };


    handlePressEnter = () => {
        const input = document.getElementById("search-input");


        if(input.value !== null && input.value !== ""){
            const value = input.value.myReplace('/',"&");
            this.props.history.push({pathname:"/home/search/"+value+"/"+this.state.type})
        }
    };

    handleSearch = (value) => {
       this.Search(value);
    };

    Search = (value) => {
        // console.log(value !== null && value !== "");

        // eslint-disable-next-line
        if (value !== null && value !== ""){
            // eslint-disable-next-line singer
            fetch(`${global.music.url}SearchBySingerServlet?singer=${value}`,{
                method:"GET",
            }).then(res => res.json() ).then( data => {
                let result = this.state.result;

                let res = [];
                for (let i = 0; i < data.length; i++){
                    if ( res.length === 3 ){
                        break;
                    }

                    let flag = false;
                    for (let j = 0; j < res.length; j++){
                        if (data[i].singer === res[j].singer){
                            flag = !flag;
                            break;
                        }
                    }

                    if (!flag){
                        res.push(data[i]);
                    }
                }

                result[0].children = [...res]

                this.setState({
                    result:[...result]
                })

            });

            // eslint-disable-next-line musicName
            fetch(`${global.music.url}SearchByMusicNameServlet?singer=${value}`,{
                method:"GET",

            }).then(res => res.json() ).then( data => {
                let result = this.state.result;
                let res = [];
                for (let i = 0; i < data.length; i++){
                    if ( res.length === 3 ){
                        break;
                    }

                    let flag = false;
                    for (let j = 0; j < res.length; j++){
                        if (data[i].musicName === res[j].musicName){
                            flag = !flag;
                            break;
                        }
                    }

                    if (!flag){
                        res.push(data[i]);
                    }
                }

                // console.log(res);

                result[1].children = [...res]

                this.setState({
                    result:result
                })

            });

            // eslint-disable-next-line album
            fetch(global.music.url+"SearchAlbumByNameServlet?musicName="+value,{
                method:"GET",
            }).then(res => res.json() ).then( data => {
                let result = this.state.result;

                // console.log(data);
                data = data.slice(0,3);
                result[2].children = [...data]

                this.setState({
                    result:result
                })

            });

            //user
            fetch(`${global.music.url}FindUserServlet`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:`userName=${value}`,
            }).then(res => res.json()).then(data => {
                let result = this.state.result;

                // console.log(data);
                data = data.slice(0,3);
                result[3].children = [...data]

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
                },{
                    title:"用户",
                    children:[],
                }]
            })
        }
    };

    handleClickSearch = (e) => {
        e.preventDefault();

        this.handlePressEnter();
    };

    handleMouseEnter = (e) => {
        this.setState({
            type:e.target.id,
        })
    };

    handleMouseLeave = (e) => {
        this.setState({
            type:"歌曲",
        })
    };

    renderTitle(title) {
        return (
            <span>
                {title}
                <a
                    style={{ float: 'right' }}
                    // eslint-disable-next-line
                    id={title}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={this.handleClickSearch}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
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
                {group.children.map(opt => {
                    // console.log(opt);
                    if (group.title==="专辑"){
                        return (
                            <Option
                                key={opt.albumId}
                                onClick={() => this.setState({type:group.title})}
                            >
                                {opt.albumName}
                            </Option>
                        )
                    }
                    else if (group.title==="用户"){
                        return (
                            <Option
                                key={opt.userId}
                                onClick={() => this.setState({type:group.title})}
                            >
                                {opt.userName}
                            </Option>
                        )
                    }
                    else return (
                        <Option
                            key={opt.musicid+opt.musicName}
                            onClick={() => this.setState({type:group.title})}
                        >
                            {group.title === "歌手" ? opt.singer: group.title === "歌曲" ? opt.musicName : opt.album}
                        </Option>
                    )
                })}
            </OptGroup>
            )
        );

        return (
            <AutoComplete
                backfill={true}
                style={{width:"15%",marginLeft:"10px"}}
                onSearch={this.handleSearch}
                dataSource={options}
                defaultActiveFirstOption={false}
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