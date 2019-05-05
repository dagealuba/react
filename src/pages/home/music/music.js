import React from "react";


class Music extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            music:{}
        }
    }


    componentDidMount() {
        const musicId = this.props.match.params.musicId;
        console.log(musicId);
        fetch(global.music.url+"FindMusicServlet?"+musicId,{
            method:"GET",
        }).then(res => res.json() ).then(data => {

        })
    }

    render() {
        return(
            <div>

            </div>
        )
    }
}

export default Music;