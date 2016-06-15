import React, {Component} from 'react';
import {cashay} from 'cashay';
import uuid from 'node-uuid';

export default class CreateComment extends Component {
  constructor(props) {
    super(props);
    this.state = {content: ''};
  }

  render() {
    return (
      <div className="newComment">
        <span>New Comment:</span>
        <input onChange={this.handleChange} type="text" value={this.state.content}/>
        <button onClick={this.handleSubmit}>Post!</button>
      </div>
    )
  }

  handleChange = event => {
    this.setState({content: event.target.value.substr(0, 140)});
  }

  handleSubmit = () => {
    const variables = {
      content: this.state.content,
      postId: this.props.postId,
      _id: uuid.v4()
    };
    this.setState({content: ''});
    cashay.mutate('createComment', {variables, components: {comments: variables.postId}})
  }
}
