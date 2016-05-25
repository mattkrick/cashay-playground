import React, {Component} from 'react';
import {connect} from 'react-redux';
import {cashay} from './index';
import Comment from './Comment';
import CreateComment from './CreateComment'
// import uuid from 'node-uuid';

// commentCount: getCommentCount(postId: $postId),
const queryCommentsForPostId = `
  query($postId: String!) {
    comments: getCommentsByPostId(postId: $postId) {
      _id,
      content,
      karma,
      createdAt,
      postId
      
    }
  }`;

// mutation: `
//     mutation($postId: String!, $content: String!, $_id: String!) {
//     newComment: createComment(postId: $postId, content: $content, _id: $_id) {
//       _id,
//       content,
//       karma,
//       createdAt,
//       postId
//     }
//   }`

const mutationHandlers = {
  createComment(optimisticVariables, docFromServer, currentResponse, state, invalidate) {
    if (optimisticVariables) {
      const {content, postId, _id} = optimisticVariables;
      const newComment = {
        _id,
        content: content + ' client',
        postId,
        createdAt: Date.now(),
        karma: 0
      };
      const placeBefore = currentResponse.comments.findIndex(comment => comment.karma < newComment.karma);
      const spliceLocation = placeBefore !== -1 ? placeBefore : currentResponse.comments.length;
      currentResponse.comments.splice(spliceLocation, 0, newComment);
      return currentResponse;
    }
    const optimisticDocIdx = currentResponse.comments.findIndex(comment => comment._id === docFromServer.newComment._id);
    currentResponse.comments[optimisticDocIdx] = docFromServer.newComment;
    return currentResponse;
  }
};

const mapStateToProps = (state, props) => {
  const {postId} = props;
  console.log('mapState comments', state, props)
  return {
    cashay: cashay.query(queryCommentsForPostId, {
      variables: {postId},
      componentId: `comments${postId}`,
      mutationHandlers
    })
  }
};

@connect(mapStateToProps)
export default class CommentContainer extends Component {
  render() {
    const {comments} = this.props.cashay.data;
    const {postId} = this.props;
    console.log('comments', comments)
    return (
      <div>
        <div>{comments.map(comment => <Comment key={`comment${comment._id}`} comment={comment}/>)}</div>
        <CreateComment postId={postId}/>
      </div>
    )
  }
}
