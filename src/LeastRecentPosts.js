import React, {Component} from 'react';
import {connect} from 'react-redux';
import {cashay} from 'cashay';
import SinglePost from './SinglePost';
import uuid from 'node-uuid';

const queryRecentPosts = `
  query($count: Int) {
    leastRecentPosts: getRecentPosts(last: $count) {
      _id,
      title,
      cursor,
      spanishTitle: title(language:"spanish"),
      reverseSpanishTitle: title(language:"spanish", inReverse:true)
    }
  }`;

const customMutations = {
  removePostById: `
  mutation($postId: String!) {
    removePostById(postId: $postId) {
      removedPostId
    }
  }`
};

const mutationHandlers = {
  createPost(optimisticVariables, docFromServer, currentResponse, state, invalidate) {
    if (optimisticVariables) {
      const {newPost} = optimisticVariables;
      const newOptimisticPost = Object.assign({}, newPost, {
        title: `${newPost.title} OPTIMISTICAL!`
      });
      currentResponse.leastRecentPosts.push(newOptimisticPost);
      return currentResponse;
    }
    const optimisticDocIdx = currentResponse.leastRecentPosts.findIndex(post => post._id === docFromServer.createPost.post._id);
    currentResponse.leastRecentPosts[optimisticDocIdx] = docFromServer.createPost.post;
    return currentResponse;
  },
  removePostById(optimisticVariables, docFromServer, currentResponse) {
    // example of not using optimistic updates
    const idRemoved = docFromServer && docFromServer.removePostById.removedPostId;
    if (idRemoved) {
      const idx = currentResponse.leastRecentPosts.findIndex(post => post._id === idRemoved);
      currentResponse.leastRecentPosts.splice(idx, 1);
      return currentResponse;
    }
  }
};

const mapStateToProps = (state, props) => {
  return {
    cashay: cashay.query(queryRecentPosts, {
      variables: {count: 2},
      mutationHandlers,
      customMutations,
      component: 'LeastRecentPosts'
    })
  }
};

@connect(mapStateToProps)
export default class LeastRecentPosts extends Component {
  render() {
    const {leastRecentPosts} = this.props.cashay.data;
    return (
      <div>
        <h2>LEAST RECENT POSTS</h2>
        <button onClick={this.createPost}>Create your very own post!</button>
        <div>{leastRecentPosts.map(post => <SinglePost key={`post${post._id}`} post={post}/>)}</div>
        {leastRecentPosts.BOF ? null :
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
