import React from "react";


class MusicCard extends React.Component{


    render() {

        return (
            <div style={{display:this.props.display}}>
                <audio src={global.music.url+"music/SOUL'd OUT - VOODOO KINGDOM.mp3"} controls autoPlay>不支持</audio>
            </div>
        )
    }
}


export default MusicCard;