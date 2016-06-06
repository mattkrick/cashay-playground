import React, {Component} from 'react';
import CommentContainer from './CommentContainer';
import {cashay} from './index';

export default class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {showComments: false}
  }
  render() {
    const {post} = this.props;
    const {showComments} = this.state;
    return (
      <div>
        <div>
          <span>{post.title}</span>
          <span className="deleteMe" onClick={this.deletePost}>     Delete Me</span>
        </div>
        {showComments ? <CommentContainer postId={post._id}/> : null}
        <div onClick={this.toggleComments} className="showComments">
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </div>
        <br/>
      </div>
    )
  }
  deletePost = () => {
    const variables = {
      postId: this.props.post._id
    };
    cashay.mutate('removePostById', {variables});
  };

  toggleComments = () => {
    this.setState({showComments: !this.state.showComments})
  }
}
