import React, { Component } from 'react';

import axios from "axios";
import faker from "faker";

import "./AddComment.css";

class AddComment extends Component {

    constructor() {
        super()

        this.state = {formData: {}};


        this.handleFormChange = this.handleFormChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.postComment = this.postComment.bind(this);
    
    }

    componentDidMount() {
        this.fillFormWithFakeData.bind(this)();
    }

    postComment(comment) {
        console.log("postComment()", comment);

        axios.post("http://localhost:8000/comments", comment);
    
    }

    onSubmit(e) {
        console.log("onSubmit()", e)
        e.preventDefault();
        console.log(e.target);

        this.postComment(this.state.formData);
    
    }

    handleFormChange(e) {
        console.log("handleFormChange()", e);

        console.log(e.target);

        console.log(e.target.name, e.target.value);

        this.setState({
            formData: Object.assign(
                {},
                this.state.formData,
                {
                    [e.target.name]: e.target.value
                }
            )
        });
    
    }

    fillFormWithFakeData() {

        this.setState(Object.assign({}, this.state.formData, {
            text: faker.lorem.sentences(),
            email: faker.internet.email(),
            author: faker.name.findName()
        }))
    }

    render() {

        const formData =  this.state.formData;

        return (
            <div className="AddComment">
                <h4>Leave a comment</h4>
                <form name="add-comment-form" onSubmit={this.onSubmit}>
                    <label>Comment</label>
                    <textarea name="text" onChange={this.handleFormChange} value={formData.text} rows="10" />
                    <label>Email</label>
                    <input name="email" onChange={this.handleFormChange} value={formData.email} type="email" />
                    <label>Name</label>
                    <input name="author" onChange={this.handleFormChange} value={formData.name} type="text" />
                    <div>
                        <button type="submit">Post Comment</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddComment;
