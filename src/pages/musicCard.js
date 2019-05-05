import React from "react";
import {Avatar, Button, Card, Icon, Popover, Row, Slider, Tooltip} from "antd";
import {NavLink} from "react-router-dom";


const {Meta} = Card;

class MusicCard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            hoverAvatar: false,
            hover: false,
            lyric: "暂无歌词",
            music_time: null,
            now_time: 0,
            voice: 1.0
        }
    }

    componentDidMount() {
        const audio = document.getElementById("music-card-player");

        audio.onloadedmetadata = () => {
            this.setState({
                music_time: audio.duration
            })
        }

        audio.ontimeupdate = () => {
            this.setState({
                now_time: audio.currentTime
            })
        }
    }

    handleClickPause = () => {
        const audio = document.getElementById("music-card-player");

        audio.pause();
        this.props.play();
    }

    handleClickPlay = () => {
        const audio = document.getElementById("music-card-player");

        audio.play();

        this.props.play();
    }

    handleChangeTime = (value) => {
        const audio = document.getElementById("music-card-player");
        audio.currentTime = value;
        this.setState({
            now_time: value
        })
    }

    handleChangeVoice = (value) => {
        const audio = document.getElementById("music-card-player");

        value = value / 100;
        value = value.toFixed(2)

        this.setState({
            voice: value
        });

        audio.volume = value;

    }

    handleMouseOver = () => {
        this.setState({
            hover: true
        })
    }

    handleMouseLeave = () => {
        this.setState({
            hover: false
        })
    }

    scrollMusicName = () => {
        const name = document.getElementById("music-name");
        const name_w = name.offsetWidth;
        const title = name.parentNode;
        const title_w = title.offsetWidth;

        const div = title.parentNode;
        if (name_w < title_w) {
            return false;
        }

        title.innerHTML += title.innerHTML;
        setInterval(function () {
            if (name_w <= div.scrollLeft) {
                div.scrollLeft -= name_w;
            } else {
                div.scrollLeft++;
            }
        }, 20);
    }

    parseTime = (time) => {
        let duration = parseInt(time);
        let minute = parseInt(duration / 60);
        let sec = duration % 60 + '';
        let isM0 = ':';
        // eslint-disable-next-line
        if (minute == 0) {
            minute = "00";
        } else if (minute < 10) {
            minute = '0' + minute;
        }
        // eslint-disable-next-line
        if (sec.length == 1) {
            sec = '0' + sec;
        }
        return minute + isM0 + sec
    }

    render() {

        const cover = this.props.playing ? "cover-round" : "cover";
        const hover = this.state.hover ? {opacity: "0.8"} : {};
        const {music_time, now_time, voice} = this.state;

        const actions = [
            <Tooltip title={<span style={{fontSize: "20px"}}>收藏</span>}>
                <Button block><Icon type={"heart"}/></Button>
            </Tooltip>,
            <Tooltip title={<span style={{fontSize: "20px"}}>上一首</span>}>
                <Button block><Icon type={"backward"}/></Button>
            </Tooltip>,
            <Tooltip title={<span style={{fontSize: "20px"}}>{this.props.playing ? "暂停" : "继续"}</span>}>
                <Button block onClick={this.props.playing ? this.handleClickPause : this.handleClickPlay}>
                    <Icon type={this.props.playing ? "pause" : "caret-right"}/>
                </Button>
            </Tooltip>,
            <Tooltip title={<span style={{fontSize: "20px"}}>下一首</span>}>
                <Button block><Icon type={"forward"}/></Button>
            </Tooltip>,
            <Popover title={<span style={{fontSize: "20px"}}>声音</span>}
                     content={<Slider max={100} min={0} step={1} dots={true} defaultValue={voice * 100}
                                      onAfterChange={this.handleChangeVoice}
                                      marks={{100: Math.floor(voice * 100)}}/>}>
                <Button block><Icon type={"notification"}/></Button>
            </Popover>
        ];

        const marks = {}

        marks[0] = {
            style: {
                left: "3%"
            },
            label: this.parseTime(now_time),
        };
        ;
        marks[music_time] = {
            style: {
                left: "97%"
            },
            label: this.parseTime(music_time),
        };

        return (
            <div style={{display: this.props.display}}>
                <Row style={{display: "none"}}>
                    <audio id={"music-card-player"} src={this.props.music.musicSrc} loop></audio>
                </Row>

                <Card
                    id={"music-card"}
                    style={{width: "90%", background: "rgba(0,0,0,0)", border: "none", marginLeft: "5%"}}
                    cover={
                        <div onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>
                            {this.state.hover ? this.props.playing ?
                                <Tooltip title={<span style={{fontSize: "30px"}}>暂停</span>}><Icon
                                    onClick={this.handleClickPause} className={"avatar-icon"}
                                    type={"pause"}/></Tooltip> :
                                <Tooltip title={<span style={{fontSize: "30px"}}>继续</span>}><Icon
                                    onClick={this.handleClickPlay} className={"avatar-icon"}
                                    type={"caret-right"}/></Tooltip> : null}
                            <Avatar
                                className={cover}
                                src={this.props.music.picSrc}
                                shape={"circle"}
                                style={hover}
                            />
                        </div>
                    }
                    actions={actions}
                    bodyStyle={{height: "15vh"}}
                >
                    <Meta
                        title={
                            <span onMouseOver={this.scrollMusicName}>
                                <span id={"music-name"}>
                                    <NavLink to={"/home/music/" + this.props.music.musicId} style={{color: "black"}}>
                                        {this.props.music.musicName}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </NavLink>
                                </span>
                            </span>
                        }
                    />
                    <Meta
                        title={
                            <Slider
                                max={music_time}
                                marks={marks}
                                value={now_time}
                                tipFormatter={this.parseTime}
                                onChange={this.handleChangeTime}
                            />
                        }
                        description={this.state.lyric}
                    />

                </Card>

            </div>
        )
    }
}


export default MusicCard;