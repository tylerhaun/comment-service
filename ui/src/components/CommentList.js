import React, { Component } from 'react';
import ReactPaginate from "react-paginate";

import _ from "lodash";
import axios from "axios";
import moment from "moment";
import mustache from "mustache";
import queryString from "query-string";

import Comment from "./Comment";

import "./CommentList.css";


window.axios = axios;
window.moment = moment;

var API_URL = "http://localhost:8000/api/v0";

class CommentList extends Component {

    constructor() {
        super()

        this.state = {
            comments: [],
            total: 0,
            page: 0,
            pageSize: 10
        };

        this.fetchComments = this.fetchComments.bind(this);
    
    }

    //componentDidMount() {
    //    this.fetchComments()    
    //}

    fetchComments(state) {

        var queryParams = _.pick(state, ["page", "pageSize"]);

        var query = queryString.stringify(queryParams)
        console.log("query", query);

        const fullUrl = mustache.render("{{{baseUrl}}}/comments?{{{queryString}}}", {baseUrl: API_URL, queryString: query});
        console.log(fullUrl);

        return axios.get(fullUrl)
            .then(response => {
                console.log("response", response);
                var data = response.data;
                this.setState(Object.assign(this.state, data));
                return data;
            })
            .catch(error => {
                //Toast message
                console.error(error);
            })
    
    }

    onPageChange(page) {
        console.log("onPageChange", arguments);

        this.setState(previousState => {
            var newState = Object.assign({}, previousState, {page: page.selected})
            this.fetchComments(newState);
            return newState;
        })
    }

    render() {

        //var comments = Array(10).fill(null).map(() => generateComment())

        var comments = this.state.comments;
        console.log("comments", comments);
        var pageCount = this.state.total / this.state.pageSize;

        return (
            <div className="CommentList">
                {comments.map(function(comment) {
                    return (
                        <Comment comment={comment} />
                    );
                })}
                <div className="react-paginate">
                    <ReactPaginate
                        activeLinkClassName="current"
                        breakLabel={"..."}
                        initialPage={this.state.page}
                        marginPagesDisplayed="1"
                        nextLabel={"Next"}
                        onPageChange={this.onPageChange.bind(this)}
                        pageCount={pageCount}
                        pageRangeDisplayed="5"
                        previousLabel={"Previous"}
                    />
                </div>
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
