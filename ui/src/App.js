import React, { Component } from 'react';

import AddComment from "./components/AddComment";
import CommentList from "./components/CommentList";

import "./App.css";

class App extends Component {
    render() {

        return (
            <div className="App">
                <CommentList />
                <AddComment />
            </div>
        );
    }
}

export default App;
