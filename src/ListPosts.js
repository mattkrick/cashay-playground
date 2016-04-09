import React, {Component} from 'react';
import gqlSchema from './schema.js';
import {connect} from 'react-redux';
import {cashay} from './index';


const queryLatestPost = `
  query($count: Int!) {
    recentPosts(count: $count) {
      _id,
      title
    }
  }`;

const mapStateToProps = (state, props) => {

  return {
    listData: cashay.query(queryLatestPost, {
      variables: {count: 5},
      idFieldName: '_id',
      paginationWords: {first: 'count'}
    })
  }
}

@connect(mapStateToProps)
export default class ListPosts extends Component {
  render() {
    const {recentPosts} = this.props.listData.data;
    return (
      <div>{recentPosts.map(post => this.renderPost(post))}</div>
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
