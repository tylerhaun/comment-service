import React, { Component } from 'react';

import moment from "moment";

import "./Comment.css";

class Comment extends Component {

    render() {
        console.log("render comment");

        const comment = this.props.comment;

        return (
            <div className="Comment">
                <div className="comment-container">
                    <div className="comment-header">
                        <div className="comment-author">
                            {comment.author}
                        </div>
                    <div className="comment-date">
                        {moment(comment.createdAt).format("LLL")}</div>
                    </div>
                    <div className="comment-body">
                        <div>{comment.text}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Comment;
