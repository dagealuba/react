import React from "react";
import {Carousel, Icon, Row} from "antd"
import "../../css/index.css";
import {NavLink} from "react-router-dom";

class Index extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hot:[],
        }
    }

    componentDidMount() {
        fetch(`${global.music.url}GetHotServlet`,{
            method:"get"
        }).then(res=>res.json()).then(data => {
            // console.log(data);
            let keys = Object.keys(data);

            console.log(keys);

            for (let i=0;i<keys.length;i++){
                for (let j=0;j<keys.length-1-i;j++){
                    if (data[keys[j]]>=data[keys[j+1]]){
                        // console.log("swap");
                        let t = keys[j];
                        keys[j] = keys[j+1];
                        keys[j+1] = t;
                    }
                }
            }

            keys = keys.slice(0,10);

            fetch(`${global.music.url}GetMusicServlet?musicIds=${keys}`,{
                method:"get"
            }).then(res=>res.json()).then(data=>{
                this.setState({
                    hot:[...data],
                })
            })
        })
    }

    render() {
        const node = (
            <div><h1>NM$L</h1></div>
    )

        return (
            <div>
                <Row className={"index-row"}>
                    {/*<Icon style={{position:"absolute",fontSize:"48px",top:"30vh"}} onClick={} type={"left"}/>*/}
                    <Carousel autoplay={true} autoplaySpeed={3000}>
                        {this.state.hot.map((music,index)=>{
                            return (
                            <div key={index}>
                                <NavLink to={`/home/music/${music.musicId}`}>
                                    <img alt={music.musicName} src={music.picSrc}></img>
                                    <h1>{music.musicName}</h1>
                                </NavLink>
                            </div>
                            );
                        })}
                    </Carousel>
                    {/*<Icon style={{position:"absolute",fontSize:"48px",top:"30vh",left:"97%"}} type={"right"}/>*/}
                </Row>
            </div>
        );
    }
}


export default Index;