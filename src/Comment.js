import React, {Component} from 'react';

export default class Comment extends Component {
  render() {
    const {comment} = this.props;
    return (
      <div className="commentText">
        <div>{comment.karma} - {comment.content}</div>
      </div>
    )
  }
}
