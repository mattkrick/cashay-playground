import React, {Component} from 'react';
import {cashay} from 'cashay';
import {connect} from 'react-redux';
import Comment from './Comment';
const queryPostCount = `
  query {
    latestPostId: getLatestPostId
    latestPostComments: getCommentsByPostId(postId: $postId) {
      _id,
      content,
      karma
    }
  }`;

const cashayOptions = {
  component: 'LatestPostComments',
  variables: {
    postId: (response, cashayDataState) => response.latestPostId
  }
};
const mapStateToProps = (state, props) => {
  return {
    cashayResponse: cashay.query(queryPostCount, cashayOptions)

  }
};

@connect(mapStateToProps)
export default class LatestPostComments extends Component {
  render() {
    const {isComplete} = this.props.cashayResponse;
    const {latestPostId, latestPostComments} = this.props.cashayResponse.data;
    return (
      <div>
        <br/>
        <br/>
        <div>
          <h2>LATEST POST COMMENTS</h2>
          <h3>(Example of a multi-part query)</h3>
        </div>
        <div>Latest post ID: {latestPostId}</div>
        <h4>Comments for post</h4>
        <div>{latestPostComments.map(comment => <Comment key={`comment${comment._id}`} comment={comment}/>)}</div>
      </div>
    )
  }
}
