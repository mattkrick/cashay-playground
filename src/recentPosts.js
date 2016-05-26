import React, {Component} from 'react';
import {connect} from 'react-redux';
import {cashay} from './index';
import SinglePost from './SinglePost';
import uuid from 'node-uuid';

const queryRecentPosts = `
  query($count: Int) {
    recentPosts: getRecentPosts(first: $count) {
      _id,
      title,
      cursor
    }
  }`;

const mutationHandlers = {
  createPost(optimisticVariables, docFromServer, currentResponse, state, invalidate) {
    if (optimisticVariables) {
      const {newPost} = optimisticVariables;
      const newOptimisticPost = Object.assign({}, newPost, {
        title: `${newPost.title} OPTIMISTICAL!`
      });
      currentResponse.recentPosts.unshift(newOptimisticPost);
      return currentResponse;
    }
    const optimisticDocIdx = currentResponse.recentPosts.findIndex(post => post._id === docFromServer.createPost.post._id);
    currentResponse.recentPosts[optimisticDocIdx] = docFromServer.createPost.post;
    return currentResponse;
  }
};

const mapStateToProps = (state, props) => {
  return {
    cashay: cashay.query(queryRecentPosts, {variables: {count: 2}, mutationHandlers})
  }
};

@connect(mapStateToProps)
export default class RecentPosts extends Component {
  render() {
    const {recentPosts} = this.props.cashay.data;
    return (
      <div>
        <h2>RECENT POSTS</h2>
        <button onClick={this.createPost}>Create your very own post!</button>
        <div>{recentPosts.map(post => <SinglePost key={`post${post._id}`} post={post}/>)}</div>
        {recentPosts.EOF ? null :
          <button onClick={this.get2More}>Get 2 More</button>
        }
      </div>
    );
  }

  createPost = () => {
    const variables = {
      newPost: {
        _id: uuid.v4(),
        title: 'Woo another post!'
      }
    };
    cashay.mutate('createPost', {variables})
  };

  get2More = () => {
    const {setVariables} = this.props.cashay;
    setVariables(currentVariables => {
      return {
        count: currentVariables.count + 2
      }
    })
  }
}
