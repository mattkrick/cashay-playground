import React, {Component} from 'react';
import CommentContainer from './CommentContainer';

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
        <div>{post.title}</div>
        {showComments ? <CommentContainer postId={post._id}/> : null}
        <div onClick={() => this.toggleComments()} className="showComments">
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </div>
        <br/>
      </div>
    )
  }
  toggleComments() {
    this.setState({showComments: !this.state.showComments})
  }
}
