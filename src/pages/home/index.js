import React from "react";
import {Carousel, Row} from "antd";


class Index extends React.Component {

    render() {
        return (
            <div>
                <Row>
                    <Carousel autoplay autoplaySpeed={1000}>
                        <div><h1>nmsl</h1></div>
                        <div><h1>又复活了</h1></div>
                    </Carousel>
                </Row>

                <Row>

                </Row>
            </div>
        );
    }
}


export default Index;