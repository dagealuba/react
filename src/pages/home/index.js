import React from "react";
import {Carousel, Row} from "antd"
import "../../css/index.css";

class Index extends React.Component {

    render() {
        return (
            <div>
                <Row className={"index-row"}>
                    <Carousel autoplay autoplaySpeed={3000}>
                        <div><h1>NM$L</h1></div>
                        <div><h1>又复活了</h1></div>
                    </Carousel>
                </Row>
            </div>
        );
    }
}


export default Index;