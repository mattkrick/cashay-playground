import React, {Component} from 'react';
import {connect} from 'react-redux';
import {cashay} from './index';


const queryLatestPost = `
  query {
    latestPost {
      _id,
      title
    }
  }`;

const mapStateToProps = (state, props) => {
  return {
    cashay: cashay.query(queryLatestPost, {
      idFieldName: '_id',
      componentId: props.componentId
    })
  }
}

// @connect(mapStateToProps)
export default class LatestPost extends Component {
  render() {
    // const {data: {latestPost}, setVariables} = this.props.cashay;
    return (
      <div>
        <h2>CRUD Post</h2>
        <div>{this.renderPost(latestPost)}</div>
      </div>
    );
  }

  renderPost(post) {
    return (
      <div key={`post${post._id}`}>
        <div>Post id: {post._id}</div>
        <div>Post title: {post.title}</div>
        <br/>
      </div>
    )
  }
}
