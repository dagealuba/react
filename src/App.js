import React, { Component } from 'react';

import "./css/login_regist.css";


class App extends Component{


    render() {
        return(
            <div className={"index-background"}>
                {this.props.children}
            </div>
        )
    }
}



export default App;