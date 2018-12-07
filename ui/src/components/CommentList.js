import React, { Component } from 'react';

import moment from "moment";
import axios from "axios";

import Comment from "./Comment";

import "./CommentList.css";

window.axios = axios;
window.moment = moment;

var API_URL = "http://localhost:8000/api/v0";

class CommentList extends Component {

    constructor() {
        super()

        this.state = {comments: []};

        this.fetchComments = this.fetchComments.bind(this);
    
    }

    componentDidMount() {

        this.fetchComments().then(comments => {
            this.setState(Object.assign(this.state, {comments}));
        })
    
    }

    fetchComments(queryParams) {

        return axios.get(API_URL + "/comments")
            .then(response => {
                console.log("response", response);
                return response.data.comments;
            })
            .catch(error => {
                //Toast message
                console.error(error);
            })
    
    }

    render() {

        //var comments = Array(10).fill(null).map(() => generateComment())

        var comments = this.state.comments;
        console.log("comments", comments);

        return (
            <div className="CommentList">
                {comments.map(function(comment) {
                    return (
                        <Comment comment={comment} />
                    );
                })}
            </div>
        );
    }
}

//function generateComment(defaults) {
//    var d = moment().add(Math.round(Math.random() * 10000));
//    return Object.assign({
//        id: "768962cadb6d73289bc6",
//        text: "this is a test comment hjg hgui hgu fkhufk ghfyugfyu gfyuf gyufk gy gfk hfgh fgyuk ftj ft jfieo ljirle jkd kl hello this is a comme tntntntnt ",
//        author: "Me",
//        postId: "abcd_efg",
//        createdAt: d,
//        updatedAt: d
//    }, defaults);
//}


export default CommentList;
